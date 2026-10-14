'use client'
import { useCallback, useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import type { Shelter } from '@/lib/shelters'

const ST: [string, string][] = [['open', 'เปิดรับ'], ['full', 'เต็ม'], ['closed', 'ปิด']]
async function toJpeg(f: File): Promise<Blob | null> {
  const url = URL.createObjectURL(f)
  try {
    const img = await new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url })
    for (const side of [1280, 1024, 800]) {
      const k = Math.min(1, side / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      for (const q of [0.82, 0.7, 0.55]) {
        const b = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', q))
        if (b && b.size <= 440_000) return b
      }
    }
    return null
  } catch { return null } finally { URL.revokeObjectURL(url) }
}

const EMPTY = { id: '', name: '', amphoe: '', address: '', coords: '', capacity: '', phone: '', status: 'open' }

function parseCoords(s: string): [number, number] | null {
  const m = s.match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/)
  return m ? [Number(m[1]), Number(m[2])] : null
}

export default function ShelterAdmin({ amphoes }: { amphoes: string[] }) {
  const [list, setList] = useState<Shelter[]>([])
  const [f, setF] = useState(EMPTY)
  const [msg, setMsg] = useState('')
  const [up, setUp] = useState('')
  const [staged, setStaged] = useState<{ blob: Blob; url: string }[]>([])
  const load = useCallback(async () => {
    const r = await fetch('/api/shelters', { cache: 'no-store' })
    if (r.ok) setList(await r.json())
  }, [])
  useEffect(() => { load() }, [load])

  const save = async (s: Omit<Shelter, 'id' | 'photos'> & { id?: string }) => {
    const r = await fetch('/api/shelters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
    const j: Shelter | null = r.ok ? await r.json() : null
    if (j) load()
    return j
  }
  const upload = async (id: string, b: Blob) => {
    const fd = new FormData(); fd.append('photo', b, 'shelter.jpg'); fd.append('shelter', id)
    return fetch('/api/shelters/photo', { method: 'POST', body: fd })
  }
  const cur = f.id ? list.find((x) => x.id === f.id) : undefined
  const room = 6 - (cur?.photos.length ?? 0) - staged.length
  const stage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, Math.max(0, room)); e.target.value = ''
    const out: { blob: Blob; url: string }[] = []
    for (const file of files) { const b = await toJpeg(file); if (b) out.push({ blob: b, url: URL.createObjectURL(b) }); else setMsg('อ่านหรือย่อรูปบางรูปไม่ได้ ลองรูปอื่น') }
    setStaged((x) => [...x, ...out])
  }
  const unstage = (i: number) => setStaged((x) => { URL.revokeObjectURL(x[i].url); return x.filter((_, k) => k !== i) })
  const clearStaged = () => { staged.forEach((x) => URL.revokeObjectURL(x.url)); setStaged([]) }
  const submit = async () => {
    const c = f.coords.trim() ? parseCoords(f.coords) : null
    if (f.coords.trim() && !c) { setMsg('พิกัดไม่ถูกต้อง ตัวอย่าง 7.0086, 100.4747'); return }
    setUp('form'); setMsg('')
    const saved = await save({
      id: f.id || undefined, name: f.name, amphoe: f.amphoe, address: f.address,
      lat: c ? c[0] : null, lng: c ? c[1] : null,
      capacity: f.capacity ? Number(f.capacity) : null, status: f.status as Shelter['status'], phone: f.phone.replace(/[^\d+]/g, ''),
    })
    if (!saved) { setUp(''); setMsg('บันทึกไม่ได้ ตรวจว่าพิกัดอยู่ในจังหวัดสงขลา'); return }
    let fail = 0
    for (const x of staged) { const r = await upload(saved.id, x.blob).catch(() => null); if (!r || !r.ok) fail++ }
    clearStaged(); setUp(''); setF(EMPTY); load()
    setMsg(fail ? `บันทึกแล้ว แต่อัปโหลดรูปไม่สำเร็จ ${fail} รูป กด "เพิ่มรูป" ที่การ์ดจุดพักพิงเพื่อลองใหม่` : 'บันทึกแล้ว')
  }
  const edit = (s: Shelter) => setF({ id: s.id, name: s.name, amphoe: s.amphoe, address: s.address, coords: s.lat != null ? `${s.lat}, ${s.lng}` : '', capacity: s.capacity != null ? String(s.capacity) : '', phone: s.phone, status: s.status })
  const del = async (id: string) => { if (confirm('ลบจุดพักพิงนี้?')) { await fetch(`/api/shelters?id=${id}`, { method: 'DELETE' }); load() } }
  const addPhotos = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); e.target.value = ''
    if (!files.length) return
    setUp(id); setMsg('')
    for (const f of files) {
      const b = await toJpeg(f)
      if (!b) { setMsg('อ่านหรือย่อรูปไม่ได้ ลองรูปอื่น'); continue }
      const r = await upload(id, b)
      if (r.status === 409) { setMsg('ครบ 6 รูปแล้ว ลบรูปเก่าก่อน'); break }
      if (!r.ok) { setMsg('อัปโหลดไม่สำเร็จ'); break }
    }
    setUp(''); load()
  }
  const delPhoto = async (sid: string, pid: string) => {
    if (!confirm('ลบรูปนี้?')) return
    await fetch(`/api/shelters/photo?shelter=${sid}&id=${pid}`, { method: 'DELETE' }); load()
  }
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })

  return (
    <>
      <div className="card alset">
        <h4>{f.id ? 'แก้ไขจุดพักพิง' : 'เพิ่มจุดพักพิง'}</h4>
        <input className="rpnote" maxLength={120} placeholder="ชื่อสถานที่" value={f.name} onChange={set('name')} />
        <select className="rpnote" value={f.amphoe} onChange={set('amphoe')}>
          <option value="">เลือกอำเภอ</option>
          {amphoes.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input className="rpnote" maxLength={200} placeholder="ที่อยู่" value={f.address} onChange={set('address')} />
        <input className="rpnote" placeholder="พิกัด วางจาก Google Maps เช่น 7.0086, 100.4747" value={f.coords} onChange={set('coords')} />
        <input className="rpnote" inputMode="numeric" placeholder="รองรับได้ (คน)" value={f.capacity} onChange={set('capacity')} />
        <input className="rpnote" inputMode="tel" placeholder="เบอร์โทร" value={f.phone} onChange={set('phone')} />
        <div className="chips">{ST.map(([k, n]) => <button key={k} className={f.status === k ? 'on' : ''} onClick={() => setF({ ...f, status: k })}>{n}</button>)}</div>
        <h4>รูปสถานที่ (สูงสุด 6 รูป ช่วยให้ผู้ประสบภัยหาจุดเจอ)</h4>
        {(cur?.photos.length || staged.length) ? (
          <div className="adphotos">
            {cur?.photos.map((p) => (
              <div key={p} className="adph">
                <img src={`/api/shelters/photo?id=${p}`} alt="" loading="lazy" />
                <button className="iconbtn" onClick={() => delPhoto(cur.id, p)} aria-label="ลบรูป"><Ic n="close" /></button>
              </div>
            ))}
            {staged.map((x, i) => (
              <div key={x.url} className="adph">
                <img src={x.url} alt="" />
                <button className="iconbtn" onClick={() => unstage(i)} aria-label="เอารูปออก"><Ic n="close" /></button>
              </div>
            ))}
          </div>
        ) : null}
        <label className="ghost" style={{ marginTop: 6, opacity: room <= 0 ? 0.4 : 1 }}>
          <Ic n="camera" />เลือกรูป ({6 - room}/6)
          <input type="file" accept="image/*" multiple hidden disabled={room <= 0} onChange={stage} />
        </label>
        {msg && <p className="muted">{msg}</p>}
        <button className="rpgo" onClick={submit} disabled={!f.name.trim() || up === 'form'}>{up === 'form' ? 'กำลังบันทึก' : f.id ? 'บันทึกการแก้ไข' : 'เพิ่มจุดพักพิง'}</button>
        {f.id && <button className="ghost" onClick={() => { clearStaged(); setF(EMPTY) }}>ยกเลิกการแก้ไข</button>}
      </div>
      <h2>จุดพักพิงทั้งหมด</h2>
      {list.length === 0 && <p className="muted">ยังไม่มีจุดพักพิง</p>}
      {list.map((s) => (
        <div key={s.id} className="card">
          <div className="row"><b>{s.name}</b><button className="iconbtn" onClick={() => del(s.id)} aria-label="ลบ"><Ic n="close" /></button></div>
          <small className="muted">{[s.amphoe, s.address].filter(Boolean).join(' · ')}{s.capacity != null && ` · ${s.capacity} คน`}{s.lat == null && ' · ไม่มีพิกัด'}</small>
          {s.photos.length > 0 && (
            <div className="adphotos">
              {s.photos.map((p) => (
                <div key={p} className="adph">
                  <img src={`/api/shelters/photo?id=${p}`} alt="" loading="lazy" />
                  <button className="iconbtn" onClick={() => delPhoto(s.id, p)} aria-label="ลบรูป"><Ic n="close" /></button>
                </div>
              ))}
            </div>
          )}
          <label className="ghost" style={{ marginBottom: 8 }}>
            <Ic n="camera" />{up === s.id ? 'กำลังอัปโหลด' : `เพิ่มรูป (${s.photos.length}/6)`}
            <input type="file" accept="image/*" multiple hidden disabled={up === s.id || s.photos.length >= 6} onChange={(e) => addPhotos(s.id, e)} />
          </label>
          <div className="chips">
            {ST.map(([k, n]) => <button key={k} className={s.status === k ? 'on' : ''} onClick={() => save({ ...s, status: k as Shelter['status'] })}>{n}</button>)}
            <button onClick={() => edit(s)}>แก้ไข</button>
          </div>
        </div>
      ))}
    </>
  )
}
