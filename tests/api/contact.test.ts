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

  it('returns 200 when DooTask bot reports ok', async () => {
    vi.stubEnv('DOOTASK_BOT_TOKEN', 'test-token')
    vi.stubEnv('DOOTASK_DIALOG_ID', '123')

    const mockSend = vi.fn().mockResolvedValue({ ok: true })
    vi.doMock('@/lib/mail', () => ({
      sendContactNotification: mockSend,
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

  it('returns 500 when DooTask bot reports failure', async () => {
    vi.stubEnv('DOOTASK_BOT_TOKEN', 'test-token')
    vi.stubEnv('DOOTASK_DIALOG_ID', '123')

    vi.doMock('@/lib/mail', () => ({
      sendContactNotification: vi.fn().mockResolvedValue({ ok: false, error: 'upstream error' }),
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
