# StreamViva

> **Viva la StreamViva!** — a community continuation of P-Stream (which was a fork of movie-web), revived and actively maintained.

[![Build](https://github.com/loak7993-code/streamviva/actions/workflows/linting_testing.yml/badge.svg?branch=production)](https://github.com/loak7993-code/streamviva/actions)
[![Deploy](https://github.com/loak7993-code/streamviva/actions/workflows/deploying.yml/badge.svg?branch=production)](https://github.com/loak7993-code/streamviva/actions)

The original P-Stream project was discontinued in March 2026 and its ecosystem (providers package, docs, proxy, backend) was taken down. StreamViva is the living continuation: **35 working stream sources**, a fixed build chain, green CI, and verified end-to-end playback for movies, TV shows, and anime.

## What works

| Capability | Status |
|---|---|
| Movies | ✅ verified playing (direct HLS + 8 embed players) |
| TV shows | ✅ verified playing (season/episode aware) |
| Anime | ✅ verified playing |
| Catalog / search | ✅ full TMDB browsing |
| Subtitles | ✅ 170+ tracks auto-resolved per title |
| Stream sources | ✅ 35 in the browser pool (vidsrc.sh universal, vsembed, videasy, vidlink, 2embed, vidapi, ridomovies, and more) |
| CI (lint / test / build / docker / PWA) | ✅ green |

StreamViva does not host any content — it searches public sources on the internet and plays what it finds.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Floak7993-code%2Fstreamviva)

## Running Locally

```bash
git clone https://github.com/loak7993-code/streamviva.git
cd streamviva
cp example.env .env   # fill in your keys / proxy URLs
pnpm install
pnpm run dev
```

Then visit http://localhost:5173.

### Environment

See `example.env`. You need:

- `VITE_TMDB_READ_API_KEY` — TMDB v4 read token (free at themoviedb.org)
- `VITE_CORS_PROXY_URL` — simple-proxy deployment (`?destination=` format)
- `VITE_M3U8_PROXY_URL` — m3u8-proxy deployment (`/m3u8-proxy?url=` format)
- `VITE_BACKEND_URL` — optional, for account sync (community backend WIP)

## Updating providers

Stream sources live in a separate package: [`@streamviva/providers`](https://github.com/loak7993-code/streamviva-providers)

```bash
pnpm run update-providers   # pull latest sources
pnpm run update-and-build   # update + rebuild
```

## Updating an instance

```bash
git remote add upstream https://github.com/loak7993-code/streamviva.git
git fetch upstream
git checkout production
git merge upstream/production
git push
```

## Contributing

Issues and PRs welcome. See `.github/CONTRIBUTING.md`.

## Credits

Built on the work of the P-Stream team, the movie-web project, and the community mirrors that kept the provider ecosystem alive after the takedown.
