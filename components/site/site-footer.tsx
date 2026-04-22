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
    <footer className="mt-24 border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">{SITE.nameZh}</p>
            <p className="mt-1 text-sm text-muted-foreground">{SITE.name}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('products')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.websiteUrl ?? p.githubUrl}
                    className="hover:text-foreground"
                    target="_blank"
                    rel="noopener"
                  >
                    {locale === 'zh' ? p.nameZh : p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <IntlLink href="/about" className="hover:text-foreground">
                  {t('about')}
                </IntlLink>
              </li>
              <li>
                <a href={`mailto:${SITE.careersEmail}`} className="hover:text-foreground">
                  {t('joinUs')}
                </a>
              </li>
              <li>
                <IntlLink href="/contact" className="hover:text-foreground">
                  {t('contact')}
                </IntlLink>
              </li>
              <li>
                <a
                  href="https://github.com/hitosea"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-foreground"
                >
                  {t('github')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('contactCol')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {year} {SITE.legalName}. {t('rights')}.
          </p>
          <p>
            {SITE.icp ? (
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noopener"
                className="hover:text-foreground"
              >
                {SITE.icp}
              </a>
            ) : (
              <span>ICP 备案号 待更新</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
