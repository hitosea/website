import { getTranslations, getLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link as IntlLink } from '@/i18n/routing'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'
import { getStampLabel } from '@/lib/editorial-date'

export async function OpenSourceStats() {
  const t = await getTranslations('home.opensource')
  const locale = await getLocale()
  const repos = Array.from(new Set(products.filter((p) => p.githubRepo).map((p) => p.githubRepo!)))
  const { aggregate } = await fetchAllProductStats(repos)

  const starsDisplay = aggregate.totalStars >= 1000
    ? `${(aggregate.totalStars / 1000).toFixed(1).replace(/\.0$/, '')}`
    : `${aggregate.totalStars}`

  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        {/* Section rule */}
        <div className="border-t border-rule pt-7 mb-16 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div className="section-label">{t('sectionId')}</div>
          <div className="font-mono text-[11px] tracking-widest text-mute">{t('sectionMeta')}</div>
        </div>

        {/* Split layout: stamp left, copy right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-20 border-t border-rule pt-12">
          {/* Stamp */}
          <div className="relative">
            <div
              className="relative border-2 border-[var(--ember)] p-8 md:p-12 bg-[rgba(229,106,63,0.05)]"
              style={{ transform: 'rotate(-1.2deg)' }}
            >
              {/* Dashed border outer */}
              <div
                className="absolute pointer-events-none border border-dashed border-[var(--ember)]"
                style={{ inset: '-10px' }}
                aria-hidden
              />

              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-ember mb-4">
                {'☉'} {getStampLabel(locale)}
              </div>
              <div
                className="font-serif text-7xl md:text-9xl lg:text-[180px] leading-[0.85] tracking-tighter font-normal italic text-foreground"
                style={{ fontVariationSettings: '"opsz" 144' }}
              >
                {starsDisplay}.<em className="not-italic text-ember" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                  {aggregate.totalStars >= 1000 ? 'k' : ''}
                </em>+
              </div>
              <div className="font-mono text-xs text-mute mt-4 border-t border-rule pt-3.5">
                {'★★★★★'} {t('stampDetail', { repos: aggregate.totalRepos, contributors: '420' })}
              </div>
            </div>

            {/* Badge floating element */}
            <div
              className="absolute -bottom-5 -right-5 border border-[var(--ochre)] px-4 py-3.5 bg-background font-mono text-[11px] tracking-widest uppercase text-ochre"
              style={{ transform: 'rotate(3deg)' }}
            >
              <span>{t('stampBadgeTop')}</span>
              <strong
                className="block text-foreground font-serif text-2xl font-medium tracking-tight not-italic"
              >
                {t('stampBadgeBottom')}
              </strong>
            </div>
          </div>

          {/* Copy / manifesto */}
          <div className="pt-6">
            <div className="section-label">{t('manifestoLabel')}</div>
            <h3
              className="font-serif font-normal text-2xl md:text-4xl tracking-tight mt-5 mb-5"
              style={{ fontVariationSettings: '"opsz" 120, "SOFT" 50', lineHeight: 1.4 }}
            >
              {renderManifestoTitle(t('manifestoTitle'), t('manifestoTitleAccent'))}
            </h3>
            <p className="text-base leading-relaxed text-foreground/80 mb-7">
              {t('manifestoP1')}
            </p>
            <p className="text-base leading-relaxed text-foreground/80 mb-7">
              {t('manifestoP2')}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/hitosea"
                target="_blank"
                rel="noopener"
                className="btn-editorial btn-editorial-primary inline-flex items-center gap-2.5"
              >
                <GithubIcon />
                {t('starOnGithub')}
              </a>
              <IntlLink
                href="/open-source"
                className="btn-editorial btn-editorial-ghost inline-flex items-center gap-2.5"
              >
                {t('readChangelog')}
                <ArrowRight className="h-3.5 w-3.5" />
              </IntlLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function renderManifestoTitle(full: string, accent: string) {
  if (!accent) return full
  const idx = full.indexOf(accent)
  if (idx === -1) return full
  const before = full.slice(0, idx)
  const after = full.slice(idx + accent.length)
  return (
    <>
      {before}
      <em className="italic text-ember" style={{ fontVariationSettings: '"opsz" 120, "SOFT" 80' }}>
        {accent}
      </em>
      {after}
    </>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.38 2.88-.39.98.01 1.96.13 2.88.39 2.2-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.11 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.79.56A11.52 11.52 0 0023.5 12.02C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  )
}
