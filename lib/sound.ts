export type Sound = 'siren' | 'bell' | 'beep' | 'voice' | 'silent'
export const SOUNDS: Sound[] = ['siren', 'bell', 'beep', 'voice', 'silent']

let ctx: AudioContext | null = null
function ac(): AudioContext | null {
  try {
    const C = window.AudioContext || (window as any).webkitAudioContext
    if (!C) return null
    ctx = ctx || new C()
    if (ctx!.state === 'suspended') void ctx!.resume()
    return ctx
  } catch { return null }
}
export const unlockAudio = () => { ac() }

function tone(c: AudioContext, f: number, t: number, d: number, type: OscillatorType, vol: number, f2?: number) {
  const o = c.createOscillator(), g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (f2) o.frequency.linearRampToValueAtTime(f2, t + d)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + d)
  o.connect(g); g.connect(c.destination)
  o.start(t); o.stop(t + d + 0.05)
}

function speak(text: string, lang: string) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = ({ th: 'th-TH', en: 'en-US', zh: 'zh-CN' } as Record<string, string>)[lang] ?? 'th-TH'
    u.rate = 0.95
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  } catch {}
}

export function playSound(kind: string, text = '', lang = 'th') {
  if (kind === 'silent') return
  if (kind === 'voice') { speak(text, lang); return }
  const c = ac()
  if (!c) return
  const t = c.currentTime + 0.05
  if (kind === 'siren') for (let i = 0; i < 4; i++) tone(c, 700, t + i * 0.8, 0.8, 'sawtooth', 0.25, 1100)
  else if (kind === 'bell') [0, 0.9, 1.8].forEach((o) => { tone(c, 880, t + o, 1.4, 'sine', 0.4); tone(c, 1760, t + o, 0.9, 'sine', 0.15) })
  else [0, 0.35, 0.7].forEach((o) => tone(c, 1000, t + o, 0.2, 'square', 0.15))
}
