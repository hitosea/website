import { useTranslations } from 'next-intl'
import { GitBranch, Server, LayoutGrid, Code2 } from 'lucide-react'

const ITEMS = [
  { key: 'openSource', Icon: GitBranch },
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
