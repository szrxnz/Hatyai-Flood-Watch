import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import ZoneBoard from '@/components/ZoneBoard'
import { ZONE_SITE, getZoneFlags } from '@/lib/zoneFlags'
import { dict, isLang } from '@/lib/i18n'

export const revalidate = 300

export default async function Zones({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const t = dict[params.locale]
  const items = await getZoneFlags()
  const L = { search: t.flSearchPh, empty: t.flEmpty, open: t.flOpen, banner: t.flBanner, fail: t.flFetchFail, n: t.flN, match: t.flMatch,
    level: { normal: t.flNormal, watch: t.flWatch, high: t.flHigh, critical: t.flCritical, nodata: t.flUnknown } }
  return (
    <main className="wrap page">
      <h1><Ic n="flag" />{t.zonesMenu}</h1>
      <p className="muted">{t.flSub}</p>
      <a className="src" href={`${ZONE_SITE}/zone`} target="_blank" rel="noopener noreferrer">{t.flCredit}: Hatyai City Climate<Ic n="ext" /></a>
      <ZoneBoard items={items} L={L} />
      <footer>{t.flNote}</footer>
    </main>
  )
}
