'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import { DEFCFG, isIOS, isStandalone, loadCfg, pushSupported, saveCfg, sendTest, subscribe, syncSub, unsubscribe, type Cfg, type Lv } from '@/lib/pushClient'
import { playSound, SOUNDS, unlockAudio, type Sound } from '@/lib/sound'

type T = Record<string, string>
type Toast = { title: string; body: string; url: string; level: string }

export function AlertWatcher({ t, lang }: { t: T; lang: string }) {
  const [toast, setToast] = useState<Toast | null>(null)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {})
    const onMsg = (e: MessageEvent) => {
      const d = e.data
      if (d?.type !== 'alert') return
      playSound(d.sound ?? loadCfg().sound, d.title, lang)
      setToast({ title: d.title, body: d.body, url: d.url || `/${lang}`, level: d.level || 'watch' })
    }
    navigator.serviceWorker.addEventListener('message', onMsg)
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    const c = loadCfg()
    if (c.on && c.consent && pushSupported() && Notification.permission === 'granted') syncSub(c, lang).catch(() => {})
    return () => { navigator.serviceWorker.removeEventListener('message', onMsg); window.removeEventListener('pointerdown', unlockAudio) }
  }, [lang])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(null), 20000); return () => clearTimeout(id) }, [toast])
  if (!toast) return null
  return (
    <div className={`toast lv-${toast.level}`} role="alert">
      <a href={toast.url}><b>{toast.title}</b><span>{toast.body}</span></a>
      <button className="iconbtn" aria-label={t.close} onClick={() => setToast(null)}><Ic n="close" /></button>
    </div>
  )
}

export default function AlertSettings({ t, amphoes, lang }: { t: T; amphoes: string[]; lang: string }) {
  const [cfg, setCfg] = useState<Cfg>(DEFCFG)
  const [perm, setPerm] = useState<string>('default')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [ios, setIos] = useState(false)
  useEffect(() => {
    setCfg(loadCfg())
    setPerm(!pushSupported() ? 'unsupported' : Notification.permission)
    setIos(isIOS() && !isStandalone())
  }, [])

  const apply = (c: Cfg) => { setCfg(c); saveCfg(c); if (c.on && c.consent) syncSub(c, lang).catch(() => {}) }

  const toggle = async () => {
    setMsg('')
    if (cfg.on) { setBusy(true); await unsubscribe(); setBusy(false); apply({ ...cfg, on: false }); return }
    if (!cfg.consent) return
    setBusy(true)
    const next = { ...cfg, on: true }
    const r = await subscribe(next, lang)
    setBusy(false)
    setPerm(pushSupported() ? Notification.permission : 'unsupported')
    if (r === 'ok') { setCfg(next); saveCfg(next); setMsg(t.alOnMsg) }
    else setMsg(r === 'off' ? t.alOff : r === 'denied' ? t.alDenied : r === 'unsupported' ? t.alUnsupported : t.alFail)
  }
  const pickArea = (a: string) => apply({ ...cfg, amphoes: cfg.amphoes.includes(a) ? cfg.amphoes.filter((x) => x !== a) : [...cfg.amphoes, a] })
  const pickSound = (s: Sound) => { unlockAudio(); playSound(s, t.alVoiceText, lang); apply({ ...cfg, sound: s }) }
  const test = async () => {
    setMsg(''); setBusy(true)
    const ok = await sendTest()
    setBusy(false); setMsg(ok ? t.alTestSent : t.alFail)
  }

  const unsupported = perm === 'unsupported'
  return (
    <div className="card alset">
      {ios && <p className="muted">{t.alIos}</p>}
      {unsupported && !ios && <p className="muted">{t.alUnsupported}</p>}
      {perm === 'denied' && <p className="muted">{t.alDenied}</p>}

      {!cfg.on && (
        <label className="chk">
          <input type="checkbox" checked={cfg.consent} onChange={(e) => { const c = { ...cfg, consent: e.target.checked }; setCfg(c); saveCfg(c) }} />
          <span>{t.alConsent} <Link className="link" href={`/${lang}/privacy`}>{t.legPrivacy}</Link></span>
        </label>
      )}
      <button className={`rpgo${cfg.on ? ' offb' : ''}`} onClick={toggle} disabled={busy || unsupported || perm === 'denied' || (!cfg.on && !cfg.consent)}>
        <Ic n="bell" />{busy ? t.rpSending : cfg.on ? t.alDisable : t.alEnable}
      </button>
      {cfg.on && <p className="okb strong" style={{ marginTop: 10 }}><Ic n="check" />{t.alOnState}</p>}

      <h4>{t.alAreas}</h4>
      <div className="chips">
        <button className={cfg.amphoes.length === 0 ? 'on' : ''} onClick={() => apply({ ...cfg, amphoes: [] })}>{t.alAll}</button>
        {amphoes.map((a) => <button key={a} className={cfg.amphoes.includes(a) ? 'on' : ''} onClick={() => pickArea(a)}>{a}</button>)}
      </div>

      <h4>{t.alMin}</h4>
      <div className="chips">
        {(['watch', 'high', 'critical'] as Lv[]).map((l) => <button key={l} className={cfg.min === l ? 'on' : ''} onClick={() => apply({ ...cfg, min: l })}>{t[l]}</button>)}
      </div>

      <h4>{t.alSound}</h4>
      <div className="chips">
        {SOUNDS.map((s) => <button key={s} className={cfg.sound === s ? 'on' : ''} onClick={() => pickSound(s)}>{t[`alSnd_${s}`]}</button>)}
      </div>
      <p className="muted"><small>{t.alSoundNote}</small></p>

      <h4>{t.alExtra}</h4>
      <div className="chips">
        <button className={cfg.notices ? 'on' : ''} onClick={() => apply({ ...cfg, notices: !cfg.notices })}>{t.alNotices}</button>
      </div>

      <button className="ghost" style={{ marginTop: 14 }} disabled={!cfg.on || busy} onClick={test}>{t.alTest}</button>
      {msg && <p className="muted">{msg}</p>}
      <p className="muted"><small>{t.alNote}</small></p>
    </div>
  )
}
