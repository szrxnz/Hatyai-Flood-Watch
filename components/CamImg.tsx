'use client'
import { useEffect, useState } from 'react'

type Item = { src: string; alt: string; id: string }
type Photo = { at: string; url: string }
type Hist = { at: string | null; photos: Photo[]; overlay: string | null }
export type CamLabels = { hist: string; live: string; cmp: string; none: string; loading: string; overlay: string; now: string; before: string; note: string }

const list = (): Item[] => Array.from(document.querySelectorAll<HTMLImageElement>('img[data-cam]')).map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, id: i.dataset.id || '' }))
const nb: React.CSSProperties = { position: 'absolute', top: '40%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', fontSize: 28, lineHeight: 1, color: '#fff', background: 'rgba(255,255,255,.18)', border: 0, cursor: 'pointer', zIndex: 1 }
const raw: React.CSSProperties = { width: 'auto', aspectRatio: 'auto', margin: 0, objectFit: 'contain', background: 'none', borderRadius: 8 }
const btn: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,.35)', background: 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', font: 'inherit', fontSize: 14 }

const fmt = (iso: string | null) => {
  if (!iso) return ''
  const lang = document.documentElement.lang
  const loc = lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-GB'
  return new Date(iso).toLocaleString(loc, { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function CamImg({ src, alt, id, L }: { src: string; alt: string; id?: string; L?: CamLabels }) {
  const [items, setItems] = useState<Item[]>([])
  const [i, setI] = useState(-1)
  const [hist, setHist] = useState<Record<string, Hist | 'load' | 'err'>>({})
  const [sel, setSel] = useState(-1)
  const [cmp, setCmp] = useState(false)
  const [ov, setOv] = useState(true)
  const open = i >= 0
  const go = (d: number) => setI((x) => (items.length ? (x + d + items.length) % items.length : x))
  const show = () => { const l = list(); const k = l.findIndex((x) => x.src === (document.querySelector<HTMLImageElement>(`img[data-cam][alt="${CSS.escape(alt)}"]`)?.currentSrc || src)); setItems(l); setI(Math.max(0, k)) }
  const cur = items[i]

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setI(-1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1) }
    document.addEventListener('keydown', k)
    const o = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [open, items.length])

  useEffect(() => {
    setSel(-1); setCmp(false); setOv(true)
    const cid = cur?.id
    if (!open || !cid || !L || hist[cid]) return
    setHist((h) => ({ ...h, [cid]: 'load' }))
    fetch(`/api/cam/${cid}`).then((r) => (r.ok ? r.json() : Promise.reject())).then((j: Hist) => setHist((h) => ({ ...h, [cid]: { at: j.at ?? null, photos: Array.isArray(j.photos) ? j.photos : [], overlay: j.overlay ?? null } }))).catch(() => setHist((h) => ({ ...h, [cid]: 'err' })))
  }, [open, cur?.id])

  const h = cur?.id ? hist[cur.id] : undefined
  const data = h && typeof h === 'object' ? h : null
  const n = data?.photos.length ?? 0
  const photo = data && sel >= 0 ? data.photos[sel] : null
  const mainSrc = photo ? photo.url : cur?.src
  const many = items.length > 1
  let x0 = 0

  const compare1h = () => {
    if (!data || !n) return
    const t0 = Date.parse(data.at ?? data.photos[n - 1].at) - 3600_000
    let best = 0
    data.photos.forEach((p, k) => { if (Math.abs(Date.parse(p.at) - t0) < Math.abs(Date.parse(data.photos[best].at) - t0)) best = k })
    setSel(best); setCmp(true)
  }

  const imgBox = (u: string, label: string, showOv: boolean) => (
    <div style={{ position: 'relative', display: 'inline-block', maxWidth: cmp ? '49%' : '100%', lineHeight: 0 }}>
      <img src={u} alt={cur?.alt} referrerPolicy="no-referrer" onClick={(e) => e.stopPropagation()} style={{ ...raw, maxWidth: '100%', maxHeight: cmp ? '45vh' : '58vh', display: 'block', cursor: 'default' }} />
      {showOv && data?.overlay && <img src={data.overlay} alt="" referrerPolicy="no-referrer" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', margin: 0, aspectRatio: 'auto', objectFit: 'fill', background: 'none' }} />}
      <span style={{ position: 'absolute', left: 6, top: 6, padding: '2px 8px', borderRadius: 8, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 12, lineHeight: 1.4 }}>{label}</span>
    </div>
  )

  return (
    <>
      <img data-cam="" data-id={id ?? ''} src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onClick={show} style={{ cursor: 'zoom-in' }} />
      {open && cur && (
        <div role="dialog" aria-label={cur.alt} onClick={() => setI(-1)}
          onTouchStart={(e) => { x0 = e.touches[0].clientX }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - x0; if (many && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1) }}
          style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 10, cursor: 'zoom-out', overflowY: 'auto' }}>
          <button onClick={() => setI(-1)} aria-label="close"
            style={{ position: 'absolute', top: 8, right: 14, fontSize: 32, lineHeight: 1, color: '#fff', background: 'none', border: 0, cursor: 'pointer', zIndex: 2 }}>×</button>
          {many && <button onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="prev" style={{ ...nb, left: 8 }}>‹</button>}
          {many && <button onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="next" style={{ ...nb, right: 8 }}>›</button>}
          <div style={{ color: '#fff', fontWeight: 600, paddingRight: 28 }}>{cur.alt}{many && <span style={{ opacity: .7, fontWeight: 400 }}> · {i + 1}/{items.length}</span>}</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', width: '100%', alignItems: 'flex-start' }}>
            {cmp && photo && imgBox(photo.url, `${L?.before ?? ''} ${fmt(photo.at)}`, ov)}
            {cmp && photo ? imgBox(cur.src, L?.now ?? '', ov) : mainSrc && imgBox(mainSrc, photo ? fmt(photo.at) : (L?.live ?? ''), ov)}
          </div>
          {L && (
            <div onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 560, color: '#fff', cursor: 'default', display: 'grid', gap: 8 }}>
              {h === 'load' && <div style={{ opacity: .8, fontSize: 14 }}>{L.loading}</div>}
              {(h === 'err' || (data && n === 0)) && <div style={{ opacity: .8, fontSize: 14 }}>{L.none}</div>}
              {data && n > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: .85 }}>
                    <span>{L.hist}: {fmt(data.photos[0].at)}</span><b>{photo ? fmt(photo.at) : L.live}</b>
                  </div>
                  <input type="range" min={0} max={n} step={1} value={sel < 0 ? n : sel} aria-label={L.hist}
                    onChange={(e) => { const v = Number(e.target.value); setSel(v >= n ? -1 : v); if (v >= n) setCmp(false) }} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button style={btn} onClick={() => { setSel(-1); setCmp(false) }}>{L.live}</button>
                    <button style={{ ...btn, background: cmp ? 'rgba(39,211,255,.35)' : btn.background }} onClick={() => (cmp ? setCmp(false) : compare1h())}>{L.cmp}</button>
                    {data.overlay && <button style={{ ...btn, background: ov ? 'rgba(39,211,255,.35)' : btn.background }} onClick={() => setOv((x) => !x)}>{L.overlay}</button>}
                  </div>
                  <div style={{ opacity: .6, fontSize: 12 }}>{L.note}</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
