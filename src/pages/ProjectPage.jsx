import { useContent, useWhatsapp } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import { Dot } from '../components/Logo.jsx'
import { Shot, SiteLink, TitleWithDot } from '../components/ProjectIndex.jsx'
import NotFound from './NotFound.jsx'

// Adresse affichée sans https:// ni www.
const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

// Page d'un projet : tout l'écran prend l'univers du projet, puis l'étude de cas et toutes les captures.
export default function ProjectPage({ id }) {
  const { projects } = useContent()
  const whatsappLink = useWhatsapp()
  const cases = projects.filter((p) => !p.href)
  const index = cases.findIndex((p) => p.id.toLowerCase() === id.toLowerCase())
  const p = cases[index]
  usePageTitle(p ? p.name : 'Projet introuvable')
  if (!p) return <NotFound />

  const t = p.theme
  const shown = new Set((p.caseStudy?.features || []).map((f) => f.image))
  const gallery = p.images.filter((img) => !shown.has(img))
  const next = cases[(index + 1) % cases.length]
  const shots = p.images.slice(0, 3)
  const order = shots.length === 3 ? [shots[0], shots[1], shots[2]] : shots
  const fan = ['-rotate-[8deg] translate-y-8', 'z-10 -translate-y-2', 'rotate-[8deg] translate-y-8']

  return (
    <article>
      {/* Ouverture dans l'univers du projet */}
      <header className="overflow-hidden" style={{ background: t.bg, color: t.fg }}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-10 md:px-[72px] md:pb-24 md:pt-16 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <nav aria-label="Fil d’Ariane" className="text-sm" style={{ color: t.muted }}>
              <a href="/projets" className="hover:underline">Projets</a> <span aria-hidden="true">/</span> {p.name}
            </nav>
            <p className="mt-10 text-sm" style={{ color: t.muted }}>{p.kind} · {p.year}</p>
            <h1 className="mt-3 text-[clamp(3rem,9vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
              <TitleWithDot name={p.name} color={t.accent} />
            </h1>
            <p className="mt-5 text-[clamp(1.3rem,2vw,1.75rem)] font-light" style={{ color: t.muted }}>{p.tagline}</p>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed">{p.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: t.accent, color: '#fff' }}>{p.status}</span>
              {p.url && <SiteLink url={p.url} />}
            </div>
          </div>
          {order.length > 0 && (
            <div className="relative flex justify-center pb-6 lg:pr-4">
              <div aria-hidden="true" className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${t.accent}55, transparent 68%)` }} />
              {order.map((img, k) => (
                <div key={img} className={`-mx-6 ${order.length === 3 ? fan[k] : k ? 'translate-y-6 rotate-6' : '-rotate-6'}`}>
                  <Shot id={img} alt="" className="w-32 sm:w-40 lg:w-48" />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Fiche projet */}
      <section aria-label="Fiche projet" className="border-b border-pierre">
        <dl className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px px-5 md:grid-cols-4 md:px-[72px]">
          {[
            ['Type', p.kind],
            ['Année', p.year],
            ['Statut', p.status],
            ['En ligne', p.url ? hostOf(p.url) : '—'],
          ].map(([k, v], i) => (
            <div key={k} className={`py-6 md:py-8 ${i % 2 ? 'pl-5 md:pl-8' : ''} ${i > 0 ? 'md:border-l md:border-pierre md:pl-8' : ''} ${i > 1 ? 'border-t border-pierre md:border-t-0' : ''}`}>
              <dt className="text-xs text-gris">{k}</dt>
              <dd className="mt-1.5 text-[17px] font-medium">
                {k === 'En ligne' && p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="border-b border-encre pb-0.5 hover:text-bronze">{v} ↗</a>
                ) : v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Étude de cas */}
      {p.caseStudy && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
          <p className="label text-gris">Étude de cas</p>
          <div className={`mt-8 grid gap-12 md:gap-16 ${p.caseStudy.problem ? 'md:grid-cols-2' : 'max-w-3xl'}`}>
            {p.caseStudy.problem && (
              <div>
                <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.045em]">Le problème<Dot className="bg-bronze" /></h2>
                <p className="mt-5 text-[19px] font-light leading-relaxed text-gris">{p.caseStudy.problem}</p>
              </div>
            )}
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.045em]">{p.caseStudy.problem ? 'Ce qu’on a construit' : 'Le projet'}<Dot className="bg-bronze" /></h2>
              <p className="mt-5 text-[19px] font-light leading-relaxed text-gris">{p.caseStudy.solution}</p>
            </div>
          </div>
          {p.caseStudy.facts?.length > 0 && (
            <ul data-reveal-stagger className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-pierre sm:grid-cols-2 lg:grid-cols-3">
              {p.caseStudy.facts.map((f, k) => (
                <li key={f} className="flex items-baseline gap-4 bg-white p-6 md:p-8">
                  <span className="text-sm text-gris">{String(k + 1).padStart(2, '0')}</span>
                  <span className="text-xl font-extrabold tracking-[-0.03em]">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Pour qui */}
      {p.caseStudy?.audience?.length > 0 && (
        <section className="bg-fond">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
            <p className="label text-gris">Pour qui</p>
            <ul data-reveal-stagger className="mt-8 grid gap-4 md:grid-cols-2">
              {p.caseStudy.audience.map((a, k) => (
                <li key={a.title} className="rounded-3xl bg-white p-7 md:p-10">
                  <span className="flex size-10 items-center justify-center rounded-full text-sm font-medium text-white" style={{ background: t.accent }}>{k + 1}</span>
                  <h2 className="mt-6 text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.045em]">{a.title}</h2>
                  <p className="mt-4 text-[17px] font-light leading-relaxed text-gris">{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* L'app, écran par écran */}
      {p.caseStudy?.features?.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
          <p className="label text-gris">Écran par écran</p>
          <h2 className="mt-4 text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
            Comment ça<br /><span className="text-gris">marche</span><Dot className="bg-bronze" />
          </h2>
          <ol data-reveal-stagger className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
            {p.caseStudy.features.map((f, k) => (
              <li key={f.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                {f.image && (
                  <div className={`relative flex justify-center rounded-[2rem] py-10 md:py-14 ${k % 2 ? 'md:order-2' : ''}`} style={{ background: t.bg }}>
                    <div aria-hidden="true" className="absolute inset-[15%] rounded-full" style={{ background: `radial-gradient(circle, ${t.accent}33, transparent 70%)` }} />
                    <Shot id={f.image} className="relative w-48 md:w-60" />
                  </div>
                )}
                <div className={k % 2 ? 'md:order-1' : ''}>
                  <span className="text-sm text-gris">{String(k + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.045em]">
                    {f.title}<Dot className="bg-bronze" />
                  </h3>
                  <p className="mt-5 max-w-lg text-[18px] font-light leading-relaxed text-gris">{f.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Toutes les captures */}
      {gallery.length > 0 && (
        <section className="bg-fond py-16 md:py-24" aria-label="Captures">
          <div className="mx-auto max-w-[1440px] px-5 md:px-[72px]">
            <p className="label text-gris">Les écrans</p>
          </div>
          <div className="mx-auto mt-8 flex max-w-[1440px] snap-x gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-[72px] [&::-webkit-scrollbar]:hidden">
            {gallery.map((img) => (
              <div key={img} className="snap-start">
                <Shot id={img} alt={undefined} className="w-44 shrink-0 md:w-56" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Un projet comme celui-ci ? */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-20 md:flex-row md:items-end md:justify-between md:px-[72px] md:py-28">
        <h2 className="max-w-2xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
          Un projet comme {p.name} ?<br /><span className="text-gris">Parlons-en</span><Dot className="bg-bronze" />
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={whatsappLink(`Bonjour theLab ! J’ai vu le projet ${p.name}, j’aimerais quelque chose de similaire. On peut en parler ?`)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-encre px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-bronze"
          >
            Écrire sur WhatsApp ↗
          </a>
          <a href="/formules" className="rounded-full border border-pierre px-6 py-4 text-[15px] font-medium transition-colors hover:border-encre">
            Voir les formules
          </a>
        </div>
      </section>

      {/* Projet suivant */}
      {next && next.id !== p.id && (
        <a href={`/projets/${next.id.toLowerCase()}`} data-cursor="voir" className="group block" style={{ background: next.theme.bg, color: next.theme.fg }}>
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-14 md:px-[72px] md:py-20">
            <div>
              <p className="text-sm" style={{ color: next.theme.muted }}>Projet suivant</p>
              <p className="mt-2 text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
                <TitleWithDot name={next.name} color={next.theme.accent} />
              </p>
            </div>
            <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full text-2xl transition-transform duration-500 group-hover:translate-x-2 md:size-20" style={{ background: next.theme.fg, color: next.theme.bg }}>
              →
            </span>
          </div>
        </a>
      )}
    </article>
  )
}
