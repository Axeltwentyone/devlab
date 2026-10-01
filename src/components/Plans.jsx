import { useState } from 'react'
import { Dot } from './Logo.jsx'
import { PLANS, whatsappLink } from '../data/site.js'

// Même grammaire que la liste des projets : une ligne par formule, le détail s'ouvre au clic.
export default function Plans() {
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(null)

  return (
    <section id="formules" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <div className="mb-5 flex items-baseline justify-between gap-6 md:mb-7">
        <h2 className="text-sm font-medium text-gris">Formules</h2>
        <p className="text-right text-sm text-gris">
          Un doute ? Le <a href="#diagnostic" className="border-b border-gris">diagnostic</a> vous oriente.
        </p>
      </div>

      <ul onPointerLeave={() => setHovered(null)} className="border-b border-pierre">
        {PLANS.map((plan, i) => {
          const isOpen = open === plan.id
          const dim = hovered && hovered !== plan.id
          return (
            <li key={plan.id} className="border-t border-pierre" onPointerEnter={() => setHovered(plan.id)}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`formule-${plan.id}`}
                onClick={() => setOpen(isOpen ? null : plan.id)}
                data-cursor="voir"
                className={`flex w-full items-center gap-4 py-6 text-left transition-opacity duration-300 md:gap-10 md:py-7 ${dim ? 'opacity-35' : 'opacity-100'}`}
              >
                <span className="w-14 shrink-0 text-sm text-gris">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[clamp(1.75rem,4.4vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
                    {plan.name}
                    {(hovered === plan.id || isOpen) && <Dot className="bg-bronze" />}
                  </span>
                  <span className="mt-2 block text-sm text-gris md:hidden">{plan.delay}</span>
                </span>
                <span className="hidden w-36 text-sm font-light text-gris lg:block">{plan.delay}</span>
                <span className="shrink-0 text-right">
                  {plan.from && <span className="block text-xs text-gris">dès</span>}
                  <span className="text-lg font-extrabold tracking-[-0.03em] md:text-2xl">{plan.price}</span>
                  {plan.unit && <span className="ml-1.5 text-xs font-medium md:text-sm">{plan.unit}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className={`hidden w-6 shrink-0 text-center text-2xl font-light transition-transform duration-300 md:block ${isOpen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div id={`formule-${plan.id}`} className="grid gap-8 pb-10 md:grid-cols-[1fr_auto] md:items-end md:pl-24">
                  <ul className="flex max-w-xl flex-col gap-2.5 text-[17px] font-light leading-relaxed">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-bronze" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink(`Bonjour DevLab ! La formule « ${plan.name} » m’intéresse. On peut en parler ?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start rounded-full bg-encre px-7 py-4 text-center text-[15px] font-medium text-white transition-opacity hover:opacity-85 md:self-auto"
                  >
                    {plan.unit ? 'Démarrer sur WhatsApp ↗' : 'Demander un devis ↗'}
                  </a>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
