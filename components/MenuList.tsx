import Link from 'next/link'
import { Ic } from '@/components/Icons'

type T = Record<string, string>
export default function MenuList({ lang, t }: { lang: string; t: T }) {
  const items = [
    { i: 'pin', title: t.area, sub: t.mArea, href: `/${lang}/area` },
    { i: 'news', title: t.updates, sub: t.mUpd, href: `/${lang}/updates` },
    { i: 'bell', title: t.alerts, sub: t.mAlerts, href: `/${lang}/alerts` },
    { i: 'camera', title: t.cctv, sub: t.mCctv, href: `/${lang}/cctv` },
    { i: 'install', title: t.install, sub: t.mInstall, href: `/${lang}/install` },
  ]
  return (
    <>
      <h2><Ic n="compass" />{t.menuTitle}</h2>
      <div className="card menu">
        {items.map((m) => (
          <Link key={m.title} href={m.href} className="mrow">
            <i><Ic n={m.i} /></i><div><b>{m.title}</b><small>{m.sub}</small></div><em><Ic n="chev" /></em>
          </Link>
        ))}
      </div>
    </>
  )
}
