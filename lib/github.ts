export interface RepoStats {
  repo: string
  stars: number
  forks: number
}

export interface AggregateStats {
  totalStars: number
  totalRepos: number
}

export async function fetchRepoStats(repo: string): Promise<RepoStats> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return { repo, stars: 0, forks: 0 }
    }
    const data = await res.json()
    return {
      repo,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch {
    return { repo, stars: 0, forks: 0 }
  }
}

export function aggregateStats(repos: RepoStats[]): AggregateStats {
  return {
    totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
    totalRepos: repos.length,
  }
}

export async function fetchAllProductStats(repoList: string[]): Promise<{
  perRepo: RepoStats[]
  aggregate: AggregateStats
}> {
  const perRepo = await Promise.all(repoList.map((r) => fetchRepoStats(r)))
  return {
    perRepo,
    aggregate: aggregateStats(perRepo),
  }
}
