import { useEffect, useRef, useState } from 'react'
import { Dot } from './Logo.jsx'
import { STEPS } from '../data/site.js'

// Progression de la frise : la ligne de lecture est aux deux tiers de l'écran.
// Renvoie la part du fil remplie et les étapes déjà atteintes.
function useTrackProgress(ref) {
  const [state, setState] = useState({ p: 0, reached: -1 })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const line = window.innerHeight * 0.65
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height))
      const steps = [...el.querySelectorAll(':scope > li')]
      const tops = steps.map((li) => li.getBoundingClientRect().top)
      // Frise horizontale (grand écran) : les étapes s'allument au fil du remplissage ; verticale : quand elles passent la ligne
      const horizontal = Math.abs(tops[tops.length - 1] - tops[0]) < 10
      const reached = horizontal
        ? steps.filter((_, i) => p >= (i + 0.1) / steps.length).length - 1
        : tops.filter((t) => t < line).length - 1
      setState((s) => (s.p === p && s.reached === reached ? s : { p, reached }))
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
  return state
}

// Mini-interfaces : ce que le client voit concrètement à chaque étape.
function Chat({ on }) {
  return (
    <div className="flex flex-col gap-2 text-[13px]">
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#D9FDD3] px-3 py-2 text-encre transition-all duration-500" style={{ opacity: on ? 1 : 0, translate: on ? '0 0' : '0 8px' }}>
        Bonjour DevLab ! J’aimerais parler d’un projet.
        <span className="ml-2 text-[10px] text-[#53BDEB]">✓✓</span>
      </p>
      <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-encre transition-all duration-500" style={{ opacity: on ? 1 : 0, translate: on ? '0 0' : '0 8px', transitionDelay: on ? '500ms' : '0ms' }}>
        Avec plaisir ! On s’appelle demain à 10 h ?
      </p>
    </div>
  )
}

function Quote({ on }) {
  const rows = [['Projet', 'Site vitrine'], ['Prix', 'Fixé, sans surprise'], ['Livraison', 'Date garantie']]
  return (
    <div className="rounded-xl bg-white p-3 text-[13px] text-encre">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-fond py-1.5 last:border-0">
          <span className="text-gris">{k}</span>
          <span className="font-medium">{v}</span>
        </div>
      ))}
      <span
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-encre px-2.5 py-1 text-[11px] font-medium text-white transition-all duration-500"
        style={{ opacity: on ? 1 : 0, scale: on ? '1' : '0.8', transitionDelay: on ? '400ms' : '0ms' }}
      >
        Validé ✓
      </span>
    </div>
  )
}

function Build({ on }) {
  const tasks = [['Maquettes', 1], ['Développement', 0.7], ['Tests sur téléphone', 0.2]]
  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-white p-3 text-[13px] text-encre">
      {tasks.map(([t, v], k) => (
        <div key={t}>
          <div className="flex justify-between">
            <span>{t}</span>
            <span className="text-gris">{v === 1 ? '✓' : `${Math.round(v * 100)} %`}</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-fond">
            <div
              className="h-full rounded-full bg-bronze transition-[width] duration-1000 ease-out"
              style={{ width: on ? `${v * 100}%` : '0%', transitionDelay: on ? `${k * 200}ms` : '0ms' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Live({ on }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white text-[13px] text-encre">
      <div className="flex items-center gap-1.5 border-b border-fond px-3 py-2">
        <span className="size-2 rounded-full bg-pierre" />
        <span className="size-2 rounded-full bg-pierre" />
        <span className="ml-2 flex-1 truncate rounded-md bg-fond px-2 py-0.5 text-[11px] text-gris">votre-entreprise.ci</span>
      </div>
      <div className="flex items-center justify-between px-3 py-3">
        <span className="flex items-center gap-2 font-medium">
          <span className="relative flex size-2">
            {on && <span className="absolute inset-0 animate-ping rounded-full bg-[#3BD16F] opacity-60" />}
            <span className="relative size-2 rounded-full transition-colors duration-500" style={{ background: on ? '#3BD16F' : 'var(--color-pierre)' }} />
          </span>
          {on ? 'En ligne' : 'Bientôt'}
        </span>
        <span className="text-[11px] text-gris">Suivi inclus</span>
      </div>
    </div>
  )
}

const ARTIFACTS = [Chat, Quote, Build, Live]

export default function Method() {
  const trackRef = useRef(null)
  const { p: progress, reached } = useTrackProgress(trackRef)

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

      <ol ref={trackRef} className="relative mt-12 grid gap-10 pl-10 md:mt-20 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-12">
        {/* Le fil : vertical sur mobile, horizontal sur grand écran */}
        <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-pierre lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto">
          <span className="absolute left-0 top-0 w-px bg-bronze lg:hidden" style={{ height: `${progress * 100}%` }} />
          <span className="absolute left-0 top-0 hidden h-px bg-bronze lg:block" style={{ width: `${progress * 100}%` }} />
        </span>

        {STEPS.map((step, i) => {
          const on = i <= reached
          const Artifact = ARTIFACTS[i]
          return (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-10 top-1 size-[15px] rounded-full border transition-colors duration-500 lg:-top-12 lg:left-0"
                style={{ background: on ? 'var(--color-bronze)' : 'white', borderColor: on ? 'var(--color-bronze)' : 'var(--color-pierre)' }}
              />
              <div className="transition-opacity duration-500" style={{ opacity: on ? 1 : 0.35 }}>
                <span className="text-sm text-gris">Étape {i + 1}</span>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] md:text-[28px]">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] font-light leading-relaxed text-gris">{step.text}</p>
                <div className="mt-6 max-w-sm rounded-2xl bg-fond p-4">
                  <Artifact on={on} />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
