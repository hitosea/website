import { NextResponse } from 'next/server'

// /api/health → 健康检查,返回 200,零依赖、零外部 I/O
// 走 api 路径,被 middleware matcher 排除,不经过 i18n 中间件
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ status: 'ok' })
}
