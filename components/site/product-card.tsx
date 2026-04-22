import Image from 'next/image'
import { ArrowUpRight, Github, Star } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { Product } from '@/content/products'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ProductCard({
  product,
  stars,
}: {
  product: Product
  stars?: number
}) {
  const locale = useLocale()
  const name = locale === 'zh' ? product.nameZh : product.name
  const tagline = locale === 'zh' ? product.taglineZh : product.tagline
  const primaryHref = product.websiteUrl ?? product.githubUrl
  const primaryLabel = product.websiteUrl ? (locale === 'zh' ? '官网' : 'Website') : 'GitHub'

  return (
    <Card className="group relative h-full overflow-hidden border-border/60 bg-card/50 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={product.logoUrl}
              alt={`${name} logo`}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          {product.isFlagship && (
            <Badge variant="secondary" className="text-xs">
              Flagship
            </Badge>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-sm">
          {typeof stars === 'number' && stars > 0 ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" /> {stars.toLocaleString()}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`${name} on GitHub`}
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {primaryLabel} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
