import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('common')
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Hitosea</h1>
      <p className="mt-4">{t('bookDemo')}</p>
    </main>
  )
}
