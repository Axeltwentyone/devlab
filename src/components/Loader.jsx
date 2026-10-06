import { useEffect, useRef, useState } from 'react'

// Écran d'entrée : le texte se tape lettre par lettre, puis le rideau se lève.
// Sur mobile, le texte passe sur deux lignes (« Bienvenue » / « dans le lab. ») pour rester grand sans toucher les bords.
const LINE_1 = 'Bienvenue'
const LINE_2 = 'dans le lab'
const TEXT_LENGTH = LINE_1.length + 1 + LINE_2.length // +1 pour l'espace entre les deux
const TYPE_DELAY = 60 // ms par lettre
const START_DELAY = 250
const HOLD = 500 // pause une fois le texte complet
const EXIT = 800 // durée de la levée du rideau
const TOTAL = START_DELAY + TEXT_LENGTH * TYPE_DELAY + HOLD
const SEEN_KEY = 'devlab-intro-vue'

// Une seule fois par visite : inutile de rejouer l'intro à chaque rechargement
export function introSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
const markSeen = () => { try { sessionStorage.setItem(SEEN_KEY, '1') } catch {} }

export default function Loader({ onReveal, onDone }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const timers = useRef([])
  const typed = count >= TEXT_LENGTH

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  // Lève le rideau (à la fin de l'animation, ou tout de suite si on touche l'écran)
  const leave = () => {
    if (leaving) return
    clear()
    setCount(TEXT_LENGTH)
    setLeaving(true)
    onReveal()
    timers.current.push(setTimeout(() => { markSeen(); onDone() }, EXIT))
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markSeen()
      onReveal()
      onDone()
      return
    }
    for (let i = 1; i <= TEXT_LENGTH; i++) {
      timers.current.push(setTimeout(() => setCount(i), START_DELAY + i * TYPE_DELAY))
    }
    timers.current.push(setTimeout(leave, TOTAL))
    const onKey = () => leave()
    window.addEventListener('keydown', onKey)
    return () => {
      clear()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const line1 = LINE_1.slice(0, count)
  const line2 = LINE_2.slice(0, Math.max(0, count - LINE_1.length - 1))
  const onLine2 = count > LINE_1.length

  return (
    <div
      role="status"
      aria-label="Chargement"
      onClick={leave}
      className={`loader fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-encre px-6 text-fond ${leaving ? 'is-leaving' : ''}`}
    >
      <p
        aria-hidden="true"
        className="text-center text-[clamp(2.75rem,15vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-[clamp(3rem,9vw,8rem)]"
      >
        {/* Chaque ligne réserve sa place (texte complet invisible) : les lettres s'écrivent sur place, rien ne bouge */}
        <Line full={LINE_1} shown={line1} caret={!onLine2} className="sm:inline-block" />
        <span className="hidden sm:inline"> </span>
        <Line full={LINE_2} shown={line2} caret={onLine2 && !typed} className="sm:inline-block">
          <span className={`loader-dot ml-[0.06em] inline-block size-[0.17em] rounded-full bg-bronze ${typed ? 'is-on' : ''}`} />
        </Line>
      </p>

      {/* Progression et invitation à passer */}
      <div className="absolute inset-x-6 bottom-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-4 md:bottom-12">
        <span className="relative h-px w-full max-w-[220px] overflow-hidden bg-trait">
          <span className="loader-bar absolute inset-y-0 left-0 w-full origin-left bg-bronze" />
        </span>
        <span className="text-xs text-doux"><span className="md:hidden">Toucher</span><span className="hidden md:inline">Cliquer</span> pour entrer</span>
      </div>

      <style>{`
        .loader { transition: transform ${EXIT}ms cubic-bezier(.7,0,.2,1); }
        .loader.is-leaving { transform: translateY(-100%); }
        .loader-dot { transform: scale(0); transition: transform 450ms cubic-bezier(.3,1.6,.5,1); }
        .loader-dot.is-on { transform: scale(1); }
        .loader-caret { animation: loader-blink 700ms steps(1) infinite; }
        @keyframes loader-blink { 50% { opacity: 0; } }
        .loader-bar { animation: loader-bar ${TOTAL}ms linear forwards; transform: scaleX(0); }
        .loader.is-leaving .loader-bar { animation: none; transform: scaleX(1); }
        @keyframes loader-bar { to { transform: scaleX(1); } }
      `}</style>
    </div>
  )
}

function Line({ full, shown, caret, className = '', children }) {
  return (
    <span className={`relative mx-auto block w-fit whitespace-nowrap text-left ${className}`}>
      <span className="invisible">{full}{children}</span>
      <span className="absolute inset-0">
        {shown}
        {caret && <Caret />}
        {shown === full && children}
      </span>
    </span>
  )
}

function Caret() {
  return <span className="loader-caret ml-[0.04em] inline-block h-[0.72em] w-[0.06em] translate-y-[0.08em] bg-fond" />
}
