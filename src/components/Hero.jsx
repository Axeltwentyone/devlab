import { Dot } from './Logo.jsx'
import { useEffect, useState } from 'react'
import { useContent, useWhatsapp } from '../content/ContentContext.jsx'
import useAbidjanClock from '../hooks/useAbidjanClock.js'

const pad = (n) => String(n).padStart(2, '0')

// Bande « en direct » : ce qu'on fait maintenant, l'heure au studio, les places restantes.
function LiveStatus() {
  const { status } = useContent()
  const { availability: AVAILABILITY, now: NOW, hours: HOURS } = status
  const whatsappLink = useWhatsapp()
  const { h, m, s, open } = useAbidjanClock(HOURS)
  const [i, setI] = useState(0)
  useEffect(() => {
    if (NOW.length < 2) return
    const id = setInterval(() => setI((x) => (x + 1) % NOW.length), 3800)
    return () => clearInterval(id)
  }, [NOW.length])

  return (
    <div className="mt-12 grid gap-6 border-t border-encre pt-5 sm:grid-cols-[minmax(0,1.6fr)_1fr_1fr] sm:gap-10 md:mt-24 md:max-w-5xl">
      <div className="min-w-0">
        <p className="flex items-center gap-2 label text-gris">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-bronze opacity-60" />
            <span className="relative size-2 rounded-full bg-bronze" />
          </span>
          En ce moment au studio
        </p>
        <p className="relative mt-1 h-[1.5em] overflow-hidden text-[15px]" aria-live="polite">
          {NOW.map((line, k) => (
            <span
              key={line}
              aria-hidden={k !== i}
              className="absolute inset-0 truncate transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{ opacity: k === i ? 1 : 0, transform: `translateY(${k === i ? 0 : k === (i + NOW.length - 1) % NOW.length ? -100 : 100}%)` }}
            >
              {line}
            </span>
          ))}
        </p>
      </div>

      <div>
        <p className="label text-gris">Abidjan</p>
        <p className="mt-1 text-[15px] tabular-nums">
          {pad(h)}:{pad(m)}<span className="text-doux">:{pad(s)}</span>
          <span className="ml-2 text-gris">· {open ? 'Studio ouvert' : `Fermé, réouverture ${HOURS.open} h`}</span>
        </p>
      </div>

      <div>
        <p className="label text-gris">Disponibilité</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-[15px]">
          {AVAILABILITY}
          <a href={whatsappLink('Bonjour theLab ! J’aimerais réserver une place pour mon projet.')} target="_blank" rel="noreferrer" className="border-b border-encre text-sm font-medium transition-colors hover:border-bronze hover:text-bronze">
            Réserver ↗
          </a>
        </p>
      </div>
    </div>
  )
}

// Le mot du milieu change : ce que le studio construit
const WORDS = ['sites', 'boutiques', 'applications']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="grid">
      {WORDS.map((w, k) => {
        const state = k === i ? 0 : k === (i + WORDS.length - 1) % WORDS.length ? -1 : 1
        return (
          <span
            key={w}
            aria-hidden={k !== i}
            className="accent [grid-area:1/1] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ transform: `translateY(${state * 100}%)`, opacity: state === 0 ? 1 : 0 }}
          >
            {w}
          </span>
        )
      })}
    </span>
  )
}

export default function Hero() {
  const whatsappLink = useWhatsapp()
  return (
    <section id="top" className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-[72px] md:pb-28 md:pt-36">
      <h1 className="text-[clamp(2.9rem,9.3vw,8.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        <span className="sr-only">On construit des sites, des boutiques et des applications qui tiennent.</span>
        {[
          'On construit des',
          <RotatingWord key="mot" />,
          <>qui tiennent<Dot className="bg-bronze" /></>,
        ].map((line, i) => (
          <span key={i} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {line}
            </span>
          </span>
        ))}
      </h1>

      <div className="hero-line-fade mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-[17px] font-light leading-relaxed text-gris md:text-lg">
          Un studio web &amp; mobile à Abidjan. On conçoit avec vous, on livre ce qu’on a promis, et on reste.
        </p>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          data-cursor="voir"
          className="group inline-flex items-center justify-center gap-3 self-start rounded-full bg-encre px-7 py-4 text-[15px] font-medium text-white transition-colors hover:bg-bronze md:self-auto"
        >
          Parlons de votre projet
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <LiveStatus />

      <style>{`
        .hero-line { transform: translateY(105%); animation: hero-rise 900ms cubic-bezier(.2,.7,.1,1) forwards; }
        @keyframes hero-rise { to { transform: translateY(0); } }
        .hero-line-fade { opacity: 0; animation: hero-fade 800ms cubic-bezier(.2,.7,.1,1) 450ms forwards; }
        @keyframes hero-fade { from { opacity: 0; translate: 0 12px; } to { opacity: 1; translate: 0 0; } }
        @media (prefers-reduced-motion: reduce) { .hero-line, .hero-line-fade { transform: none; opacity: 1; animation: none; } }
      `}</style>
    </section>
  )
}
