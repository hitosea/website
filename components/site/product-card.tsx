import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { Product } from '@/content/products'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function Github({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.386-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.832 2.807 1.302 3.492.996.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.932 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.399 3-.404 1.02.005 2.043.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.628-5.48 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

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
