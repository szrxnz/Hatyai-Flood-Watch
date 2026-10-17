'use client'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="mapbox" /> })
export default MapView
