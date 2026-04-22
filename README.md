# hitosea.com

Official website of 广西海豚有海信息科技有限公司 (Hitosea).

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3.4 + shadcn/ui
- next-intl (zh / en)
- next-themes (dark default)
- DooTask Bot API (contact form notifications)
- GitHub REST API (live star counts, 1h ISR cache)
- Vitest + Testing Library

## Development

```bash
pnpm install
cp .env.example .env.local
# Fill in DOOTASK_BOT_TOKEN, DOOTASK_DIALOG_ID
pnpm dev
```

Visit http://localhost:3000 (redirects to /zh).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Local dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm test` | Run unit tests |
| `pnpm lint` | ESLint |

## Changing Content

| What | Where |
|------|-------|
| Products (name, tagline, link) | `content/products.ts` |
| Company timeline | `content/company.ts` |
| Site copy (zh/en) | `i18n/messages/zh.json`, `i18n/messages/en.json` |
| Brand color | `app/globals.css` — CSS custom properties |
| Logo | `public/brand/` |
| Product logos | `public/logos/products/` |
| Site constants (emails, ICP, phone) | `lib/constants.ts` |

## Environment Variables

**Required:**

| Variable | Description |
|----------|-------------|
| `DOOTASK_BOT_TOKEN` | DooTask bot token for contact form notifications |
| `DOOTASK_DIALOG_ID` | DooTask dialog ID to send messages to |

**Optional:**

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Bumps GitHub API rate limit (60 → 5000/hr) |
| `NEXT_PUBLIC_SITE_URL` | Full URL; defaults to `https://hitosea.com` |

## Deployment

### Docker (recommended)

```bash
docker pull ghcr.io/hitosea/website:latest
docker run -p 3000:3000 --env-file .env.local ghcr.io/hitosea/website:latest
```

CI automatically builds and pushes Docker images to GHCR when the version in `package.json` changes on `main`.

### Vercel

Standard Next.js app, no special build flags needed.

## Architecture

```
app/[locale]/       # zh and en routes
app/api/            # contact API route
components/ui/      # shadcn primitives
components/site/    # page-specific components
content/            # products and timeline data (TS)
i18n/               # locale config + messages
lib/                # helpers (github, mail, schema, constants, editorial-date)
tests/              # Vitest unit tests
```

## Release

Bump the `version` field in `package.json`, commit, and push to `main`. CI will automatically build a Docker image and publish to `ghcr.io/hitosea/website:<version>`.
