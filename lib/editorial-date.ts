const SEASONS = [
  { en: 'Spring', zh: '春' },
  { en: 'Summer', zh: '夏' },
  { en: 'Fall', zh: '秋' },
  { en: 'Winter', zh: '冬' },
] as const

function getSeasonIndex(month: number): number {
  if (month >= 3 && month <= 5) return 0
  if (month >= 6 && month <= 8) return 1
  if (month >= 9 && month <= 11) return 2
  return 3
}

// Issue №01 = Fall 2024 (Sep 2024). Each season increments by 1.
export function getIssueLine(locale: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const season = SEASONS[getSeasonIndex(month)]

  const monthsSinceBase = (year - 2024) * 12 + month - 9
  const issueNum = String(Math.floor(monthsSinceBase / 3) + 1).padStart(2, '0')

  return locale === 'zh'
    ? `第 ${issueNum} 期 · ${year} 年${season.zh}`
    : `Issue №${issueNum} · ${season.en} ${year}`
}

export function getIndexVersion(): string {
  const now = new Date()
  return `v${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getStampLabel(locale: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  if (locale === 'zh') {
    return `GitHub Star 总数 — ${year} 年 ${month} 月`
  }

  const monthName = now.toLocaleDateString('en-US', { month: 'long' })
  return `Total GitHub Stars — ${monthName} ${year}`
}
