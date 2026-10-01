import { useState } from 'react'
import { Dot } from './Logo.jsx'
import Phone from './Phone.jsx'
import { PROJECTS } from '../data/site.js'
import shoptongbaOnboarding from '../assets/shoptongba-onboarding.webp'
import shoptongbaAccueil from '../assets/shoptongba-accueil.webp'
import subciAccueil from '../assets/subci-accueil.webp'
import subciExplorer from '../assets/subci-explorer.webp'
import subciAbonnements from '../assets/subci-abonnements.webp'
import subciOffre from '../assets/subci-offre.webp'

const IMAGES = {
  'shoptongba-onboarding': shoptongbaOnboarding,
  'shoptongba-accueil': shoptongbaAccueil,
  'subci-accueil': subciAccueil,
  'subci-explorer': subciExplorer,
  'subci-abonnements': subciAbonnements,
  'subci-offre': subciOffre,
}
const ALT = {
  'shoptongba-onboarding': 'ShopTongba : écran d’accueil « Une voiture. Maintenant. »',
  'shoptongba-accueil': 'ShopTongba : recherche de véhicules autour de soi à Abidjan',
  'subci-accueil': 'Subci : accueil avec l’abonnement en cours d’activation et les offres populaires',
  'subci-explorer': 'Subci : explorer les abonnements partagés disponibles et leurs prix',
  'subci-abonnements': 'Subci : mes abonnements actifs et les économies du mois',
  'subci-offre': 'Subci : gérer une offre partagée, prix par place et nombre de places',
}

// Étude de cas courte : le problème, ce qu'on a construit, quelques faits.
function CaseStudy({ problem, solution, facts }) {
  return (
    <>
      <dl className="mt-8 grid gap-5 border-t border-pierre pt-5">
        <div>
          <dt className="text-xs font-medium text-gris">Le problème</dt>
          <dd className="mt-1 text-[15px] leading-relaxed">{problem}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gris">Ce qu’on a construit</dt>
          <dd className="mt-1 text-[15px] leading-relaxed">{solution}</dd>
        </div>
      </dl>
      <ul className="mt-6 flex flex-wrap gap-2">
        {facts.map((f) => (
          <li key={f} className="rounded-full border border-pierre px-3 py-1 text-xs">{f}</li>
        ))}
      </ul>
    </>
  )
}

export default function ProjectIndex() {
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(null)

  return (
    <section id="index" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <h2 className="mb-5 text-sm font-medium text-gris md:mb-7">Projets</h2>

      <ul onPointerLeave={() => setHovered(null)} className="border-b border-pierre">
        {PROJECTS.map((p) => {
          const dim = hovered && hovered !== p.id
          const isOpen = open === p.id
          const content = (
            <>
              <span className="w-14 shrink-0 text-sm text-gris">{String(PROJECTS.indexOf(p) + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 text-[clamp(2rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
                {p.name}
                {hovered === p.id && p.id !== 'vous' && <Dot className="bg-bronze" />}
              </span>
              <span className="hidden w-56 text-sm font-light text-gris lg:block">{p.kind}</span>
              <span className="hidden w-20 text-sm font-light text-gris lg:block">{p.year}</span>
              <span className="w-24 text-right text-sm font-medium">{p.status}</span>
            </>
          )
          const rowClass = `flex w-full items-center gap-4 py-6 text-left transition-opacity duration-300 md:gap-10 md:py-7 ${dim ? 'opacity-35' : 'opacity-100'}`

          return (
            <li key={p.id} className="border-t border-pierre" onPointerEnter={() => setHovered(p.id)}>
              {p.href ? (
                <a href={p.href} className={rowClass} data-cursor="voir">{content}</a>
              ) : (
                <button
                  type="button"
                  className={rowClass}
                  aria-expanded={isOpen}
                  aria-controls={`projet-${p.id}`}
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  data-cursor="voir"
                >
                  {content}
                </button>
              )}

              {!p.href && isOpen && (
                <div id={`projet-${p.id}`} className="grid gap-8 pb-10 md:pl-24 xl:grid-cols-[1fr_auto]">
                  <div className="max-w-md">
                    <p className="text-lg font-light leading-relaxed text-gris">{p.summary}</p>
                    <p className="mt-3 text-sm text-gris lg:hidden">{p.kind}</p>
                    {p.caseStudy && <CaseStudy {...p.caseStudy} />}
                  </div>
                  <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-6 md:mx-0 md:px-0">
                    {p.images.map((img) => (
                      <Phone key={img} src={IMAGES[img]} alt={ALT[img]} className="w-36 shrink-0 md:w-44" />
                    ))}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
