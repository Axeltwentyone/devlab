import { Dot } from './Logo.jsx'
import { EXPERTISE } from '../data/site.js'

export default function Expertise() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[72px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-gris">Savoir-faire</p>
            <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
              Ce qu’on sait<br /><span className="text-gris">faire, et bien</span><Dot className="bg-bronze" />
            </h2>
          </div>
          <a href="#formules" className="self-start border-b border-encre pb-0.5 text-[15px] font-medium md:self-auto">
            Voir les formules →
          </a>
        </div>

        <ul className="mt-12 border-b border-pierre md:mt-16">
          {EXPERTISE.map((e, i) => (
            <li
              key={e.name}
              className="group relative -mx-5 grid gap-4 border-t border-pierre px-5 py-7 transition-colors duration-300 hover:bg-encre hover:text-white md:-mx-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center md:gap-10 md:rounded-2xl md:border-transparent md:px-6 md:py-9 md:[&+li]:border-pierre"
            >
              <div className="flex items-baseline gap-4 md:gap-6">
                <span className="text-sm text-gris transition-colors group-hover:text-doux">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-[clamp(1.8rem,3.6vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.045em]">
                  {e.name}
                  <Dot className="bg-bronze opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </h3>
              </div>
              <div className="pl-10 md:pl-0">
                <p className="text-[16px] font-light leading-relaxed text-gris transition-colors group-hover:text-pierre">
                  {e.text}
                  {e.proof && <> Comme <span className="font-medium text-encre transition-colors group-hover:text-white">{e.proof}</span>.</>}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <li key={t} className="rounded-full border border-pierre px-3 py-1 text-xs transition-colors group-hover:border-trait group-hover:text-pierre">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
