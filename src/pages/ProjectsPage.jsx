import { useState } from 'react'
import { useContent } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import { Shot, TitleWithDot } from '../components/ProjectIndex.jsx'
import PageHeader from './PageHeader.jsx'
import Expertise from '../components/Expertise.jsx'

// Une carte par projet, dans son univers ; « Votre projet » ferme la grille.
function ProjectCard({ p, i }) {
  const t = p.theme
  const shots = p.images.slice(0, 2)
  const href = p.href || `/projets/${p.id.toLowerCase()}`
  return (
    <li>
      <a
        href={href}
        data-cursor="voir"
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:min-h-[540px] transition-transform duration-500 hover:-translate-y-1 md:p-9"
        style={{ background: t.bg, color: t.fg }}
      >
        <div className="relative z-10 flex items-start justify-between gap-4 text-sm" style={{ color: t.muted }}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: t.accent, color: '#fff' }}>{p.status}</span>
        </div>

        {/* Écrans en éventail, qui se déploient au survol */}
        <div aria-hidden="true" className="pointer-events-none relative my-6 flex h-64 items-center justify-center md:absolute md:inset-x-0 md:top-14 md:my-0 md:h-[58%]">
          <div className="absolute inset-[10%] rounded-full opacity-60" style={{ background: `radial-gradient(circle, ${t.accent}55, transparent 70%)` }} />
          {shots.length ? (
            shots.map((img, k) => (
              <div
                key={img}
                className={`-mx-6 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${
                  k === 0 ? '-rotate-6 group-hover:-rotate-[10deg] group-hover:-translate-x-3' : 'translate-y-6 rotate-6 group-hover:translate-x-3 group-hover:rotate-[10deg]'
                }`}
              >
                <Shot id={img} alt="" className="w-28 md:w-40" />
              </div>
            ))
          ) : (
            <div className="flex aspect-[9/19.5] w-28 items-center justify-center rounded-[2rem] border-2 border-dashed text-4xl font-light md:w-40" style={{ borderColor: t.accent, color: t.accent }}>
              +
            </div>
          )}
        </div>

        <div className="relative z-10">
          <p className="text-sm" style={{ color: t.muted }}>{p.kind === '—' ? 'Ouvert' : `${p.kind} · ${p.year}`}</p>
          <h2 className="mt-2 text-[clamp(2.25rem,4.5vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
            <TitleWithDot name={p.name} color={t.accent} />
          </h2>
          <p className="mt-2 flex items-center justify-between gap-4 text-[17px] font-light" style={{ color: t.muted }}>
            {p.tagline}
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-500 group-hover:translate-x-1" style={{ background: t.fg, color: t.bg }}>
              →
            </span>
          </p>
        </div>
      </a>
    </li>
  )
}

// Vue liste : les noms en très grand ; au survol, le fond prend l'univers du projet
// et son écran suit la souris (sur ordinateur).
function ProjectList({ projects }) {
  const [hover, setHover] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const active = projects.find((p) => p.id === hover)
  return (
    <div
      className="relative transition-colors duration-500"
      style={{ background: active ? active.theme.bg : 'transparent', color: active ? active.theme.fg : undefined }}
      onPointerMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onPointerLeave={() => setHover(null)}
    >
      <ul data-reveal-stagger className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
        {projects.map((p, i) => {
          const t = active?.theme
          const href = p.href || `/projets/${p.id.toLowerCase()}`
          return (
            <li key={p.id} className="border-t" style={{ borderColor: t ? t.line : 'var(--color-pierre)' }}>
              <a
                href={href}
                data-cursor="voir"
                onPointerEnter={() => setHover(p.id)}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-opacity duration-300 md:grid-cols-[3.5rem_minmax(0,1fr)_14rem_6rem_7rem] md:gap-x-8 md:py-8"
                style={{ opacity: hover && hover !== p.id ? 0.35 : 1 }}
              >
                <span className="text-sm opacity-60">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[clamp(2.25rem,6.5vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
                  {p.name}
                  <span className="ml-[0.06em] inline-block size-[0.17em] rounded-full" style={{ background: p.theme.accent }} />
                </span>
                <span className="hidden text-sm opacity-70 md:block">{p.kind === '—' ? 'Ouvert' : p.kind}</span>
                <span className="hidden text-sm opacity-70 md:block">{p.year === '—' ? '' : p.year}</span>
                <span className="text-right text-sm font-medium">{p.status}</span>
              </a>
            </li>
          )
        })}
      </ul>

      {/* Écran qui suit la souris */}
      {active?.images?.[0] && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(pointer:fine)]:block"
          style={{ transform: `translate(${pos.x + 32}px, ${pos.y - 160}px) rotate(-6deg)` }}
        >
          <Shot id={active.images[0]} alt="" className="w-44" />
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  usePageTitle('Projets')
  const { projects } = useContent()
  const [filter, setFilter] = useState('Tous')
  const [view, setView] = useState('grille')
  // Le type d'un projet = le début de son « kind » (« Application mobile · Flutter » → « Application mobile »)
  const typeOf = (p) => (p.href ? null : p.kind.split('·')[0].trim())
  const types = ['Tous', ...new Set(projects.map(typeOf).filter(Boolean))]
  const shown = projects.filter((p) => filter === 'Tous' || p.href || typeOf(p) === filter)
  return (
    <>
      <PageHeader
        eyebrow="Projets"
        title="Ce qu’on a"
        muted="construit"
        intro="Des sites et des applications pensés pour la Côte d’Ivoire. Chaque projet a son étude de cas : le problème de départ et ce qu’on a construit."
      >
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        {types.length > 2 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
            {types.map((t) => {
              const n = t === 'Tous' ? projects.filter((p) => !p.href).length : projects.filter((p) => typeOf(p) === t).length
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={filter === t}
                  onClick={() => setFilter(t)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${filter === t ? 'border-encre bg-encre text-white' : 'border-pierre hover:border-encre'}`}
                >
                  {t} <span className="opacity-50">{n}</span>
                </button>
              )
            })}
          </div>
        ) : <span />}
          <div className="flex rounded-full border border-pierre p-1" role="group" aria-label="Affichage">
            {['grille', 'liste'].map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${view === v ? 'bg-encre text-white' : 'text-gris hover:text-encre'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>
      {view === 'liste' ? (
        <ProjectList projects={shown} />
      ) : (
        <ul data-reveal-stagger className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-20 md:grid-cols-2 md:gap-5 md:px-[72px] md:pb-32">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </ul>
      )}
      <div className="bg-fond">
        <Expertise />
      </div>
    </>
  )
}
