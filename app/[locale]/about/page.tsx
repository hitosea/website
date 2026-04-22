import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductTimeline } from '@/components/site/product-timeline'
import { SITE } from '@/lib/constants'

export const metadata = { title: 'About' }

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <main>
      <section className="container py-16 md:py-24">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
      </section>

      <section className="container grid gap-12 border-t border-border/40 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('missionTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('missionBody')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('doTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('doBody')}</p>
        </div>
      </section>

      <section className="container border-t border-border/40 py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{t('timelineTitle')}</h2>
        <ProductTimeline />
      </section>

      <section className="container border-t border-border/40 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('joinTitle')}</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t('joinBody')}</p>
        <Button asChild className="mt-6">
          <a href={`mailto:${SITE.careersEmail}`}>
            {t('joinCta')} <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>
    </main>
  )
}
