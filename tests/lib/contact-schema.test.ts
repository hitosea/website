import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/contact-schema'

describe('contactSchema', () => {
  const valid = {
    name: 'Alice',
    company: 'Acme',
    email: 'alice@acme.com',
    phone: '',
    productSlugs: ['dootask'],
    message: 'We want to evaluate DooTask for 200 engineers.',
  }

  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing name', () => {
    const r = contactSchema.safeParse({ ...valid, name: '' })
    expect(r.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(r.success).toBe(false)
  })

  it('rejects missing company', () => {
    const r = contactSchema.safeParse({ ...valid, company: '' })
    expect(r.success).toBe(false)
  })

  it('rejects message shorter than 10 chars', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'short' })
    expect(r.success).toBe(false)
  })

  it('accepts empty optional phone', () => {
    expect(contactSchema.safeParse({ ...valid, phone: '' }).success).toBe(true)
  })

  it('accepts empty productSlugs array', () => {
    expect(contactSchema.safeParse({ ...valid, productSlugs: [] }).success).toBe(true)
  })
})
