import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link as IntlLink } from '@/i18n/routing'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export async function OpenSourceStats() {
  const t = await getTranslations('home.opensource')
  const repos = Array.from(new Set(products.filter((p) => p.githubRepo).map((p) => p.githubRepo!)))
  const { aggregate } = await fetchAllProductStats(repos)

  return (
    <section className="container py-20 md:py-32">
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
    <div className="glass rounded-2xl border border-border/40 p-7">
      <div className="font-mono text-4xl font-bold text-gradient md:text-5xl">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k+`
  return `${n}`
}
