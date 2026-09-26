# P-Stream (Community Continuation)

> [!NOTE]
> The original p-stream project was discontinued in March 2026. This is a **community continuation** — the project is actively maintained again here.
>
> The original providers package (`p-stream/providers`) was removed from GitHub, which broke every build. This continuation ships with a restored providers package at [`loak7993-code/providers`](https://github.com/loak7993-code/providers) and a fixed build chain.

[![P-Stream Image](.github/P-Stream.png)](#running-locally)

## Status

| Component | State |
| --------- | ----- |
| Frontend (this repo) | ✅ Maintained — builds and runs from this fork |
| Providers package | ✅ Restored at [loak7993-code/providers](https://github.com/loak7993-code/providers) |
| CI (lint / test / build / docker) | ✅ Fixed — workflows now trigger on the real default branch (`production`) with the correct pnpm version |
| Backend / proxy / extension | ⚠️ Original repos archived or gone — self-host required for those pieces |

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Floak7993-code%2Fp-stream)

**NOTE: To self-host, more setup is required (TMDB key, CORS proxy, HLS proxy, backend). See `example.env`.**

## Changes from the original

- Restored the `@p-stream/providers` dependency from a post-takedown mirror — the frontend **builds again**
- Fixed CI: workflows triggered on a nonexistent `master` branch and installed pnpm 8 (project requires 9.14.4); now they run on `production` with lint + test + build + docker jobs
- Fixed the README quick-start (`cd smov` → `cd p-stream`)
- Pointed GitHub links at the continuation repo
- Version bumped to `5.4.0` (continuation release)

## Running Locally

Type the following commands into your terminal / command line to run P-Stream locally

```bash
git clone https://github.com/loak7993-code/p-stream.git
cd p-stream
cp example.env .env   # fill in your keys / proxy URLs
pnpm install
pnpm run dev
```

Then you can visit the local instance [here](http://localhost:5173) or, at local host on port 5173.

## Updating a P-Stream Instance

To update a P-Stream instance you can type the below commands into a terminal at the root of your project.

```bash
git remote add upstream https://github.com/loak7993-code/p-stream.git
git fetch upstream # Grab the contents of the new remote source
git checkout <YOUR_MAIN_BRANCH>  # Most likely this would be `origin/production`
git merge upstream/production
# * Fix any conflicts present during merge *
git add .  # Add all changes made during merge and conflict fixing
git commit -m "Update p-stream instance (merge upstream/production)"
git push  # Push to YOUR repository
```

## Updating providers

Providers (the scrapers/sources that find streams) live in a separate package:

```bash
pnpm run update-providers   # pull latest from the continuation's providers repo
pnpm run update-and-build   # update providers and rebuild
```

## Contributing

Issues and PRs are open on this repo. Bug reports and feature requests via the issue templates are welcome.

## Credits

All credit for the original project goes to the p-stream team and contributors. This continuation exists to keep their work buildable and running.
