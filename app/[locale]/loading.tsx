'use client'
import { usePathname } from 'next/navigation'
import Loader from '@/components/Loader'

const TXT: Record<string, string> = { th: 'กำลังโหลด…', en: 'Loading…', zh: '加载中…' }
export default function Loading() {
  const l = (usePathname() ?? '').split('/')[1]
  return <div className="wrap page loadpage"><Loader text={TXT[l] ?? TXT.th} size={64} /></div>
}
