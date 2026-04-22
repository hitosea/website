# hitosea.com Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship MVP of the hitosea.com company website — a bilingual (zh/en), Next.js 15 + shadcn/ui static site with 4 pages (home, open-source, about, contact), a product matrix, a GitHub stats integration, a contact form, and SEO-ready metadata — within ~14 days.

**Architecture:** Single Next.js 15 App Router project, static-generation-first, dark-mode-default. Product metadata lives in a single source of truth (`content/products.ts`) and feeds the homepage matrix, open-source page, navigation mega-menu, and footer. i18n via next-intl with `/zh` / `/en` route prefixes. Contact form posts to a server route that sends mail via Resend and optionally pings a Feishu webhook. GitHub stats are fetched server-side with a 1-hour ISR cache.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 3.4, shadcn/ui (radix-ui under the hood), next-intl, next-themes, framer-motion (light), react-hook-form + zod, lucide-react, Resend (email), Vitest + React Testing Library (unit tests), pnpm (package manager).

**Spec reference:** `docs/superpowers/specs/2026-04-22-hitosea-website-design.md`

---

## Conventions Used Throughout This Plan

- **Package manager**: pnpm. All install commands use `pnpm add`.
- **Commits**: after each task, commit with a Conventional Commits message (`feat:`, `chore:`, `test:`, etc.). One commit per task unless a task has a natural split.
- **Testing philosophy**: Strict TDD for pure logic (validation, data aggregation, helpers). Smoke tests only for UI components. No tests for trivial wiring (page shells that just compose components).
- **Paths**: All paths are relative to the project root `/home/coder/workspaces/hitosea.com/`.
- **Language**: Source code comments and variable names in English. UI copy in both Chinese and English.

---

## File Structure Overview

By the end of this plan, the project tree will look like:

```
hitosea.com/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── open-source/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── github-stats/route.ts
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                       (shadcn primitives)
│   └── site/
│       ├── site-header.tsx
│       ├── site-footer.tsx
│       ├── hero.tsx
│       ├── product-matrix.tsx
│       ├── product-card.tsx
│       ├── open-source-stats.tsx
│       ├── trust-bar.tsx
│       ├── why-us.tsx
│       ├── cta-section.tsx
│       ├── contact-form.tsx
│       ├── wechat-popover.tsx
│       ├── language-switch.tsx
│       ├── theme-toggle.tsx
│       └── product-timeline.tsx
├── content/
│   ├── products.ts
│   ├── company.ts
│   └── timeline.ts
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── messages/
│       ├── zh.json
│       └── en.json
├── lib/
│   ├── github.ts
│   ├── mail.ts
│   ├── contact-schema.ts
│   ├── constants.ts
│   └── utils.ts
├── public/
│   ├── logos/
│   ├── screenshots/
│   ├── brand/
│   └── og/
├── tests/
│   ├── lib/github.test.ts
│   ├── lib/contact-schema.test.ts
│   └── api/contact.test.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── components.json
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

---

## Task 1: Bootstrap Next.js 15 project with TypeScript and Tailwind

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx` (temporary root), `app/page.tsx` (temporary root), `.gitignore`, `.eslintrc.json`, `.prettierrc`

- [ ] **Step 1: Run create-next-app scaffolding**

Run in project root:
```bash
pnpm create next-app@15 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-pnpm --no-turbopack
```

When prompted about existing files, say yes to overwrite (we're in an empty repo except for `docs/`).

- [ ] **Step 2: Verify dev server boots**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: Next.js default landing page renders. Kill the server with Ctrl-C.

- [ ] **Step 3: Lock Tailwind to v3.4 if create-next-app picked a different version**

Open `package.json`. If `tailwindcss` is not in the `^3.4.0` range, run:
```bash
pnpm remove tailwindcss && pnpm add -D tailwindcss@^3.4 postcss autoprefixer
```

Then ensure `tailwind.config.ts` has:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Configure Prettier**

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Install plugin:
```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: bootstrap Next.js 15 + TypeScript + Tailwind 3.4"
```

---

## Task 2: Install shadcn/ui and seed baseline components

**Files:**
- Create: `components.json`, `components/ui/*` (multiple files generated by shadcn), `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init -d
```

This creates `components.json` and `lib/utils.ts`. Accept defaults (style: `default`, base color: `slate`, CSS variables: yes).

- [ ] **Step 2: Add baseline components**

```bash
pnpm dlx shadcn@latest add button card badge input textarea label select checkbox dialog sheet popover tooltip dropdown-menu navigation-menu form skeleton sonner separator
```

- [ ] **Step 3: Verify build still succeeds**

```bash
pnpm build
```

Expected: build completes without errors (the default Next.js page still works; shadcn components are not yet used).

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: init shadcn/ui with baseline components"
```

---

## Task 3: Install project dependencies

**Files:** Only `package.json` / `pnpm-lock.yaml` change.

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add next-intl next-themes framer-motion react-hook-form zod @hookform/resolvers lucide-react resend
```

- [ ] **Step 2: Install dev dependencies for testing**

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

- [ ] **Step 3: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
```

Create `tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

Add scripts to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Verify Vitest runs**

Create a throwaway test `tests/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('adds', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run:
```bash
pnpm test
```

Expected: 1 test passes. Delete `tests/smoke.test.ts` after confirming.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: add runtime deps and configure Vitest"
```

---

## Task 4: Configure i18n with next-intl

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `i18n/messages/zh.json`, `i18n/messages/en.json`, `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create locale routing config**

Create `i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

- [ ] **Step 2: Create request config**

Create `i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create initial message files**

Create `i18n/messages/zh.json`:
```json
{
  "common": {
    "bookDemo": "预约演示",
    "contact": "联系",
    "language": "语言"
  },
  "nav": {
    "products": "产品",
    "openSource": "开源",
    "about": "关于"
  }
}
```

Create `i18n/messages/en.json`:
```json
{
  "common": {
    "bookDemo": "Book a demo",
    "contact": "Contact",
    "language": "Language"
  },
  "nav": {
    "products": "Products",
    "openSource": "Open Source",
    "about": "About"
  }
}
```

- [ ] **Step 4: Add middleware**

Create `middleware.ts` at project root:
```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 5: Wire next-intl plugin in next.config.ts**

Replace `next.config.ts` with:
```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 6: Move default page into [locale] structure**

Delete existing `app/page.tsx` and `app/layout.tsx`. Create:

`app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

export const metadata: Metadata = {
  title: '海豚有海 Hitosea',
  description: 'Developer-first 的开源产品公司',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'zh' | 'en')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

`app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('common')
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Hitosea</h1>
      <p className="mt-4">{t('bookDemo')}</p>
    </main>
  )
}
```

- [ ] **Step 7: Verify dev server renders both locales**

```bash
pnpm dev
```

Visit:
- `http://localhost:3000/zh` → should show "预约演示"
- `http://localhost:3000/en` → should show "Book a demo"
- `http://localhost:3000/` → should redirect to `/zh`

Kill server.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: wire up next-intl with zh/en locales and middleware"
```

---

## Task 5: Set up theme system (dark default, brand color via CSS var)

**Files:**
- Create: `components/theme-provider.tsx`
- Modify: `app/[locale]/layout.tsx`, `app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Create theme provider wrapper**

Create `components/theme-provider.tsx`:
```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode
} & React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 2: Update globals.css with brand-aware CSS variables**

Replace `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 199 89% 48%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 199 89% 48%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222 47% 5%;
    --foreground: 210 40% 98%;
    --card: 222 47% 7%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 7%;
    --popover-foreground: 210 40% 98%;
    --primary: 199 89% 48%;
    --primary-foreground: 222 47% 5%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 199 89% 48%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Extend Tailwind config with shadcn tokens**

Replace `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

Install the animate plugin if shadcn init didn't:
```bash
pnpm add -D tailwindcss-animate
```

- [ ] **Step 4: Wire ThemeProvider into layout**

Edit `app/[locale]/layout.tsx` — change the `<body>` section to wrap children with ThemeProvider:
```tsx
import { ThemeProvider } from '@/components/theme-provider'
// ... other imports

// In the return:
<body className="min-h-screen bg-background text-foreground antialiased">
  <ThemeProvider>
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 5: Verify dark mode is active by default**

```bash
pnpm dev
```

Visit `/zh`. Expected: page background is dark (near-black). Kill server.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: set up theme system with dark default and brand color CSS var"
```

---

## Task 6: Global constants and brand fonts

**Files:**
- Create: `lib/constants.ts`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create constants file**

Create `lib/constants.ts`:
```ts
export const SITE = {
  name: 'Hitosea',
  nameZh: '海豚有海',
  legalName: '广西海豚有海信息科技有限公司',
  domain: 'hitosea.com',
  url: 'https://hitosea.com',
  email: 'contact@hitosea.com',
  salesEmail: 'sales@hitosea.com',
  careersEmail: 'careers@hitosea.com',
  phone: '',
  icp: '',
  founded: 2020,
} as const

export const GITHUB_ORGS = [
  'hitosea',
  'kuaifan',
  'menuray',
  'doopush',
  'qiujian-club',
] as const

export const LOCALES = ['zh', 'en'] as const
export type Locale = (typeof LOCALES)[number]
```

- [ ] **Step 2: Add Inter + Geist fonts via next/font**

Edit `app/[locale]/layout.tsx` — add at top:
```tsx
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

Install Geist:
```bash
pnpm add geist
```

Update the `<html>` tag:
```tsx
<html lang={locale} suppressHydrationWarning className={`${inter.variable} ${GeistMono.variable}`}>
```

- [ ] **Step 3: Verify fonts load**

```bash
pnpm dev
```

Visit `/zh`. Open DevTools → Network → Fonts. Expected: Inter font loaded. Kill server.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add site constants and Inter + Geist Mono fonts"
```

---

## Task 7: Product metadata (single source of truth)

**Files:**
- Create: `content/products.ts`
- Test: `tests/content/products.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/content/products.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { products, getProductsByTheme, getFlagshipProduct } from '@/content/products'

describe('products metadata', () => {
  it('contains all expected products', () => {
    const slugs = products.map(p => p.slug)
    expect(slugs).toContain('dootask')
    expect(slugs).toContain('happy-next')
    expect(slugs).toContain('eeui')
    expect(slugs).toContain('menuray')
    expect(slugs).toContain('doopush')
    expect(slugs).toContain('qiujian')
  })

  it('every product has a theme', () => {
    for (const p of products) {
      expect(['collaboration', 'ai-dev', 'vertical-ai']).toContain(p.theme)
    }
  })

  it('groups products by theme', () => {
    const groups = getProductsByTheme()
    expect(groups.collaboration.length).toBeGreaterThan(0)
    expect(groups['ai-dev'].length).toBeGreaterThan(0)
    expect(groups['vertical-ai'].length).toBeGreaterThan(0)
  })

  it('returns DooTask as the flagship', () => {
    expect(getFlagshipProduct().slug).toBe('dootask')
  })

  it('every product has non-empty tagline and taglineZh', () => {
    for (const p of products) {
      expect(p.tagline.length).toBeGreaterThan(0)
      expect(p.taglineZh.length).toBeGreaterThan(0)
    }
  })

  it('every product has a githubRepo in owner/name format', () => {
    for (const p of products) {
      expect(p.githubRepo).toMatch(/^[^/]+\/[^/]+$/)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/content/products.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement products.ts**

Create `content/products.ts`:
```ts
export type ProductTheme = 'collaboration' | 'ai-dev' | 'vertical-ai'

export interface Product {
  slug: string
  name: string
  nameZh: string
  tagline: string
  taglineZh: string
  theme: ProductTheme
  isFlagship?: boolean
  logoUrl: string
  websiteUrl?: string
  githubRepo: string
  githubUrl: string
  tags: string[]
  featured: boolean
}

export const products: Product[] = [
  {
    slug: 'dootask',
    name: 'DooTask',
    nameZh: 'DooTask',
    tagline: 'Open-source all-in-one team workspace — tasks, chat, docs, whiteboard.',
    taglineZh: '开源的团队协作中枢：任务、IM、文档、白板一体化。',
    theme: 'collaboration',
    isFlagship: true,
    logoUrl: '/logos/products/dootask.svg',
    websiteUrl: 'https://www.dootask.com',
    githubRepo: 'kuaifan/dootask',
    githubUrl: 'https://github.com/kuaifan/dootask',
    tags: ['Open Source', 'Self-hosted'],
    featured: true,
  },
  {
    slug: 'dootask-okr',
    name: 'DooTask OKR',
    nameZh: 'DooTask OKR',
    tagline: 'OKR management, built on top of DooTask.',
    taglineZh: '基于 DooTask 的目标与关键结果（OKR）管理。',
    theme: 'collaboration',
    logoUrl: '/logos/products/dootask-okr.svg',
    githubRepo: 'hitosea/dootask-okr',
    githubUrl: 'https://github.com/hitosea/dootask-okr',
    tags: ['Open Source', 'OKR'],
    featured: true,
  },
  {
    slug: 'dootask-ai',
    name: 'DooTask AI',
    nameZh: 'DooTask AI',
    tagline: 'AI assistant module that plugs into DooTask.',
    taglineZh: '为 DooTask 注入 AI 能力的助手模块。',
    theme: 'collaboration',
    logoUrl: '/logos/products/dootask-ai.svg',
    githubRepo: 'kuaifan/dootask-ai',
    githubUrl: 'https://github.com/kuaifan/dootask-ai',
    tags: ['AI', 'Open Source'],
    featured: false,
  },
  {
    slug: 'happy-next',
    name: 'Happy Next',
    nameZh: 'Happy Next',
    tagline: 'A multi-model AI workspace for Claude Code & Codex — orchestration, realtime voice, E2E encryption.',
    taglineZh: '面向 Claude Code 和 Codex 的多模型 AI 工作空间，支持编排、实时语音、端到端加密。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/happy-next.svg',
    websiteUrl: 'https://happy-next.com',
    githubRepo: 'hitosea/happy-next',
    githubUrl: 'https://github.com/hitosea/happy-next',
    tags: ['AI', 'Open Source', 'E2E Encrypted'],
    featured: true,
  },
  {
    slug: 'eeui',
    name: 'eeui',
    nameZh: 'eeui',
    tagline: 'Build high-quality native (iOS/Android) apps with Vue.js.',
    taglineZh: '用 Vue.js 开发高质量原生（Android/iOS）应用的跨端框架。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/eeui.svg',
    websiteUrl: 'https://eeui.app',
    githubRepo: 'kuaifan/eeui',
    githubUrl: 'https://github.com/kuaifan/eeui',
    tags: ['Framework', 'Open Source', 'Vue'],
    featured: true,
  },
  {
    slug: 'doopush',
    name: 'DooPush',
    nameZh: 'DooPush',
    tagline: 'Self-hosted push notification platform for iOS and Android.',
    taglineZh: '自部署的 iOS / Android 推送通知平台。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/doopush.svg',
    githubRepo: 'doopush/doopush',
    githubUrl: 'https://github.com/doopush/doopush',
    tags: ['Infrastructure', 'Open Source'],
    featured: true,
  },
  {
    slug: 'menuray',
    name: 'MenuRay',
    nameZh: 'MenuRay',
    tagline: 'Snap a photo of any paper menu — get a shareable digital menu in minutes.',
    taglineZh: '拍一张纸质菜单，分钟级得到可分享的数字菜单（面向 SMB 餐厅）。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/menuray.svg',
    githubRepo: 'menuray/menuray',
    githubUrl: 'https://github.com/menuray/menuray',
    tags: ['AI', 'Open Source', 'Restaurant'],
    featured: true,
  },
  {
    slug: 'qiujian',
    name: 'Qiujian',
    nameZh: '球见',
    tagline: 'Your pocket tennis AI companion, with a personalized tennis feed.',
    taglineZh: '口袋里的网球 AI 伙伴，加一份只属于你的网球内容流。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/qiujian.svg',
    githubRepo: 'qiujian-club/qiujian',
    githubUrl: 'https://github.com/qiujian-club/qiujian',
    tags: ['AI', 'Open Source', 'Sports'],
    featured: true,
  },
  {
    slug: 'ttpos',
    name: 'TTPOS',
    nameZh: 'TTPOS',
    tagline: 'Point-of-sale system for retail (Go + Flutter).',
    taglineZh: '面向零售的 POS 系统（Go + Flutter）。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/ttpos.svg',
    githubRepo: 'hitosea/ttpos-server-go',
    githubUrl: 'https://github.com/hitosea/ttpos-server-go',
    tags: ['Retail'],
    featured: false,
  },
]

export function getProductsByTheme(): Record<ProductTheme, Product[]> {
  const groups: Record<ProductTheme, Product[]> = {
    collaboration: [],
    'ai-dev': [],
    'vertical-ai': [],
  }
  for (const p of products) {
    groups[p.theme].push(p)
  }
  return groups
}

export function getFlagshipProduct(): Product {
  const flagship = products.find((p) => p.isFlagship)
  if (!flagship) throw new Error('No flagship product defined')
  return flagship
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test tests/content/products.test.ts
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add product metadata single source of truth"
```

---

## Task 8: Contact form validation schema (Zod)

**Files:**
- Create: `lib/contact-schema.ts`
- Test: `tests/lib/contact-schema.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/contact-schema.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/contact-schema'

describe('contactSchema', () => {
  const valid = {
    name: 'Alice',
    company: 'Acme',
    email: 'alice@acme.com',
    phone: '',
    productSlugs: ['dootask'],
    message: 'We want to evaluate DooTask for 200 engineers.',
  }

  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing name', () => {
    const r = contactSchema.safeParse({ ...valid, name: '' })
    expect(r.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(r.success).toBe(false)
  })

  it('rejects missing company', () => {
    const r = contactSchema.safeParse({ ...valid, company: '' })
    expect(r.success).toBe(false)
  })

  it('rejects message shorter than 10 chars', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'short' })
    expect(r.success).toBe(false)
  })

  it('accepts empty optional phone', () => {
    expect(contactSchema.safeParse({ ...valid, phone: '' }).success).toBe(true)
  })

  it('accepts empty productSlugs array', () => {
    expect(contactSchema.safeParse({ ...valid, productSlugs: [] }).success).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/lib/contact-schema.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement schema**

Create `lib/contact-schema.ts`:
```ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100),
  company: z.string().min(1, { message: 'Company is required' }).max(200),
  email: z.string().email({ message: 'Valid email required' }).max(200),
  phone: z.string().max(50).optional().default(''),
  productSlugs: z.array(z.string()).default([]),
  message: z
    .string()
    .min(10, { message: 'Please share at least 10 characters about your needs' })
    .max(5000),
})

export type ContactSubmission = z.infer<typeof contactSchema>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test tests/lib/contact-schema.test.ts
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add contact form validation schema"
```

---

## Task 9: GitHub stats aggregator

**Files:**
- Create: `lib/github.ts`
- Test: `tests/lib/github.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/github.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoStats, aggregateStats } from '@/lib/github'

describe('github stats', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchRepoStats', () => {
    it('returns stargazers_count and forks_count when response is ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            stargazers_count: 5400,
            forks_count: 320,
            open_issues_count: 40,
          }),
        }),
      )
      const stats = await fetchRepoStats('kuaifan/dootask')
      expect(stats.stars).toBe(5400)
      expect(stats.forks).toBe(320)
    })

    it('returns zeros on a failed response (graceful fallback)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
      const stats = await fetchRepoStats('does/not-exist')
      expect(stats.stars).toBe(0)
      expect(stats.forks).toBe(0)
    })

    it('sends Authorization header when GITHUB_TOKEN is set', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ stargazers_count: 1, forks_count: 0, open_issues_count: 0 }),
      })
      vi.stubGlobal('fetch', mockFetch)
      vi.stubEnv('GITHUB_TOKEN', 'test-token')
      await fetchRepoStats('a/b')
      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer test-token')
    })
  })

  describe('aggregateStats', () => {
    it('sums stars and counts repos', () => {
      const result = aggregateStats([
        { repo: 'a/b', stars: 100, forks: 10 },
        { repo: 'c/d', stars: 250, forks: 30 },
      ])
      expect(result.totalStars).toBe(350)
      expect(result.totalRepos).toBe(2)
    })

    it('handles empty input', () => {
      const result = aggregateStats([])
      expect(result.totalStars).toBe(0)
      expect(result.totalRepos).toBe(0)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test tests/lib/github.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement lib/github.ts**

Create `lib/github.ts`:
```ts
export interface RepoStats {
  repo: string
  stars: number
  forks: number
}

export interface AggregateStats {
  totalStars: number
  totalRepos: number
}

export async function fetchRepoStats(repo: string): Promise<RepoStats> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return { repo, stars: 0, forks: 0 }
    }
    const data = await res.json()
    return {
      repo,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch {
    return { repo, stars: 0, forks: 0 }
  }
}

export function aggregateStats(repos: RepoStats[]): AggregateStats {
  return {
    totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
    totalRepos: repos.length,
  }
}

export async function fetchAllProductStats(repoList: string[]): Promise<{
  perRepo: RepoStats[]
  aggregate: AggregateStats
}> {
  const perRepo = await Promise.all(repoList.map((r) => fetchRepoStats(r)))
  return {
    perRepo,
    aggregate: aggregateStats(perRepo),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test tests/lib/github.test.ts
```

Expected: all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add GitHub repo stats fetcher with graceful fallback"
```

---

## Task 10: GitHub stats API route

**Files:**
- Create: `app/api/github-stats/route.ts`

- [ ] **Step 1: Implement route**

Create `app/api/github-stats/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export const revalidate = 3600

export async function GET() {
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { perRepo, aggregate } = await fetchAllProductStats(repos)
  return NextResponse.json(
    {
      perRepo,
      aggregate,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
```

- [ ] **Step 2: Verify manually**

```bash
pnpm dev
```

In another terminal:
```bash
curl -s http://localhost:3000/api/github-stats | head -200
```

Expected: JSON with `perRepo` array and `aggregate: { totalStars, totalRepos }`. `totalStars` should be in the thousands (mostly from DooTask). Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add /api/github-stats route with 1h cache"
```

---

## Task 11: SiteHeader component

**Files:**
- Create: `components/site/site-header.tsx`, `components/site/language-switch.tsx`, `components/site/wechat-popover.tsx`, `components/site/theme-toggle.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create LanguageSwitch**

Create `components/site/language-switch.tsx`:
```tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

export function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const next = locale === 'zh' ? 'en' : 'zh'
    router.replace(pathname, { locale: next })
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Switch language">
      {locale === 'zh' ? 'EN' : '中'}
    </Button>
  )
}
```

- [ ] **Step 2: Create ThemeToggle**

Create `components/site/theme-toggle.tsx`:
```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
```

- [ ] **Step 3: Create WeChatPopover**

Create `components/site/wechat-popover.tsx`:
```tsx
'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslations } from 'next-intl'

export function WeChatPopover() {
  const t = useTranslations('common')
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="WeChat">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 text-center">
        <p className="mb-2 text-sm font-medium">{t('wechatTitle')}</p>
        <div className="relative mx-auto h-40 w-40 bg-muted">
          <Image
            src="/brand/wechat-qr.svg"
            alt="WeChat QR"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t('wechatHint')}</p>
      </PopoverContent>
    </Popover>
  )
}
```

Create a placeholder QR SVG at `public/brand/wechat-qr.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#e5e7eb"/><text x="80" y="85" text-anchor="middle" fill="#6b7280" font-size="12" font-family="sans-serif">WeChat QR placeholder</text></svg>
```

Add to `i18n/messages/zh.json` under `common`:
```json
"wechatTitle": "添加微信",
"wechatHint": "工作日 9:00-18:00"
```

And `en.json`:
```json
"wechatTitle": "Add on WeChat",
"wechatHint": "Weekdays 9:00–18:00"
```

- [ ] **Step 4: Create SiteHeader**

Create `components/site/site-header.tsx`:
```tsx
import Link from 'next/link'
import { Link as IntlLink } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitch } from './language-switch'
import { ThemeToggle } from './theme-toggle'
import { WeChatPopover } from './wechat-popover'
import { SITE } from '@/lib/constants'

export async function SiteHeader() {
  const t = await getTranslations('nav')
  const tc = await getTranslations('common')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <IntlLink href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">{SITE.nameZh}</span>
          <span className="hidden text-sm text-muted-foreground md:inline">
            {SITE.name}
          </span>
        </IntlLink>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <IntlLink href="/#products" className="text-muted-foreground hover:text-foreground">
            {t('products')}
          </IntlLink>
          <IntlLink href="/open-source" className="text-muted-foreground hover:text-foreground">
            {t('openSource')}
          </IntlLink>
          <IntlLink href="/about" className="text-muted-foreground hover:text-foreground">
            {t('about')}
          </IntlLink>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <WeChatPopover />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <IntlLink href="/contact">{tc('bookDemo')}</IntlLink>
          </Button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 5: Mount header in layout**

Edit `app/[locale]/layout.tsx` — inside `<ThemeProvider>`, wrap content:
```tsx
import { SiteHeader } from '@/components/site/site-header'

// In return, replace <NextIntlClientProvider>...</NextIntlClientProvider> with:
<NextIntlClientProvider messages={messages}>
  <SiteHeader />
  <div className="flex-1">{children}</div>
</NextIntlClientProvider>
```

Also change outer body to `flex flex-col min-h-screen`.

- [ ] **Step 6: Verify in browser**

```bash
pnpm dev
```

Visit `/zh`. Expected:
- Header sticky at top
- Shows "海豚有海 Hitosea"
- Nav items "产品 开源 关于"
- Right side: EN switch, WeChat icon, theme toggle, "预约演示" button
- Click EN → URL changes to `/en`, nav becomes English

Kill server.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add SiteHeader with language switch, WeChat popover, and theme toggle"
```

---

## Task 12: SiteFooter component

**Files:**
- Create: `components/site/site-footer.tsx`
- Modify: `app/[locale]/layout.tsx`, `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n with footer keys**

Add to `i18n/messages/zh.json`:
```json
"footer": {
  "tagline": "Developer-first 的开源产品公司",
  "products": "产品",
  "company": "公司",
  "openSourceCol": "开源",
  "contactCol": "联系",
  "about": "关于我们",
  "joinUs": "加入我们",
  "contact": "联系我们",
  "github": "GitHub 组织",
  "contribute": "贡献指南",
  "email": "邮箱",
  "wechat": "微信",
  "rights": "保留所有权利"
}
```

Same structure in `en.json`:
```json
"footer": {
  "tagline": "A developer-first open-source product company.",
  "products": "Products",
  "company": "Company",
  "openSourceCol": "Open Source",
  "contactCol": "Contact",
  "about": "About",
  "joinUs": "Join us",
  "contact": "Contact",
  "github": "GitHub org",
  "contribute": "Contributing guide",
  "email": "Email",
  "wechat": "WeChat",
  "rights": "All rights reserved"
}
```

- [ ] **Step 2: Create footer component**

Create `components/site/site-footer.tsx`:
```tsx
import { Link as IntlLink } from '@/i18n/routing'
import { getTranslations, getLocale } from 'next-intl/server'
import { products } from '@/content/products'
import { SITE } from '@/lib/constants'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  const locale = await getLocale()
  const year = new Date().getFullYear()

  const productLinks = products.filter((p) => p.featured)

  return (
    <footer className="mt-24 border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">{SITE.nameZh}</p>
            <p className="mt-1 text-sm text-muted-foreground">{SITE.name}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('products')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.websiteUrl ?? p.githubUrl}
                    className="hover:text-foreground"
                    target="_blank"
                    rel="noopener"
                  >
                    {locale === 'zh' ? p.nameZh : p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <IntlLink href="/about" className="hover:text-foreground">
                  {t('about')}
                </IntlLink>
              </li>
              <li>
                <a href={`mailto:${SITE.careersEmail}`} className="hover:text-foreground">
                  {t('joinUs')}
                </a>
              </li>
              <li>
                <IntlLink href="/contact" className="hover:text-foreground">
                  {t('contact')}
                </IntlLink>
              </li>
              <li>
                <a
                  href="https://github.com/hitosea"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-foreground"
                >
                  {t('github')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('contactCol')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {year} {SITE.legalName}. {t('rights')}.
          </p>
          <p>
            {SITE.icp ? (
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noopener"
                className="hover:text-foreground"
              >
                {SITE.icp}
              </a>
            ) : (
              <span>ICP 备案号 待更新</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Mount in layout**

Edit `app/[locale]/layout.tsx`:
```tsx
import { SiteFooter } from '@/components/site/site-footer'

// In <NextIntlClientProvider>:
<SiteHeader />
<div className="flex-1">{children}</div>
<SiteFooter />
```

- [ ] **Step 4: Verify**

```bash
pnpm dev
```

Visit `/zh`. Scroll to bottom. Expected: footer with 4 columns, product links, copyright. Kill server.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add SiteFooter with product and company links"
```

---

## Task 13: ProductCard component

**Files:**
- Create: `components/site/product-card.tsx`

- [ ] **Step 1: Implement component**

Create `components/site/product-card.tsx`:
```tsx
import Image from 'next/image'
import { ArrowUpRight, Github, Star } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { Product } from '@/content/products'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ProductCard({
  product,
  stars,
}: {
  product: Product
  stars?: number
}) {
  const locale = useLocale()
  const name = locale === 'zh' ? product.nameZh : product.name
  const tagline = locale === 'zh' ? product.taglineZh : product.tagline
  const primaryHref = product.websiteUrl ?? product.githubUrl
  const primaryLabel = product.websiteUrl ? (locale === 'zh' ? '官网' : 'Website') : 'GitHub'

  return (
    <Card className="group relative h-full overflow-hidden border-border/60 bg-card/50 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={product.logoUrl}
              alt={`${name} logo`}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          {product.isFlagship && (
            <Badge variant="secondary" className="text-xs">
              Flagship
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-sm">
          {typeof stars === 'number' && stars > 0 ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" /> {stars.toLocaleString()}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`${name} on GitHub`}
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {primaryLabel} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Create placeholder product logos**

For each product slug, create `/public/logos/products/<slug>.svg` as a simple monogram placeholder. Use this as a template (swap letter and slug):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#0EA5E9"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="18" font-family="system-ui" font-weight="600">D</text></svg>
```

Create these files (letters based on initial of product name):
- `dootask.svg` (D)
- `dootask-okr.svg` (O)
- `dootask-ai.svg` (A)
- `happy-next.svg` (H)
- `eeui.svg` (E)
- `doopush.svg` (P)
- `menuray.svg` (M)
- `qiujian.svg` (Q)
- `ttpos.svg` (T)

Use a shell loop to create them:
```bash
mkdir -p public/logos/products
for entry in "dootask D" "dootask-okr O" "dootask-ai A" "happy-next H" "eeui E" "doopush P" "menuray M" "qiujian Q" "ttpos T"; do
  slug=${entry%% *}; letter=${entry##* }
  cat > "public/logos/products/${slug}.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#0EA5E9"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="18" font-family="system-ui" font-weight="600">${letter}</text></svg>
EOF
done
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add ProductCard component and placeholder logos"
```

---

## Task 14: ProductMatrix component

**Files:**
- Create: `components/site/product-matrix.tsx`
- Modify: `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n**

Add to `i18n/messages/zh.json`:
```json
"home": {
  "matrixTitle": "产品矩阵",
  "matrixSubtitle": "三条产品线，服务不同场景下的团队与开发者",
  "themes": {
    "collaboration": "① 企业协作与生产力",
    "ai-dev": "② AI 与开发者工具",
    "vertical-ai": "③ 面向行业的 AI 产品"
  }
}
```

Add to `en.json`:
```json
"home": {
  "matrixTitle": "Product matrix",
  "matrixSubtitle": "Three product lines for teams and developers in different contexts.",
  "themes": {
    "collaboration": "① Enterprise collaboration & productivity",
    "ai-dev": "② AI & developer tools",
    "vertical-ai": "③ Vertical AI products"
  }
}
```

- [ ] **Step 2: Implement matrix**

Create `components/site/product-matrix.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { getProductsByTheme, type ProductTheme } from '@/content/products'
import { ProductCard } from './product-card'
import { fetchAllProductStats } from '@/lib/github'

const THEME_ORDER: ProductTheme[] = ['collaboration', 'ai-dev', 'vertical-ai']

export async function ProductMatrix() {
  const groups = getProductsByTheme()
  const allRepos = THEME_ORDER.flatMap((theme) =>
    groups[theme].filter((p) => p.featured).map((p) => p.githubRepo),
  )
  const { perRepo } = await fetchAllProductStats(allRepos)
  const starsByRepo = new Map(perRepo.map((r) => [r.repo, r.stars]))

  return (
    <section id="products" className="container py-16 md:py-24">
      <ProductMatrixHeading />
      <div className="space-y-12 md:space-y-16">
        {THEME_ORDER.map((theme) => {
          const items = groups[theme].filter((p) => p.featured)
          if (items.length === 0) return null
          return <ProductThemeGroup key={theme} theme={theme} items={items} starsByRepo={starsByRepo} />
        })}
      </div>
    </section>
  )
}

function ProductMatrixHeading() {
  const t = useTranslations('home')
  return (
    <div className="mb-12 max-w-2xl md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t('matrixTitle')}</h2>
      <p className="mt-3 text-muted-foreground">{t('matrixSubtitle')}</p>
    </div>
  )
}

function ProductThemeGroup({
  theme,
  items,
  starsByRepo,
}: {
  theme: ProductTheme
  items: ReturnType<typeof getProductsByTheme>[ProductTheme]
  starsByRepo: Map<string, number>
}) {
  const t = useTranslations('home.themes')
  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t(theme)}
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} stars={starsByRepo.get(p.githubRepo)} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Temporarily mount on home page to verify**

Edit `app/[locale]/page.tsx`:
```tsx
import { ProductMatrix } from '@/components/site/product-matrix'

export default function HomePage() {
  return (
    <main>
      <ProductMatrix />
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
pnpm dev
```

Visit `/zh#products`. Expected: three theme groups rendering with product cards, each with star counts (or 0 if GitHub API was rate-limited). Kill server.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add ProductMatrix with themed groupings and live GitHub stars"
```

---

## Task 15: Hero section

**Files:**
- Create: `components/site/hero.tsx`, `components/site/stats-strip.tsx`
- Modify: `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n**

Add to `i18n/messages/zh.json` under `home`:
```json
"hero": {
  "eyebrow": "开源 · 产品矩阵 · 企业级",
  "titleLine1": "我们构建开源的",
  "titleLine2": "生产力、AI 与开发者工具",
  "lede": "海豚有海是一家 Developer-first 的开源产品公司。我们的产品被数千个团队和开发者信赖使用。",
  "primaryCta": "预约演示",
  "secondaryCta": "浏览产品矩阵"
},
"stats": {
  "stars": "GitHub ★",
  "repos": "开源项目",
  "contributors": "贡献者"
}
```

Add to `en.json` under `home`:
```json
"hero": {
  "eyebrow": "Open source · Product suite · Enterprise-ready",
  "titleLine1": "We build open-source tools for",
  "titleLine2": "productivity, AI, and developers.",
  "lede": "Hitosea is a developer-first open-source product company. Our products are trusted by thousands of teams and developers.",
  "primaryCta": "Book a demo",
  "secondaryCta": "Explore our products"
},
"stats": {
  "stars": "GitHub ★",
  "repos": "Open-source projects",
  "contributors": "Contributors"
}
```

- [ ] **Step 2: Create StatsStrip**

Create `components/site/stats-strip.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function StatsStrip() {
  const t = useTranslations('stats')
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { aggregate } = await fetchAllProductStats(repos)

  const items = [
    { label: t('stars'), value: formatCount(aggregate.totalStars) },
    { label: t('repos'), value: `${aggregate.totalRepos}` },
  ]

  return (
    <div className="mt-10 flex flex-wrap gap-8 text-sm md:gap-12">
      {items.map((item) => (
        <div key={item.label}>
          <div className="font-mono text-2xl font-semibold text-foreground">{item.value}</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k+`
  return `${n}`
}
```

- [ ] **Step 3: Create Hero**

Create `components/site/hero.tsx`:
```tsx
import { Suspense } from 'react'
import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsStrip } from './stats-strip'

export function Hero() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary blur-[128px]" />
      </div>
      <div className="container relative py-20 md:py-32">
        <p className="mb-6 inline-block rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          {t('eyebrow')}
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-muted-foreground">{t('titleLine1')}</span>
          <br />
          <span>{t('titleLine2')}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{t('lede')}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <IntlLink href="/contact">
              {t('primaryCta')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <IntlLink href="/#products">{t('secondaryCta')}</IntlLink>
          </Button>
        </div>
        <Suspense fallback={<div className="mt-10 h-16" />}>
          <StatsStrip />
        </Suspense>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Mount Hero on home page**

Edit `app/[locale]/page.tsx`:
```tsx
import { Hero } from '@/components/site/hero'
import { ProductMatrix } from '@/components/site/product-matrix'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductMatrix />
    </main>
  )
}
```

- [ ] **Step 5: Verify**

```bash
pnpm dev
```

Visit `/zh`. Expected: Hero with title, eyebrow, two CTAs, stats strip, then product matrix below. Kill server.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Hero section with stats strip"
```

---

## Task 16: OpenSourceStats (full strip) + WhyUs + CTASection

**Files:**
- Create: `components/site/open-source-stats.tsx`, `components/site/why-us.tsx`, `components/site/cta-section.tsx`
- Modify: `i18n/messages/*.json`, `app/[locale]/page.tsx`

- [ ] **Step 1: Extend i18n**

Add to `zh.json` under `home`:
```json
"opensource": {
  "title": "我们相信开源",
  "lede": "海豚有海的所有核心产品都开源。从 DooTask 到 MenuRay，我们相信可审计、可自部署、可定制的软件是企业未来的基础。",
  "viewProjects": "查看开源项目",
  "viewGithub": "前往 GitHub 组织"
},
"whyUs": {
  "title": "为什么选海豚有海",
  "items": {
    "openSource": {
      "title": "全线开源",
      "desc": "所有核心产品开源，可审计、可自部署、可定制。"
    },
    "enterprise": {
      "title": "企业私有化",
      "desc": "提供生产级私有化部署、安全合规支持和 SLA。"
    },
    "matrix": {
      "title": "产品矩阵",
      "desc": "从团队协作到 AI 工作空间到垂直 SaaS，一家公司满足多场景。"
    },
    "devFriendly": {
      "title": "开发者友好",
      "desc": "完整的开源文档、丰富的 API 和 SDK、活跃的社区。"
    }
  }
},
"cta": {
  "title": "准备为你的团队接入海豚有海的产品了吗？",
  "primary": "预约演示",
  "secondary": "加微信聊聊",
  "emailHint": "或直接发邮件："
}
```

Same keys in `en.json`:
```json
"opensource": {
  "title": "We believe in open source",
  "lede": "Every core product at Hitosea is open source. From DooTask to MenuRay, we believe auditable, self-hostable, customizable software is the future of enterprise software.",
  "viewProjects": "View open-source projects",
  "viewGithub": "Go to our GitHub org"
},
"whyUs": {
  "title": "Why Hitosea",
  "items": {
    "openSource": {
      "title": "Fully open-source",
      "desc": "All our core products are open source — auditable, self-hostable, customizable."
    },
    "enterprise": {
      "title": "Enterprise-ready",
      "desc": "Production-grade self-hosted deployments, compliance, and SLA support."
    },
    "matrix": {
      "title": "Product suite",
      "desc": "From team collaboration to AI workspace to vertical SaaS — one vendor, many scenarios."
    },
    "devFriendly": {
      "title": "Developer-first",
      "desc": "Solid open-source docs, rich APIs and SDKs, active community."
    }
  }
},
"cta": {
  "title": "Ready to bring Hitosea products to your team?",
  "primary": "Book a demo",
  "secondary": "Chat on WeChat",
  "emailHint": "Or just email us:"
}
```

- [ ] **Step 2: OpenSourceStats component (full strip)**

Create `components/site/open-source-stats.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link as IntlLink } from '@/i18n/routing'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function OpenSourceStats() {
  const t = useTranslations('home.opensource')
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { aggregate } = await fetchAllProductStats(repos)

  return (
    <section className="container border-y border-border/40 py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1.2fr,1fr] md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">{t('lede')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <IntlLink href="/open-source">
                {t('viewProjects')} <ArrowRight className="ml-2 h-4 w-4" />
              </IntlLink>
            </Button>
            <Button asChild variant="outline">
              <a href="https://github.com/hitosea" target="_blank" rel="noopener">
                {t('viewGithub')}
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Stat value={formatK(aggregate.totalStars)} label="GitHub ★" />
          <Stat value={`${aggregate.totalRepos}+`} label="Repos" />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-6">
      <div className="font-mono text-4xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k+`
  return `${n}`
}
```

- [ ] **Step 3: WhyUs component**

Create `components/site/why-us.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { Github, Server, LayoutGrid, Code2 } from 'lucide-react'

const ITEMS = [
  { key: 'openSource', Icon: Github },
  { key: 'enterprise', Icon: Server },
  { key: 'matrix', Icon: LayoutGrid },
  { key: 'devFriendly', Icon: Code2 },
] as const

export function WhyUs() {
  const t = useTranslations('home.whyUs')
  const tItem = useTranslations('home.whyUs.items')

  return (
    <section className="container py-16 md:py-24">
      <h2 className="mb-12 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
        {t('title')}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ key, Icon }) => (
          <div
            key={key}
            className="rounded-xl border border-border/60 bg-card/30 p-6 transition-colors hover:border-primary/50"
          >
            <Icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">
              {tItem(`${key}.title` as `${typeof key}.title`)}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {tItem(`${key}.desc` as `${typeof key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: CTASection component**

Create `components/site/cta-section.tsx`:
```tsx
import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/constants'

export function CTASection() {
  const t = useTranslations('home.cta')

  return (
    <section className="relative overflow-hidden border-t border-border/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[128px]" />
      </div>
      <div className="container relative py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <IntlLink href="/contact">
              {t('primary')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <IntlLink href="/contact#wechat">{t('secondary')}</IntlLink>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {t('emailHint')}{' '}
          <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
            {SITE.email}
          </a>
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Assemble home page**

Edit `app/[locale]/page.tsx`:
```tsx
import { Hero } from '@/components/site/hero'
import { ProductMatrix } from '@/components/site/product-matrix'
import { OpenSourceStats } from '@/components/site/open-source-stats'
import { WhyUs } from '@/components/site/why-us'
import { CTASection } from '@/components/site/cta-section'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductMatrix />
      <OpenSourceStats />
      <WhyUs />
      <CTASection />
    </main>
  )
}
```

- [ ] **Step 6: Verify**

```bash
pnpm dev
```

Visit `/zh` and `/en`. Expected: Full homepage with all 5 sections rendering correctly in both languages. Kill server.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: assemble homepage with Open Source stats, Why Us, and CTA sections"
```

---

## Task 17: Open Source page

**Files:**
- Create: `app/[locale]/open-source/page.tsx`, `components/site/open-source-project-list.tsx`
- Modify: `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n**

Add to `zh.json`:
```json
"openSource": {
  "heroTitle": "开源是海豚有海的根基",
  "heroLede": "我们的代码、产品路线、issue 跟踪全部公开。参与我们，从 star 一个仓库开始。",
  "projectsTitle": "核心开源项目",
  "communityTitle": "加入社区",
  "communityGithub": "GitHub Discussions 讨论最佳实践、提建议",
  "communityWeChat": "微信群（添加小助手邀请入群）",
  "contributeTitle": "参与贡献",
  "contributeDesc": "每个仓库都有 CONTRIBUTING.md，说明如何提 issue、开发、提 PR。"
}
```

Add to `en.json`:
```json
"openSource": {
  "heroTitle": "Open source is Hitosea's foundation",
  "heroLede": "Our code, product roadmap, and issue tracking are all public. Join us — start by starring a repo.",
  "projectsTitle": "Core open-source projects",
  "communityTitle": "Join the community",
  "communityGithub": "Discuss on GitHub Discussions, share best practices, propose ideas",
  "communityWeChat": "WeChat group (add our bot to request an invite)",
  "contributeTitle": "Contribute",
  "contributeDesc": "Each repo includes a CONTRIBUTING.md with issue, development, and PR instructions."
}
```

- [ ] **Step 2: Create project list component**

Create `components/site/open-source-project-list.tsx`:
```tsx
import { Github } from 'lucide-react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { products, type Product } from '@/content/products'
import { fetchAllProductStats } from '@/lib/github'
import { Badge } from '@/components/ui/badge'

export async function OpenSourceProjectList() {
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { perRepo } = await fetchAllProductStats(repos)
  const starsByRepo = new Map(perRepo.map((r) => [r.repo, r.stars]))

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <ProjectRow key={p.slug} product={p} stars={starsByRepo.get(p.githubRepo) ?? 0} />
      ))}
    </div>
  )
}

function ProjectRow({ product, stars }: { product: Product; stars: number }) {
  const locale = useLocale()
  const name = locale === 'zh' ? product.nameZh : product.name
  const tagline = locale === 'zh' ? product.taglineZh : product.tagline

  return (
    <a
      href={product.githubUrl}
      target="_blank"
      rel="noopener"
      className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/30 p-5 transition-colors hover:border-primary/50"
    >
      <div className="relative h-10 w-10 shrink-0">
        <Image src={product.logoUrl} alt={`${name} logo`} fill className="object-contain" sizes="40px" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        <p className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Github className="h-3.5 w-3.5" /> {product.githubRepo}
          </span>
          <span>★ {stars.toLocaleString()}</span>
        </p>
      </div>
    </a>
  )
}
```

- [ ] **Step 3: Create page**

Create `app/[locale]/open-source/page.tsx`:
```tsx
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { OpenSourceStats } from '@/components/site/open-source-stats'
import { OpenSourceProjectList } from '@/components/site/open-source-project-list'

export default function OpenSourcePage() {
  return (
    <main>
      <OpenSourceHero />
      <OpenSourceStats />
      <ProjectsSection />
      <CommunitySection />
    </main>
  )
}

function OpenSourceHero() {
  const t = useTranslations('openSource')
  return (
    <section className="container py-16 md:py-24">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{t('heroTitle')}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
    </section>
  )
}

function ProjectsSection() {
  const t = useTranslations('openSource')
  return (
    <section className="container py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{t('projectsTitle')}</h2>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
        <OpenSourceProjectList />
      </Suspense>
    </section>
  )
}

function CommunitySection() {
  const t = useTranslations('openSource')
  return (
    <section className="container border-t border-border/40 py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('communityTitle')}</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• {t('communityGithub')}</li>
            <li>• {t('communityWeChat')}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('contributeTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('contributeDesc')}</p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify**

```bash
pnpm dev
```

Visit `/zh/open-source` and `/en/open-source`. Expected: hero, stats strip, project list with all products, community section. Kill server.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add open-source page with project list and community sections"
```

---

## Task 18: About page

**Files:**
- Create: `content/company.ts`, `app/[locale]/about/page.tsx`, `components/site/product-timeline.tsx`
- Modify: `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n**

Add to `zh.json`:
```json
"about": {
  "heroTitle": "我们是海豚有海",
  "heroLede": "一群相信开源可以改变企业软件的工程师。",
  "missionTitle": "我们的使命",
  "missionBody": "用开源、模块化的产品帮助团队把精力花在真正创造价值的事情上 —— 不是搭建基础设施，而是构建更好的产品、服务更多客户。",
  "doTitle": "我们在做什么",
  "doBody": "我们构建三条相互支撑的产品线：企业协作（以 DooTask 为核心）、AI 与开发者工具（Happy Next、eeui、DooPush），以及面向行业的 AI 产品（MenuRay、球见、TTPOS）。每一款产品都开源，可私有化部署，为企业级场景准备。",
  "timelineTitle": "发展历程",
  "joinTitle": "加入我们",
  "joinBody": "如果你认同开源、热爱构建产品，我们想认识你。把简历发到：",
  "joinCta": "发送简历"
}
```

Add to `en.json`:
```json
"about": {
  "heroTitle": "We are Hitosea",
  "heroLede": "A group of engineers who believe open source can change enterprise software.",
  "missionTitle": "Our mission",
  "missionBody": "Use open-source, modular products to help teams spend their energy on what truly creates value — not building infrastructure, but shipping better products and serving more customers.",
  "doTitle": "What we're doing",
  "doBody": "We build three product lines that reinforce each other: enterprise collaboration (centered on DooTask), AI & developer tools (Happy Next, eeui, DooPush), and vertical AI products (MenuRay, Qiujian, TTPOS). Every product is open-source, self-hostable, and enterprise-ready.",
  "timelineTitle": "Timeline",
  "joinTitle": "Join us",
  "joinBody": "If you believe in open source and love shipping products, we'd like to meet you. Send your résumé to:",
  "joinCta": "Send résumé"
}
```

- [ ] **Step 2: Create timeline data**

Create `content/company.ts`:
```ts
export interface TimelineEvent {
  date: string
  titleZh: string
  title: string
  descZh?: string
  desc?: string
}

export const timeline: TimelineEvent[] = [
  {
    date: '2020',
    title: 'DooTask open-sourced',
    titleZh: 'DooTask 开源',
    desc: 'Our flagship team collaboration platform goes public on GitHub.',
    descZh: '旗舰协作平台 DooTask 在 GitHub 公开发布。',
  },
  {
    date: '2021',
    title: 'eeui cross-platform framework matures',
    titleZh: 'eeui 跨端框架成熟',
    desc: 'Vue-based native mobile framework reaches 500+ stars.',
    descZh: '基于 Vue 的原生移动框架达到 500+ stars。',
  },
  {
    date: '2023',
    title: 'DooTask crosses 5,000 GitHub stars',
    titleZh: 'DooTask 突破 5,000 GitHub stars',
    desc: 'Production deployments at large enterprises including China Unicom.',
    descZh: '生产环境落地中国联通等大型企业。',
  },
  {
    date: '2025',
    title: 'Happy Next launched',
    titleZh: 'Happy Next 发布',
    desc: 'Multi-model AI workspace for Claude Code and Codex.',
    descZh: '面向 Claude Code 和 Codex 的多模型 AI 工作空间。',
  },
  {
    date: '2026',
    title: 'Vertical AI product line begins',
    titleZh: '垂直 AI 产品线启动',
    desc: 'MenuRay (restaurant menus) and Qiujian (tennis companion) ship.',
    descZh: 'MenuRay（餐厅菜单）和球见（网球 AI 伙伴）相继发布。',
  },
]
```

- [ ] **Step 3: Create timeline component**

Create `components/site/product-timeline.tsx`:
```tsx
import { useLocale } from 'next-intl'
import { timeline } from '@/content/company'

export function ProductTimeline() {
  const locale = useLocale()
  return (
    <ol className="relative space-y-8 border-l border-border/60 pl-6">
      {timeline.map((event) => {
        const title = locale === 'zh' ? event.titleZh : event.title
        const desc = locale === 'zh' ? event.descZh : event.desc
        return (
          <li key={event.date} className="relative">
            <span className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {event.date}
            </p>
            <p className="mt-1 font-semibold">{title}</p>
            {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 4: Create about page**

Create `app/[locale]/about/page.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductTimeline } from '@/components/site/product-timeline'
import { SITE } from '@/lib/constants'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <main>
      <section className="container py-16 md:py-24">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
      </section>

      <section className="container grid gap-12 border-t border-border/40 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('missionTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('missionBody')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('doTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('doBody')}</p>
        </div>
      </section>

      <section className="container border-t border-border/40 py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{t('timelineTitle')}</h2>
        <ProductTimeline />
      </section>

      <section className="container border-t border-border/40 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('joinTitle')}</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t('joinBody')}</p>
        <Button asChild className="mt-6">
          <a href={`mailto:${SITE.careersEmail}`}>
            {t('joinCta')} <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>
    </main>
  )
}
```

- [ ] **Step 5: Verify**

```bash
pnpm dev
```

Visit `/zh/about` and `/en/about`. Expected: hero, mission/doing split, timeline, join-us section. Kill server.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add about page with mission, timeline, and careers callout"
```

---

## Task 19: Contact form UI

**Files:**
- Create: `components/site/contact-form.tsx`, `app/[locale]/contact/page.tsx`
- Modify: `i18n/messages/*.json`

- [ ] **Step 1: Extend i18n**

Add to `zh.json`:
```json
"contact": {
  "heroTitle": "预约演示 / 联系我们",
  "heroLede": "想了解私有化部署、定制开发、或商务合作？留下联系方式，我们会在一个工作日内回复。",
  "form": {
    "name": "姓名",
    "namePlaceholder": "你的姓名",
    "company": "公司",
    "companyPlaceholder": "公司名称",
    "email": "邮箱",
    "emailPlaceholder": "your@email.com",
    "phone": "电话（可选）",
    "phonePlaceholder": "+86 ...",
    "products": "感兴趣的产品",
    "productsPlaceholder": "可多选",
    "message": "需求说明",
    "messagePlaceholder": "团队规模、使用场景、希望何时部署等",
    "submit": "提交",
    "submitting": "提交中...",
    "success": "已收到，我们会尽快联系你！",
    "errorGeneric": "提交失败，请稍后重试或直接发邮件给我们。"
  },
  "otherTitle": "其他联系方式",
  "otherEmail": "商务邮箱",
  "otherWeChat": "微信",
  "otherWeChatDesc": "工作日 9:00-18:00",
  "otherAddress": "办公地点",
  "otherAddressValue": "广西"
}
```

Add to `en.json`:
```json
"contact": {
  "heroTitle": "Book a demo / Contact us",
  "heroLede": "Want to explore self-hosted deployment, custom development, or partnerships? Leave your info and we'll get back within one business day.",
  "form": {
    "name": "Name",
    "namePlaceholder": "Your name",
    "company": "Company",
    "companyPlaceholder": "Company name",
    "email": "Email",
    "emailPlaceholder": "your@email.com",
    "phone": "Phone (optional)",
    "phonePlaceholder": "+1 ...",
    "products": "Products of interest",
    "productsPlaceholder": "Select one or more",
    "message": "Your needs",
    "messagePlaceholder": "Team size, use cases, target deployment timeline, etc.",
    "submit": "Submit",
    "submitting": "Submitting…",
    "success": "Got it — we'll reach out soon!",
    "errorGeneric": "Submission failed. Please retry or email us directly."
  },
  "otherTitle": "Other ways to reach us",
  "otherEmail": "Business email",
  "otherWeChat": "WeChat",
  "otherWeChatDesc": "Weekdays 9:00–18:00",
  "otherAddress": "Office",
  "otherAddressValue": "Guangxi, China"
}
```

- [ ] **Step 2: Implement ContactForm**

Create `components/site/contact-form.tsx`:
```tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { contactSchema, type ContactSubmission } from '@/lib/contact-schema'
import { products } from '@/content/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const locale = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactSubmission>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      productSlugs: [],
      message: '',
    },
  })

  const selected = watch('productSlugs') ?? []

  const onSubmit = (data: ContactSubmission) => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('submit failed')
        setSubmitted(true)
        reset()
        toast.success(t('success'))
      } catch {
        toast.error(t('errorGeneric'))
      }
    })
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <p className="text-lg font-semibold">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="demo-form">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('name')} error={errors.name?.message}>
          <Input {...register('name')} placeholder={t('namePlaceholder')} />
        </Field>
        <Field label={t('company')} error={errors.company?.message}>
          <Input {...register('company')} placeholder={t('companyPlaceholder')} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('email')} error={errors.email?.message}>
          <Input type="email" {...register('email')} placeholder={t('emailPlaceholder')} />
        </Field>
        <Field label={t('phone')} error={errors.phone?.message}>
          <Input {...register('phone')} placeholder={t('phonePlaceholder')} />
        </Field>
      </div>

      <Field label={t('products')}>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {products
            .filter((p) => p.featured)
            .map((p) => {
              const checked = selected.includes(p.slug)
              return (
                <label key={p.slug} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(state) => {
                      const nextSelected = state
                        ? [...selected, p.slug]
                        : selected.filter((s) => s !== p.slug)
                      setValue('productSlugs', nextSelected, { shouldValidate: true })
                    }}
                  />
                  <span>{locale === 'zh' ? p.nameZh : p.name}</span>
                </label>
              )
            })}
        </div>
      </Field>

      <Field label={t('message')} error={errors.message?.message}>
        <Textarea rows={5} {...register('message')} placeholder={t('messagePlaceholder')} />
      </Field>

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Mount Sonner provider in layout**

Edit `app/[locale]/layout.tsx` to include `<Toaster />`:
```tsx
import { Toaster } from '@/components/ui/sonner'

// Inside body, after SiteFooter:
<Toaster position="top-center" richColors />
```

- [ ] **Step 4: Create contact page**

Create `app/[locale]/contact/page.tsx`:
```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ContactForm } from '@/components/site/contact-form'
import { SITE } from '@/lib/constants'

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <main>
      <section className="container py-16 md:py-24">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
      </section>

      <section className="container grid gap-12 border-t border-border/40 py-16 lg:grid-cols-[1.4fr,1fr]">
        <div>
          <ContactForm />
        </div>
        <aside className="space-y-6" id="wechat">
          <h2 className="text-xl font-semibold">{t('otherTitle')}</h2>

          <InfoBlock title={t('otherEmail')} value={SITE.email} href={`mailto:${SITE.email}`} />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t('otherWeChat')}</h3>
            <div className="mt-2 flex items-start gap-4">
              <div className="relative h-32 w-32 shrink-0">
                <Image
                  src="/brand/wechat-qr.svg"
                  alt="WeChat QR"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="pt-2 text-sm text-muted-foreground">{t('otherWeChatDesc')}</p>
            </div>
          </div>

          <InfoBlock title={t('otherAddress')} value={t('otherAddressValue')} />
        </aside>
      </section>
    </main>
  )
}

function InfoBlock({ title, value, href }: { title: string; value: string; href?: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {href ? (
        <a href={href} className="mt-1 block text-base text-primary hover:underline">
          {value}
        </a>
      ) : (
        <p className="mt-1 text-base">{value}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Verify form UI**

```bash
pnpm dev
```

Visit `/zh/contact`. Expected:
- Form renders with all fields
- Submitting empty form shows inline validation errors
- Product checkboxes visible

(Form won't submit successfully yet because the API route isn't built — that's Task 20.) Kill server.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add contact page with form UI and auxiliary contact info"
```

---

## Task 20: Contact form API route

**Files:**
- Create: `lib/mail.ts`, `app/api/contact/route.ts`
- Test: `tests/api/contact.test.ts`
- Modify: `.env.example`

- [ ] **Step 1: Create .env.example**

Create `.env.example`:
```
# Email (Resend)
RESEND_API_KEY=re_xxx
CONTACT_EMAIL_FROM=noreply@hitosea.com
CONTACT_EMAIL_TO=contact@hitosea.com

# Optional: Feishu / Lark webhook for sales notification
FEISHU_WEBHOOK_URL=

# Optional: bump GitHub API rate limit
GITHUB_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=https://hitosea.com
```

Also add to `.gitignore` if not present:
```
.env
.env.local
.env.production
```

- [ ] **Step 2: Create mail helper**

Create `lib/mail.ts`:
```ts
import { Resend } from 'resend'
import type { ContactSubmission } from './contact-schema'

export interface MailerConfig {
  resendApiKey: string
  from: string
  to: string
}

export async function sendContactEmail(
  submission: ContactSubmission,
  config: MailerConfig,
): Promise<{ ok: boolean; error?: string }> {
  if (!config.resendApiKey) {
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }
  const resend = new Resend(config.resendApiKey)
  const subject = `[官网线索] ${submission.company} – ${submission.name}`
  const html = renderEmail(submission)

  try {
    const { error } = await resend.emails.send({
      from: config.from,
      to: [config.to],
      subject,
      replyTo: submission.email,
      html,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return { ok: false, error: msg }
  }
}

function renderEmail(s: ContactSubmission): string {
  const fields = [
    ['Name / 姓名', s.name],
    ['Company / 公司', s.company],
    ['Email', s.email],
    ['Phone / 电话', s.phone || '-'],
    ['Products / 产品', s.productSlugs.length ? s.productSlugs.join(', ') : '-'],
    ['Message / 需求', s.message],
  ] as const

  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="margin:0 0 16px">新官网预约演示线索</h2>
    <table style="width:100%;border-collapse:collapse">
      ${fields
        .map(
          ([k, v]) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#666;vertical-align:top;width:160px">${escapeHtml(k)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v as string)}</td>
      </tr>`,
        )
        .join('')}
    </table>
  </body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendFeishuNotification(
  webhookUrl: string,
  submission: ContactSubmission,
): Promise<void> {
  if (!webhookUrl) return
  const text = `🚀 新官网线索\n公司: ${submission.company}\n联系人: ${submission.name}\n邮箱: ${submission.email}\n产品: ${submission.productSlugs.join(', ') || '-'}\n需求: ${submission.message.slice(0, 200)}`
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text } }),
    })
  } catch {
    // best-effort; don't block on Feishu failure
  }
}
```

- [ ] **Step 3: Write API route test**

Create `tests/api/contact.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 on invalid payload', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 when mailer reports ok', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test')
    vi.stubEnv('CONTACT_EMAIL_FROM', 'from@x.com')
    vi.stubEnv('CONTACT_EMAIL_TO', 'to@x.com')

    const mockSend = vi.fn().mockResolvedValue({ ok: true })
    vi.doMock('@/lib/mail', () => ({
      sendContactEmail: mockSend,
      sendFeishuNotification: vi.fn().mockResolvedValue(undefined),
    }))
    vi.resetModules()
    const { POST } = await import('@/app/api/contact/route')

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        company: 'Acme',
        email: 'a@acme.com',
        phone: '',
        productSlugs: [],
        message: 'We need DooTask for 100 people.',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('returns 500 when mailer reports failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test')
    vi.stubEnv('CONTACT_EMAIL_FROM', 'from@x.com')
    vi.stubEnv('CONTACT_EMAIL_TO', 'to@x.com')

    vi.doMock('@/lib/mail', () => ({
      sendContactEmail: vi.fn().mockResolvedValue({ ok: false, error: 'upstream error' }),
      sendFeishuNotification: vi.fn().mockResolvedValue(undefined),
    }))
    vi.resetModules()
    const { POST } = await import('@/app/api/contact/route')

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        company: 'Acme',
        email: 'a@acme.com',
        phone: '',
        productSlugs: [],
        message: 'A long enough message to pass validation.',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
pnpm test tests/api/contact.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 5: Implement route**

Create `app/api/contact/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'
import { sendContactEmail, sendFeishuNotification } from '@/lib/mail'

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid payload', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const mailResult = await sendContactEmail(parsed.data, {
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.CONTACT_EMAIL_FROM ?? 'noreply@hitosea.com',
    to: process.env.CONTACT_EMAIL_TO ?? 'contact@hitosea.com',
  })

  if (!mailResult.ok) {
    return NextResponse.json({ ok: false, error: 'mailer failed' }, { status: 500 })
  }

  // Fire and forget
  void sendFeishuNotification(process.env.FEISHU_WEBHOOK_URL ?? '', parsed.data)

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
pnpm test tests/api/contact.test.ts
```

Expected: all 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add /api/contact with Resend + Zod validation and Feishu notification"
```

---

## Task 21: SEO — metadata, sitemap, robots, OG image fallback

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `public/og/default.svg`
- Modify: `app/[locale]/layout.tsx`, each page's metadata

- [ ] **Step 1: Robots**

Create `app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
```

- [ ] **Step 2: Sitemap**

Create `app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { routing } from '@/i18n/routing'

const PATHS = ['', '/open-source', '/about', '/contact'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    for (const p of PATHS) {
      entries.push({
        url: `${SITE.url}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: p === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE.url}/${l}${p}`]),
          ),
        },
      })
    }
  }
  return entries
}
```

- [ ] **Step 3: Default OG image**

Create `public/og/default.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#020617"/>
  <text x="80" y="280" font-family="system-ui" font-size="72" font-weight="700" fill="#f8fafc">Hitosea</text>
  <text x="80" y="360" font-family="system-ui" font-size="36" fill="#94a3b8">Developer-first open-source product company</text>
  <text x="80" y="410" font-family="system-ui" font-size="32" fill="#0ea5e9">hitosea.com</text>
</svg>
```

- [ ] **Step 4: Per-page metadata**

Edit `app/[locale]/layout.tsx` — replace the static `metadata` export with `generateMetadata`:
```tsx
import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: isZh
        ? `${SITE.nameZh} | Developer-first 的开源产品公司`
        : `${SITE.name} | Developer-first open-source product company`,
      template: `%s · ${SITE.nameZh}`,
    },
    description: isZh
      ? '海豚有海构建团队协作、AI、开发者工具与行业 SaaS 的开源产品矩阵。'
      : 'Hitosea builds open-source products for team collaboration, AI, developer tools, and vertical SaaS.',
    openGraph: {
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      url: `${SITE.url}/${locale}`,
      siteName: SITE.nameZh,
      images: [{ url: '/og/default.svg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og/default.svg'],
    },
    alternates: {
      canonical: `${SITE.url}/${locale}`,
      languages: {
        zh: `${SITE.url}/zh`,
        en: `${SITE.url}/en`,
      },
    },
  }
}
```

- [ ] **Step 5: Page-specific metadata**

Add `export const metadata` near the top of each page file. For `/about`:
```tsx
export const metadata = { title: 'About' }
```

Do the same for `/open-source` (`title: 'Open Source'`) and `/contact` (`title: 'Contact'`).

- [ ] **Step 6: Verify**

```bash
pnpm dev
```

Check:
- `http://localhost:3000/sitemap.xml` → renders XML with 8 entries
- `http://localhost:3000/robots.txt` → valid robots
- `http://localhost:3000/zh/about` → `<title>` contains "About · 海豚有海"

Kill server.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add SEO metadata, sitemap, robots, and default OG image"
```

---

## Task 22: Polish pass — responsive, accessibility, performance

**Files:** various.

- [ ] **Step 1: Responsive review**

Start dev server:
```bash
pnpm dev
```

Open `/zh` and in DevTools toggle device toolbar. Test at widths: 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop). For each page (`/zh`, `/zh/open-source`, `/zh/about`, `/zh/contact`):
- No horizontal scroll
- Text is readable (not too small, not wrapping oddly)
- Buttons reach 44×44px minimum tap target on mobile
- Nav collapses appropriately on mobile

Fix any issues found. Common fixes: add `flex-wrap`, reduce heading sizes on mobile, stack grid to single column.

- [ ] **Step 2: Mobile nav menu (hamburger)**

The current `SiteHeader` hides nav items on mobile (`hidden md:flex`). Add a mobile hamburger using shadcn's `Sheet`. Edit `components/site/site-header.tsx` — add to the imports:
```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
```

Add a mobile menu trigger before the desktop nav (inside the right-side controls, visible only on mobile):
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-72">
    <nav className="mt-8 flex flex-col gap-4 text-lg">
      <IntlLink href="/#products">{t('products')}</IntlLink>
      <IntlLink href="/open-source">{t('openSource')}</IntlLink>
      <IntlLink href="/about">{t('about')}</IntlLink>
      <IntlLink href="/contact">{tc('bookDemo')}</IntlLink>
    </nav>
  </SheetContent>
</Sheet>
```

Verify on mobile viewport.

- [ ] **Step 3: Accessibility checks**

With dev tools open, run Lighthouse → Accessibility on `/zh`. Expected score ≥ 95. Fix any:
- Missing `alt` on images → provide descriptive alts
- Button without `aria-label` → add labels for icon-only buttons
- Low contrast text → adjust `text-muted-foreground` usage or color variables

- [ ] **Step 4: Lighthouse performance**

In Lighthouse, run Performance on `/zh` (mobile preset). Target ≥ 90. Common wins:
- Next.js already does most perf optimizations automatically
- Ensure no `<img>` tags are used (all should be `next/image`)
- Remove any unused `framer-motion` imports
- Confirm `display: 'swap'` on fonts (already done in Task 6)

- [ ] **Step 5: Build check**

```bash
pnpm build
```

Expected: successful production build, no TypeScript errors, all pages SSG'd (green "○" next to each route in build output).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "polish: responsive fixes, mobile hamburger menu, a11y and perf pass"
```

---

## Task 23: README, deployment prep, final verification

**Files:**
- Create: `README.md`
- Modify: `.env.example` (if needed)

- [ ] **Step 1: Write README.md**

Create `README.md`:
```markdown
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
```

- [ ] **Step 2: Final test pass**

```bash
pnpm test
```

Expected: all tests green.

- [ ] **Step 3: Final build**

```bash
pnpm build
```

Expected: successful build with no warnings or errors.

- [ ] **Step 4: Smoke-test prod build locally**

```bash
pnpm start
```

Visit:
- `http://localhost:3000` → redirects to `/zh`
- `/zh` → homepage, all sections render
- `/en` → English version
- `/zh/open-source` → project list
- `/zh/about` → mission, timeline
- `/zh/contact` → form + WeChat block
- Submit form with invalid data → inline errors
- Submit form with valid data (without real RESEND_API_KEY) → "submission failed" toast (expected)

Kill server.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "docs: add README with dev, deployment, and content-editing instructions"
```

- [ ] **Step 6: Final summary**

Print the status:
```bash
git log --oneline
```

Expected: ~23 commits. All MVP tasks complete. Ready for Vercel deploy or handoff.

---

## Post-MVP Backlog (not covered by this plan)

These are explicitly out of scope for the MVP but listed here for future reference:

- Blog / Press section (MDX-based)
- Customer case study details page (requires user-provided content + authorization)
- Full Careers page with open-positions listing
- Team member profile cards on About page
- Light-mode polish (currently prioritized dark)
- International CDN setup and Chinese CDN integration
- ICP filing coordination
- Analytics (Vercel Analytics / Umami self-host)
- A/B testing infrastructure
- Extended i18n (Japanese, Vietnamese, etc.)

---

## Known Placeholders in This MVP

The following are seeded with placeholder content and should be replaced before or shortly after launch:

- `public/brand/wechat-qr.svg` — placeholder WeChat QR
- `public/logos/products/*.svg` — monogram placeholders; replace with real product logos
- `lib/constants.ts` — empty `phone`, `icp` fields
- Hero title — currently static; user may want to pick from 3-5 candidate one-liners (see spec §6.2)
- OG image — simple SVG; could be upgraded to a designed image
- Brand primary color `--primary` HSL — currently sky-500 (#0EA5E9); change in `app/globals.css` when user provides actual brand hex
