import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { getFeaturedProducts } from '@/content/products'
import { fetchAllProductStats } from '@/lib/github'

export async function HeroIndexCard() {
  const t = await getTranslations('home.hero')
  const locale = await getLocale()
  const featured = getFeaturedProducts()
  const repos = featured.filter((p) => p.githubRepo).map((p) => p.githubRepo!)
  const { perRepo } = await fetchAllProductStats(repos)
  const starsByRepo = new Map(perRepo.map((r) => [r.repo, r.stars]))

  const rows = featured.map((p, i) => {
    const stars = p.githubRepo ? starsByRepo.get(p.githubRepo) : undefined
    let badge = ''
    if (stars && stars > 0) {
      badge = stars >= 1000 ? `★ ${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k` : `★ ${stars}`
    } else {
      badge = p.tags[0] ?? ''
    }
    return {
      n: String(i + 1).padStart(2, '0'),
      name: locale === 'zh' ? p.nameZh : p.name,
      page: `p. ${String((i + 1) * 8 + 4).padStart(3, '0')}`,
      badge,
    }
  })

  return (
    <div className="border border-rule bg-[rgba(243,238,228,0.02)] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule bg-[rgba(229,106,63,0.08)] text-[11px] tracking-widest uppercase text-ember">
        <span>{'◉'} {t('indexTitle')}</span>
        <span>{t('indexVersion')}</span>
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.n}
          className={`grid grid-cols-[28px_1fr_auto] items-center gap-3.5 px-4 py-3 text-[12.5px] ${
            i < rows.length - 1 ? 'border-b border-dashed border-rule' : ''
          }`}
        >
          <span className="text-mute">{row.n}</span>
          <span>
            <span className="font-sans font-semibold text-foreground">{row.name}</span>
            <span className="text-mute ml-2 font-mono text-[11px]">· {row.page}</span>
          </span>
          <span className="text-ochre">{row.badge}</span>
        </div>
      ))}
    </div>
  )
}
