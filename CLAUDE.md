# Hitosea 官网 (hitosea.com)

广西海豚有海信息科技有限公司官网。Developer-first 开源产品公司品牌站。

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS 3.4 + shadcn/ui (new-york style, `--radius: 0px`)
- next-intl: 中英双语，locale 在 URL path (`/zh/`, `/en/`)
- next-themes: 深色模式为默认
- Fraunces (可变衬线, opsz/SOFT 轴) + Inter + JetBrains Mono

## 设计风格：杂志编排 (Editorial / Magazine)

整站采用杂志编排设计语言，**不是**典型 SaaS 深色风格。新增页面/组件必须遵循：

### 核心视觉元素
- **Section ID**: `§ 01`, `§ 02` 等编号标记区块
- **Dropcap**: 首段首字母放大 (`dropcap` class)
- **衬线标题**: 所有标题使用 Fraunces (`font-serif`)，带 `fontVariationSettings`
- **等宽标签**: 小号信息用 JetBrains Mono (`font-mono`, `text-[11px]`, `tracking-widest`)
- **方角**: 全局 `--radius: 0px`，没有圆角
- **分隔线**: 使用 `border-rule` 而非普通 border

### CSS 调色板 (globals.css)
| 变量 | 色值 | 用途 |
|------|------|------|
| `--ember` | `#E56A3F` | 主强调色、CTA |
| `--ochre` | `#E2B04A` | 次强调色、标签 |
| `--teal` | `#7AB9A8` | 垂直 AI 组强调 |
| `--plum` | `#6B4E71` | AI 开发组强调 |
| `--rule` | 浅灰/深灰 | 分隔线、边框 |
| `--mute` | `#706A5F` | 辅助文字 |

### 组件类名
- `.btn-editorial` / `.btn-editorial-primary` / `.btn-editorial-ghost`: 按钮
- `.section-label`: 区块标签 (如 `§ 01 · Title`)
- `.text-ember`, `.text-ochre`, `.text-mute`: 颜色工具类
- `.border-rule`: 编排风格分隔线

### 排版规则
- 中文标题比英文标题小一号 (通过 `useLocale()` / `getLocale()` 判断)
- 行距通过 inline style 设置 (避免 Tailwind 优先级冲突)
- 产品矩阵三组配色: collaboration=ember, ai-dev=plum, vertical-ai=teal

## 项目结构

```
app/[locale]/           # 页面路由 (zh/en)
app/api/contact/        # 联系表单 API
components/ui/          # shadcn 基础组件
components/site/        # 页面组件
content/products.ts     # 产品数据 (SSOT)
content/company.ts      # 公司时间线
i18n/messages/{zh,en}.json  # 翻译文案
lib/constants.ts        # 站点常量 (邮箱、ICP、电话)
lib/editorial-date.ts   # 期刊号/版本号自动生成
lib/github.ts           # GitHub API (stars 获取)
lib/mail.ts             # DooTask Bot API (联系表单通知)
```

## 添加新页面

1. 创建 `app/[locale]/新页面/page.tsx`
2. 在 `i18n/messages/zh.json` 和 `en.json` 添加对应翻译 key
3. 在 `components/site/site-header.tsx` 和 `site-footer.tsx` 添加导航链接
4. 遵循杂志编排风格：section-label 开头、font-serif 标题、border-rule 分隔

## 添加新产品

修改 `content/products.ts`，所有页面自动更新 (产品矩阵、索引卡、footer)。

## 国际化

所有用户可见文案在 `i18n/messages/` 中，两个语言文件的 key 必须完全一致。时间相关的显示（期刊号、版本号、统计时间戳）已自动化，不在 i18n 文件中。

## 联系表单

通过 DooTask Bot API 发送通知，不是邮件服务。环境变量：`DOOTASK_BOT_TOKEN`、`DOOTASK_DIALOG_ID`。

## 发版

改 `package.json` 的 `version` → commit → push。CI 自动构建 Docker 镜像到 `ghcr.io/hitosea/website`。
