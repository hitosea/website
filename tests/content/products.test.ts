import { describe, it, expect } from 'vitest'
import { products, getProductsByTheme, getFlagshipProduct } from '@/content/products'

describe('products metadata', () => {
  it('contains all expected products', () => {
    const slugs = products.map(p => p.slug)
    expect(slugs).toContain('dootask')
    expect(slugs).toContain('happy-next')
    expect(slugs).toContain('eeui')
    expect(slugs).toContain('menuray')
    expect(slugs).toContain('doopush')
    expect(slugs).toContain('qiujian')
  })

  it('every product has a theme', () => {
    for (const p of products) {
      expect(['collaboration', 'ai-dev', 'vertical-ai']).toContain(p.theme)
    }
  })

  it('groups products by theme', () => {
    const groups = getProductsByTheme()
    expect(groups.collaboration.length).toBeGreaterThan(0)
    expect(groups['ai-dev'].length).toBeGreaterThan(0)
    expect(groups['vertical-ai'].length).toBeGreaterThan(0)
  })

  it('returns DooTask as the flagship', () => {
    expect(getFlagshipProduct().slug).toBe('dootask')
  })

  it('every product has non-empty tagline and taglineZh', () => {
    for (const p of products) {
      expect(p.tagline.length).toBeGreaterThan(0)
      expect(p.taglineZh.length).toBeGreaterThan(0)
    }
  })

  it('every product has a githubRepo in owner/name format', () => {
    for (const p of products) {
      expect(p.githubRepo).toMatch(/^[^/]+\/[^/]+$/)
    }
  })
})
