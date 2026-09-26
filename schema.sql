CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  namespace TEXT NOT NULL DEFAULT 'movie-web',
  public_key TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL DEFAULT '',
  profile TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  device TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  accessed_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS challenges (
  code TEXT PRIMARY KEY,
  public_key TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id TEXT NOT NULL,
  tmdb_id TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT,
  PRIMARY KEY (user_id, tmdb_id)
);
CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL,
  tmdb_id TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT,
  PRIMARY KEY (user_id, tmdb_id)
);
CREATE TABLE IF NOT EXISTS watch_history (
  user_id TEXT NOT NULL,
  tmdb_id TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT,
  PRIMARY KEY (user_id, tmdb_id)
);
CREATE TABLE IF NOT EXISTS settings (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS group_order (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
