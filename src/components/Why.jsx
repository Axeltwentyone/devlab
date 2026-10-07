import { Dot } from './Logo.jsx'
import { REASONS } from '../data/site.js'
import useInView from '../hooks/useInView.js'

// Visuels : chacun illustre l'engagement de sa carte, et s'anime quand la carte arrive à l'écran.

function ZeroArt({ on }) {
  return (
    <div className="flex items-end gap-4">
      <span
        className="text-[clamp(7rem,14vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.07em] text-white transition-[opacity,translate] duration-1000"
        style={{ opacity: on ? 1 : 0, translate: on ? '0 0' : '0 30px' }}
      >
        0
      </span>
      <span className="mb-2 flex flex-col gap-1.5 text-[13px]">
        {['frais caché', 'retard non prévenu', 'jargon'].map((t, k) => (
          <span
            key={t}
            className="flex items-center gap-2 text-doux transition-opacity duration-500"
            style={{ opacity: on ? 1 : 0, transitionDelay: on ? `${400 + k * 150}ms` : '0ms' }}
          >
            <span className="size-1 rounded-full bg-bronze" />
            {t}
          </span>
        ))}
      </span>
    </div>
  )
}

function ClockArt({ on }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-pierre)" strokeWidth="6" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke="var(--color-encre)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: on ? 0 : c, transition: 'stroke-dashoffset 1400ms cubic-bezier(.2,.7,.2,1)' }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold tracking-[-0.05em]">24 h</span>
        <span className="text-[11px] text-gris">pour répondre</span>
      </span>
    </div>
  )
}

function LocalArt({ on }) {
  const pays = [['Wave', 'bg-[#1DC3F1] text-white'], ['Orange Money', 'bg-[#FF7900] text-white'], ['MoMo', 'bg-[#FFCC00] text-encre']]
  return (
    <div className="relative h-40 w-32">
      <div className="absolute inset-0 rounded-[1.4rem] bg-encre p-[4px] shadow-[0_24px_40px_-20px_rgba(17,17,17,0.6)]">
        <div className="flex h-full flex-col rounded-[1.15rem] bg-white p-2.5">
          <div className="flex items-center justify-between text-[8px] font-medium text-encre">
            <span>Abidjan</span>
            <span className="flex items-end gap-[2px]" aria-hidden="true">
              {[3, 5, 7, 9].map((h) => <span key={h} className="w-[2px] rounded-full bg-encre" style={{ height: h }} />)}
            </span>
          </div>
          <span className="mt-2 text-[9px] text-gris">Payer avec</span>
          <div className="mt-1 flex flex-col gap-1">
            {pays.map(([p, c], k) => (
              <span
                key={p}
                className={`rounded-md px-2 py-1 text-[9px] font-medium transition-[opacity,translate] duration-500 ${c}`}
                style={{ opacity: on ? 1 : 0, translate: on ? '0 0' : '12px 0', transitionDelay: on ? `${200 + k * 140}ms` : '0ms' }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StayArt({ on }) {
  const steps = ['En ligne', 'Mois 1', 'Mois 6', 'Et après']
  return (
    <div className="w-full">
      <div className="relative flex justify-between">
        <span className="absolute inset-x-1 top-[7px] h-px bg-trait" />
        <span
          className="absolute left-1 top-[7px] h-px bg-bronze transition-[width] duration-[1600ms] ease-out"
          style={{ width: on ? 'calc(100% - 0.5rem)' : '0%' }}
        />
        {steps.map((s, k) => (
          <span key={s} className="relative flex flex-col items-center gap-2">
            <span
              className="size-[15px] rounded-full border-2 transition-colors duration-500"
              style={{
                background: on ? 'var(--color-bronze)' : 'var(--color-encre)',
                borderColor: on ? 'var(--color-bronze)' : 'var(--color-trait)',
                transitionDelay: on ? `${k * 380}ms` : '0ms',
              }}
            />
            <span className="text-[12px] text-doux">{s}</span>
          </span>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-doux">Toujours le même interlocuteur.</p>
    </div>
  )
}

// Mosaïque : deux cartes sombres en diagonale, deux claires
const CARDS = {
  prix: { Art: ZeroArt, dark: true, span: 'md:col-span-7' },
  reponse: { Art: ClockArt, dark: false, span: 'md:col-span-5' },
  ici: { Art: LocalArt, dark: false, span: 'md:col-span-5' },
  reste: { Art: StayArt, dark: true, span: 'md:col-span-7' },
}

function Card({ r, i }) {
  const [ref, on] = useInView({ threshold: 0.35 })
  const { Art, dark, span } = CARDS[r.id]
  return (
    <li
      ref={ref}
      className={`group flex min-h-[340px] flex-col justify-between gap-10 overflow-hidden rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 md:min-h-[400px] md:p-9 ${span} ${
        dark ? 'bg-encre text-white' : 'bg-fond text-encre'
      }`}
    >
      <div className="flex min-h-36 items-center">
        <Art on={on} />
      </div>
      <div>
        <span className={`text-sm ${dark ? 'text-doux' : 'text-gris'}`}>{String(i + 1).padStart(2, '0')}</span>
        <h3 className="mt-2 text-[clamp(1.75rem,2.8vw,2.6rem)] font-extrabold leading-none tracking-[-0.045em]">
          {r.title}<Dot className="bg-bronze" />
        </h3>
        <p className={`mt-3 max-w-md text-[16px] font-light leading-relaxed ${dark ? 'text-doux' : 'text-gris'}`}>{r.text}</p>
      </div>
    </li>
  )
}

export default function Why() {
  return (
    <section id="pourquoi" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-gris">Pourquoi le lab ?</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Un partenaire,<br /><span className="text-gris">pas un prestataire</span><Dot className="bg-bronze" />
          </h2>
        </div>
        <p className="max-w-xs font-light leading-relaxed text-gris md:text-right md:text-lg">
          Quatre engagements, sur chaque projet.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
        {REASONS.map((r, i) => (
          <Card key={r.id} r={r} i={i} />
        ))}
      </ul>
    </section>
  )
}
