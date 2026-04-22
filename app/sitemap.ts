import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { routing } from '@/i18n/routing'

const PATHS = ['', '/open-source', '/about', '/contact'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    for (const p of PATHS) {
      entries.push({
        url: `${SITE.url}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: p === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE.url}/${l}${p}`]),
          ),
        },
      })
    }
  }
  return entries
}
