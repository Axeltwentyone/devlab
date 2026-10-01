import { Dot } from './Logo.jsx'
import { AVAILABILITY } from '../data/site.js'

const LINES = ['On construit des', 'produits numériques', 'qui tiennent']

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-[72px] md:pb-28 md:pt-36">
      <h1 className="text-[clamp(2.9rem,9.3vw,8.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        {LINES.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {line}
              {i === LINES.length - 1 && <Dot className="bg-bronze" />}
            </span>
          </span>
        ))}
      </h1>

      <dl className="mt-12 grid gap-6 border-t border-encre pt-5 sm:grid-cols-3 md:mt-24 md:max-w-4xl">
        <div>
          <dt className="text-xs font-medium text-gris">Studio</dt>
          <dd className="mt-1 text-[15px]">Web &amp; mobile, Abidjan</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gris">Approche</dt>
          <dd className="mt-1 text-[15px]">Partenaire, pas prestataire</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gris">Disponibilité</dt>
          <dd className="mt-1 flex items-center gap-2 text-[15px]">
            <span aria-hidden="true" className="size-2 rounded-full bg-bronze" />
            {AVAILABILITY}
          </dd>
        </div>
      </dl>

      <style>{`
        .hero-line { transform: translateY(105%); animation: hero-rise 900ms cubic-bezier(.2,.7,.1,1) forwards; }
        @keyframes hero-rise { to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hero-line { transform: none; animation: none; } }
      `}</style>
    </section>
  )
}
