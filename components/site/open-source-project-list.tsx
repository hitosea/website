import Image from 'next/image'
import { useLocale } from 'next-intl'
import { products, type Product } from '@/content/products'
import { fetchAllProductStats } from '@/lib/github'
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

export async function OpenSourceProjectList() {
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { perRepo } = await fetchAllProductStats(repos)
  const starsByRepo = new Map(perRepo.map((r) => [r.repo, r.stars]))

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <ProjectRow key={p.slug} product={p} stars={starsByRepo.get(p.githubRepo) ?? 0} />
      ))}
    </div>
  )
}

function ProjectRow({ product, stars }: { product: Product; stars: number }) {
  const locale = useLocale()
  const name = locale === 'zh' ? product.nameZh : product.name
  const tagline = locale === 'zh' ? product.taglineZh : product.tagline

  return (
    <a
      href={product.githubUrl}
      target="_blank"
      rel="noopener"
      className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/30 p-5 transition-colors hover:border-primary/50"
    >
      <div className="relative h-10 w-10 shrink-0">
        <Image src={product.logoUrl} alt={`${name} logo`} fill className="object-contain" sizes="40px" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        <p className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Github className="h-3.5 w-3.5" /> {product.githubRepo}
          </span>
          <span>★ {stars.toLocaleString()}</span>
        </p>
      </div>
    </a>
  )
}
