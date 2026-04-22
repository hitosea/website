import { useLocale } from 'next-intl'
import { timeline } from '@/content/company'

export function ProductTimeline() {
  const locale = useLocale()
  return (
    <ol className="relative space-y-8 border-l border-border/60 pl-6">
      {timeline.map((event) => {
        const title = locale === 'zh' ? event.titleZh : event.title
        const desc = locale === 'zh' ? event.descZh : event.desc
        return (
          <li key={event.date} className="relative">
            <span className="absolute -left-[1.95rem] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {event.date}
            </p>
            <p className="mt-1 font-semibold">{title}</p>
            {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
          </li>
        )
      })}
    </ol>
  )
}
