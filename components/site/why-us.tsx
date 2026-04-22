import { useTranslations } from 'next-intl'
import { GitBranch, Server, LayoutGrid, Code2 } from 'lucide-react'

const ITEMS = [
  { key: 'openSource', Icon: GitBranch, color: 'from-sky-500 to-blue-600' },
  { key: 'enterprise', Icon: Server, color: 'from-violet-500 to-purple-600' },
  { key: 'matrix', Icon: LayoutGrid, color: 'from-emerald-500 to-teal-600' },
  { key: 'devFriendly', Icon: Code2, color: 'from-orange-500 to-amber-600' },
] as const

export function WhyUs() {
  const t = useTranslations('home.whyUs')
  const tItem = useTranslations('home.whyUs.items')

  return (
    <section className="container py-20 md:py-32">
      <div className="mb-14 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          {t('title')}
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ key, Icon, color }) => (
          <div
            key={key}
            className="group relative rounded-2xl glass border border-border/40 p-7 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1"
          >
            <div className="relative mb-5">
              <div aria-hidden className={`absolute -inset-2 rounded-full bg-gradient-to-br ${color} opacity-20 blur-xl transition-opacity group-hover:opacity-40`} />
              <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">
              {tItem(`${key}.title` as `${typeof key}.title`)}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {tItem(`${key}.desc` as `${typeof key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
