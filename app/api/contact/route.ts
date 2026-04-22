import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'
import { sendContactEmail, sendFeishuNotification } from '@/lib/mail'

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

  const mailResult = await sendContactEmail(parsed.data, {
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.CONTACT_EMAIL_FROM ?? 'noreply@hitosea.com',
    to: process.env.CONTACT_EMAIL_TO ?? 'contact@hitosea.com',
  })

  if (!mailResult.ok) {
    return NextResponse.json({ ok: false, error: 'mailer failed' }, { status: 500 })
  }

  // Fire and forget
  void sendFeishuNotification(process.env.FEISHU_WEBHOOK_URL ?? '', parsed.data)

  return NextResponse.json({ ok: true })
}
