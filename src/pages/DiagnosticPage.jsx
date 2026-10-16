import { useState } from 'react'
import { useContent } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import Diagnostic from '../components/Diagnostic.jsx'
import { Dot } from '../components/Logo.jsx'

// Les recommandations possibles, et la réponse qui y mène
function Outcomes({ match }) {
  const { diagnostic } = useContent()
  const besoin = diagnostic.questions.find((q) => q.id === 'besoin')
  const entries = Object.entries(diagnostic.recommendations)
  if (!entries.length) return null
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
      <p className="label text-gris">Les recommandations</p>
      <h2 className="mt-4 max-w-3xl text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
        Ce qu’on peut<br /><span className="text-gris">vous conseiller</span><Dot className="bg-bronze" />
      </h2>
      <ul data-reveal-stagger className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
        {entries.map(([key, r]) => {
          const answer = besoin?.options.find((o) => o.id === key)?.label
          const yours = match === key
          return (
            <li
              key={key}
              id={`reco-${key}`}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-500 md:p-8 ${
                yours ? 'border-encre bg-encre text-white shadow-[0_30px_60px_-30px_rgba(17,17,17,0.5)]' : match ? 'border-pierre opacity-50' : 'border-pierre'
              }`}
            >
              {yours && <span className="absolute right-5 top-5 rounded-full bg-bronze px-3 py-1 text-xs font-medium text-white">Pour vous</span>}
              {answer && (
                <p className={`text-sm ${yours ? 'text-doux' : 'text-gris'}`}>
                  Si vous voulez <span className={`font-medium ${yours ? 'text-white' : 'text-encre'}`}>« {answer.charAt(0).toLowerCase() + answer.slice(1)} »</span>
                </p>
              )}
              <h3 className="mt-3 text-[clamp(1.4rem,2.2vw,1.9rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">{r.title}</h3>
              <p className={`mt-3 text-[16px] font-light leading-relaxed ${yours ? 'text-doux' : 'text-gris'}`}>{r.text}</p>
              <dl className={`mt-auto grid grid-cols-3 gap-3 border-t pt-5 text-sm ${yours ? 'border-trait' : 'border-fond'}`}>
                {[['Formule', r.plan], ['Délai', r.delay], ['Tarif', r.price]].map(([k, v]) => (
                  <div key={k}>
                    <dt className={`text-xs ${yours ? 'text-doux' : 'text-gris'}`}>{k}</dt>
                    <dd className="mt-1 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// Ce qui se passe une fois le message envoyé (reprend les deux premières étapes de la méthode)
function After() {
  const { steps } = useContent()
  const items = [
    { title: 'Votre message arrive sur notre WhatsApp', text: 'Il reprend vos réponses : pas besoin de tout réexpliquer.' },
    steps[0] && { title: 'On vous répond', text: steps[0].text },
    steps[1],
  ].filter(Boolean)
  return (
    <section className="bg-fond">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
        <p className="label text-gris">Et ensuite ?</p>
        <ol data-reveal-stagger className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {items.map((it, i) => (
            <li key={it.title} className="border-t border-encre pt-6">
              <span className="text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.06em] text-pierre">{i + 1}</span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.035em]">{it.title}</h3>
              <p className="mt-3 max-w-xs text-[15px] font-light leading-relaxed text-gris">{it.text}</p>
            </li>
          ))}
        </ol>
        <a href="/studio#methode" className="mt-12 inline-flex items-center gap-2 border-b border-encre pb-0.5 text-[15px] font-medium transition-colors hover:border-bronze hover:text-bronze">
          Toute la méthode <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

export default function DiagnosticPage() {
  usePageTitle('Diagnostic')
  const [match, setMatch] = useState(null)
  return (
    <>
      <Diagnostic page onResult={setMatch} />
      {match && (
        <a
          href={`#reco-${match}`}
          className="relative z-10 mx-auto -mt-5 flex w-fit items-center gap-2 rounded-full bg-bronze px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:translate-y-0.5"
        >
          Voir votre recommandation en détail <span aria-hidden="true">↓</span>
        </a>
      )}
      <Outcomes match={match} />
      <After />
    </>
  )
}
