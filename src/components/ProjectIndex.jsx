import { useEffect, useRef, useState } from 'react'
import { Dot } from './Logo.jsx'
import Phone from './Phone.jsx'
import { PROJECTS } from '../data/site.js'
import shoptongbaOnboarding from '../assets/shoptongba-onboarding.webp'
import shoptongbaAccueil from '../assets/shoptongba-accueil.webp'
import subciAccueil from '../assets/subci-accueil.webp'
import subciExplorer from '../assets/subci-explorer.webp'
import subciAbonnements from '../assets/subci-abonnements.webp'
import subciOffre from '../assets/subci-offre.webp'
import tiakoliseProduit from '../assets/tiakolise-produit.webp'
import tiakolisePassion from '../assets/tiakolise-passion.webp'
import tiakoliseCollection from '../assets/tiakolise-collection.webp'

const IMAGES = {
  'shoptongba-onboarding': shoptongbaOnboarding,
  'shoptongba-accueil': shoptongbaAccueil,
  'subci-accueil': subciAccueil,
  'subci-explorer': subciExplorer,
  'subci-abonnements': subciAbonnements,
  'subci-offre': subciOffre,
  'tiakolise-produit': tiakoliseProduit,
  'tiakolise-passion': tiakolisePassion,
  'tiakolise-collection': tiakoliseCollection,
}
const ALT = {
  'shoptongba-onboarding': 'ShopTongba : écran d’accueil « Une voiture. Maintenant. »',
  'shoptongba-accueil': 'ShopTongba : recherche de véhicules autour de soi à Abidjan',
  'subci-accueil': 'Subci : accueil avec l’abonnement en cours d’activation et les offres populaires',
  'subci-explorer': 'Subci : explorer les abonnements partagés disponibles et leurs prix',
  'subci-abonnements': 'Subci : mes abonnements actifs et les économies du mois',
  'subci-offre': 'Subci : gérer une offre partagée, prix par place et nombre de places',
  'tiakolise-produit': 'Tiakolisé : fiche du t-shirt Mélo Décalé, tailles et prix',
  'tiakolise-passion': 'Tiakolisé : « Plus qu’une passion », la série limitée',
  'tiakolise-collection': 'Tiakolisé : stocks restants et la collection complète',
}

const num = (i) => String(i + 1).padStart(2, '0')

// Le projet actif suit la progression du scroll dans la section épinglée.
function useActiveIndex(ref, count) {
  const [state, setState] = useState({ index: 0, progress: 0 })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
      const index = Math.min(count - 1, Math.floor(progress * count))
      setState((s) => (s.index === index && Math.abs(s.progress - progress) < 0.002 ? s : { index, progress }))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, count])
  return state
}

// Vignette de la colonne de gauche : le projet actif s'agrandit, les autres reculent.
function Thumb({ p, i, active, onSelect }) {
  const t = p.theme
  const cover = p.images[1] ?? p.images[0]
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      data-cursor="voir"
      className={`group relative block overflow-hidden rounded-2xl text-left transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${
        active ? 'h-[min(12rem,22vh)] w-full opacity-100' : 'h-[min(7rem,11vh)] w-[82%] opacity-45 hover:opacity-80'
      }`}
      style={{ background: t.bg, color: t.fg, boxShadow: `inset 0 0 0 1px ${t.line}` }}
    >
      <span className="absolute left-4 top-4 text-xs" style={{ color: t.muted }}>{num(i)}</span>
      <span className="absolute bottom-4 left-4 text-lg font-extrabold tracking-[-0.03em]">
        {p.name}
        <span className="ml-[0.08em] inline-block size-[0.3em] rounded-full" style={{ background: t.accent }} />
      </span>
      {cover ? (
        <img
          src={IMAGES[cover]}
          alt=""
          className={`absolute -bottom-10 right-4 w-24 rotate-[-6deg] rounded-xl object-cover object-top shadow-xl transition-transform duration-700 ${
            active ? 'translate-y-0' : 'translate-y-10'
          }`}
          loading="lazy"
        />
      ) : (
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-5xl font-extrabold" style={{ color: t.accent }}>?</span>
      )}
    </button>
  )
}

function Facts({ p }) {
  const t = p.theme
  if (!p.caseStudy) return null
  return (
    <>
      <dl className="mt-8 grid max-w-xl gap-5 border-t pt-6 xl:grid-cols-2 xl:gap-8" style={{ borderColor: t.line }}>
        <div>
          <dt className="text-xs font-medium" style={{ color: t.muted }}>Le problème</dt>
          <dd className="mt-1.5 text-[15px] leading-relaxed">{p.caseStudy.problem}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium" style={{ color: t.muted }}>Ce qu’on a construit</dt>
          <dd className="mt-1.5 text-[15px] leading-relaxed">{p.caseStudy.solution}</dd>
        </div>
      </dl>
      <ul className="mt-6 flex flex-wrap gap-2">
        {p.caseStudy.facts.map((f) => (
          <li key={f} className="rounded-full px-3 py-1 text-xs" style={{ boxShadow: `inset 0 0 0 1px ${t.line}` }}>{f}</li>
        ))}
      </ul>
    </>
  )
}

// Téléphones en éventail ; ils entrent l'un après l'autre quand le projet devient actif.
function Phones({ p, active, className = '' }) {
  const shots = p.images.slice(0, 3)
  const fan = shots.length === 3
    ? ['-rotate-6 translate-y-10', 'z-10 -translate-y-2', 'rotate-6 translate-y-10']
    : ['-rotate-3 translate-y-6', 'rotate-3 -translate-y-2']
  if (!shots.length) {
    return (
      <div className={`flex justify-center ${className}`}>
        <Phone className="w-40 xl:w-48">
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center" style={{ background: p.theme.card }}>
            <span className="text-6xl font-extrabold" style={{ color: p.theme.accent }}>?</span>
            <span className="text-xs" style={{ color: p.theme.muted }}>Votre écran ici</span>
          </div>
        </Phone>
      </div>
    )
  }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {shots.map((img, k) => (
        <div
          key={img}
          className={`-mx-4 transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${fan[k]}`}
          style={{
            transitionDelay: active ? `${150 + k * 110}ms` : '0ms',
            opacity: active ? 1 : 0,
            translate: active ? '0 0' : '0 60px',
          }}
        >
          <Phone src={IMAGES[img]} alt={ALT[img]} className="w-36 2xl:w-40" />
        </div>
      ))}
    </div>
  )
}

function SiteLink({ url, className = '' }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" data-cursor="voir" className={`border-b border-current pb-0.5 text-sm font-medium transition-opacity hover:opacity-70 ${className}`}>
      Voir le site <span aria-hidden="true">↗</span>
    </a>
  )
}

// Le point reste collé au dernier mot, même si le titre passe sur deux lignes.
function TitleWithDot({ name, color }) {
  const words = name.split(' ')
  const last = words.pop()
  return (
    <>
      {words.length > 0 && `${words.join(' ')} `}
      <span className="whitespace-nowrap">
        {last}
        <span className="ml-[0.06em] inline-block size-[0.17em] rounded-full" style={{ background: color }} />
      </span>
    </>
  )
}

function Panel({ p, i, active }) {
  const t = p.theme
  return (
    <div
      aria-hidden={!active}
      className="absolute inset-0 grid items-center gap-10 transition-[opacity,translate] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] xl:grid-cols-[minmax(0,1fr)_auto]"
      style={{ opacity: active ? 1 : 0, translate: active ? '0 0' : '0 24px', pointerEvents: active ? 'auto' : 'none' }}
    >
      <div className="@container min-w-0">
        <p className="flex items-center gap-3 text-sm" style={{ color: t.muted }}>
          <span>{num(i)}</span>
          <span className="h-px w-8" style={{ background: t.line }} />
          <span>{p.kind === '—' ? 'Ouvert' : p.kind}</span>
          {p.year !== '—' && <span>· {p.year}</span>}
        </p>
        {/* La taille suit la largeur de la colonne, pas de l'écran : le titre ne passe jamais sous les téléphones */}
        <h3 className="mt-5 text-[clamp(2.5rem,15cqi,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
          <TitleWithDot name={p.name} color={t.accent} />
        </h3>
        <p className="mt-5 text-[clamp(1.25rem,1.8vw,1.6rem)] font-light" style={{ color: t.muted }}>{p.tagline}</p>
        <p className="mt-6 max-w-lg text-[17px] font-light leading-relaxed">{p.summary}</p>
        <Facts p={p} />
        {p.href && (
          <a
            href={p.href}
            data-cursor="voir"
            className="mt-10 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            style={{ background: t.accent }}
          >
            Faire le diagnostic <span aria-hidden="true">→</span>
          </a>
        )}
        {!p.href && (
          <div className="mt-6 flex items-center gap-5">
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ background: t.accent, color: '#fff' }}>
              {p.status}
            </span>
            {p.url && <SiteLink url={p.url} />}
          </div>
        )}
      </div>
      <Phones p={p} active={active} className="hidden xl:flex xl:w-[400px] 2xl:w-[460px]" />
    </div>
  )
}

// Mobile et tablette : même principe épinglé, pensé pour le pouce.
// En haut des segments façon stories, au centre les écrans, en bas le projet ; l'étude de cas s'ouvre en panneau.
function MobileStage() {
  const ref = useRef(null)
  const { index, progress } = useActiveIndex(ref, PROJECTS.length)
  const [sheet, setSheet] = useState(null)
  const p = PROJECTS[index]
  const t = p.theme

  useEffect(() => {
    if (!sheet) return
    const onKey = (e) => e.key === 'Escape' && setSheet(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [sheet])

  const goTo = (i) => {
    const el = ref.current
    const scrollable = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (scrollable * (i + 0.5)) / PROJECTS.length, behavior: 'smooth' })
  }

  const open = sheet && PROJECTS.find((x) => x.id === sheet)

  return (
    <div ref={ref} className="relative lg:hidden" style={{ height: `${PROJECTS.length * 100}svh` }}>
      <div
        className="sticky top-0 flex h-svh flex-col overflow-hidden pt-16 transition-colors duration-700 md:pt-[84px]"
        style={{ background: t.bg, color: t.fg }}
      >
        {/* Segments : un par projet, celui en cours se remplit avec le scroll */}
        <div className="px-5 pt-5 md:px-[72px]">
          <div className="flex items-center justify-between text-xs" style={{ color: t.muted }}>
            <h2 className="font-medium">Projets</h2>
            <span>{num(index)} / {num(PROJECTS.length - 1)}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {PROJECTS.map((x, i) => {
              const fill = Math.min(1, Math.max(0, progress * PROJECTS.length - i))
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Voir ${x.name}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="relative h-6 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full" style={{ background: t.line }}>
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${fill * 100}%`, background: t.fg }} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Écrans en éventail, en fondu d'un projet à l'autre */}
        <div className="relative min-h-0 flex-1">
          {PROJECTS.map((x, i) => {
            const active = i === index
            const shots = x.images.slice(0, 3)
            const fan = shots.length === 3
              ? [{ r: -8, y: 18, z: 0 }, { r: 0, y: -6, z: 10 }, { r: 8, y: 18, z: 0 }]
              : [{ r: -5, y: 10, z: 0 }, { r: 5, y: -4, z: 10 }]
            return (
              <div
                key={x.id}
                aria-hidden={!active}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                style={{ opacity: active ? 1 : 0 }}
              >
                {shots.length ? (
                  shots.map((img, k) => (
                    <div
                      key={img}
                      className="-mx-[4vw] transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
                      style={{
                        zIndex: fan[k].z,
                        transitionDelay: active ? `${100 + k * 90}ms` : '0ms',
                        transform: active ? `translateY(${fan[k].y}px) rotate(${fan[k].r}deg)` : 'translateY(70px) rotate(0deg)',
                      }}
                    >
                      <Phone src={IMAGES[img]} alt={active ? ALT[img] : ''} className="w-[min(33vw,calc(34svh*0.4615),11rem)]" />
                    </div>
                  ))
                ) : (
                  <Phone className="w-[min(40vw,calc(34svh*0.4615),11rem)]">
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center" style={{ background: x.theme.card }}>
                      <span className="text-5xl font-extrabold" style={{ color: x.theme.accent }}>?</span>
                      <span className="text-[11px]" style={{ color: x.theme.muted }}>Votre écran ici</span>
                    </div>
                  </Phone>
                )}
              </div>
            )
          })}
        </div>

        {/* Le projet en cours */}
        <div className="relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-[72px] md:pb-12">
          {PROJECTS.map((x, i) => {
            const active = i === index
            return (
              <div
                key={x.id}
                aria-hidden={!active}
                className={`transition-[opacity,translate] duration-500 ${active ? 'relative' : 'pointer-events-none absolute inset-x-5 bottom-[max(1.5rem,env(safe-area-inset-bottom))] md:inset-x-[72px]'}`}
                style={{ opacity: active ? 1 : 0, translate: active ? '0 0' : '0 16px' }}
              >
                <p className="text-xs" style={{ color: x.theme.muted }}>
                  {x.kind === '—' ? 'Ouvert' : `${x.kind} · ${x.year}`}
                </p>
                <h3 className="mt-2 text-[clamp(2.6rem,13vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
                  <TitleWithDot name={x.name} color={x.theme.accent} />
                </h3>
                <p className="mt-2 text-lg font-light" style={{ color: x.theme.muted }}>{x.tagline}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {x.href ? (
                    <a href={x.href} tabIndex={active ? 0 : -1} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white" style={{ background: x.theme.accent }}>
                      Faire le diagnostic <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        tabIndex={active ? 0 : -1}
                        onClick={() => setSheet(x.id)}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                        style={{ background: x.theme.fg, color: x.theme.bg }}
                      >
                        L’étude de cas <span aria-hidden="true">↑</span>
                      </button>
                      <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: x.theme.accent, color: '#fff' }}>{x.status}</span>
                      {x.url && <SiteLink url={x.url} className="ml-auto" />}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Étude de cas en panneau qui remonte du bas */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label={`Étude de cas : ${open.name}`}>
          <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSheet(null)} />
          <div
            className="relative max-h-[82svh] w-full overflow-y-auto rounded-t-3xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 md:px-[72px]"
            style={{ background: open.theme.bg, color: open.theme.fg, animation: 'sheet-up .45s cubic-bezier(.2,.7,.2,1)' }}
          >
            <span className="mx-auto block h-1 w-10 rounded-full" style={{ background: open.theme.line }} />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs" style={{ color: open.theme.muted }}>{open.kind} · {open.year}</p>
                <h3 className="mt-1 text-4xl font-extrabold tracking-[-0.05em]">
                  <TitleWithDot name={open.name} color={open.theme.accent} />
                </h3>
              </div>
              <button type="button" onClick={() => setSheet(null)} className="rounded-full px-3 py-1.5 text-sm" style={{ boxShadow: `inset 0 0 0 1px ${open.theme.line}` }}>
                Fermer
              </button>
            </div>
            <p className="mt-5 text-[17px] font-light leading-relaxed">{open.summary}</p>
            <Facts p={open} />
            <div className="-mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-2">
              {open.images.map((img) => (
                <Phone key={img} src={IMAGES[img]} alt={ALT[img]} className="w-36 shrink-0" />
              ))}
            </div>
            {open.url && <SiteLink url={open.url} className="mt-8 inline-block" />}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectIndex() {
  const ref = useRef(null)
  const { index, progress } = useActiveIndex(ref, PROJECTS.length)
  const t = PROJECTS[index].theme

  const goTo = (i) => {
    const el = ref.current
    const scrollable = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (scrollable * (i + 0.5)) / PROJECTS.length, behavior: 'smooth' })
  }

  return (
    <section id="index" aria-label="Projets">
      {/* Grand écran : la section reste épinglée, chaque cran de scroll fait entrer un projet et son univers */}
      <div
        ref={ref}
        className="relative hidden lg:block"
        style={{ height: `${PROJECTS.length * 100}vh` }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden pt-[84px] transition-colors duration-700"
          style={{ background: t.bg, color: t.fg }}
        >
          <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[280px_minmax(0,1fr)] gap-16 px-[72px] py-12 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="flex flex-col">
              <h2 className="text-sm font-medium transition-colors duration-700" style={{ color: t.muted }}>
                Projets<Dot className="bg-current" />
              </h2>
              <div className="mt-8 flex flex-1 flex-col justify-center gap-4">
                {PROJECTS.map((p, i) => (
                  <Thumb key={p.id} p={p} i={i} active={i === index} onSelect={() => goTo(i)} />
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4 text-xs" style={{ color: t.muted }}>
                <span>{num(index)} / {num(PROJECTS.length - 1)}</span>
                <span className="relative h-px flex-1" style={{ background: t.line }}>
                  <span className="absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, background: t.accent }} />
                </span>
              </div>
            </div>

            <div className="relative">
              {PROJECTS.map((p, i) => (
                <Panel key={p.id} p={p} i={i} active={i === index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileStage />
    </section>
  )
}
