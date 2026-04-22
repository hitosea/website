import type { ContactSubmission } from './contact-schema'

export async function sendContactNotification(
  submission: ContactSubmission,
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.DOOTASK_BOT_TOKEN
  const dialogId = process.env.DOOTASK_DIALOG_ID

  if (!token || !dialogId) {
    return { ok: false, error: 'DOOTASK_BOT_TOKEN or DOOTASK_DIALOG_ID not configured' }
  }

  const text = formatMessage(submission)

  try {
    const res = await fetch('https://task.dootask.com/api/dialog/msg/sendtext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        version: '1.7.14',
        token,
      },
      body: JSON.stringify({
        dialog_id: dialogId,
        text,
        text_type: 'md',
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      return { ok: false, error: `DooTask API ${res.status}: ${body.slice(0, 200)}` }
    }

    const data = await res.json()
    if (data.ret !== 1) {
      return { ok: false, error: data.msg || 'DooTask API returned error' }
    }

    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return { ok: false, error: msg }
  }
}

function formatMessage(s: ContactSubmission): string {
  const products = s.productSlugs.length ? s.productSlugs.join(', ') : '-'
  return [
    `## 🚀 新官网预约演示线索`,
    ``,
    `| 字段 | 内容 |`,
    `| --- | --- |`,
    `| **姓名** | ${s.name} |`,
    `| **公司** | ${s.company} |`,
    `| **邮箱** | ${s.email} |`,
    `| **电话** | ${s.phone || '-'} |`,
    `| **感兴趣的产品** | ${products} |`,
    ``,
    `### 需求说明`,
    ``,
    s.message,
  ].join('\n')
}
