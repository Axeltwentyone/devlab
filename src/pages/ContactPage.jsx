import { useContent } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import { Dot } from '../components/Logo.jsx'
import { ContactCards, LiveLine } from '../components/Closing.jsx'
import Method from '../components/Method.jsx'
import useAbidjanClock from '../hooks/useAbidjanClock.js'

const DAYS = [[1, 'Lundi'], [2, 'Mardi'], [3, 'Mercredi'], [4, 'Jeudi'], [5, 'Vendredi'], [6, 'Samedi'], [0, 'Dimanche']]

// Horaires de la semaine, aujourd'hui mis en avant (heure d'Abidjan)
function Hours() {
  const { status } = useContent()
  const { hours } = status
  const { day, open } = useAbidjanClock(hours)
  return (
    <div>
      <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.045em]">Horaires<Dot className="bg-bronze" /></h2>
      <p className="mt-2 text-[15px] text-gris">Heure d’Abidjan. Vous pouvez écrire à tout moment, on répond dès l’ouverture.</p>
      <ul data-reveal-stagger className="mt-8 border-b border-pierre">
        {DAYS.map(([d, label]) => {
          const isOpen = hours.days.includes(d)
          const today = d === day
          return (
            <li key={d} className={`flex items-center justify-between border-t border-pierre py-3.5 text-[16px] ${today ? 'font-medium' : ''}`}>
              <span className="flex items-center gap-3">
                {label}
                {today && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${open ? 'bg-[#DDF5E4] text-[#1B6B36] dark:bg-[#1F4D3A] dark:text-[#9BE3B1]' : 'bg-fond text-gris'}`}>
                    {open ? 'Ouvert maintenant' : 'Aujourd’hui'}
                  </span>
                )}
              </span>
              <span className={`tabular-nums ${isOpen ? '' : 'text-gris'}`}>{isOpen ? `${hours.open} h – ${hours.close} h` : 'Fermé'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ContactPage() {
  usePageTitle('Contact')
  return (
    <>
      <section data-tone="dark" className="bg-encre text-white">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-14 md:px-[72px] md:pb-24 md:pt-28">
          <p className="label text-doux">Contact</p>
          <h1 className="mt-4 text-[clamp(2.75rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
            Un projet ?<br /><span className="text-doux">Parlons-en</span><Dot className="bg-bronze" />
          </h1>
          <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-doux">
            Une idée, une boutique à mettre en ligne, une app à lancer : dites-nous où vous en êtes, on vous dit par où commencer.
          </p>
          <LiveLine className="mt-8 [&>span:first-child]:text-white" />
          <ContactCards className="mt-12 md:mt-16" />
        </div>
      </section>

      <div className="pt-20 md:pt-28" />
      <Method />
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-28">
        <div className="max-w-2xl">
          <Hours />
        </div>
      </section>
    </>
  )
}
