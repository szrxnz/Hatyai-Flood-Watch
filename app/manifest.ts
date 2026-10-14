import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/th', name: 'Hat Yai Flood Watch', short_name: 'HatYai Flood', lang: 'th', dir: 'ltr',
    description: 'ติดตามระดับน้ำ ฝน และแจ้งเตือนน้ำท่วมหาดใหญ่/สงขลา · Hat Yai flood monitoring and alerts',
    start_url: '/th', scope: '/', display: 'standalone', orientation: 'portrait',
    background_color: '#ffffff', theme_color: '#ffffff', categories: ['weather', 'utilities', 'news'],
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
    shortcuts: [
      { name: 'แผนที่น้ำ / Map', url: '/th/map', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'แจ้งเตือน / Alerts', url: '/th/alerts', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'จุดพักพิง / Shelters', url: '/th/shelters', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
