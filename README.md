# hitosea.com

Official website of 广西海豚有海信息科技有限公司 (Hitosea).

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3.4 + shadcn/ui
- next-intl (zh / en)
- next-themes (dark default)
- Resend (contact form email)
- Vitest + Testing Library

## Development

```bash
pnpm install
cp .env.example .env.local
# Fill in RESEND_API_KEY and other optional vars
pnpm dev
```

Visit http://localhost:3000 (redirects to /zh).

## Scripts

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm test` — run unit tests
- `pnpm lint` — ESLint

## Changing content

| What | Where |
|---|---|
| Products (name, tagline, link) | `content/products.ts` |
| Company timeline | `content/company.ts` |
| Site copy (zh/en) | `i18n/messages/zh.json`, `i18n/messages/en.json` |
| Brand color | `app/globals.css` — `--primary` HSL variable |
| Logo | `public/brand/` |
| Product logos | `public/logos/products/` |
| Site constants (emails, ICP) | `lib/constants.ts` |

## Deployment

**Recommended:** Vercel. The project is a standard Next.js app with no special build flags.

Required env vars:
- `RESEND_API_KEY` — Resend API key for contact form emails
- `CONTACT_EMAIL_FROM` — verified Resend sender (e.g. `noreply@hitosea.com`)
- `CONTACT_EMAIL_TO` — destination for form submissions (e.g. `contact@hitosea.com`)

Optional:
- `FEISHU_WEBHOOK_URL` — if set, pings Feishu/Lark on each form submission
- `GITHUB_TOKEN` — bumps GitHub API rate limit for the stats strip (60 → 5000/hr)
- `NEXT_PUBLIC_SITE_URL` — full URL; defaults to `https://hitosea.com`

## Architecture

```
app/[locale]/       # zh and en routes
app/api/            # contact + github-stats routes
components/ui/      # shadcn primitives
components/site/    # page-specific components
content/            # products and timeline data (TS)
i18n/               # locale config + messages
lib/                # helpers (github, mail, schema, constants)
tests/              # Vitest unit tests
```

Design spec: `docs/superpowers/specs/2026-04-22-hitosea-website-design.md`
