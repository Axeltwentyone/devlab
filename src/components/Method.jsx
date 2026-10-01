import { Dot } from './Logo.jsx'
import { STEPS } from '../data/site.js'

export default function Method() {
  return (
    <section id="methode" className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-gris">La méthode devlab</p>
          <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Du premier message<br /><span className="text-gris">à la mise en ligne</span><Dot className="bg-bronze" />
          </h2>
        </div>
        <p className="max-w-xs font-light leading-relaxed text-gris md:text-right md:text-lg">
          Quatre étapes, pas de surprise. Vous savez toujours où en est votre projet.
        </p>
      </div>

      <ol className="mt-12 grid gap-x-8 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="group border-t border-encre pb-4 pt-6 sm:pb-10">
            <span className="block text-[clamp(3.5rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.06em] text-pierre transition-colors duration-300 group-hover:text-bronze">
              {i + 1}
            </span>
            <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] md:text-[28px]">{step.title}</h3>
            <p className="mt-3 max-w-xs text-[15px] font-light leading-relaxed text-gris">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
