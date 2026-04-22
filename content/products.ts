export type ProductTheme = 'collaboration' | 'ai-dev' | 'vertical-ai'

export interface Product {
  slug: string
  name: string
  nameZh: string
  tagline: string
  taglineZh: string
  theme: ProductTheme
  isFlagship?: boolean
  logoUrl: string
  websiteUrl?: string
  githubRepo?: string
  githubUrl?: string
  giteeUrl?: string
  repoUrl: string
  tags: string[]
  featured: boolean
}

export const products: Product[] = [
  {
    slug: 'dootask',
    name: 'DooTask',
    nameZh: 'DooTask',
    tagline: 'Open-source all-in-one team workspace — tasks, chat, docs, whiteboard.',
    taglineZh: '开源的团队协作中枢：任务、IM、文档、白板一体化。',
    theme: 'collaboration',
    isFlagship: true,
    logoUrl: '/logos/products/dootask.png',
    websiteUrl: 'https://www.dootask.com',
    githubRepo: 'kuaifan/dootask',
    githubUrl: 'https://github.com/kuaifan/dootask',
    repoUrl: 'https://github.com/kuaifan/dootask',
    tags: ['Open Source', 'Self-hosted'],
    featured: true,
  },
  {
    slug: 'dootask-okr',
    name: 'DooTask OKR',
    nameZh: 'DooTask OKR',
    tagline: 'OKR management, built on top of DooTask.',
    taglineZh: '基于 DooTask 的目标与关键结果（OKR）管理。',
    theme: 'collaboration',
    logoUrl: '/logos/products/dootask-okr.svg',
    githubRepo: 'hitosea/dootask-okr',
    githubUrl: 'https://github.com/hitosea/dootask-okr',
    repoUrl: 'https://github.com/hitosea/dootask-okr',
    tags: ['Open Source', 'OKR'],
    featured: true,
  },
  {
    slug: 'wookteam',
    name: 'WookTeam',
    nameZh: 'WookTeam',
    tagline: 'Lightweight open-source team collaboration — docs, mind maps, flowcharts, Kanban, Gantt, IM.',
    taglineZh: '轻量级开源在线团队协作工具：文档、思维导图、流程图、看板、甘特图、即时通讯。',
    theme: 'collaboration',
    logoUrl: '/logos/products/wookteam.svg',
    giteeUrl: 'https://gitee.com/aipaw/wookteam',
    repoUrl: 'https://gitee.com/aipaw/wookteam',
    tags: ['Open Source', 'Lightweight', 'Self-hosted'],
    featured: true,
  },
  {
    slug: 'dootask-ai',
    name: 'DooTask AI',
    nameZh: 'DooTask AI',
    tagline: 'AI assistant module that plugs into DooTask.',
    taglineZh: '为 DooTask 注入 AI 能力的助手模块。',
    theme: 'collaboration',
    logoUrl: '/logos/products/dootask-ai.svg',
    githubRepo: 'kuaifan/dootask-ai',
    githubUrl: 'https://github.com/kuaifan/dootask-ai',
    repoUrl: 'https://github.com/kuaifan/dootask-ai',
    tags: ['AI', 'Open Source'],
    featured: false,
  },
  {
    slug: 'happy-next',
    name: 'Happy Next',
    nameZh: 'Happy Next',
    tagline: 'A multi-model AI workspace for Claude Code & Codex — orchestration, realtime voice, E2E encryption.',
    taglineZh: '面向 Claude Code 和 Codex 的多模型 AI 工作空间，支持编排、实时语音、端到端加密。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/happy-next.png',
    websiteUrl: 'https://happy-next.com',
    githubRepo: 'hitosea/happy-next',
    githubUrl: 'https://github.com/hitosea/happy-next',
    repoUrl: 'https://github.com/hitosea/happy-next',
    tags: ['AI', 'Open Source', 'E2E Encrypted'],
    featured: true,
  },
  {
    slug: 'eeui',
    name: 'EEUI',
    nameZh: 'EEUI',
    tagline: 'Build high-quality native (iOS/Android) apps with Vue.js.',
    taglineZh: '用 Vue.js 开发高质量原生（Android/iOS）应用的跨端框架。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/eeui.svg',
    websiteUrl: 'https://eeui.app',
    githubRepo: 'kuaifan/eeui',
    githubUrl: 'https://github.com/kuaifan/eeui',
    repoUrl: 'https://github.com/kuaifan/eeui',
    tags: ['Framework', 'Open Source', 'Vue'],
    featured: true,
  },
  {
    slug: 'doopush',
    name: 'DooPush',
    nameZh: 'DooPush',
    tagline: 'Self-hosted push notification platform for iOS and Android.',
    taglineZh: '自部署的 iOS / Android 推送通知平台。',
    theme: 'ai-dev',
    logoUrl: '/logos/products/doopush.svg',
    githubRepo: 'doopush/doopush',
    githubUrl: 'https://github.com/doopush/doopush',
    repoUrl: 'https://github.com/doopush/doopush',
    tags: ['Infrastructure', 'Open Source'],
    featured: true,
  },
  {
    slug: 'menuray',
    name: 'MenuRay',
    nameZh: 'MenuRay',
    tagline: 'Snap a photo of any paper menu — get a shareable digital menu in minutes.',
    taglineZh: '拍一张纸质菜单，分钟级得到可分享的数字菜单（面向 SMB 餐厅）。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/menuray.svg',
    githubRepo: 'menuray/menuray',
    githubUrl: 'https://github.com/menuray/menuray',
    repoUrl: 'https://github.com/menuray/menuray',
    tags: ['AI', 'Open Source', 'Restaurant'],
    featured: true,
  },
  {
    slug: 'qiujian',
    name: 'Qiujian',
    nameZh: '球见',
    tagline: 'Your pocket tennis AI companion, with a personalized tennis feed.',
    taglineZh: '口袋里的网球 AI 伙伴，加一份只属于你的网球内容流。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/qiujian.svg',
    githubRepo: 'qiujian-club/qiujian',
    githubUrl: 'https://github.com/qiujian-club/qiujian',
    repoUrl: 'https://github.com/qiujian-club/qiujian',
    tags: ['AI', 'Open Source', 'Sports'],
    featured: true,
  },
  {
    slug: 'ttpos',
    name: 'TTPOS',
    nameZh: 'TTPOS',
    tagline: 'Point-of-sale system for retail (Go + Flutter).',
    taglineZh: '面向零售的 POS 系统（Go + Flutter）。',
    theme: 'vertical-ai',
    logoUrl: '/logos/products/ttpos.svg',
    githubRepo: 'hitosea/ttpos-flutter',
    githubUrl: 'https://github.com/hitosea/ttpos-flutter',
    repoUrl: 'https://github.com/hitosea/ttpos-flutter',
    tags: ['Retail', 'Open Source'],
    featured: true,
  },
]

export function getProductsByTheme(): Record<ProductTheme, Product[]> {
  const groups: Record<ProductTheme, Product[]> = {
    collaboration: [],
    'ai-dev': [],
    'vertical-ai': [],
  }
  for (const p of products) {
    groups[p.theme].push(p)
  }
  return groups
}

export function getFlagshipProduct(): Product {
  const flagship = products.find((p) => p.isFlagship)
  if (!flagship) throw new Error('No flagship product defined')
  return flagship
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
