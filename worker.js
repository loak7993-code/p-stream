/**
 * StreamViva — single Cloudflare Worker
 *
 * Serves everything on one origin:
 *   /                      -> built SPA (static assets, SPA fallback)
 *   /config.js             -> dynamic runtime config (same-origin proxy URLs)
 *   /proxy?destination=... -> simple CORS proxy (X-Referer/X-Origin/... passthrough)
 *   /m3u8-proxy?url=...    -> HLS playlist proxy (rewrites playlist URLs
 *                             to route back through this worker)
 *
 * Same-origin means no CORS problems and no separate proxy deployments.
 */

const TMDB_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2NjZjNhZDYyN2M4ZTA3MmQ3NjQ3YWFlNDRmNGU3ZiIsIm5iZiI6MTc3Mjg1MjkxMS40MjcsInN1YiI6IjY5YWI5NmFmNzgyNzRlMTFmMThmYWYxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bUX3sQru8sCYqTKO-SB9YqXfLvoa88bwc9g3AJdfst8";

const HEADER_MAP = {
  "x-cookie": "cookie",
  "x-referer": "referer",
  "x-origin": "origin",
  "x-user-agent": "user-agent",
  "x-x-real-ip": "x-real-ip",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, HEAD, OPTIONS",
  "access-control-expose-headers": "*",
};

function cors(response) {
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(CORS_HEADERS)) r.headers.set(k, v);
  return r;
}

/* ---------------------------- dynamic config ---------------------------- */

function serveConfig(origin) {
  const body = `window.__CONFIG__ = {
  VITE_TMDB_READ_API_KEY: ${JSON.stringify(TMDB_KEY)},
  VITE_CORS_PROXY_URL: ${JSON.stringify(origin + "/proxy")},
  VITE_M3U8_PROXY_URL: ${JSON.stringify(origin)},
  VITE_APP_DOMAIN: ${JSON.stringify(origin)},
  VITE_NORMAL_ROUTER: true,
  VITE_OPENSEARCH_ENABLED: false,
  VITE_BACKEND_URL: null,
  VITE_DMCA_EMAIL: null,
  VITE_DISALLOWED_IDS: "",
};
`;
  return new Response(body, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

/* ----------------------------- simple proxy ----------------------------- */

async function handleSimpleProxy(request, url) {
  const destination = url.searchParams.get("destination");
  if (!destination) {
    return cors(
      new Response("streamviva proxy: use /proxy?destination=<url>", {
        status: 400,
      }),
    );
  }

  const fwd = {
    "user-agent": request.headers.get("x-user-agent") || UA,
    accept: request.headers.get("accept") || "*/*",
    "accept-language": request.headers.get("accept-language") || "en-US,en;q=0.9",
  };
  for (const [src, dst] of Object.entries(HEADER_MAP)) {
    const v = request.headers.get(src);
    if (src === "x-user-agent") continue;
    if (v) fwd[dst] = v;
  }
  const ct = request.headers.get("content-type");
  if (ct) fwd["content-type"] = ct;
  const range = request.headers.get("range");
  if (range) fwd.range = range;

  const init = {
    method: request.method,
    headers: fwd,
    redirect: "follow",
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : request.body,
  };

  let upstream;
  try {
    upstream = await fetch(destination, init);
    // vidsrc-style mirrors 403 requests carrying referer/origin — retry clean
    if (upstream.status === 403 || upstream.status === 401) {
      const clean = { ...fwd };
      delete clean.referer;
      delete clean.origin;
      try {
        upstream = await fetch(destination, { ...init, headers: clean });
      } catch {
        /* keep first response */
      }
    }
  } catch (e) {
    return cors(new Response(`proxy error: ${e.message}`, { status: 502 }));
  }

  const rh = new Headers();
  for (const k of [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "etag",
    "last-modified",
    "location",
  ]) {
    const v = upstream.headers.get(k);
    if (v) rh.set(k, v);
  }
  const sc = upstream.headers.get("set-cookie");
  if (sc) rh.set("x-set-cookie", sc);
  if (upstream.url && upstream.url !== destination)
    rh.set("x-final-destination", upstream.url);

  return cors(new Response(upstream.body, { status: upstream.status, headers: rh }));
}

/* ------------------------------ m3u8 proxy ------------------------------ */

function selfUrl(origin, abs, headers) {
  const u = new URL(origin + "/m3u8-proxy");
  u.searchParams.set("url", abs);
  if (headers && Object.keys(headers).length > 0)
    u.searchParams.set("headers", JSON.stringify(headers));
  return u.toString();
}

function relToAbs(base, uri) {
  try {
    return new URL(uri, base).toString();
  } catch {
    return uri;
  }
}

async function fetchUpstream(target, headers) {
  const fwd = { "user-agent": UA };
  for (const [k, v] of Object.entries(headers || {})) {
    if (k.toLowerCase() !== "user-agent") fwd[k] = v;
  }
  return fetch(target, { headers: fwd, redirect: "follow" });
}

async function handleM3U8Proxy(request, url, origin) {
  const target = url.searchParams.get("url");
  if (!target)
    return cors(new Response("missing url param", { status: 400 }));

  let headers = {};
  const h = url.searchParams.get("headers");
  if (h) {
    try {
      headers = JSON.parse(h);
    } catch {}
  }

  let resp;
  try {
    resp = await fetchUpstream(target, headers);
  } catch (e) {
    return cors(new Response(`m3u8-proxy error: ${e.message}`, { status: 502 }));
  }

  const ctype = resp.headers.get("content-type") || "";
  const looksPlaylist =
    ctype.includes("mpegurl") ||
    ctype.includes("m3u8") ||
    ctype.includes("audio/mp") ||
    target.includes(".m3u8");

  if (looksPlaylist) {
    let text = await resp.text();
    const out = [];
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (t === "") {
        out.push(line);
        continue;
      }
      if (t.startsWith("#")) {
        out.push(
          line.replace(/URI="([^"]+)"/g, (m, uri) => {
            const abs = relToAbs(target, uri);
            return `URI="${selfUrl(origin, abs, headers)}"`;
          }),
        );
      } else {
        out.push(selfUrl(origin, relToAbs(target, t), headers));
      }
    }
    return cors(
      new Response(out.join("\n"), {
        status: resp.status,
        headers: {
          "content-type": "application/vnd.apple.mpegurl",
          "cache-control": "no-store",
        },
      }),
    );
  }

  // binary segment — stream through with range support
  const rh = new Headers();
  for (const k of [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "etag",
  ]) {
    const v = resp.headers.get(k);
    if (v) rh.set(k, v);
  }
  return cors(new Response(resp.body, { status: resp.status, headers: rh }));
}

/* -------------------------------- router -------------------------------- */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = url.origin;

    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

    // hotlink protection: only our own origin may use the proxy endpoints
    const referer = request.headers.get("referer") || "";
    const isProxyPath = url.pathname === "/proxy" || url.pathname === "/m3u8-proxy";
    if (isProxyPath && referer && !referer.startsWith(origin)) {
      return new Response("forbidden", { status: 403 });
    }

    if (url.pathname === "/config.js") return serveConfig(origin);
    if (url.pathname === "/proxy") return handleSimpleProxy(request, url);
    if (url.pathname === "/m3u8-proxy")
      return handleM3U8Proxy(request, url, origin);

    // everything else -> static assets (with SPA fallback)
    if (env.ASSETS) {
      const assetResp = await env.ASSETS.fetch(request);
      if (assetResp.status !== 404 || request.method !== "GET") return assetResp;
      // SPA fallback for client-side routes
      return env.ASSETS.fetch(new URL("/index.html", origin).toString());
    }

    return new Response("not found", { status: 404 });
  },
};
