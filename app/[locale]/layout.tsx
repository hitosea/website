import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { SITE } from '@/lib/constants'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: isZh
        ? `${SITE.nameZh} | Developer-first 的开源产品公司`
        : `${SITE.name} | Developer-first open-source product company`,
      template: `%s · ${SITE.nameZh}`,
    },
    description: isZh
      ? '海豚有海构建团队协作、AI、开发者工具与行业 SaaS 的开源产品矩阵。'
      : 'Hitosea builds open-source products for team collaboration, AI, developer tools, and vertical SaaS.',
    openGraph: {
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      url: `${SITE.url}/${locale}`,
      siteName: SITE.nameZh,
      images: [{ url: '/og/default.svg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og/default.svg'],
    },
    alternates: {
      canonical: `${SITE.url}/${locale}`,
      languages: {
        zh: `${SITE.url}/zh`,
        en: `${SITE.url}/en`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'zh' | 'en')) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${GeistMono.variable}`}>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
            <Toaster position="top-center" richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
