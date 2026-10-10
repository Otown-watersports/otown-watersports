/** Plus/minus accordion built on <details> — works without JS, keyboard accessible (21st.dev Origin UI pattern, adapted). */
export default function Accordion({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  return (
    <div className={`accordion${dark ? " accordion--dark" : ""}`}>
      {items.map((it, n) => (
        <details key={it.q} className="accordion__item" open={n === 0}>
          <summary>
            <span>{it.q}</span>
            <span className="accordion__icon" aria-hidden />
          </summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}
