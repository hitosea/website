import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { getProductsByTheme, type ProductTheme, type Product } from '@/content/products'
import { fetchAllProductStats } from '@/lib/github'

const THEME_ORDER: ProductTheme[] = ['collaboration', 'ai-dev', 'vertical-ai']
const ACCENT_MAP: Record<ProductTheme, { css: string; soft: string }> = {
  collaboration: { css: 'var(--ember)', soft: 'rgba(229,106,63,0.08)' },
  'ai-dev': { css: 'var(--plum)', soft: 'rgba(107,78,113,0.12)' },
  'vertical-ai': { css: 'var(--teal)', soft: 'rgba(122,185,168,0.12)' },
}

export async function ProductMatrix() {
  const groups = getProductsByTheme()
  const allRepos = THEME_ORDER.flatMap((theme) =>
    groups[theme].filter((p) => p.featured && p.githubRepo).map((p) => p.githubRepo!),
  )
  const { perRepo } = await fetchAllProductStats(allRepos)
  const starsByRepo = new Map(perRepo.map((r) => [r.repo, r.stars]))

  return (
    <section id="products" className="relative py-24 md:py-32">
      <div className="container">
        <ProductMatrixHeading />

        {/* 3-column editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule">
          {THEME_ORDER.map((theme) => {
            const items = groups[theme].filter((p) => p.featured)
            if (items.length === 0) return null
            return (
              <ProductGroup
                key={theme}
                theme={theme}
                items={items}
                starsByRepo={starsByRepo}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProductMatrixHeading() {
  const t = useTranslations('home')
  return (
    <div className="mb-14">
      {/* Section rule */}
      <div className="border-t border-rule pt-7 mb-16 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div className="section-label">{t('matrixSectionId')}</div>
        <div className="font-mono text-[11px] tracking-widest text-mute">{t('matrixMeta')}</div>
      </div>
      <h2
        className="font-serif font-normal text-3xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-7 max-w-[1100px] text-balance"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
      >
        {t('matrixTitle')}
      </h2>
      <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-[680px]">
        {t('matrixSubtitle')}
      </p>
    </div>
  )
}

function ProductGroup({
  theme,
  items,
  starsByRepo,
}: {
  theme: ProductTheme
  items: Product[]
  starsByRepo: Map<string, number>
}) {
  const t = useTranslations('home.groups')
  const locale = useLocale()
  const accent = ACCENT_MAP[theme]

  // Global index across all groups for numbering
  const baseIndex = theme === 'collaboration' ? 0 : theme === 'ai-dev' ? 3 : 6

  return (
    <div
      className="border-r border-b border-rule p-6 md:p-8 relative transition-colors hover:bg-[rgba(243,238,228,0.02)]"
      style={{ '--group-accent': accent.css, '--group-accent-soft': accent.soft } as React.CSSProperties}
    >
      {/* Group number with color chip */}
      <div className="font-mono text-[11px] tracking-[0.14em] text-mute mb-4">
        <span
          className="inline-block w-2 h-2 mr-2 align-middle"
          style={{ background: accent.css }}
        />
        {t(`${theme}.num` as `collaboration.num`)}
      </div>

      {/* Group title */}
      <h3
        className="font-serif font-normal text-xl md:text-2xl leading-snug tracking-tight mb-5 min-h-[2.4em]"
        style={{ fontVariationSettings: '"opsz" 120, "SOFT" 40' }}
      >
        {renderAccentTitle(t(`${theme}.title` as `collaboration.title`), t(`${theme}.titleAccent` as `collaboration.titleAccent`), accent.css)}
      </h3>

      {/* Group subtitle */}
      <p className="text-sm leading-relaxed text-foreground/70 mb-7 max-w-[300px]">
        {t(`${theme}.sub` as `collaboration.sub`)}
      </p>

      {/* Product list */}
      <div className="flex flex-col border-t border-rule">
        {items.map((p, j) => {
          const name = locale === 'zh' ? p.nameZh : p.name
          const tagline = locale === 'zh' ? p.taglineZh : p.tagline
          const stars = p.githubRepo ? starsByRepo.get(p.githubRepo) : undefined
          const tag = stars && stars > 0
            ? (stars >= 1000 ? `★ ${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k` : `★ ${stars}`)
            : p.tags[0]?.toLowerCase() ?? ''
          const href = p.websiteUrl ?? p.repoUrl
          const num = String(baseIndex + j + 1).padStart(2, '0')

          return (
            <a
              key={p.slug}
              href={href}
              target="_blank"
              rel="noopener"
              className="grid grid-cols-[40px_1fr_auto] items-center gap-3.5 py-4 border-b border-rule no-underline text-inherit transition-all hover:pl-2"
              style={{
                background: 'transparent',
              }}
              onMouseEnter={undefined}
            >
              <span className="font-mono text-[11px] tracking-widest text-mute">{num}</span>
              <div>
                <div
                  className="font-serif text-lg md:text-xl leading-tight font-medium"
                  style={{ fontVariationSettings: '"opsz" 72' }}
                >
                  {name}
                </div>
                <div className="text-xs text-mute mt-0.5 max-w-[260px] leading-snug line-clamp-2">
                  {tagline}
                </div>
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-mute flex items-center gap-1">
                {tag} <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function renderAccentTitle(full: string, accent: string, color: string) {
  if (!accent) return full
  const idx = full.indexOf(accent)
  if (idx === -1) return full
  const before = full.slice(0, idx)
  const after = full.slice(idx + accent.length)
  return (
    <>
      {before}
      <em className="not-italic" style={{ color, fontVariationSettings: '"opsz" 120, "SOFT" 80' }}>
        {accent}
      </em>
      {after}
    </>
  )
}
