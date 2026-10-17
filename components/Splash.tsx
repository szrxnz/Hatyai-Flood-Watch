'use client'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'

const MIN = 900, MAX = 2500
export default function Splash({ text }: { text: string }) {
  const [state, setState] = useState<'show' | 'out' | 'gone'>('show')
  useEffect(() => {
    try { sessionStorage.setItem('splash', '1') } catch {}
    const t0 = performance.now()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setTimeout(() => { setState('out'); setTimeout(() => setState('gone'), 450) }, Math.max(0, MIN - (performance.now() - t0)))
    }
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    const cap = setTimeout(finish, MAX)
    return () => { clearTimeout(cap); window.removeEventListener('load', finish) }
  }, [])
  if (state === 'gone') return null
  return <div className={`splash${state === 'out' ? ' out' : ''}`}><Loader text={text} /></div>
}
