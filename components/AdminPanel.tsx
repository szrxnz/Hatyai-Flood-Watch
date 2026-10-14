'use client'
import { useCallback, useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import ReportAdmin from '@/components/ReportAdmin'
import ShelterAdmin from '@/components/ShelterAdmin'
import type { Notice } from '@/lib/store'

const KINDS: [string, string][] = [['rain', 'ฝนตกหนักต่อเนื่อง'], ['flood', 'น้ำท่วม'], ['evac', 'อพยพ'], ['info', 'ทั่วไป']]
const LEVELS: [string, string][] = [['info', 'ข้อมูล'], ['watch', 'เฝ้าระวัง'], ['high', 'เสี่ยงสูง'], ['critical', 'วิกฤต']]
const PRESET = { kind: 'rain', level: 'high', title: 'เตือนฝนตกหนักต่อเนื่อง', body: 'คาดว่ามีฝนตกหนักต่อเนื่องในพื้นที่ ขอให้ประชาชนเฝ้าระวังน้ำป่าไหลหลากและน้ำท่วมฉับพลัน เตรียมยกของขึ้นที่สูง และติดตามประกาศอย่างใกล้ชิด', hours: 24 }

export default function AdminPanel({ amphoes }: { amphoes: string[] }) {
  const [state, setState] = useState<'load' | 'out' | 'in' | 'nocfg'>('load')
  const [pw, setPw] = useState('')
  const [list, setList] = useState<Notice[]>([])
  const [f, setF] = useState({ ...PRESET, kind: 'info', level: 'watch', title: '', body: '', hours: 12 })
  const [areas, setAreas] = useState<string[]>([])
  const [push, setPush] = useState(true)
  const [pushInfo, setPushInfo] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/notices?all=1', { cache: 'no-store' })
    if (r.ok) setList(await r.json())
  }, [])
  useEffect(() => {
    fetch('/api/admin/login').then((r) => r.json()).then((j) => { setState(!j.configured ? 'nocfg' : j.ok ? 'in' : 'out'); if (j.ok) load() }).catch(() => setState('out'))
  }, [load])

  const login = async () => {
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    setPw('')
    if (r.ok) { setState('in'); setMsg(''); load() } else setMsg(r.status === 429 ? 'ลองบ่อยเกินไป รอสักครู่' : 'รหัสผ่านไม่ถูกต้อง')
  }
  const logout = async () => { await fetch('/api/admin/login', { method: 'DELETE' }); setState('out') }
  const post = async () => {
    setMsg('')
    const r = await fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, areas, push }) })
    if (r.ok) { const j = await r.json().catch(() => null); setPushInfo(j?.push ? `ส่ง push ถึง ${j.push.ok}/${j.push.targets} เครื่อง` : push ? 'ยังไม่ได้ตั้งค่า VAPID จึงไม่ได้ส่ง push' : ''); setMsg('ประกาศแล้ว'); setF({ ...f, title: '', body: '' }); load() } else setMsg(r.status === 500 ? 'บันทึกไม่ได้ ตรวจการตั้งค่าที่เก็บข้อมูล (README)' : 'ข้อมูลไม่ครบ')
  }
  const del = async (id: string) => { await fetch(`/api/notices?id=${id}`, { method: 'DELETE' }); load() }
  const pick = (a: string) => setAreas(areas.includes(a) ? areas.filter((x) => x !== a) : [...areas, a])

  if (state === 'load') return <div className="card">กำลังโหลด</div>
  if (state === 'nocfg') return <div className="card"><p className="muted">ยังไม่ได้ตั้งค่า ADMIN_PASSWORD ในไฟล์ .env.local</p></div>
  if (state === 'out') return (
    <div className="login">
      <div className="loginic"><Ic n="shield" /></div>
      <h2>เข้าสู่ระบบเจ้าหน้าที่</h2>
      <p className="muted">สำหรับประกาศแจ้งเตือนและจัดการจุดพักพิง</p>
      <input className="loginin" type="password" placeholder="รหัสผ่าน" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} autoComplete="current-password" autoFocus />
      {msg && <p className="loginerr" role="alert">{msg}</p>}
      <button className="rpgo" onClick={login} disabled={!pw}>เข้าสู่ระบบ</button>
    </div>
  )
  return (
    <>
      <div className="card alset">
        <div className="row"><h4>สร้างประกาศ</h4><button className="ghost" onClick={logout}>ออกจากระบบ</button></div>
        <button className="ghost" onClick={() => setF({ ...PRESET })}><Ic n="rain" />ใช้แบบฝนตกหนักต่อเนื่อง</button>
        <h4>ประเภท</h4>
        <div className="chips">{KINDS.map(([k, n]) => <button key={k} className={f.kind === k ? 'on' : ''} onClick={() => setF({ ...f, kind: k })}>{n}</button>)}</div>
        <h4>ระดับ</h4>
        <div className="chips">{LEVELS.map(([k, n]) => <button key={k} className={f.level === k ? 'on' : ''} onClick={() => setF({ ...f, level: k })}>{n}</button>)}</div>
        <input className="rpnote" maxLength={120} placeholder="หัวข้อ" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <textarea className="rpnote" maxLength={1000} placeholder="รายละเอียด" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        <h4>พื้นที่ (ไม่เลือก = ทั้งจังหวัด)</h4>
        <div className="chips">{amphoes.map((a) => <button key={a} className={areas.includes(a) ? 'on' : ''} onClick={() => pick(a)}>{a}</button>)}</div>
        <h4>แสดงนาน (ชั่วโมง)</h4>
        <div className="chips">{[6, 12, 24, 48, 72].map((h) => <button key={h} className={f.hours === h ? 'on' : ''} onClick={() => setF({ ...f, hours: h })}>{h}</button>)}</div>
        {msg && <p className="muted">{msg}</p>}
        <label className="chk"><input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} /> ส่งแจ้งเตือน push ถึงผู้ที่สมัครไว้ทันที (ตามพื้นที่ที่เลือก)</label>
        {pushInfo && <p className="muted">{pushInfo}</p>}
        <button className="rpgo" onClick={post} disabled={!f.title.trim()}>เผยแพร่ประกาศ</button>
      </div>
      <h2>ประกาศทั้งหมด</h2>
      {list.length === 0 && <p className="muted">ยังไม่มีประกาศ</p>}
      {list.map((n) => (
        <div key={n.id} className={`card ntc lv-${n.level}`}>
          <div className="row"><b>{n.title}</b><button className="iconbtn" onClick={() => del(n.id)} aria-label="ลบ"><Ic n="close" /></button></div>
          <small className="muted">{n.until < Date.now() ? 'หมดอายุแล้ว · ' : ''}{new Date(n.at).toLocaleString('th-TH')} · {n.areas.length ? n.areas.join(', ') : 'ทั้งจังหวัด'}</small>
        </div>
      ))}
      <h1>รายงานจากประชาชน</h1>
      <p className="muted">เรียงตามจำนวนที่ถูกแจ้งว่าเป็นข้อมูลเท็จ ลบได้ทันที</p>
      <ReportAdmin />
      <h1>จุดพักพิง</h1>
      <ShelterAdmin amphoes={amphoes} />
    </>
  )
}
