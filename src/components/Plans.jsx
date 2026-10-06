import { Dot } from './Logo.jsx'
import { PLANS, whatsappLink } from '../data/site.js'

const MAX_WEEKS = 12

// Mini-visuels : à quoi ressemble concrètement chaque formule.
function VitrineArt() {
  return (
    <div className="w-[78%] overflow-hidden rounded-lg bg-white shadow-[0_18px_40px_-18px_rgba(17,17,17,0.35)] transition-transform duration-500 group-hover:-translate-y-1.5">
      <div className="flex items-center gap-1 border-b border-fond px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-pierre" /><span className="size-1.5 rounded-full bg-pierre" /><span className="size-1.5 rounded-full bg-pierre" />
        <span className="ml-2 h-2.5 flex-1 rounded bg-fond" />
      </div>
      <div className="p-3">
        <div className="h-2.5 w-2/3 rounded bg-encre" />
        <div className="mt-1.5 h-2.5 w-1/2 rounded bg-encre" />
        <div className="mt-3 flex gap-1.5">
          <span className="h-1.5 w-full rounded bg-fond" /><span className="h-1.5 w-full rounded bg-fond" />
        </div>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#3BD16F] px-2 py-0.5 text-[9px] font-medium text-encre">WhatsApp</span>
      </div>
    </div>
  )
}

function BoutiqueArt() {
  return (
    <div className="w-[78%] rounded-lg bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(17,17,17,0.35)] transition-transform duration-500 group-hover:-translate-y-1.5">
      <div className="grid grid-cols-3 gap-1.5">
        {['bg-encre', 'bg-bronze', 'bg-pierre'].map((c) => (
          <div key={c}>
            <div className={`aspect-square rounded ${c}`} />
            <div className="mt-1 h-1 w-3/4 rounded bg-fond" />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-md bg-fond px-2 py-1.5 text-[9px]">
        <span className="font-medium text-encre">Payer</span>
        <span className="flex gap-1">
          <span className="rounded bg-[#1DC3F1] px-1.5 py-0.5 font-medium text-white">Wave</span>
          <span className="rounded bg-[#FF7900] px-1.5 py-0.5 font-medium text-white">OM</span>
          <span className="rounded bg-[#FFCC00] px-1.5 py-0.5 font-medium text-encre">MoMo</span>
        </span>
      </div>
    </div>
  )
}

function AppArt() {
  return (
    <div className="aspect-[9/17] w-[34%] rounded-[1rem] bg-encre p-[3px] shadow-[0_18px_40px_-18px_rgba(17,17,17,0.5)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-3deg]">
      <div className="flex h-full flex-col gap-1.5 rounded-[0.8rem] bg-white p-2">
        <div className="h-1.5 w-1/2 rounded bg-encre" />
        <div className="h-8 rounded-md bg-encre" />
        <div className="grid grid-cols-2 gap-1">
          <div className="h-5 rounded bg-fond" /><div className="h-5 rounded bg-fond" />
        </div>
        <div className="mt-auto h-3 rounded-full bg-bronze" />
      </div>
    </div>
  )
}

const ART = { vitrine: VitrineArt, ecommerce: BoutiqueArt, app: AppArt }

// Jauge du délai : une case par semaine, la fourchette en bronze clair
function Weeks({ weeks: [min, max], delay }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gris">
        <span>Délai</span>
        <span className="font-medium text-encre">{delay}</span>
      </div>
      <div className="mt-2 flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: MAX_WEEKS }, (_, w) => (
          <span
            key={w}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: w < min ? 'var(--color-encre)' : w < max ? 'var(--color-bronze)' : 'var(--color-fond)' }}
          />
        ))}
      </div>
    </div>
  )
}

function PlanCard({ plan, i }) {
  const Art = ART[plan.id]
  const quote = !plan.unit
  return (
    <li className="group flex w-[84vw] max-w-[420px] shrink-0 snap-center flex-col rounded-3xl border border-pierre bg-white p-3 transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:border-encre hover:shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)] sm:w-[60vw] lg:w-auto lg:max-w-none">
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-fond">
        <span className="absolute left-4 top-3 text-xs text-gris">{String(i + 1).padStart(2, '0')}</span>
        {Art && <Art />}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
        <h3 className="text-[clamp(1.6rem,2.2vw,2.1rem)] font-extrabold leading-none tracking-[-0.04em]">
          {plan.name}<Dot className="bg-bronze opacity-0 transition-opacity group-hover:opacity-100" />
        </h3>
        <p className="mt-2 text-[15px] font-light text-gris">{plan.pitch}</p>

        <p className="mt-6 flex items-baseline gap-1.5">
          <span className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-extrabold tracking-[-0.04em]">{plan.price}</span>
          {plan.unit && <span className="text-sm font-medium">{plan.unit}</span>}
        </p>

        <div className="mt-5">
          <Weeks weeks={plan.weeks} delay={plan.delay} />
        </div>

        <ul className="mt-6 flex flex-col gap-2.5 border-t border-fond pt-5 text-[15px] leading-relaxed">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.3em] flex size-4 shrink-0 items-center justify-center rounded-full bg-encre text-[9px] text-white">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {plan.reference && (
            <p className="mb-4 text-sm text-gris">
              Exemple :{' '}
              <a
                href={plan.reference.href}
                {...(plan.reference.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="border-b border-gris font-medium text-encre"
              >
                {plan.reference.name}{plan.reference.href.startsWith('http') ? ' ↗' : ''}
              </a>
            </p>
          )}
          <a
            href={whatsappLink(`Bonjour DevLab ! La formule « ${plan.name} » m’intéresse. On peut en parler ?`)}
            target="_blank"
            rel="noreferrer"
            data-cursor="voir"
            className={`flex items-center justify-center gap-2 rounded-full py-4 text-[15px] font-medium transition-colors ${
              quote ? 'border border-encre text-encre hover:bg-encre hover:text-white' : 'bg-encre text-white hover:bg-bronze'
            }`}
          >
            {quote ? 'Demander un devis' : 'Démarrer sur WhatsApp'} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </li>
  )
}

export default function Plans() {
  return (
    <section id="formules" className="mx-auto max-w-[1440px] pb-20 md:pb-32">
      <div className="flex flex-col gap-5 px-5 md:flex-row md:items-end md:justify-between md:px-[72px]">
        <div>
          <p className="text-sm font-medium text-gris">Formules</p>
          <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Trois façons<br /><span className="text-gris">de démarrer</span><Dot className="bg-bronze" />
          </h2>
        </div>
        <p className="max-w-xs font-light leading-relaxed text-gris md:text-right md:text-lg">
          Prix et délai fixés ensemble avant de commencer. Rien ne change sans votre accord.
        </p>
      </div>

      {/* Carrousel au doigt sur mobile, trois colonnes sur grand écran */}
      <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mt-16 md:px-[72px] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} i={i} />
        ))}
      </ul>
      <p className="px-5 text-center text-xs text-gris lg:hidden" aria-hidden="true">← Glissez pour voir les formules →</p>

      {/* Pas sûr : renvoi vers le diagnostic */}
      <a
        href="#diagnostic"
        className="group mx-5 mt-8 flex items-center justify-between gap-4 rounded-3xl bg-fond px-6 py-6 transition-colors hover:bg-pierre/60 md:mx-[72px] md:mt-10 md:px-10"
      >
        <span>
          <span className="block text-lg font-extrabold tracking-[-0.03em] md:text-2xl">Pas sûr de la bonne formule ?</span>
          <span className="mt-1 block text-[15px] font-light text-gris">Trois questions, et le diagnostic vous oriente.</span>
        </span>
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-encre text-xl text-white transition-transform group-hover:translate-x-1">→</span>
      </a>
    </section>
  )
}
