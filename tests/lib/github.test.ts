import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoStats, aggregateStats } from '@/lib/github'

describe('github stats', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchRepoStats', () => {
    it('returns stargazers_count and forks_count when response is ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            stargazers_count: 5400,
            forks_count: 320,
            open_issues_count: 40,
          }),
        }),
      )
      const stats = await fetchRepoStats('kuaifan/dootask')
      expect(stats.stars).toBe(5400)
      expect(stats.forks).toBe(320)
    })

    it('returns zeros on a failed response (graceful fallback)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
      const stats = await fetchRepoStats('does/not-exist')
      expect(stats.stars).toBe(0)
      expect(stats.forks).toBe(0)
    })

    it('sends Authorization header when GITHUB_TOKEN is set', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ stargazers_count: 1, forks_count: 0, open_issues_count: 0 }),
      })
      vi.stubGlobal('fetch', mockFetch)
      vi.stubEnv('GITHUB_TOKEN', 'test-token')
      await fetchRepoStats('a/b')
      const [, init] = mockFetch.mock.calls[0]
      const headers = init?.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer test-token')
    })
  })

  describe('aggregateStats', () => {
    it('sums stars and counts repos', () => {
      const result = aggregateStats([
        { repo: 'a/b', stars: 100, forks: 10 },
        { repo: 'c/d', stars: 250, forks: 30 },
      ])
      expect(result.totalStars).toBe(350)
      expect(result.totalRepos).toBe(2)
    })

    it('handles empty input', () => {
      const result = aggregateStats([])
      expect(result.totalStars).toBe(0)
      expect(result.totalRepos).toBe(0)
    })
  })
})
