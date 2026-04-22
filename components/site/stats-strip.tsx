import { getTranslations } from 'next-intl/server'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function StatsStrip() {
  const t = await getTranslations('stats')
  const repos = Array.from(new Set(products.filter((p) => p.githubRepo).map((p) => p.githubRepo!)))
  const { aggregate } = await fetchAllProductStats(repos)

  const items = [
    { label: t('stars'), value: formatCount(aggregate.totalStars) },
    { label: t('repos'), value: `${aggregate.totalRepos}` },
  ]

  return (
    <div className="mt-14 flex flex-wrap gap-10 text-sm md:gap-16">
      {items.map((item) => (
        <div key={item.label} className="relative">
          <div className="font-mono text-3xl font-bold text-gradient md:text-4xl">{item.value}</div>
          <div className="mt-1.5 text-xs uppercase tracking-widest text-muted-foreground">
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
