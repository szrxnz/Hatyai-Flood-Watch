'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Ic } from '@/components/Icons'

type T = Record<string, string>
interface R { x: number; y: number; w: number; h: number }

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

async function detectFaces(c: HTMLCanvasElement): Promise<R[]> {
  const m = await import('@mediapipe/tasks-vision')
  const det = await m.FaceDetector.createFromOptions(await m.FilesetResolver.forVisionTasks(WASM), {
    baseOptions: { modelAssetPath: MODEL }, runningMode: 'IMAGE', minDetectionConfidence: 0.3,
  })
  const out = det.detect(c).detections.flatMap((d) => d.boundingBox ? [d.boundingBox] : []).map((b) => {
    const px = b.width * 0.3, py = b.height * 0.4
    return { x: Math.max(0, b.originX - px), y: Math.max(0, b.originY - py), w: b.width + px * 2, h: b.height + py * 2 }
  })
  det.close()
  return out
}

function pixelate(ctx: CanvasRenderingContext2D, r: R) {
  const s = Math.max(12, Math.min(r.w, r.h) / 4)
  const tmp = document.createElement('canvas')
  tmp.width = Math.max(1, Math.round(r.w / s)); tmp.height = Math.max(1, Math.round(r.h / s))
  tmp.getContext('2d')!.drawImage(ctx.canvas, r.x, r.y, r.w, r.h, 0, 0, tmp.width, tmp.height)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, r.x, r.y, r.w, r.h)
  ctx.imageSmoothingEnabled = true
}

export default function BlurEditor({ base, t, onDone }: { base: HTMLCanvasElement; t: T; onDone: (b: Blob) => void }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const [rects, setRects] = useState<R[]>([])
  const [drag, setDrag] = useState<R | null>(null)
  const [info, setInfo] = useState(t.blurLoading)
  const [detecting, setDetecting] = useState(true)
  const start = useRef<{ x: number; y: number } | null>(null)

  const paint = useCallback((rs: R[], extra?: R | null) => {
    const c = cv.current; if (!c) return
    const ctx = c.getContext('2d')!
    ctx.drawImage(base, 0, 0)
    for (const r of rs) pixelate(ctx, r)
    if (extra) { ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, c.width / 300); ctx.strokeRect(extra.x, extra.y, extra.w, extra.h) }
  }, [base])

  useEffect(() => {
    const c = cv.current!; c.width = base.width; c.height = base.height; paint([])
    let live = true
    setDetecting(true)
    detectFaces(base)
      .then((f) => { if (!live) return; setRects((r) => [...r, ...f]); setInfo(t.blurAuto.replace('{n}', String(f.length))) })
      .catch(() => { if (live) setInfo(t.blurNoAI) })
      .finally(() => { if (live) setDetecting(false) })
    return () => { live = false }
  }, [base, paint, t])
  useEffect(() => paint(rects, drag), [rects, drag, paint])

  const pt = (e: React.PointerEvent) => {
    const b = cv.current!.getBoundingClientRect()
    return { x: ((e.clientX - b.left) / b.width) * base.width, y: ((e.clientY - b.top) / b.height) * base.height }
  }
  const box = (a: { x: number; y: number }, b: { x: number; y: number }): R => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) })
  const down = (e: React.PointerEvent) => { cv.current!.setPointerCapture(e.pointerId); start.current = pt(e) }
  const move = (e: React.PointerEvent) => { if (start.current) setDrag(box(start.current, pt(e))) }
  const up = () => { if (drag && drag.w > 8 && drag.h > 8) setRects((r) => [...r, drag]); setDrag(null); start.current = null }
  const done = () => { if (detecting) return; paint(rects); cv.current!.toBlob((b) => b && onDone(b), 'image/jpeg', 0.75) }

  return (
    <div className="blur">
      <h4>{t.blurTitle}</h4>
      <p className="muted">{t.blurHint}</p>
      <canvas ref={cv} className="blurcv" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <small className="muted">{info}</small>
      <div className="blurbtn">
        <button className="ghost" disabled={!rects.length} onClick={() => setRects((r) => r.slice(0, -1))}><Ic n="undo" />{t.blurUndo}</button>
        <button className="rpgo" disabled={detecting} onClick={done}>{detecting ? `${t.blurLoading}…` : t.blurDone}</button>
      </div>
    </div>
  )
}