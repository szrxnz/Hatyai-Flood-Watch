import type { Doc, Item } from '@/lib/legal'

const li = (x: Item, i: number) => (
  <li key={i}>{typeof x === 'string' ? x : <a className="link" href={x.href} target="_blank" rel="noopener noreferrer">{x.t}</a>}</li>
)

export default function LegalDoc({ doc, lang }: { doc: Doc; lang: string }) {
  return (
    <main className="wrap page legal">
      <h1>{doc.title}</h1>
      <p className="upd">{doc.updated}{lang === 'zh' && ' · English version'}</p>
      {doc.intro && <p>{doc.intro}</p>}
      {doc.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.p?.map((x, i) => <p key={i}>{x}</p>)}
          {s.table && (
            <div className="wide"><table><thead><tr>{s.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{s.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
          )}
          {s.ul && s.ul.length > 0 && <ul>{s.ul.map(li)}</ul>}
        </section>
      ))}
    </main>
  )
}
