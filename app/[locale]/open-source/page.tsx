import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { OpenSourceStats } from '@/components/site/open-source-stats'
import { OpenSourceProjectList } from '@/components/site/open-source-project-list'

export default function OpenSourcePage() {
  return (
    <main>
      <OpenSourceHero />
      <OpenSourceStats />
      <ProjectsSection />
      <CommunitySection />
    </main>
  )
}

function OpenSourceHero() {
  const t = useTranslations('openSource')
  return (
    <section className="container py-16 md:py-24">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{t('heroTitle')}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
    </section>
  )
}

function ProjectsSection() {
  const t = useTranslations('openSource')
  return (
    <section className="container py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{t('projectsTitle')}</h2>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
        <OpenSourceProjectList />
      </Suspense>
    </section>
  )
}

function CommunitySection() {
  const t = useTranslations('openSource')
  return (
    <section className="container border-t border-border/40 py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('communityTitle')}</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• {t('communityGithub')}</li>
            <li>• {t('communityWeChat')}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t('contributeTitle')}</h2>
          <p className="mt-4 text-muted-foreground">{t('contributeDesc')}</p>
        </div>
      </div>
    </section>
  )
}
