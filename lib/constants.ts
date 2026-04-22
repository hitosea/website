export const SITE = {
  name: 'Hitosea',
  nameZh: '海豚有海',
  legalName: '广西海豚有海信息科技有限公司',
  domain: 'hitosea.com',
  url: 'https://hitosea.com',
  email: 'service@hitosea.com',
  salesEmail: 'service@hitosea.com',
  careersEmail: 'service@hitosea.com',
  phone: '',
  icp: '桂ICP备2021003642号-1',
  gonganIcp: '桂公网安备45010802000317号',
  founded: 2020,
} as const

export const GITHUB_ORGS = [
  'hitosea',
  'kuaifan',
  'menuray',
  'doopush',
  'qiujian-club',
] as const

export const LOCALES = ['zh', 'en'] as const
export type Locale = (typeof LOCALES)[number]
