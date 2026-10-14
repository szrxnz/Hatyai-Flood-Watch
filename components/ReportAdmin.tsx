'use client'
import { useCallback, useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import type { AdminReport } from '@/lib/reports'

function ago(at: number) {
  const m = Math.max(1, Math.round((Date.now() - at) / 60000))
  return m < 60 ? `${m} นาทีที่แล้ว` : `${Math.round(m / 60)} ชม.ที่แล้ว`
}

export default function ReportAdmin() {
  const [list, setList] = useState<AdminReport[] | null>(null)
  const load = useCallback(async () => {
    const r = await fetch('/api/report?all=1', { cache: 'no-store' })
    setList(r.ok ? await r.json() : [])
  }, [])
  useEffect(() => { load() }, [load])
  const del = async (id: string) => {
    if (!confirm('ลบรายงานและรูปนี้ถาวร?')) return
    await fetch(`/api/report?id=${id}`, { method: 'DELETE' })
    load()
  }
  if (!list) return <div className="card">กำลังโหลด</div>
  if (!list.length) return <p className="muted">ยังไม่มีรายงานจากประชาชน</p>
  return (
    <div className="rfgrid">
      {list.map((r) => (
        <article key={r.id} className={`card rfc${r.flags > 0 ? ' flagged' : ''}`}>
          <img src={`/api/report?id=${r.id}`} alt="" loading="lazy" />
          <div className="row"><small className="muted"><Ic n="clock" />{ago(r.at)}</small>
            <a className="link" href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noopener noreferrer"><Ic n="pin" />แผนที่</a></div>
          {r.note && <p>{r.note}</p>}
          <small className="muted">ถูกแจ้งเท็จ {r.flags} · ยืนยัน {r.ok}{r.hidden && ' · ซ่อนจากสาธารณะแล้ว'}</small>
          <button className="ghost" onClick={() => del(r.id)}><Ic n="close" />ลบรายงาน</button>
        </article>
      ))}
    </div>
  )
}
