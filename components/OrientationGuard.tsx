'use client'
import { useEffect } from 'react'

// ล็อกแนวตั้งเฉพาะ PWA ที่ติดตั้งแล้ว (Android) เบราว์เซอร์ปกติไม่ล็อกและไม่มีแผ่นปิดจอ
export default function OrientationGuard() {
  useEffect(() => {
    try {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
      if (standalone) (screen.orientation as any)?.lock?.('portrait')?.catch(() => {})
    } catch {}
  }, [])
  return null
}
