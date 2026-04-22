export interface TimelineEvent {
  date: string
  titleZh: string
  title: string
  descZh?: string
  desc?: string
}

export const timeline: TimelineEvent[] = [
  {
    date: '2019',
    title: 'Company founded & DooTask open-sourced',
    titleZh: '公司成立 & DooTask 开源',
    desc: 'Hitosea is founded in Guangxi. Our flagship team collaboration platform goes public on GitHub.',
    descZh: '海豚有海在广西成立，旗舰协作平台 DooTask 在 GitHub 公开发布。',
  },
  {
    date: '2021',
    title: 'eeui cross-platform framework matures',
    titleZh: 'eeui 跨端框架成熟',
    desc: 'Vue-based native mobile framework reaches 500+ stars.',
    descZh: '基于 Vue 的原生移动框架达到 500+ stars。',
  },
  {
    date: '2023',
    title: 'DooTask crosses 5,000 GitHub stars',
    titleZh: 'DooTask 突破 5,000 GitHub stars',
    desc: 'Production deployments at large enterprises including China Unicom.',
    descZh: '生产环境落地中国联通等大型企业。',
  },
  {
    date: '2025',
    title: 'Happy Next launched',
    titleZh: 'Happy Next 发布',
    desc: 'Multi-model AI workspace for Claude Code and Codex.',
    descZh: '面向 Claude Code 和 Codex 的多模型 AI 工作空间。',
  },
  {
    date: '2026',
    title: 'Vertical AI product line begins',
    titleZh: '垂直 AI 产品线启动',
    desc: 'MenuRay (restaurant menus) and Qiujian (tennis companion) ship.',
    descZh: 'MenuRay（餐厅菜单）和球见（网球 AI 伙伴）相继发布。',
  },
]
