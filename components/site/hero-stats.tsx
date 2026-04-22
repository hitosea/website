import { getTranslations } from 'next-intl/server'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function HeroStats() {
  const t = await getTranslations('stats')
  const repos = Array.from(new Set(products.filter((p) => p.githubRepo).map((p) => p.githubRepo!)))
  const { aggregate } = await fetchAllProductStats(repos)

  const items = [
    { ordinal: 'i', label: t('stars'), value: formatK(aggregate.totalStars), suffix: '+' },
    { ordinal: 'ii', label: t('repos'), value: `${Math.max(aggregate.totalRepos, 10)}`, suffix: '+' },
    { ordinal: 'iii', label: t('contributors'), value: '420', suffix: '+' },
    { ordinal: 'iv', label: t('dockerPulls'), value: '12M', suffix: '' },
  ]

  return (
    <div className="mt-16 md:mt-20 border-t border-b border-rule grid grid-cols-2 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.ordinal}
          className="px-4 md:px-7 py-7 md:py-9 border-r border-rule last:border-r-0 relative"
        >
          <div className="flex justify-between items-center mb-3 font-mono text-[11px] tracking-widest uppercase text-mute">
            <span>{item.label}</span>
            <span className="text-ember">{'§'} {item.ordinal}</span>
          </div>
          <div
            className="font-serif text-4xl md:text-5xl lg:text-7xl leading-none tracking-tight font-normal"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            {item.value}
            {item.suffix && (
              <em
                className="not-italic text-ember"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
              >
                {item.suffix}
              </em>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${n}`
}
