import { Dot } from './Logo.jsx'
import MoreLink from './MoreLink.jsx'
import { useContent } from '../content/ContentContext.jsx'

// Aperçu des formules sur l'accueil : une ligne par formule (nom, pour qui, délai, prix).
// Les cartes complètes et la FAQ sont sur /formules.
export default function PlansTeaser() {
  const { plans } = useContent()
  return (
    <section id="formules" className="mx-auto max-w-[1440px] mt-6 px-5 pb-20 md:px-[72px] md:pb-32">
      <div data-reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-gris">Formules</p>
          <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Trois façons<br /><span className="text-gris">de démarrer</span><Dot className="bg-bronze" />
          </h2>
        </div>
        <MoreLink href="/formules" className="self-start md:self-auto">Comparer les formules</MoreLink>
      </div>

      <ul data-reveal-stagger className="mt-12 border-b border-pierre md:mt-16">
        {plans.map((p, i) => (
          <li key={p.id}>
            <a
              href={`/formules#formule-${p.id}`}
              className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1 border-t border-pierre py-6 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_10rem_9rem] md:gap-x-8 md:py-8"
            >
              <span className="text-sm text-gris">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[clamp(1.6rem,3.2vw,3rem)] font-extrabold leading-none tracking-[-0.045em] transition-transform duration-300 group-hover:translate-x-2">
                {p.name}
              </span>
              <span className="col-start-2 row-start-2 text-sm text-gris md:col-start-auto md:row-start-auto md:text-[15px] md:font-light">{p.pitch}</span>
              <span className="hidden text-sm text-gris md:block">{p.delay}</span>
              <span className="col-start-3 row-span-2 row-start-1 text-right md:col-start-auto md:row-span-1 md:row-start-auto">
                <span className="text-lg font-extrabold tracking-[-0.03em] md:text-2xl">{p.price}</span>
                {p.unit && <span className="ml-1 text-xs font-medium">{p.unit}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
