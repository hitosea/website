import { NextResponse } from 'next/server'
import { fetchAllProductStats } from '@/lib/github'
import { products } from '@/content/products'

export const revalidate = 3600

export async function GET() {
  const repos = Array.from(new Set(products.map((p) => p.githubRepo)))
  const { perRepo, aggregate } = await fetchAllProductStats(repos)
  return NextResponse.json(
    {
      perRepo,
      aggregate,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
