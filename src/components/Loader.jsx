import { useEffect, useState } from 'react'

// Écran d'entrée : le texte se tape lentement, lettre par lettre, puis le rideau se lève.
const TEXT = 'devlab'
const TYPE_DELAY = 180 // ms par lettre — volontairement lent
const START_DELAY = 400
const HOLD = 900 // pause une fois le mot complet
const EXIT = 900 // durée de la levée du rideau
const SEEN_KEY = 'devlab-intro-vue'

// Une seule fois par visite : inutile de rejouer l'intro à chaque rechargement
export function introSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
const markSeen = () => { try { sessionStorage.setItem(SEEN_KEY, '1') } catch {} }

export default function Loader({ onReveal, onDone }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const typed = count >= TEXT.length

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(TEXT.length)
      onReveal()
      onDone()
      return
    }

    const timers = []
    for (let i = 1; i <= TEXT.length; i++) {
      timers.push(setTimeout(() => setCount(i), START_DELAY + i * TYPE_DELAY))
    }
    const typedAt = START_DELAY + TEXT.length * TYPE_DELAY
    timers.push(setTimeout(() => { setLeaving(true); onReveal() }, typedAt + HOLD))
    timers.push(setTimeout(() => { markSeen(); onDone() }, typedAt + HOLD + EXIT))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      role="status"
      aria-label="Chargement"
      className={`loader fixed inset-0 z-[100] flex items-center justify-center bg-encre text-fond ${leaving ? 'is-leaving' : ''}`}
    >
      <p aria-hidden="true" className="flex items-baseline text-[clamp(3rem,10vw,8rem)] font-extrabold leading-none tracking-[-0.05em]">
        <span className="relative">
          {TEXT.slice(0, count)}
          <span className={`loader-caret absolute bottom-0 left-full ml-[0.06em] h-[0.75em] w-[0.06em] bg-fond ${typed ? 'is-done' : ''}`} />
        </span>
        <span className={`loader-dot ml-[0.06em] inline-block size-[0.17em] rounded-full bg-bronze ${typed ? 'is-on' : ''}`} />
      </p>

      <style>{`
        .loader { transition: transform ${EXIT}ms cubic-bezier(.7,0,.2,1); }
        .loader.is-leaving { transform: translateY(-100%); }
        .loader-dot { transform: scale(0); transition: transform 500ms cubic-bezier(.3,1.6,.5,1); }
        .loader-dot.is-on { transform: scale(1); }
        .loader-caret { animation: loader-blink 900ms steps(1) infinite; }
        .loader-caret.is-done { opacity: 0; animation: none; transition: opacity 300ms; }
        @keyframes loader-blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
