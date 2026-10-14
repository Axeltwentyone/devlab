import { useState } from 'react'
import { useContent, useWhatsapp } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import Plans from '../components/Plans.jsx'
import Why from '../components/Why.jsx'
import { Dot } from '../components/Logo.jsx'

function Faq() {
  const { faq } = useContent()
  const [open, setOpen] = useState(0)
  if (!faq?.length) return null
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-20 md:px-[72px] md:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
      <div>
        <p className="label text-gris">Questions fréquentes</p>
        <h2 className="mt-4 text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
          Avant de<br /><span className="text-gris">se lancer</span><Dot className="bg-bronze" />
        </h2>
      </div>
      <ul className="border-b border-pierre">
        {faq.map((f, i) => {
          const isOpen = open === i
          return (
            <li key={f.q} className="border-t border-pierre">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.15rem,1.6vw,1.4rem)] font-extrabold tracking-[-0.025em]"
              >
                {f.q}
                <span aria-hidden="true" className={`text-2xl font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <p className="overflow-hidden pr-10 text-[17px] font-light leading-relaxed text-gris">
                  <span className="block pb-6">{f.a}</span>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// Tableau comparatif : les formules côte à côte, à partir des mêmes données que les cartes
function Compare() {
  const { plans } = useContent()
  const whatsappLink = useWhatsapp()
  if (plans.length < 2) return null
  const rows = [
    ['Pour qui', (p) => p.pitch],
    ['Prix', (p) => (p.unit ? `${p.price} ${p.unit}` : p.price)],
    ['Délai', (p) => p.delay],
    ['Inclus', (p) => (
      <ul className="flex flex-col gap-2">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden="true" className="mt-[0.35em] size-1.5 shrink-0 rounded-full bg-bronze" />
            {f}
          </li>
        ))}
      </ul>
    )],
    ['Exemple', (p) => (p.reference?.name ? <a href={p.reference.href} className="border-b border-encre pb-0.5">{p.reference.name}</a> : '—')],
  ]
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <p className="label text-gris">Comparer</p>
      <h2 className="mt-4 text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
        Côte à côte<Dot className="bg-bronze" />
      </h2>
      <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
          <thead>
            <tr>
              <th className="w-40 pb-5" />
              {plans.map((p) => (
                <th key={p.id} scope="col" className="pb-5 pr-6 align-bottom">
                  <span className="block text-[clamp(1.3rem,2vw,1.75rem)] font-extrabold tracking-[-0.035em]">{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, cell]) => (
              <tr key={label} className="border-t border-pierre align-top">
                <th scope="row" className="py-5 pr-6 label text-gris">{label}</th>
                {plans.map((p) => (
                  <td key={p.id} className={`py-5 pr-6 ${label === 'Prix' ? 'text-xl font-extrabold tracking-[-0.03em]' : 'font-light leading-relaxed'}`}>
                    {cell(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-pierre">
              <th scope="row" />
              {plans.map((p) => (
                <td key={p.id} className="pr-6 pt-6">
                  <a
                    href={whatsappLink(`Bonjour theLab ! La formule « ${p.name} » m’intéresse. On peut en parler ?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-encre px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-bronze"
                  >
                    {p.unit ? 'Démarrer' : 'Demander un devis'} <span aria-hidden="true">↗</span>
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function PlansPage() {
  usePageTitle('Formules')
  return (
    <>
      <div className="pt-14 md:pt-28">
        <Plans />
      </div>
      <Compare />
      <Why />
      <Faq />
    </>
  )
}
