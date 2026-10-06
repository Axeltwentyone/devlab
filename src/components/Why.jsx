import { Dot } from './Logo.jsx'
import { REASONS } from '../data/site.js'
import useInView from '../hooks/useInView.js'

const COLS = 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.15fr)]'

function No({ className = '' }) {
  return (
    <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F7E4E1] text-[12px] font-bold text-[#C2412D] ${className}`}>✕</span>
  )
}
function Yes({ className = '' }) {
  return (
    <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3BD16F] text-[12px] font-bold text-encre ${className}`}>✓</span>
  )
}

function Row({ r, i, last }) {
  const [ref, on] = useInView({ threshold: 0.6 })
  return (
    <li className="contents">
      {/* Le point comparé */}
      <div ref={ref} className="flex items-baseline gap-4 border-t border-encre pt-6 md:py-8 md:pr-8">
        <span className="text-sm text-gris">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.04em]">{r.title}</h3>
      </div>

      {/* Une agence classique */}
      <div className="mt-5 md:mt-0 md:border-t md:border-pierre md:py-8 md:pr-10">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gris md:hidden">
          <No /> Une agence classique
        </p>
        <p className="flex gap-3 text-[16px] font-light leading-relaxed text-gris">
          <No className="mt-0.5 hidden md:flex" />
          {r.them}
        </p>
      </div>

      {/* Avec devlab : la colonne sombre, mise en avant */}
      <div
        className={`mb-10 mt-4 rounded-2xl bg-encre px-5 py-5 text-white md:m-0 md:rounded-none md:px-8 md:py-8 ${
          last ? 'md:rounded-b-3xl' : ''
        }`}
      >
        <div
          className="transition-[opacity,translate] duration-700"
          style={{ opacity: on ? 1 : 0.15, translate: on ? '0 0' : '0 10px', transitionDelay: on ? '200ms' : '0ms' }}
        >
        <p className="mb-2 flex items-center gap-2 text-sm font-medium md:hidden">
          <Yes /> Avec devlab
        </p>
        <p className="flex gap-3 text-[16px] leading-relaxed">
          <Yes className="mt-0.5 hidden md:flex" />
          {r.us}
        </p>
        </div>
      </div>
    </li>
  )
}

export default function Why() {
  return (
    <section id="pourquoi" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <p className="text-sm font-medium text-gris">Pourquoi le lab ?</p>
      <h2 className="mt-4 max-w-4xl text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
        Un partenaire,<br /><span className="text-gris">pas un prestataire</span><Dot className="bg-bronze" />
      </h2>
      <p className="mt-6 max-w-xl text-[17px] font-light leading-relaxed text-gris">
        Ce qu’on entend souvent sur les agences, et ce qui se passe quand vous travaillez avec nous.
      </p>

      <div className="mt-12 md:mt-16">
        {/* En-têtes de colonnes (grand écran) */}
        <div className={`hidden md:grid ${COLS}`}>
          <span />
          <span className="flex items-center gap-3 pb-5 text-lg font-extrabold tracking-[-0.02em] text-gris">
            <No /> Une agence classique
          </span>
          <span className="flex items-center gap-3 rounded-t-3xl bg-encre px-8 pb-5 pt-7 text-lg font-extrabold tracking-[-0.02em] text-white">
            <Yes /> Avec devlab
          </span>
        </div>
        <ul className={`md:grid ${COLS}`}>
          {REASONS.map((r, i) => (
            <Row key={r.title} r={r} i={i} last={i === REASONS.length - 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}
