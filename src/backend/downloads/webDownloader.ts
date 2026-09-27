/* eslint-disable no-console */
/**
 * Web downloads: client-side HLS segment downloader.
 * Fetches the master playlist through the configured m3u8 proxy,
 * parses quality variants, downloads the chosen variant's segments,
 * concatenates to a single Blob and saves it via a blob URL link.
 */

const PROXY_BASE = import.meta.env.VITE_M3U8_PROXY_URL || "";

export interface WebQuality {
  label: string;
  width: number;
  height: number;
  url: string;
}

function proxied(url: string): string {
  if (!PROXY_BASE) return url;
  return `${PROXY_BASE}/m3u8-proxy?url=${encodeURIComponent(url)}`;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(proxied(url), {
    credentials: "omit",
  });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return res.text();
}

/** resolve playable variants for a media item (movie or episode) */
export type DownloadMedia =
  | {
      type: "movie";
      title: string;
      releaseYear: number;
      tmdbId: string;
      imdbId?: string;
    }
  | {
      type: "show";
      title: string;
      releaseYear: number;
      tmdbId: string;
      imdbId?: string;
      season: { number: number; tmdbId: string };
      episode: { number: number; tmdbId: string };
    };

export async function resolveQualities(
  media: DownloadMedia,
): Promise<WebQuality[]> {
  // reuse the app's providers to get the m3u8 url
  const { getProviders } = await import("@/backend/providers/providers");
  const providers = getProviders();
  // vidsrcsh only uses season/episode numbers — the full ScrapeMedia shape
  // is cast here for convenience
  const out = await providers.runSourceScraper({
    id: "vidsrcsh",
    media: media as never,
  });
  const stream = out.stream?.[0];
  if (!stream || stream.type !== "hls" || !stream.playlist)
    throw new Error("no stream");
  // playlist is already the m3u8-proxied master; fetch it
  const master = await fetch(stream.playlist, { credentials: "omit" });
  if (!master.ok) throw new Error(`master ${master.status}`);
  const text = await master.text();
  if (!text.trimStart().startsWith("#EXTM3U")) throw new Error("not hls");

  const isMaster = text.includes("#EXT-X-STREAM-INF");
  if (!isMaster)
    return [{ label: "source", width: 0, height: 0, url: stream.playlist }];

  const lines = text.split("\n").map((l) => l.trim());
  const qualities: WebQuality[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("#EXT-X-STREAM-INF")) {
      const res = /RESOLUTION=(\d+)x(\d+)/.exec(lines[i]);
      const uri = lines[i + 1];
      if (!uri) continue;
      const w = res ? parseInt(res[1], 10) : 0;
      const h = res ? parseInt(res[2], 10) : 0;
      qualities.push({
        label: h > 0 ? `${h}p` : "auto",
        width: w,
        height: h,
        url: uri,
      });
    }
  }
  return qualities.sort((a, b) => b.height - a.height);
}

export interface DownloadProgress {
  phase: "resolving" | "downloading" | "done" | "error";
  pct: number;
  message?: string;
}

/** download all segments of a variant playlist and save */
export async function downloadVariant(
  variantUrl: string,
  fileName: string,
  onProgress: (p: DownloadProgress) => void,
): Promise<void> {
  onProgress({ phase: "downloading", pct: 0 });

  const playlistText = await fetchText(variantUrl);
  const base = new URL(variantUrl);
  const segments = playlistText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => new URL(l, base).toString());

  const chunks: BlobPart[] = [];
  const total = segments.length;

  for (let i = 0; i < segments.length; i += 1) {
    const segUrl = segments[i];
    const res = await fetch(proxied(segUrl), { credentials: "omit" });
    if (res.ok) {
      chunks.push(await res.arrayBuffer());
    }
    onProgress({ phase: "downloading", pct: ((i + 1) / total) * 100 });
  }

  const blob = new Blob(chunks, { type: "video/mp2t" });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName.endsWith(".ts") ? fileName : `${fileName}.ts`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  onProgress({ phase: "done", pct: 100 });
}
