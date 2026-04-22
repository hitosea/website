# hitosea.com 官网设计规格书

**日期**：2026-04-22
**项目**：广西海豚有海信息科技有限公司官网
**作者**：Claude（与用户协作定稿）
**状态**：已定稿，准备进入实现阶段

---

## 1. 项目总览

### 1.1 一句话定位

**"Developer-first 的开源产品公司"** —— 海豚有海构建团队协作、AI、开发者工具与行业 SaaS 的开源产品矩阵，以开源建立信任，以私有化部署和企业支持实现商业化。

参考定位模式：Supabase、GitLab、PostHog、Grafana Labs。

### 1.2 核心目标

| 层级 | 目标 |
|---|---|
| **品牌** | 建立"开源 + 产品多样性"的技术公司形象 |
| **获客漏斗 TOFU** | 开发者/CTO 看到产品矩阵 → 认知海豚有海 |
| **获客漏斗 MOFU** | 访客探索具体产品 → 进入产品独立站 / GitHub 自己试用 |
| **获客漏斗 BOFU** | 企业 CTO 通过官网提交私有化咨询/演示预约 → 商务接手 |

### 1.3 关键决策锚点

| 维度 | 决策 | 理由 |
|---|---|---|
| 核心目标 | 开源品牌 + 企业转化双线 | 产品开源（DooTask 5400+ stars），商业收入靠企业私有化部署 |
| 主要受众 | 企业技术负责人 / CTO / IT 主管 | 有采购决策权、重视技术可靠性和合规 |
| 市场 | 中英双语 | 国内为主战场；MenuRay/Happy Next 有海外潜力 |
| 视觉风格 | Linear / Vercel / Supabase 深色技术风 | 与 developer-first 定位一致，符合受众审美 |
| 产品页策略 | 轻量卖卡，跳转产品独立站 | 6+ 产品都有独立站，不做内容复制 |
| 主 CTA | 预约演示 + 私有化部署咨询 | B2B 销售漏斗终点；+ 微信 + 400 辅助 |
| 信息架构 | 4 页：首页、开源、关于、联系 | 低维护优先；内容集中在首页 |
| 技术栈 | Next.js 15 App Router + Tailwind + shadcn/ui + next-intl | 主流、生态好、SSG 性能优、i18n 成熟 |
| 上线节奏 | 1-2 周 MVP，后续迭代 | 快速上线抢占 SEO，细节在线上打磨 |

### 1.4 产品三分组

```
① 企业协作与生产力 (Enterprise Collaboration & Productivity)
   └─ DooTask（旗舰） + DooTask OKR + DooTask Flow + DooTask AI

② AI 与开发者工具 (AI & Developer Tools)
   └─ Happy Next + eeui + DooPush

③ 面向行业的 AI 产品 (Vertical AI Products)
   └─ MenuRay + 球见 Qiujian + TTPOS
```

---

## 2. 信息架构

### 2.1 站点地图

```
hitosea.com
│
├─ /[locale]/                    首页 (locale ∈ {zh, en})
│
├─ /[locale]/open-source         开源页
│
├─ /[locale]/about               关于页
│
├─ /[locale]/contact             联系/预约演示页
│
├─ /api/contact                  表单提交后端
│
├─ /api/github-stats             GitHub 数据缓存代理
│
├─ /sitemap.xml                  SEO sitemap
│
└─ /robots.txt                   爬虫规则
```

**说明**：
- 语言通过路径前缀处理：`/zh/about` 和 `/en/about`。根路径 `/` 通过 middleware 根据 `Accept-Language` 自动重定向到 `/zh` 或 `/en`。
- `/products` **MVP 不独立出页面**，而是作为首页内锚点 `/#products`。日后产品数量增长（>10 个）或需要筛选/搜索时再拆出来。
- `/contact` 独立成页，不做成首页锚点 —— 方便在邮件签名、GitHub 链接等外部场景直接引用。

### 2.2 顶部导航

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]   产品 ▾   开源   关于         │  [EN/中]  [📧]  [预约演示] │
└──────────────────────────────────────────────────────────────────┘
```

- **Logo**：点击回到首页
- **产品 ▾**：mega menu（悬停/点击展开），展示三分组 + 各分组下产品卡片列表，每个产品点击跳至其独立站（外链）；点击"产品"文字本身滚动到首页产品区锚点
- **开源**：直达 `/open-source`
- **关于**：直达 `/about`
- **语言切换 EN/中**：ghost button 样式
- **微信图标**：点击弹出二维码 Popover（中国用户习惯）
- **预约演示**：primary button（主色填充），链接到 `/contact#demo-form`

**移动端**：汉堡菜单展开所有项，产品分组做成折叠手风琴。

### 2.3 Footer

```
┌───────────────────────────────────────────────────────────────┐
│                                                                │
│  产品                公司               开源              联系   │
│  DooTask             关于我们           GitHub 组织       邮箱  │
│  DooTask OKR         加入我们           核心项目          微信  │
│  Happy Next          新闻媒体           贡献指南          地点  │
│  eeui                联系我们                            400   │
│  ... (全部产品)                                                 │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│  © 2026 广西海豚有海信息科技有限公司  |  ICP 备案号  |  电子营业执照 │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. 首页结构（长页面）

首页采用 Approach B（产品矩阵优先型），垂直分为 7 个板块：

### Section 1: Hero

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  [微型标签: 开源 · 产品矩阵 · 企业级]                        │
│                                                           │
│  我们构建开源的                                             │
│  生产力、AI 与开发者工具                                   │
│                                                           │
│  海豚有海是一家 Developer-first 的开源产品公司，            │
│  我们的产品被 5000+ 团队和开发者使用。                      │
│                                                           │
│  [预约演示 →]   [浏览产品矩阵]                              │
│                                                           │
│  [GitHub: ★ 6,000+     Contributors: 120+   Projects: 10+] │
│                                                           │
│  [背景：微弱的代码片段/星点/线条动效，不抢视觉]              │
└──────────────────────────────────────────────────────────┘
```

- 深色背景（`bg-slate-950` 或用品牌主色深调）
- 文字极大（中文约 48-64px，英文可到 72px）
- 背景可选：细腻的 SVG 星空/代码流动画（用 CSS 而非视频，保证性能）
- **两个 CTA**：主 CTA "预约演示"（primary），次 CTA "浏览产品矩阵"（ghost，锚点到下面的产品矩阵）
- 底部一行**活数据条**（从 GitHub API 动态获取并 1h 缓存）

### Section 2: 产品矩阵（核心）

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
产品矩阵
三条产品线，服务不同场景下的团队与开发者
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────── ① 企业协作与生产力 ────────┐
│  DooTask              │  DooTask OKR   │  DooTask AI      │
│  [logo] 开源团队协作    │ [logo] OKR 管理 │ [logo] AI 助理    │
│  一句话                │ 一句话           │ 一句话           │
│  ★ 5.4k  [→ 官网]     │ [→ GitHub]       │ [→ GitHub]       │
└─────────────────────────────────────────────────────────┘

┌─────── ② AI 与开发者工具 ────────┐
│  Happy Next          │  eeui              │  DooPush         │
│  Claude Code/Codex   │  Vue 跨端原生框架    │  iOS/安卓推送平台  │
│  一句话               │  一句话              │  一句话          │
│  ★ 14  [→ 官网]      │  ★ 525  [→ 官网]   │  [→ GitHub]      │
└─────────────────────────────────────────────────────────┘

┌─────── ③ 面向行业的 AI 产品 ────────┐
│  MenuRay             │  球见 Qiujian       │  TTPOS          │
│  AI 菜单数字化        │  网球 AI 伙伴         │  POS 零售系统    │
│  一句话               │  一句话              │  一句话          │
│  [→ GitHub]          │  [→ GitHub]          │  [→ GitHub]     │
└─────────────────────────────────────────────────────────┘
```

**每张产品卡片包含**：
- 产品 logo / icon
- 产品名（中英对照）
- 一句话描述
- 1-2 个标签（如 "开源" / "SDK" / "自托管"）
- GitHub stars（小号数字，带 ★ 图标，动态）
- 跳转 CTA：官网链接（主要）、GitHub 链接（次要）

**布局**：
- 桌面：每组 3 列 grid（第一组 DooTask 占 2 列跨列为强调旗舰）
- 平板：2 列
- 移动：1 列
- 卡片 hover 态：轻微上浮 + 边框高亮 + 主色 glow

### Section 3: 开源影响力条

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
我们相信开源
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[大号数字]  6,000+      120+           10+            1,000+
             GitHub ★    贡献者          开源项目        Docker 拉取

"海豚有海的所有核心产品都开源。从 DooTask 到 MenuRay，
 我们相信可审计、可自部署、可定制的软件是企业未来的基础。"

[查看开源项目 →]  [前往 GitHub 组织 →]
```

- 数字从 GitHub API 聚合（hitosea + kuaifan + menuray + doopush + qiujian-club 的 stars / contributors / repos 总和）
- 有 1h 缓存（避免命中 API rate limit）
- 数字挂载时有从 0 rolling up 到最终值的动效（Intersection Observer 触发）

### Section 4: 客户信任条（条件性）

**仅在用户提供中国联通等客户 logo 授权后启用**。否则 MVP 阶段跳过此 section。

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
被以下团队信赖
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [中国联通]   [logo]    [logo]    [logo]    [logo]
```

- 灰度滤镜 logo 墙，hover 恢复彩色
- 可选：缓慢自动滚动（infinite marquee）

### Section 5: 为什么选海豚有海

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
为什么选海豚有海
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [icon]        │ │ [icon]        │ │ [icon]        │ │ [icon]        │
│ 全线开源      │ │ 私有化部署    │ │ 产品矩阵       │ │ 开发者友好    │
│              │ │              │ │              │ │              │
│ 所有核心产品  │ │ 提供企业级    │ │ 从协作到 AI   │ │ 原生 API、   │
│ 开源，可审计  │ │ 私有化部署和   │ │ 到垂直 SaaS,  │ │ 完善文档、   │
│ 可定制        │ │ SLA 保障      │ │ 一站式服务    │ │ 开源示例     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Section 6: 次要 CTA 区

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        准备为你的团队接入海豚有海的产品了吗？

        [预约演示 →]       [加微信聊聊]

        或直接发邮件：contact@hitosea.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- 强背景色块（主色渐变或纹理背景）
- 两个 CTA button
- 后备联系方式直接明文给出（降低摩擦）

### Section 7: Footer

（见 2.3）

---

## 4. 其他页面

### 4.1 `/open-source` — 开源页

**目的**：集中展示公司的开源贡献，吸引开发者社区。

**章节**：

1. **Hero 小标题**
   > "开源是海豚有海的根基。我们的代码、产品路线、issue 跟踪全部公开。"

2. **GitHub 数据汇总**（复用首页 Section 3 组件）

3. **核心开源项目列表**（详细版，比首页卡片更详细）
   - 每个项目：logo、名称、描述、stars、language、license、"在 GitHub 查看" / "访问官网"
   - 顺序：DooTask → Happy Next → eeui → MenuRay → DooPush → 球见 → 其他 fork

4. **贡献指南入口**
   - "如何参与海豚有海的开源"
   - 链接到各项目的 CONTRIBUTING.md

5. **社区入口**
   - GitHub Discussions
   - 微信社群（二维码）
   - Discord（如有）

### 4.2 `/about` — 关于页

**章节**：

1. **Hero**
   > "我们是海豚有海 —— 一群相信开源可以改变企业软件的工程师。"

2. **公司简介**（1-2 段文字）
   - 公司全称、成立时间、所在地（广西）
   - 一段愿景陈述

3. **我们在做什么**（产品矩阵的浓缩版，3 段文字即可）

4. **发展历程**（时间轴，里程碑）
   - "DooTask 开源，2020"
   - "GitHub 达到 1000 stars"
   - "发布 Happy Next"
   - ...（从 git log 和 release 提取）

5. **加入我们**
   - 简短一段 + 邮箱
   - **MVP 不做完整 careers 页**，只给 `careers@hitosea.com` 或类似邮箱

### 4.3 `/contact` — 联系 / 预约演示页

**章节**：

1. **预约演示表单**（默认打开，页面主焦点）
   - 字段：姓名*、公司名*、邮箱*、电话（可选）、感兴趣的产品（多选下拉，从产品列表生成）、需求说明（textarea）
   - 提交：调用 `/api/contact` → 发送邮件到 contact@hitosea.com + 可选 Discord/飞书 webhook 通知
   - 表单校验用 Zod + react-hook-form
   - 提交后展示感谢信息 + 预期响应时间

2. **其他联系方式**（右侧或下方卡片）
   - 商务邮箱：sales@hitosea.com
   - 开源支持：hello@hitosea.com
   - 微信：二维码 + "工作日 9:00-18:00"
   - 400 电话（如有）
   - 办公地址（广西某地）+ 地图可选

3. **常见问题**（可选，MVP 可省）
   - 是否支持私有化部署？
   - 是否提供 SLA？
   - 定制开发流程？

---

## 5. 设计系统

### 5.1 色彩

**主色（Primary）**：待用户提供。先用占位色 `#0EA5E9`（sky-500）开发，等用户贴 logo 和品牌主色后**一处配置项替换**即可全局生效（通过 CSS variable）。

**建议方向**（根据公司名"海豚 + 海"的意象）：
- 蓝色系：海的颜色，#0EA5E9 / #0284C7 / #0369A1 中选一个
- 如果用户 logo 是其他颜色（比如深紫或深绿），以用户颜色为准

**辅助色**：
- 中性色：Tailwind `slate` 系列（`slate-950` 主深色背景，`slate-900` 次级背景，`slate-50` 亮色文字等）
- 成功：`emerald-500`
- 警告：`amber-500`
- 错误：`rose-500`

**色彩 token**（通过 CSS variable + Tailwind theme 配置）：
```css
--primary: 199 89% 48%;           /* sky-500 HSL, 待替换 */
--primary-foreground: 0 0% 100%;
--background: 222 47% 5%;          /* slate-950 */
--foreground: 210 40% 98%;
--muted: 217 33% 17%;
--muted-foreground: 215 20% 65%;
--border: 217 33% 17%;
--card: 222 47% 7%;
--card-foreground: 210 40% 98%;
```

### 5.2 字体

- **中文**：`MiSans` 或 `HarmonyOS Sans SC`（两者都免费商用）
  - 优先 `MiSans`（小米字体，字重丰富，视觉现代）
  - 字重：400 / 500 / 600 / 700
- **英文 / 数字 / 代码**：
  - 正文英文：`Inter`（Google Fonts 免费）
  - 显示级英文：`Geist Sans`（Vercel，免费）
  - 代码：`Geist Mono` 或 `JetBrains Mono`

**字阶**（Tailwind scale 自定义）：
- Display (Hero 标题)：`text-5xl md:text-7xl` 中文稍小
- H1 (章节大标题)：`text-4xl md:text-5xl`
- H2 (卡片标题)：`text-2xl md:text-3xl`
- H3 (次级标题)：`text-xl`
- Body：`text-base`（16px）
- Small：`text-sm`（14px）
- Caption：`text-xs`（12px）

**行高**：`leading-tight` 用于大标题，`leading-relaxed` 用于正文段落。

### 5.3 组件库

**基础组件（shadcn/ui）**：
- Button / Badge / Card / Input / Textarea / Select / Checkbox
- Dialog / Sheet / Popover（微信二维码）/ Tooltip
- Navigation Menu / Dropdown Menu（导航栏 mega menu）
- Form（react-hook-form + zod 封装）
- Skeleton（加载态）
- Toast / Sonner（表单提交反馈）

**项目自建组件**：
- `<SiteHeader />` — 顶部导航
- `<SiteFooter />` — 页脚
- `<Hero />` — 首页 Hero
- `<ProductMatrix />` — 产品矩阵容器
- `<ProductCard />` — 单个产品卡片
- `<OpenSourceStats />` — GitHub 数据汇总组件
- `<TrustBar />` — 客户 logo 条
- `<WhyUs />` — 差异化优势
- `<CTASection />` — 次要 CTA 区
- `<ContactForm />` — 联系表单
- `<WeChatPopover />` — 微信二维码
- `<LanguageSwitch />` — 语言切换
- `<ThemeToggle />` — 深色/亮色切换（可选）

### 5.4 图标

- **UI 图标**：`lucide-react`（shadcn 默认搭配）
- **品牌图标**：`simple-icons`（GitHub、Discord 等品牌标识）
- **产品 logo**：本地 SVG 文件，统一放在 `/public/logos/products/`

### 5.5 动效

MVP 阶段采用"克制动效"原则：

- **有**：
  - Hover 过渡（`transition-colors`, `transition-transform`）
  - 卡片悬停微上浮（`hover:-translate-y-1`）
  - Scroll reveal（元素进入视口时淡入 + 下移 8px，用 Intersection Observer）
  - Hero 数据条数字 rolling up（仅触发一次）
  - 页面路由切换时淡入（Next.js 默认即可）
- **没有**：
  - 大型 parallax
  - 粒子系统 / Three.js 场景
  - 复杂的 scroll-driven 动画
  - 视频背景

工具：原生 CSS transitions + `framer-motion`（只用在少量需要状态协调的地方）。

### 5.6 响应式断点

- Mobile: `< 640px` (base)
- Tablet: `≥ 768px` (`md:`)
- Laptop: `≥ 1024px` (`lg:`)
- Desktop: `≥ 1280px` (`xl:`)

所有页面 mobile-first 设计，**移动端必须过关**（CTO 也常用手机看）。

### 5.7 深色 / 亮色

- **默认深色**（符合"类 Linear/Vercel"的视觉方向）
- 提供亮色切换（用 `next-themes`，存 localStorage）
- 亮色不是必选 —— 如果时间紧 MVP 只做深色也可接受

---

## 6. 内容计划

### 6.1 内容来源策略

| 内容类型 | 来源 | 谁负责 |
|---|---|---|
| 产品一句话描述（中英） | 各产品 README / 官网 + 我精简 | Claude 起草，用户 review |
| 产品 logo / 截图 | 各产品已有 | Claude 从产品站/repo 抓取 |
| 公司简介 / 使命 | 基于前期讨论起草 | Claude 起草，用户 review |
| 团队介绍 | （MVP 先不做，等用户提供） | —— |
| 客户案例 / logo 授权 | 用户提供 | 用户（有授权才用） |
| GitHub stars / contributors 数字 | GitHub API 动态 | 代码自动 |
| Hero 金句 3-5 候选 | Claude 起草 | 用户选 |
| 差异化 4 点（Why Us） | Claude 起草 | 用户 review |
| About 时间轴 | 从 git history / repo 创建时间提取 | Claude 起草 |
| 法律文本（隐私 / 条款 / ICP） | 用户提供 | 用户 |
| 预约演示表单字段列表 | 见 4.3 | Claude 设计 |

### 6.2 Hero 金句候选（供用户挑）

1. **"我们构建开源的 生产力、AI 与开发者工具"**
   *英：We build open-source tools for productivity, AI, and developers.*

2. **"Developer-first 的开源产品矩阵，为中国团队而生"**
   *英：A developer-first open-source product suite, built for modern teams.*

3. **"从团队协作到 AI 工作空间 —— 开源的答案"**
   *英：From team collaboration to AI workspace — the open-source answer.*

4. **"海豚有海 · 一家做产品的开源公司"**
   *英：Hitosea — an open-source company that ships products.*

5. **"被 5000+ 团队和开发者信赖的开源产品公司"**
   *英：The open-source product studio trusted by 5,000+ teams and developers.*

**当前默认采用 #1**，上线前用户可换。

### 6.3 产品一句话（初稿，供 review）

- **DooTask** · 开源的团队协作中枢：任务、IM、文档、白板一体化。
- **DooTask OKR** · 基于 DooTask 的目标与关键结果管理。
- **DooTask AI** · 为 DooTask 注入 AI 能力的助手模块。
- **Happy Next** · 面向 Claude Code 和 Codex 的多模型 AI 工作空间，支持编排、实时语音、端到端加密。
- **eeui** · 用 Vue.js 开发高质量原生（Android/iOS）应用的跨端框架。
- **DooPush** · 自部署的 iOS / Android 推送通知平台。
- **MenuRay** · 拍一张纸质菜单，分钟级得到可分享的数字菜单（面向 SMB 餐厅）。
- **球见 Qiujian** · 口袋里的网球 AI 伙伴，加一份只属于你的网球内容流。
- **TTPOS** · 面向零售的 POS 系统（Go + Flutter）。

### 6.4 Why Us 四点（初稿）

1. **全线开源** — 所有核心产品开源，可审计、可自部署、可定制。
2. **企业私有化** — 提供生产级私有化部署、安全合规支持和 SLA。
3. **产品矩阵** — 从团队协作到 AI 工作空间到垂直 SaaS，一家公司满足多场景需求。
4. **开发者友好** — 完整的开源文档、丰富的 API 和 SDK、活跃的社区。

---

## 7. 技术架构

### 7.1 整体架构

```
┌─────────────────────────────────────────────────┐
│  Next.js 15 (App Router) — SSG + 按需 ISR       │
│                                                  │
│  [app/[locale]/*]  →  静态页面（预渲染）          │
│  [app/api/*]       →  Edge/Node runtime         │
│                                                  │
│  ├─ next-intl        → 中英双语路由和 messages   │
│  ├─ next-themes      → 深色/亮色主题             │
│  ├─ shadcn/ui        → UI 组件底座               │
│  ├─ Tailwind CSS 3.4 → 样式                      │
│  ├─ framer-motion    → 轻度动效                  │
│  ├─ react-hook-form  → 表单                     │
│  └─ zod              → 表单校验                  │
└─────────────────────────────────────────────────┘
        │
        ├─ 表单提交 → /api/contact → SMTP / Resend / 飞书 Webhook
        ├─ 数据 → /api/github-stats → GitHub REST API（1h 缓存）
        └─ 静态资源 → /public + CDN
```

### 7.2 目录结构

```
hitosea.com/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx               # 全站 layout (header + footer + theme provider)
│   │   ├── page.tsx                 # 首页
│   │   ├── open-source/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts             # POST /api/contact
│   │   └── github-stats/
│   │       └── route.ts             # GET /api/github-stats (revalidate 3600s)
│   ├── globals.css
│   ├── sitemap.ts                   # SEO sitemap 生成
│   └── robots.ts                    # SEO robots 生成
├── components/
│   ├── ui/                          # shadcn 生成的原子组件
│   ├── site/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── product-matrix.tsx
│   │   ├── product-card.tsx
│   │   ├── open-source-stats.tsx
│   │   ├── trust-bar.tsx
│   │   ├── why-us.tsx
│   │   ├── cta-section.tsx
│   │   ├── contact-form.tsx
│   │   ├── wechat-popover.tsx
│   │   ├── language-switch.tsx
│   │   └── theme-toggle.tsx
│   └── theme-provider.tsx
├── content/
│   └── products.ts                  # 产品元数据单一数据源
├── i18n/
│   ├── request.ts                   # next-intl config
│   ├── routing.ts
│   └── messages/
│       ├── zh.json
│       └── en.json
├── lib/
│   ├── github.ts                    # GitHub API 封装
│   ├── mail.ts                      # 邮件发送封装（Resend 或 nodemailer）
│   ├── utils.ts                     # shadcn utils (cn 等)
│   └── constants.ts                 # 全局常量（联系邮箱、电话等）
├── public/
│   ├── logos/
│   │   ├── company/                 # 海豚有海 logo
│   │   └── products/                # 各产品 logo
│   ├── screenshots/                 # 产品截图
│   ├── brand/                       # VI 素材（如果有）
│   └── og/                          # 社交分享卡片
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-22-hitosea-website-design.md
├── .env.example
├── .eslintrc.json
├── .gitignore
├── middleware.ts                    # next-intl locale 匹配
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### 7.3 产品元数据单一数据源

所有产品信息集中在 `content/products.ts`（TypeScript 对象），让首页、开源页、导航菜单、footer 都从同一处读取：

```typescript
// content/products.ts
export type ProductTheme = 'collaboration' | 'ai-dev' | 'vertical-ai'

export interface Product {
  slug: string
  name: string              // 英文名
  nameZh: string            // 中文名
  tagline: string           // 英文一句话
  taglineZh: string         // 中文一句话
  theme: ProductTheme
  isFlagship?: boolean
  logoUrl: string           // /logos/products/<slug>.svg
  websiteUrl?: string       // 产品独立官网（可选）
  githubUrl: string         // 主 GitHub 仓库
  tags: string[]            // 如 ['Open Source', 'Self-hosted']
  featured: boolean         // 首页是否展示
}

export const products: Product[] = [
  { slug: 'dootask', isFlagship: true, ... },
  { slug: 'happy-next', ... },
  // ...
]
```

### 7.4 GitHub 数据获取

```typescript
// lib/github.ts
// 通过 /api/github-stats 路由返回聚合数据
// - 遍历 products[].githubUrl 对应的 repo
// - 调用 GET /repos/{owner}/{repo} 拿 stargazers_count 等
// - 聚合 total stars / repos / contributors
// - 响应缓存 1h (Next.js revalidate)
// - 有环境变量 GITHUB_TOKEN 时用 authenticated 请求（5000/hr 额度）
```

**Fallback**：如果 API 失败，返回上次缓存 或 硬编码的兜底数字（避免首页白屏）。

### 7.5 i18n 策略（next-intl）

- 路由：`/zh/*` 与 `/en/*`
- 根路径 `/`：中间件按 `Accept-Language` 重定向到 `/zh` 或 `/en`（默认 `/zh`）
- 翻译文件：`i18n/messages/zh.json` + `en.json`，命名空间按页面划分（`home.hero.title` 等）
- SEO：每页设置 `<link rel="alternate" hreflang="...">`

### 7.6 表单后端（`/api/contact`）

- POST 请求 body 经 Zod 校验（同前端 schema）
- 发送邮件到 `contact@hitosea.com`（用 Resend 或阿里云邮件推送）
- **可选同步**：飞书 / 企微机器人 webhook 通知销售
- 简易 rate limit（用 Upstash Redis 或内存 LRU，按 IP，每分钟 3 次）
- 成功：返回 200 + `{ ok: true }`
- 失败：返回 4xx/5xx + 错误信息（不泄露内部错误）

**环境变量**：
```
RESEND_API_KEY=...
CONTACT_EMAIL_TO=contact@hitosea.com
CONTACT_EMAIL_FROM=noreply@hitosea.com
FEISHU_WEBHOOK_URL=...            # 可选
GITHUB_TOKEN=...                  # 可选，提高 GitHub API 限额
```

### 7.7 性能与 SEO

- **目标**：Lighthouse 性能 ≥ 90（移动端）
- **手段**：
  - 所有页面 SSG（无客户端数据获取阻塞首屏）
  - 图片用 `next/image`，优先 WebP/AVIF，lazy load
  - 字体使用 `next/font` 自托管避免第三方延迟
  - 关键 CSS inline（Tailwind + Next.js 默认即可）
  - 代码分割到页面级
- **SEO**：
  - 每页设置 `metadata`（title、description、OG、Twitter card）
  - sitemap.xml 自动生成
  - robots.txt
  - hreflang
  - structured data（Organization schema）

### 7.8 部署

- **开发 / 预览**：Vercel（PR 自动 preview deploy）
- **生产**：
  - 方案 A：Vercel Edge Network（配合中国 CDN 加速，如又拍云/阿里云 CDN 回源 Vercel）
  - 方案 B：用 `next build` + `next start` 或 `output: 'standalone'` 自部署到阿里云/腾讯云
  - **决策推后到部署阶段**，根据 ICP 备案进度决定
- **ICP 备案**：公司官网必做，由用户方处理（通常 10-20 工作日）

### 7.9 监控（MVP 可选）

- Vercel Analytics（如用 Vercel）
- 或 Umami（自部署，开源友好）
- 不用 Google Analytics（中国访问不稳，合规顾虑）
- 错误监控：Sentry 免费版（可选）

---

## 8. MVP 范围与里程碑

### 8.1 MVP 范围（1-2 周内）

**包含**：
- ✅ 首页完整（所有 7 个 section，除客户 logo 条视素材而定）
- ✅ 开源页完整
- ✅ 关于页（简介 + 使命 + 时间轴 + 加入我们邮箱；**不含**团队成员介绍）
- ✅ 联系页（表单 + 微信 + 邮箱 + 地点）
- ✅ 中英双语（文案 Claude 起草，用户审）
- ✅ 深色模式（亮色切换可延后）
- ✅ 响应式（移动/平板/桌面）
- ✅ 顶部导航 mega menu
- ✅ GitHub API 数据集成
- ✅ 表单后端（邮件发送）
- ✅ 基础 SEO（OG、sitemap、robots、metadata）
- ✅ 部署到 Vercel 预览

**不包含（Post-MVP）**：
- ❌ 博客 / 新闻系统
- ❌ 客户案例详情页
- ❌ 完整 careers / 招聘系统
- ❌ 团队成员详情卡片
- ❌ 亮色模式完整打磨
- ❌ 复杂动画（parallax、Three.js 等）
- ❌ 国内服务器自部署（待 ICP 备案）
- ❌ 第二阶段语言（越南语/日语等）

### 8.2 里程碑（14 天估算）

| 天 | 任务 | 产出 |
|---|---|---|
| D1 | 项目初始化、依赖安装、shadcn 配置、ESLint/Prettier | 可 `pnpm dev` 跑起来 |
| D2 | 设计系统搭建、全局布局、i18n 框架、主题切换 | 空白页面 + 头部/底部可见 |
| D3 | Hero section + 数据条组件 | 首页 Hero 可见 |
| D4 | Product Card + Product Matrix（含 3 分组布局） | 产品矩阵可见 |
| D5 | Open Source Stats + Why Us + CTA section | 首页完成 |
| D6 | Open Source 页 | `/open-source` 完成 |
| D7 | About 页 | `/about` 完成 |
| D8 | Contact 页 + Contact Form UI | 表单 UI 完成 |
| D9 | `/api/contact` + 邮件发送 + Zod 校验 | 表单后端完成 |
| D10 | `/api/github-stats` + 缓存 + fallback | GitHub 数据实时 |
| D11 | 中英文案完整填充 + 审校 | i18n 完成 |
| D12 | SEO metadata + sitemap + OG 图 | SEO 完成 |
| D13 | 响应式打磨 + 浏览器兼容 + Lighthouse 优化 | 性能 ≥ 90 |
| D14 | 部署到 Vercel + 域名配置 + 预览 URL 交付 | MVP 上线 |

**关键依赖（需用户提供的素材 —— 缺失不阻塞但会用占位）**：
- 公司 logo 文件（SVG 优先）
- 品牌主色 hex
- 客户 logo + 授权（若要放 Trust Bar）
- ICP 备案号（上线时）
- 法律条款内容（可后加）

### 8.3 风险与应对

| 风险 | 应对 |
|---|---|
| 用户没及时提供 logo / 主色 | 用占位色开发，品牌色通过 CSS variable 一处替换 |
| GitHub API 限额 | 加 GITHUB_TOKEN 环境变量；cache 1h；API 失败 fallback 到硬编码数字 |
| ICP 备案流程长 | 先在 Vercel 预览 URL 交付；备案通过后切到国内域名 |
| 产品截图质量不统一 | 用 Headless Chrome 批量截屏主官网；或用产品 logo + 简洁卡片设计少依赖截图 |
| 中英文案质量 | Claude 起草 → 用户 native review；重要文案（Hero、Why Us）用户自己定稿 |

---

## 9. 交付清单

MVP 上线时交付：

- [ ] Git 仓库（含完整代码 + docs）
- [ ] Vercel 预览 URL
- [ ] `.env.example` 和部署所需环境变量清单
- [ ] 简短的 README（怎么本地运行、怎么改内容、怎么改品牌色）
- [ ] 本设计文档
- [ ] 实现计划（由 writing-plans skill 产出）

---

## 附录 A：待用户提供的资产清单

为方便用户陆续提供，列出所有需要他本人给的东西：

- [ ] 公司 logo 文件（SVG / PNG 高清）
- [ ] 品牌主色 hex 值
- [ ] （可选）辅助色、字体指定
- [ ] 英文公司名（如果有官方英文名，不是音译"Hitosea"）
- [ ] ICP 备案号（备案通过后）
- [ ] 电子营业执照（footer 展示）
- [ ] 办公地点详细地址
- [ ] 商务/联系/加入我们邮箱地址
- [ ] 400 电话（如有）
- [ ] 微信二维码图片（商务对接用）
- [ ] 客户 logo 素材 + 授权书（如要放 Trust Bar）
- [ ] Resend 或邮件服务 API Key（上线时）
- [ ] GitHub Token（可选，提升 API 限额）

这些东西**缺失不阻塞开发**，会用占位处理，上线前一次性替换。

---

## 附录 B：参考站点

上线前和迭代时可参考的视觉/结构标杆：

- [linear.app](https://linear.app) — 深色、克制、文案极好
- [supabase.com](https://supabase.com) — 开源技术公司官网的范式
- [vercel.com](https://vercel.com) — 产品矩阵呈现
- [posthog.com](https://posthog.com) — 开源公司 + 幽默 + 数据驱动
- [gitlab.com](https://about.gitlab.com) — 企业级开源公司
- [pingcap.com](https://www.pingcap.com) — 中国开源公司的标杆
- [1panel.cn](https://1panel.cn) — 飞致云的中国风开源官网（中文区参考）

---

**文档版本**：v1.0
**下一步**：进入 writing-plans 阶段，产出按天可执行的实现计划。
