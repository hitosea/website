import { useTranslations } from 'next-intl'
import { getProductsByTheme, type ProductTheme } from '@/content/products'
import { ProductCard } from './product-card'
import { fetchAllProductStats } from '@/lib/github'

const THEME_ORDER: ProductTheme[] = ['collaboration', 'ai-dev', 'vertical-ai']

export async function ProductMatrix() {
  const groups = getProductsByTheme()
  const allRepos = THEME_ORDER.flatMap((theme) =>
    groups[theme].filter((p) => p.featured && p.githubRepo).map((p) => p.githubRepo!),
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
          <ProductCard key={p.slug} product={p} stars={p.githubRepo ? starsByRepo.get(p.githubRepo) : undefined} />
        ))}
      </div>
    </div>
  )
}
