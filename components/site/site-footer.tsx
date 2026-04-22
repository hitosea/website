import Image from 'next/image'
import { Link as IntlLink } from '@/i18n/routing'
import { getTranslations, getLocale } from 'next-intl/server'
import { products } from '@/content/products'
import { SITE } from '@/lib/constants'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  const locale = await getLocale()
  const year = new Date().getFullYear()
  const productLinks = products.filter((p) => p.featured)

  return (
    <footer className="border-t-[3px] border-double border-rule py-16 md:py-20 bg-background">
      <div className="container">
        {/* Masthead header */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-rule pb-6 mb-10 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo-white.png"
              alt="Hitosea"
              width={140}
              height={40}
              className="hidden h-10 w-auto dark:block"
            />
            <Image
              src="/brand/logo-black.png"
              alt="Hitosea"
              width={140}
              height={40}
              className="block h-10 w-auto dark:hidden"
            />
          </div>
          <div className="font-mono text-[11px] text-mute tracking-widest leading-relaxed md:text-right">
            <strong className="text-foreground font-medium">{t('colophonTitle')}</strong>
            <br />
            {t('colophonLine1')}
            <br />
            {t('colophonLine2')}
          </div>
        </div>

        {/* 4-column link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <FooterCol title={t('products')}>
            {productLinks.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.websiteUrl ?? p.repoUrl}
                  className="footer-link"
                  target="_blank"
                  rel="noopener"
                >
                  {locale === 'zh' ? p.nameZh : p.name}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={t('company')}>
            <li><IntlLink href="/about" className="footer-link">{t('about')}</IntlLink></li>
            <li><a href={`mailto:${SITE.careersEmail}`} className="footer-link">{t('joinUs')}</a></li>
            <li><IntlLink href="/contact" className="footer-link">{t('contact')}</IntlLink></li>
          </FooterCol>

          <FooterCol title={t('openSourceCol')}>
            <li><a href="https://github.com/hitosea" target="_blank" rel="noopener" className="footer-link">{t('github')}</a></li>
            <li><IntlLink href="/open-source" className="footer-link">{t('contribute')}</IntlLink></li>
          </FooterCol>

          <FooterCol title={t('contactCol')}>
            <li><a href={`tel:${SITE.phone}`} className="footer-link">{t('phone')}: {SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="footer-link">{SITE.email}</a></li>
          </FooterCol>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-5 border-t border-rule flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[11px] text-mute">
          <div>© {year} {SITE.legalName}. {t('rights')}.</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener" className="hover:text-foreground">{SITE.icp}</a>
            {'gonganIcp' in SITE && SITE.gonganIcp && (
              <a href="https://www.beian.gov.cn" target="_blank" rel="noopener" className="hover:text-foreground">{SITE.gonganIcp}</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-ember mb-4 pb-3 border-b border-rule">
        {title}
      </h5>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  )
}
