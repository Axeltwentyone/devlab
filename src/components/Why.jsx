import { Dot } from './Logo.jsx'
import { REASONS } from '../data/site.js'

export default function Why() {
  return (
    <section id="pourquoi" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <p className="text-sm font-medium text-gris">Pourquoi le lab ?</p>
      <h2 className="mt-4 max-w-4xl text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
        Un partenaire,<br /><span className="text-gris">pas un prestataire</span><Dot className="bg-bronze" />
      </h2>

      <ul className="mt-12 grid gap-x-14 sm:grid-cols-2 md:mt-20">
        {REASONS.map((r, i) => (
          <li key={r.title} className="border-t border-encre py-7 md:py-9">
            <span className="text-sm text-gris">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-[clamp(1.6rem,2.8vw,2.5rem)] font-extrabold leading-none tracking-[-0.04em]">{r.title}</h3>
            <p className="mt-4 max-w-md text-[17px] font-light leading-relaxed text-gris">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
