export const SITE = {
  name: 'Hitosea',
  nameZh: '海豚有海',
  legalName: '广西海豚有海信息科技有限公司',
  domain: 'hitosea.com',
  url: 'https://hitosea.com',
  email: 'contact@hitosea.com',
  salesEmail: 'sales@hitosea.com',
  careersEmail: 'careers@hitosea.com',
  phone: '',
  icp: '',
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
