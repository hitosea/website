import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ContactForm } from '@/components/site/contact-form'
import { SITE } from '@/lib/constants'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <main>
      <section className="container py-16 md:py-24">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('heroLede')}</p>
      </section>

      <section className="container grid gap-12 border-t border-border/40 py-16 lg:grid-cols-[1.4fr,1fr]">
        <div>
          <ContactForm />
        </div>
        <aside className="space-y-6" id="wechat">
          <h2 className="text-xl font-semibold">{t('otherTitle')}</h2>

          <InfoBlock title={t('otherEmail')} value={SITE.email} href={`mailto:${SITE.email}`} />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t('otherWeChat')}</h3>
            <div className="mt-2 flex items-start gap-4">
              <div className="relative h-32 w-32 shrink-0">
                <Image
                  src="/brand/wechat-qr.svg"
                  alt="WeChat QR"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="pt-2 text-sm text-muted-foreground">{t('otherWeChatDesc')}</p>
            </div>
          </div>

          <InfoBlock title={t('otherAddress')} value={t('otherAddressValue')} />
        </aside>
      </section>
    </main>
  )
}

function InfoBlock({ title, value, href }: { title: string; value: string; href?: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {href ? (
        <a href={href} className="mt-1 block text-base text-primary hover:underline">
          {value}
        </a>
      ) : (
        <p className="mt-1 text-base">{value}</p>
      )}
    </div>
  )
}
