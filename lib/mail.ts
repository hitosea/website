import { Resend } from 'resend'
import type { ContactSubmission } from './contact-schema'

export interface MailerConfig {
  resendApiKey: string
  from: string
  to: string
}

export async function sendContactEmail(
  submission: ContactSubmission,
  config: MailerConfig,
): Promise<{ ok: boolean; error?: string }> {
  if (!config.resendApiKey) {
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }
  const resend = new Resend(config.resendApiKey)
  const subject = `[官网线索] ${submission.company} – ${submission.name}`
  const html = renderEmail(submission)

  try {
    const { error } = await resend.emails.send({
      from: config.from,
      to: [config.to],
      subject,
      replyTo: submission.email,
      html,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return { ok: false, error: msg }
  }
}

function renderEmail(s: ContactSubmission): string {
  const fields = [
    ['Name / 姓名', s.name],
    ['Company / 公司', s.company],
    ['Email', s.email],
    ['Phone / 电话', s.phone || '-'],
    ['Products / 产品', s.productSlugs.length ? s.productSlugs.join(', ') : '-'],
    ['Message / 需求', s.message],
  ] as const

  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="margin:0 0 16px">新官网预约演示线索</h2>
    <table style="width:100%;border-collapse:collapse">
      ${fields
        .map(
          ([k, v]) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#666;vertical-align:top;width:160px">${escapeHtml(k)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v as string)}</td>
      </tr>`,
        )
        .join('')}
    </table>
  </body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendFeishuNotification(
  webhookUrl: string,
  submission: ContactSubmission,
): Promise<void> {
  if (!webhookUrl) return
  const text = `🚀 新官网线索\n公司: ${submission.company}\n联系人: ${submission.name}\n邮箱: ${submission.email}\n产品: ${submission.productSlugs.join(', ') || '-'}\n需求: ${submission.message.slice(0, 200)}`
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text } }),
    })
  } catch {
    // best-effort; don't block on Feishu failure
  }
}
