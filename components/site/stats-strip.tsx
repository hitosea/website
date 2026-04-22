import { useTranslations } from 'next-intl'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function StatsStrip() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- next-intl supports useTranslations in server components
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
