import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'
import { sendContactNotification } from '@/lib/mail'

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid payload', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const result = await sendContactNotification(parsed.data)

  if (!result.ok) {
    console.error('[contact] notification failed:', result.error)
    return NextResponse.json(
      { ok: false, error: result.error ?? 'notification failed' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
