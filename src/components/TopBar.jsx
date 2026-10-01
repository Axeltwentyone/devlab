import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import { whatsappLink } from '../data/site.js'

const LINKS = [
  { href: '#index', label: 'Projets' },
  { href: '#diagnostic', label: 'Diagnostic' },
  { href: '#formules', label: 'Formules' },
  { href: '#contact', label: 'Contact' },
]

function useAbidjanTime() {
  const format = () =>
    new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Abidjan' }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function TopBar() {
  const time = useAbidjanTime()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-fond bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-[84px] md:px-[72px]">
        <a href="#top" aria-label="Retour en haut de page">
          <Logo className="text-[22px] md:text-2xl" />
        </a>

        <p className="text-[13px] text-gris">
          <span className="font-medium text-encre">Abidjan</span> <time>{time}</time>
        </p>

        <nav className="hidden items-center gap-9 text-sm md:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-opacity hover:opacity-60">{l.label}</a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="border-b border-encre pb-0.5 font-medium">
            WhatsApp ↗
          </a>
        </nav>

        <button
          type="button"
          className="text-[13px] font-medium md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Fermer' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-fond px-5 pb-8 pt-4 md:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-3xl font-extrabold tracking-[-0.04em]">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-3 inline-block border-b border-encre pb-1 text-lg font-medium">
                WhatsApp ↗
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
