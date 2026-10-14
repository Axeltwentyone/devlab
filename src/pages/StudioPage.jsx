import { useEffect, useRef, useState } from 'react'
import { useContent } from '../content/ContentContext.jsx'
import { usePageTitle } from '../router.jsx'
import { Dot } from '../components/Logo.jsx'
import useInView from '../hooks/useInView.js'
import useAbidjanClock from '../hooks/useAbidjanClock.js'

const pad = (n) => String(n).padStart(2, '0')
const EASE = 'cubic-bezier(.16,1,.3,1)'

// Progression (0 → 1) d'une section haute pendant qu'elle traverse l'écran
function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const scrollable = r.height - window.innerHeight
      setP(scrollable > 0 ? Math.min(1, Math.max(0, -r.top / scrollable)) : 0)
    }
    const on = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [ref])
  return p
}

// 1. Ouverture : le titre monte mot à mot, Abidjan en direct en bas
function Intro() {
  const { status } = useContent()
  const { h, m, s } = useAbidjanClock(status.hours)
  const words = [['Ce', 'qui', 'nous'], ['fait', 'avancer']]
  let k = 0
  return (
    <header className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1440px] flex-col px-5 pb-10 pt-14 md:min-h-[calc(100svh-84px)] md:px-[72px] md:pt-24">
      <p className="label text-gris">Le studio · Abidjan, Côte d’Ivoire</p>
      <h1 className="my-auto py-12 text-[clamp(3.25rem,11vw,10.5rem)] font-extrabold leading-[0.88] tracking-[-0.055em]">
        {words.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            {line.map((w) => {
              const delay = 120 + k++ * 90
              const last = w === 'avancer'
              return (
                <span key={w} className="studio-rise mr-[0.22em] inline-block" style={{ animationDelay: `${delay}ms` }}>
                  {last ? <span className="accent">{w}</span> : w}
                  {last && <Dot className="bg-bronze" />}
                </span>
              )
            })}
          </span>
        ))}
      </h1>
      <div className="grid grid-cols-2 gap-6 border-t border-encre pt-5 md:grid-cols-4">
        <p><span className="label block text-gris">Où</span><span className="mt-1 block text-[15px]">Abidjan</span></p>
        <p><span className="label block text-gris">Coordonnées</span><span className="mt-1 block text-[15px]">5°20′ N · 4°02′ O</span></p>
        <p><span className="label block text-gris">Heure locale</span><span className="mt-1 block text-[15px] tabular-nums">{pad(h)}:{pad(m)}<span className="text-doux">:{pad(s)}</span></span></p>
        <p className="hidden md:block"><span className="label block text-gris">Suite</span><span className="mt-1 block text-[15px]">Faites défiler ↓</span></p>
      </div>
    </header>
  )
}

// 2. Manifeste : la section reste à l'écran, une phrase à la fois, le fond change à chaque phrase
const SCENES = [
  { bg: 'var(--color-fond)', fg: 'var(--color-encre)', muted: 'var(--color-gris)' },
  { bg: 'var(--color-encre)', fg: '#FFFFFF', muted: 'var(--color-doux)' },
  { bg: 'var(--color-bronze)', fg: '#FFFFFF', muted: 'rgba(255,255,255,.7)' },
]

function Manifesto({ lines }) {
  const ref = useRef(null)
  const p = useScrollProgress(ref)
  if (!lines.length) return null
  const index = Math.min(lines.length - 1, Math.floor(p * lines.length))
  const scene = SCENES[index % SCENES.length]
  return (
    <section ref={ref} aria-label="Manifeste" className="relative" style={{ height: `${lines.length * 90}svh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden transition-colors duration-700" style={{ background: scene.bg, color: scene.fg }}>
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 pt-24 md:px-[72px] md:pt-28" style={{ color: scene.muted }}>
          <span className="label">Manifeste</span>
          <span className="label tabular-nums">{pad(index + 1)} / {pad(lines.length)}</span>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-5 md:px-[72px]">
          {lines.map((line, i) => {
            const state = i === index ? 'on' : i < index ? 'past' : 'next'
            const words = line.split(' ')
            return (
              <p
                key={i}
                aria-hidden={state !== 'on'}
                className="absolute inset-x-5 top-1/2 text-[clamp(2.4rem,7vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.05em] md:inset-x-[72px]"
                style={{
                  transform: `translateY(calc(-50% + ${state === 'past' ? -40 : state === 'next' ? 40 : 0}px))`,
                  opacity: state === 'on' ? 1 : 0,
                  filter: state === 'on' ? 'none' : 'blur(8px)',
                  transition: `transform .9s ${EASE}, opacity .6s, filter .6s`,
                }}
              >
                {words.map((w, k) => (
                  <span
                    key={k}
                    className="inline-block"
                    style={{
                      transform: state === 'on' ? 'none' : 'translateY(0.35em)',
                      opacity: state === 'on' ? 1 : 0,
                      transition: `transform .8s ${EASE}, opacity .5s`,
                      transitionDelay: state === 'on' ? `${k * 45}ms` : '0ms',
                    }}
                  >
                    {w}{k < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            )
          })}
        </div>

        {/* Un segment par phrase, celui en cours se remplit */}
        <div className="mx-auto flex w-full max-w-[1440px] gap-1.5 px-5 pb-10 md:px-[72px] md:pb-14">
          {lines.map((_, i) => {
            const fill = Math.min(1, Math.max(0, p * lines.length - i))
            return (
              <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full">
                <span className="absolute inset-0 bg-current opacity-20" />
                <span className="absolute inset-y-0 left-0 rounded-full bg-current" style={{ width: `${fill * 100}%` }} />
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// 3. Chiffres, calculés à partir des projets (rien d'inventé)
function CountUp({ to, on }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const start = performance.now()
    let frame = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1100)
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [on, to])
  return <span className="tabular-nums">{n}</span>
}

function Numbers() {
  const { projects } = useContent()
  const [ref, on] = useInView({ threshold: 0.4 })
  const cases = projects.filter((p) => !p.href)
  const stats = [
    { n: cases.length, label: cases.length > 1 ? 'projets' : 'projet' },
    { n: cases.filter((p) => /application/i.test(p.kind)).length, label: 'applications mobiles' },
    { n: cases.filter((p) => /site|boutique|e-commerce/i.test(p.kind)).length, label: 'sites et boutiques' },
  ].filter((s) => s.n > 0)
  if (!stats.length) return null
  return (
    <section ref={ref} className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-32">
      <div className="flex items-end justify-between gap-6">
        <p className="label text-gris">En chiffres</p>
        <a href="/projets" className="border-b border-encre pb-0.5 text-[15px] font-medium transition-colors hover:border-bronze hover:text-bronze">Voir les projets →</a>
      </div>
      <ul className="mt-10 grid border-t border-encre sm:grid-cols-3">
        {stats.map((s, i) => (
          <li key={s.label} className={`py-8 sm:py-10 ${i ? 'border-t border-pierre sm:border-l sm:border-t-0 sm:pl-8' : ''}`}>
            <span className="block text-[clamp(4.5rem,11vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
              <CountUp to={s.n} on={on} />
            </span>
            <span className="mt-3 block text-[17px] text-gris">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Story({ story }) {
  if (!story?.paragraphs?.filter(Boolean).length) return null
  return (
    <section className="bg-fond">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-[72px] md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <h2 className="text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
          {story.title || 'Notre histoire'}<Dot className="bg-bronze" />
        </h2>
        <div className="flex flex-col gap-6">
          {story.paragraphs.filter(Boolean).map((p, i) => (
            <p key={i} className={i === 0 ? 'text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug' : 'text-[17px] font-light leading-relaxed text-gris'}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

// 4. Outils : on survole un nom, la raison de l'utiliser s'affiche en grand
function Tools({ tools }) {
  const [active, setActive] = useState(0)
  if (!tools?.length) return null
  const t = tools[Math.min(active, tools.length - 1)]
  return (
    <section className="bg-encre text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-28">
        <p className="label text-doux">Nos outils</p>
        <h2 className="mt-4 text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold leading-none tracking-[-0.045em]">
          Avec quoi on <span className="accent text-bronze">construit</span><Dot className="bg-bronze" />
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <ul className="border-b border-trait">
            {tools.map((tool, i) => (
              <li key={tool.name} className="border-t border-trait">
                <button
                  type="button"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="flex w-full items-baseline justify-between gap-6 py-5 text-left md:py-6"
                >
                  <span
                    className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.05em] transition-colors duration-300"
                    style={{ color: i === active ? '#FFFFFF' : 'rgba(255,255,255,.28)' }}
                  >
                    {tool.name}
                  </span>
                  <span className="label shrink-0 text-doux">{tool.category}</span>
                </button>
                {/* Mobile : l'explication sous l'outil choisi */}
                <p className={`overflow-hidden text-[17px] font-light leading-relaxed text-doux transition-all duration-500 lg:hidden ${i === active ? 'max-h-40 pb-5' : 'max-h-0'}`}>{tool.why}</p>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <div className="sticky top-32 rounded-3xl bg-[#1A1A1A] p-10 ring-1 ring-trait">
              <p className="label text-doux">{t.category}</p>
              <p key={t.name} className="studio-fade mt-6 text-[clamp(2rem,3.2vw,3rem)] leading-[1.1] tracking-[-0.02em]">
                <span className="accent">{t.why}</span>
              </p>
              <p className="mt-10 flex items-center gap-3 text-sm text-doux">
                <span className="size-2 rounded-full bg-bronze" /> {t.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 5. Le mot du fondateur : la citation s'éclaire au scroll, la signature se dessine
function Founder() {
  const ref = useRef(null)
  const [lit, setLit] = useState(0)
  const [sigRef, sigOn] = useInView({ threshold: 0.8 })
  const quote = '« On conçoit avec vous, on livre ce qu’on a promis, et on reste. »'
  const words = quote.split(' ')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      setLit(Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.2))))
    }
    const on = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', on)
    }
  }, [])
  const count = Math.round(lit * words.length * 1.15)
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-[72px] md:py-40">
      <p className="label text-gris">Le mot du fondateur</p>
      <blockquote ref={ref} className="mt-10 max-w-5xl text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.08] tracking-[-0.035em]">
        {words.map((w, k) => (
          <span key={k} className="transition-colors duration-300" style={{ color: k < count ? 'var(--color-encre)' : 'var(--color-pierre)' }}>
            {w}{k < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </blockquote>
      <div ref={sigRef} className="mt-12 flex items-baseline gap-4">
        <span
          className="font-sign text-[clamp(3.5rem,7vw,5.5rem)] leading-none"
          style={{ clipPath: sigOn ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: 'clip-path 1.6s cubic-bezier(.65,0,.35,1)' }}
        >
          Seventeen
        </span>
        <span className="label text-gris">Fondateur</span>
      </div>
    </section>
  )
}

// 6. Appel final : un grand lien qui se remplit au survol
function Cta() {
  return (
    <a href="/contact" data-cursor="voir" className="group relative block overflow-hidden border-t border-pierre">
      <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-bronze transition-transform duration-700 group-hover:scale-y-100" style={{ transitionTimingFunction: EASE }} />
      <span className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-16 transition-colors duration-500 group-hover:text-white md:px-[72px] md:py-24">
        <span>
          <span className="label block text-gris transition-colors group-hover:text-white/70">Un projet ?</span>
          <span className="mt-4 block text-[clamp(2.75rem,8vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
            Parlons-<span className="accent">en</span><Dot className="bg-bronze transition-colors group-hover:bg-white" />
          </span>
        </span>
        <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-encre text-2xl text-white transition-transform duration-500 group-hover:translate-x-2 group-hover:-rotate-45 md:size-24 md:text-4xl">
          →
        </span>
      </span>
    </a>
  )
}

export default function StudioPage() {
  usePageTitle('Le studio')
  const { studio } = useContent()
  return (
    <>
      <Intro />
      <Manifesto lines={studio.manifesto || []} />
      <Numbers />
      <Story story={studio.story} />
      <Tools tools={studio.tools} />
      <Founder />
      <Cta />

      <style>{`
        .studio-rise { transform: translateY(105%); animation: studio-rise .9s ${EASE} forwards; }
        @keyframes studio-rise { to { transform: translateY(0); } }
        .studio-fade { animation: studio-fade .6s ${EASE}; }
        @keyframes studio-fade { from { opacity: 0; transform: translateY(12px); } }
        @media (prefers-reduced-motion: reduce) {
          .studio-rise { transform: none; animation: none; }
          .studio-fade { animation: none; }
        }
      `}</style>
    </>
  )
}
