/**
 * StreamViva accounts backend — movie-web compatible account protocol.
 * D1-backed: users, sessions, challenges, bookmarks, progress,
 * watch history, settings, group order.
 */

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function b64urlToBytes(s) {
  const b = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b.length % 4 === 0 ? "" : "=".repeat(4 - (b.length % 4));
  const bin = atob(b + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomId(bytes = 16) {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function verifyEd25519(publicKeyB64Url, signatureB64Url, message) {
  try {
    const pub = b64urlToBytes(publicKeyB64Url);
    const sig = b64urlToBytes(signatureB64Url);
    const key = await crypto.subtle.importKey(
      "raw",
      pub,
      { name: "Ed25519" },
      false,
      ["verify"],
    );
    const data = new TextEncoder().encode(message);
    return await crypto.subtle.verify("Ed25519", key, sig, data);
  } catch {
    return false;
  }
}

function userResponse(row) {
  const profile = JSON.parse(row.profile || "{}");
  return {
    id: row.id,
    namespace: row.namespace,
    nickname: row.nickname || "",
    permissions: [],
    profile: {
      colorA: profile.colorA || "#72043a",
      colorB: profile.colorB || "#16010d",
      icon: profile.icon || "07",
    },
  };
}

function sessionResponse(row) {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    accessedAt: row.accessed_at,
    device: row.device,
    userAgent: row.user_agent || "",
  };
}

async function createSession(db, userId, device, userAgent) {
  const sessionId = randomId(12);
  const token = randomId(32);
  const tokenHash = await sha256hex(token);
  const now = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, token_hash, device, user_agent, created_at, accessed_at) VALUES (?,?,?,?,?,?,?)",
    )
    .bind(sessionId, userId, tokenHash, device || "Unknown device", userAgent || "", now, now)
    .run();
  return { sessionId, token };
}

async function authSession(db, request) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const tokenHash = await sha256hex(token);
  const session = await db
    .prepare(
      "SELECT s.*, u.nickname, u.namespace, u.profile FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?",
    )
    .bind(tokenHash)
    .first();
  return session || null;
}

async function consumeChallenge(db, publicKey, code, signature) {
  const row = await db.prepare("SELECT * FROM challenges WHERE code = ?").bind(code).first();
  if (!row) return { ok: false, err: "invalid challenge" };
  await db.prepare("DELETE FROM challenges WHERE code = ?").bind(code).run();
  const age = Date.now() - new Date(row.created_at).getTime();
  if (age > 10 * 60 * 1000) return { ok: false, err: "challenge expired" };
  if (row.public_key && row.public_key !== publicKey)
    return { ok: false, err: "challenge mismatch" };
  const valid = await verifyEd25519(publicKey, signature, code);
  if (!valid) return { ok: false, err: "bad signature" };
  return { ok: true };
}

function errBody(e, status = 400) {
  return json({ error: e, statusCode: status }, status);
}

export async function handleAccounts(request, path, db) {
  const url = new URL(request.url);
  const method = request.method;
  const now = new Date().toISOString();

  /* ------------------------------ meta ------------------------------ */
  if (path === "/meta" && method === "GET") {
    return json({
      version: "1.0.0-streamviva",
      name: "StreamViva accounts",
      description: "Account backend for StreamViva",
      hasCaptcha: false,
    });
  }

  /* ------------------------------ auth ------------------------------ */
  if (path === "/auth/register/start" && method === "POST") {
    const code = randomId(24);
    await db
      .prepare("INSERT INTO challenges (code, public_key, created_at) VALUES (?,?,?)")
      .bind(code, null, now)
      .run();
    return json({ challenge: code });
  }

  if (path === "/auth/register/complete" && method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body?.publicKey || !body?.challenge?.code || !body?.challenge?.signature)
      return errBody("invalid register payload");
    const existing = await db
      .prepare("SELECT id FROM users WHERE public_key = ?")
      .bind(body.publicKey)
      .first();
    if (existing) return errBody("account already exists", 409);
    const check = await consumeChallenge(
      db,
      body.publicKey,
      body.challenge.code,
      body.challenge.signature,
    );
    if (!check.ok) return errBody(check.err, 401);
    const userId = randomId(12);
    const profile = body.profile || {};
    await db
      .prepare(
        "INSERT INTO users (id, namespace, public_key, nickname, profile, created_at) VALUES (?,?,?,?,?,?)",
      )
      .bind(
        userId,
        body.namespace || "movie-web",
        body.publicKey,
        "",
        JSON.stringify(profile),
        now,
      )
      .run();
    const { sessionId, token } = await createSession(
      db,
      userId,
      body.device,
      request.headers.get("user-agent"),
    );
    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    const session = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sessionId).first();
    return json({ user: userResponse(user), session: sessionResponse(session), token });
  }

  if (path === "/auth/login/start" && method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body?.publicKey) return errBody("publicKey required");
    const user = await db
      .prepare("SELECT * FROM users WHERE public_key = ?")
      .bind(body.publicKey)
      .first();
    if (!user) return errBody("account not found", 404);
    const code = randomId(24);
    await db
      .prepare("INSERT INTO challenges (code, public_key, created_at) VALUES (?,?,?)")
      .bind(code, body.publicKey, now)
      .run();
    return json({ challenge: code });
  }

  if (path === "/auth/login/complete" && method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body?.publicKey || !body?.challenge?.code || !body?.challenge?.signature)
      return errBody("invalid login payload");
    const user = await db
      .prepare("SELECT * FROM users WHERE public_key = ?")
      .bind(body.publicKey)
      .first();
    if (!user) return errBody("account not found", 404);
    const check = await consumeChallenge(
      db,
      body.publicKey,
      body.challenge.code,
      body.challenge.signature,
    );
    if (!check.ok) return errBody(check.err, 401);
    const { sessionId, token } = await createSession(
      db,
      user.id,
      body.device,
      request.headers.get("user-agent"),
    );
    const session = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sessionId).first();
    return json({ session: sessionResponse(session), token });
  }

  /* --------------------------- authenticated -------------------------- */
  const session = await authSession(db, request);
  if (!session) return errBody("unauthorized", 401);
  const meId = session.user_id;

  if (path === "/users/@me" && method === "GET") {
    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(meId).first();
    return json({ user: userResponse(user), session: sessionResponse(session) });
  }

  if (path === "/users/@me" && method === "PATCH") {
    const body = await request.json().catch(() => ({}));
    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(meId).first();
    const profile = body.profile || JSON.parse(user.profile || "{}");
    const nickname = body.nickname !== undefined ? body.nickname : user.nickname;
    await db
      .prepare("UPDATE users SET profile = ?, nickname = ? WHERE id = ?")
      .bind(JSON.stringify(profile), nickname, meId)
      .run();
    const fresh = await db.prepare("SELECT * FROM users WHERE id = ?").bind(meId).first();
    return json({ user: userResponse(fresh), session: sessionResponse(session) });
  }

  if (path === "/users/@me" && method === "DELETE") {
    await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM bookmarks WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM progress WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM watch_history WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM settings WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM group_order WHERE user_id = ?").bind(meId).run();
    await db.prepare("DELETE FROM users WHERE id = ?").bind(meId).run();
    return json({ ok: true });
  }

  // per-id user routes (auth must match)
  const usersMatch = path.match(/^\/users\/([^/]+)(\/.*)?$/);
  if (usersMatch) {
    const targetId = usersMatch[1];
    const sub = usersMatch[2] || "";
    if (targetId !== meId && targetId !== "@me") return errBody("forbidden", 403);

    /* sessions list */
    if (sub === "/sessions" && method === "GET") {
      const rows = await db
        .prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY accessed_at DESC")
        .bind(meId)
        .all();
      return json(rows.results.map(sessionResponse));
    }

    /* bookmarks */
    if (sub === "/bookmarks" && method === "GET") {
      const rows = await db
        .prepare("SELECT * FROM bookmarks WHERE user_id = ?")
        .bind(meId)
        .all();
      return json(rows.results.map((r) => JSON.parse(r.data)));
    }
    if (sub === "/bookmarks" && method === "PUT") {
      const items = await request.json().catch(() => []);
      for (const item of items) {
        await db
          .prepare(
            "INSERT OR REPLACE INTO bookmarks (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
          )
          .bind(meId, item.tmdbId, JSON.stringify(item), now)
          .run();
      }
      return json({ ok: true });
    }
    const bmMatch = sub.match(/^\/bookmarks\/([^/]+)$/);
    if (bmMatch) {
      const tmdbId = decodeURIComponent(bmMatch[1]);
      if (method === "POST") {
        const body = await request.json().catch(() => null);
        if (!body) return errBody("invalid body");
        const row = { tmdbId, ...body, updatedAt: now };
        await db
          .prepare(
            "INSERT OR REPLACE INTO bookmarks (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
          )
          .bind(meId, tmdbId, JSON.stringify(row), now)
          .run();
        return json(row);
      }
      if (method === "DELETE") {
        await db
          .prepare("DELETE FROM bookmarks WHERE user_id = ? AND tmdb_id = ?")
          .bind(meId, tmdbId)
          .run();
        return json({ tmdbId });
      }
    }

    /* progress */
    if (sub === "/progress" && method === "GET") {
      const rows = await db.prepare("SELECT * FROM progress WHERE user_id = ?").bind(meId).all();
      return json(rows.results.map((r) => JSON.parse(r.data)));
    }
    if (sub === "/progress" && method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!body?.tmdbId) return errBody("invalid body");
      const row = { ...body, updatedAt: now };
      await db
        .prepare(
          "INSERT OR REPLACE INTO progress (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
        )
        .bind(meId, body.tmdbId, JSON.stringify(row), now)
        .run();
      return json(row);
    }
    if (sub === "/progress/import" && method === "PUT") {
      const items = await request.json().catch(() => []);
      for (const item of items) {
        await db
          .prepare(
            "INSERT OR REPLACE INTO progress (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
          )
          .bind(meId, item.tmdbId, JSON.stringify({ ...item, updatedAt: now }), now)
          .run();
      }
      return json({ ok: true });
    }
    const pgMatch = sub.match(/^\/progress\/([^/]+)$/);
    if (pgMatch && method === "DELETE") {
      await db
        .prepare("DELETE FROM progress WHERE user_id = ? AND tmdb_id = ?")
        .bind(meId, decodeURIComponent(pgMatch[1]))
        .run();
      return json({ ok: true });
    }

    /* watch history */
    if (sub === "/watch-history" && method === "GET") {
      const rows = await db
        .prepare("SELECT * FROM watch_history WHERE user_id = ?")
        .bind(meId)
        .all();
      return json(rows.results.map((r) => JSON.parse(r.data)));
    }
    const whMatch = sub.match(/^\/watch-history\/([^/]+)$/);
    if (whMatch) {
      const tmdbId = decodeURIComponent(whMatch[1]);
      if (method === "PUT") {
        const body = await request.json().catch(() => null);
        if (!body) return errBody("invalid body");
        const row = { ...body, updatedAt: now };
        await db
          .prepare(
            "INSERT OR REPLACE INTO watch_history (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
          )
          .bind(meId, tmdbId, JSON.stringify(row), now)
          .run();
        return json(row);
      }
      if (method === "DELETE") {
        await db
          .prepare("DELETE FROM watch_history WHERE user_id = ? AND tmdb_id = ?")
          .bind(meId, tmdbId)
          .run();
        return json({ tmdbId });
      }
    }
    if (sub === "/watch-history/import" && method === "PUT") {
      const items = await request.json().catch(() => []);
      for (const item of items) {
        await db
          .prepare(
            "INSERT OR REPLACE INTO watch_history (user_id, tmdb_id, data, updated_at) VALUES (?,?,?,?)",
          )
          .bind(meId, item.tmdbId, JSON.stringify({ ...item, updatedAt: now }), now)
          .run();
      }
      return json({ ok: true });
    }

    /* settings */
    if (sub === "/settings" && method === "GET") {
      const row = await db.prepare("SELECT * FROM settings WHERE user_id = ?").bind(meId).first();
      return json(row ? JSON.parse(row.data) : {});
    }
    if (sub === "/settings" && method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!body) return errBody("invalid body");
      await db
        .prepare("INSERT OR REPLACE INTO settings (user_id, data) VALUES (?,?)")
        .bind(meId, JSON.stringify(body))
        .run();
      return json(body);
    }

    /* group order */
    if (sub === "/group-order" && method === "GET") {
      const row = await db.prepare("SELECT * FROM group_order WHERE user_id = ?").bind(meId).first();
      return json(row ? JSON.parse(row.data) : []);
    }
    if (sub === "/group-order" && method === "PUT") {
      const body = await request.json().catch(() => []);
      await db
        .prepare("INSERT OR REPLACE INTO group_order (user_id, data) VALUES (?,?)")
        .bind(meId, JSON.stringify(body))
        .run();
      return json(body);
    }

    /* user edit/delete by id */
    if (sub === "" && method === "PATCH") {
      const body = await request.json().catch(() => ({}));
      const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(meId).first();
      const profile = body.profile || JSON.parse(user.profile || "{}");
      const nickname = body.nickname !== undefined ? body.nickname : user.nickname;
      await db
        .prepare("UPDATE users SET profile = ?, nickname = ? WHERE id = ?")
        .bind(JSON.stringify(profile), nickname, meId)
        .run();
      const fresh = await db.prepare("SELECT * FROM users WHERE id = ?").bind(meId).first();
      return json({ user: userResponse(fresh), session: sessionResponse(session) });
    }
    if (sub === "" && method === "DELETE") {
      await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(meId).run();
      await db.prepare("DELETE FROM users WHERE id = ?").bind(meId).run();
      return json({ ok: true });
    }
  }

  /* sessions management */
  const sessMatch = path.match(/^\/sessions\/([^/]+)$/);
  if (sessMatch) {
    const sessionId = sessMatch[1];
    const row = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sessionId).first();
    if (!row || row.user_id !== meId) return errBody("not found", 404);
    if (method === "GET") {
      const rows = await db
        .prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY accessed_at DESC")
        .bind(meId)
        .all();
      return json(rows.results.map(sessionResponse));
    }
    if (method === "PATCH") {
      const body = await request.json().catch(() => ({}));
      if (body.deviceName)
        await db
          .prepare("UPDATE sessions SET device = ? WHERE id = ?")
          .bind(body.deviceName, sessionId)
          .run();
      const fresh = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sessionId).first();
      return json([sessionResponse(fresh)]);
    }
    if (method === "DELETE") {
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
      return json({ ok: true });
    }
  }

  return errBody("not found", 404);
}
