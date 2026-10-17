'use client'
import { useEffect, useRef, useState } from 'react'
import { Ic } from '@/components/Icons'
import BlurEditor from '@/components/BlurEditor'

type T = Record<string, string>

async function shrink(f: File): Promise<HTMLCanvasElement | null> {
  const url = URL.createObjectURL(f)
  try {
    const img = await new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url })
    const k = Math.min(1, 1024 / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
    return c
  } catch { return null } finally { URL.revokeObjectURL(url) }
}

export default function ReportFlood({ t }: { t: T }) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState(false)
  const [img, setImg] = useState<Blob | null>(null)
  const [base, setBase] = useState<HTMLCanvasElement | null>(null)
  const [prev, setPrev] = useState('')
  const [note, setNote] = useState('')
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const fi = useRef<HTMLInputElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const [cam, setCam] = useState(false)

  const stopCam = () => { stream.current?.getTracks().forEach((x) => x.stop()); stream.current = null; setCam(false) }
  const close = () => { stopCam(); setOpen(false); setMsg(''); setImg(null); setBase(null); setPrev(''); setNote(''); setPos(null); setOk(false) }
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  useEffect(() => {
    if (cam && vid.current && stream.current) { vid.current.srcObject = stream.current; vid.current.play().catch(() => {}) }
  }, [cam])
  useEffect(() => () => { stream.current?.getTracks().forEach((x) => x.stop()) }, [])

  const openCam = async () => {
    setMsg('')
    if (!navigator.mediaDevices?.getUserMedia) { fi.current?.click(); return }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      setCam(true)
    } catch { setMsg(t.camDenied) }
  }

  const snap = () => {
    const v = vid.current
    if (!v || !v.videoWidth) return
    const k = Math.min(1, 1024 / Math.max(v.videoWidth, v.videoHeight))
    const c = document.createElement('canvas')
    c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k)
    c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height)
    stopCam(); setBase(c); setMsg('')
  }

  const discard = () => { if (prev) URL.revokeObjectURL(prev); setBase(null); setImg(null); setPrev(''); setNote(''); setPos(null); setMsg('') }
  const retake = () => { discard(); openCam() }

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    const c = await shrink(f)
    if (!c) { setMsg(t.rpFail); return }
    setBase(c); setMsg('')
  }

  const confirm = (b: Blob) => {
    setBase(null); setImg(b); setPrev(URL.createObjectURL(b))
    navigator.geolocation?.getCurrentPosition((p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }), () => setMsg(t.rpNoLoc), { enableHighAccuracy: true, timeout: 15000 })
  }

  const send = async () => {
    if (!img || !pos) return
    setBusy(true); setMsg('')
    const fd = new FormData()
    fd.append('photo', img, 'report.jpg'); fd.append('lat', String(pos.lat)); fd.append('lng', String(pos.lng)); fd.append('note', note)
    try {
      const r = await fetch('/api/report', { method: 'POST', body: fd })
      if (r.ok) { setImg(null); setPrev(''); setNote(''); setMsg(t.rpOk); setTimeout(() => { location.href = `/${document.documentElement.lang}/reports` }, 1200) }
      else setMsg(r.status === 429 ? t.rpRate : t.rpFail)
    } catch { setMsg(t.rpFail) }
    setBusy(false)
  }

  return (
    <>
      <button className="fab mini" onClick={() => setOpen(true)} title={t.rpBtn} aria-label={t.rpBtn}><Ic n="camera" /><span>{t.fab}</span><i className="fabdrop" aria-hidden="true"><Ic n="drop" /></i></button>
      {open && (
        <div className="rpback" onClick={close}>
          <div className="rpbox" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="row"><h3><Ic n="camera" />{t.rpTitle}</h3><button className="iconbtn" onClick={close} aria-label={t.close}><Ic n="close" /></button></div>
            <p className="muted">{t.rpSub}</p>
            <ul className="rplist">{['rpB1', 'rpB2', 'rpB3', 'rpB4'].map((k) => <li key={k}>{t[k]}</li>)}</ul>
            <label className="rpchk"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /><span>{t.rpConsent}<a className="link rplink" href={`/${document.documentElement.lang || 'th'}/privacy`} target="_blank" rel="noopener noreferrer">{t.legPrivacy}</a></span></label>
            <input ref={fi} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
            {base && <BlurEditor base={base} t={t} onDone={confirm} />}
            {base && <div className="acts" style={{ marginTop: 10 }}>
              <button className="ghost" onClick={retake}><Ic n="camera" />{t.camRetake}</button>
              <button className="ghost" onClick={discard}><Ic n="close" />{t.camDelete}</button>
            </div>}
            {prev && <img className="rpimg" src={prev} alt="" />}
            {img && <textarea className="rpnote" maxLength={200} placeholder={t.rpNote} value={note} onChange={(e) => setNote(e.target.value)} />}
            {msg && <p className="muted">{msg}</p>}
            {base ? null : !img
              ? <button className="rpgo" disabled={!ok} onClick={openCam}>{t.rpOpen}</button>
              : <button className="rpgo" disabled={!ok || !pos || busy} onClick={send}>{busy ? t.rpSending : pos ? t.rpSend : t.rpLocating}</button>}
            {img && !base && <div className="acts" style={{ marginTop: 10 }}>
              <button className="ghost" disabled={busy} onClick={retake}><Ic n="camera" />{t.camRetake}</button>
              <button className="ghost" disabled={busy} onClick={discard}><Ic n="close" />{t.camDelete}</button>
            </div>}
          </div>
        </div>
      )}
      {open && cam && (
        <div className="camfull">
          <video ref={vid} playsInline muted autoPlay />
          <div className="cambar">
            <button className="iconbtn" onClick={stopCam} aria-label={t.close}><Ic n="close" /></button>
            <button className="shutter" onClick={snap} aria-label={t.camShot} />
            <span />
          </div>
        </div>
      )}
    </>
  )
}
