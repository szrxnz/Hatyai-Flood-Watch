import { notFound } from 'next/navigation'
import AdminPanel from '@/components/AdminPanel'
import { getStationViews } from '@/lib/data'
import { isLang } from '@/lib/i18n'

export const metadata = { robots: { index: false, follow: false } }

export default async function Admin({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const amphoes = [...new Set((await getStationViews('th')).map((s) => s.amphoe).filter((a) => a && a !== '-'))].sort()
  return (
    <main className="wrap page">
      <h1>เจ้าหน้าที่ / แอดมิน</h1>
      <AdminPanel amphoes={amphoes} />
    </main>
  )
}
