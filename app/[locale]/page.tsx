import { Hero } from '@/components/site/hero'
import { ProductMatrix } from '@/components/site/product-matrix'
import { OpenSourceStats } from '@/components/site/open-source-stats'
import { WhyUs } from '@/components/site/why-us'
import { CTASection } from '@/components/site/cta-section'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductMatrix />
      <OpenSourceStats />
      <WhyUs />
      <CTASection />
    </main>
  )
}
