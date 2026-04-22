import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100),
  company: z.string().min(1, { message: 'Company is required' }).max(200),
  email: z.string().email({ message: 'Valid email required' }).max(200),
  phone: z.string().max(50).optional().default(''),
  productSlugs: z.array(z.string()).default([]),
  message: z
    .string()
    .min(10, { message: 'Please share at least 10 characters about your needs' })
    .max(5000),
})

export type ContactSubmission = z.infer<typeof contactSchema>
