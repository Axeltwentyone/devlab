import { Dot } from './Logo.jsx'
import MoreLink from './MoreLink.jsx'
import { useContent } from '../content/ContentContext.jsx'

// Aperçu du diagnostic sur l'accueil : la première question, dont chaque réponse ouvre la page /diagnostic.
export default function DiagnosticTeaser() {
  const { diagnostic } = useContent()
  const first = diagnostic.questions[0]
  if (!first) return null
  return (
    <section id="diagnostic" className="bg-fond">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-[72px] md:py-28 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center lg:gap-20">
        <div>
          <p className="label text-gris">Diagnostic express</p>
          <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Trois questions.<br /><span className="text-gris">Une recommandation</span><Dot className="bg-bronze" />
          </h2>
          <p className="mt-6 max-w-md text-[17px] font-light leading-relaxed text-gris">
            30 secondes, sans inscription. On vous dit ce dont vous avez vraiment besoin, et combien de temps ça prend.
          </p>
          <MoreLink href="/diagnostic" className="mt-8">Faire le diagnostic</MoreLink>
        </div>

        <div className="rounded-[28px] bg-[#EFEAE2] p-5 shadow-[0_40px_80px_-40px_rgba(17,17,17,0.4)] ring-1 ring-pierre md:p-6">
          <div className="flex max-w-[85%] items-end gap-2">
            <span aria-hidden="true" className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-encre text-[11px] font-extrabold text-white">
              t<span className="text-bronze">.</span>
            </span>
            <p className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[15px] text-encre">{first.title}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {first.options.map((o) => (
              <a
                key={o.id}
                href={`/diagnostic?${first.id}=${encodeURIComponent(o.id)}`}
                className="rounded-full border border-pierre bg-white px-4 py-2.5 text-[14px] transition-colors hover:border-encre hover:bg-encre hover:text-white"
              >
                {o.label}
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-gris">Question 1 sur {diagnostic.questions.length}</p>
        </div>
      </div>
    </section>
  )
}
