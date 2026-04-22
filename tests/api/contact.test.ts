import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 on invalid payload', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 when mailer reports ok', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test')
    vi.stubEnv('CONTACT_EMAIL_FROM', 'from@x.com')
    vi.stubEnv('CONTACT_EMAIL_TO', 'to@x.com')

    const mockSend = vi.fn().mockResolvedValue({ ok: true })
    vi.doMock('@/lib/mail', () => ({
      sendContactEmail: mockSend,
      sendFeishuNotification: vi.fn().mockResolvedValue(undefined),
    }))
    vi.resetModules()
    const { POST } = await import('@/app/api/contact/route')

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        company: 'Acme',
        email: 'a@acme.com',
        phone: '',
        productSlugs: [],
        message: 'We need DooTask for 100 people.',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('returns 500 when mailer reports failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test')
    vi.stubEnv('CONTACT_EMAIL_FROM', 'from@x.com')
    vi.stubEnv('CONTACT_EMAIL_TO', 'to@x.com')

    vi.doMock('@/lib/mail', () => ({
      sendContactEmail: vi.fn().mockResolvedValue({ ok: false, error: 'upstream error' }),
      sendFeishuNotification: vi.fn().mockResolvedValue(undefined),
    }))
    vi.resetModules()
    const { POST } = await import('@/app/api/contact/route')

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        company: 'Acme',
        email: 'a@acme.com',
        phone: '',
        productSlugs: [],
        message: 'A long enough message to pass validation.',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })
})
