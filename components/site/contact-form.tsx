'use client'

import { useState, useTransition } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { z } from 'zod'
import { contactSchema } from '@/lib/contact-schema'
import { products } from '@/content/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

type ContactFormValues = z.input<typeof contactSchema>

export function ContactForm() {
  const t = useTranslations('contact.form')
  const locale = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormValues>({
    // Cast needed because @hookform/resolvers@5 predates zod@4.3 internals; runtime behavior is unaffected.
    resolver: zodResolver(
      contactSchema as unknown as Parameters<typeof zodResolver>[0],
    ) as unknown as Resolver<ContactFormValues>,
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      productSlugs: [],
      message: '',
    },
  })

  const selected = watch('productSlugs') ?? []

  const onSubmit = (data: ContactFormValues) => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('submit failed')
        setSubmitted(true)
        reset()
        toast.success(t('success'))
      } catch {
        toast.error(t('errorGeneric'))
      }
    })
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <p className="text-lg font-semibold">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="demo-form">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('name')} error={errors.name?.message}>
          <Input {...register('name')} placeholder={t('namePlaceholder')} />
        </Field>
        <Field label={t('company')} error={errors.company?.message}>
          <Input {...register('company')} placeholder={t('companyPlaceholder')} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('email')} error={errors.email?.message}>
          <Input type="email" {...register('email')} placeholder={t('emailPlaceholder')} />
        </Field>
        <Field label={t('phone')} error={errors.phone?.message}>
          <Input {...register('phone')} placeholder={t('phonePlaceholder')} />
        </Field>
      </div>

      <Field label={t('products')}>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {products
            .filter((p) => p.featured)
            .map((p) => {
              const checked = selected.includes(p.slug)
              return (
                <label key={p.slug} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(state) => {
                      const nextSelected = state
                        ? [...selected, p.slug]
                        : selected.filter((s) => s !== p.slug)
                      setValue('productSlugs', nextSelected, { shouldValidate: true })
                    }}
                  />
                  <span>{locale === 'zh' ? p.nameZh : p.name}</span>
                </label>
              )
            })}
        </div>
      </Field>

      <Field label={t('message')} error={errors.message?.message}>
        <Textarea rows={5} {...register('message')} placeholder={t('messagePlaceholder')} />
      </Field>

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
