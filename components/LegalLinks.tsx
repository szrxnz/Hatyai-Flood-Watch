import Link from 'next/link'

export default function LegalLinks({ lang, t }: { lang: string; t: Record<string, string> }) {
  return (
    <>
    <p className="notgov">{t.notGov}</p>
    <nav className="legalinks" aria-label="legal">
      <Link className="link" href={`/${lang}/privacy`}>{t.legPrivacy}</Link>
      <Link className="link" href={`/${lang}/terms`}>{t.legTerms}</Link>
      <Link className="link" href={`/${lang}/credits`}>{t.legCredits}</Link>
    </nav>
    </>
  )
}
