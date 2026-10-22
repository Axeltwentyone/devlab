import { Dot } from './Logo.jsx'
import { ThemeToggle } from '../theme.jsx'
import { useContent, useWhatsapp } from '../content/ContentContext.jsx'
import useAbidjanClock from '../hooks/useAbidjanClock.js'
import { scrollToY } from '../motion/scroll.js'

const pad = (n) => String(n).padStart(2, '0')
// 2250797589617 → +225 07 97 58 96 17
export const prettyPhone = (n) => `+${n.slice(0, 3)} ${n.slice(3).replace(/(\d{2})(?=\d)/g, '$1 ')}`

const LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/studio', label: 'Le studio' },
  { href: '/projets', label: 'Projets' },
  { href: '/formules', label: 'Formules' },
  { href: '/diagnostic', label: 'Diagnostic' },
  { href: '/contact', label: 'Contact' },
]

export function Card({ href, external, eyebrow, title, text, accent, children }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      data-cursor="voir"
      className={`group relative flex flex-col md:min-h-56 justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 md:p-7 ${
        accent ? 'bg-white text-encre' : 'bg-[#1A1A1A] text-white ring-1 ring-trait'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`text-xs font-medium ${accent ? 'text-gris' : 'text-doux'}`}>{eyebrow}</span>
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-500 group-hover:rotate-45 ${
            accent ? 'bg-encre text-white' : 'bg-white text-encre'
          }`}
        >
          ↗
        </span>
      </div>
      <div className="mt-6 md:mt-10">
        <p className="text-[clamp(1.5rem,2.2vw,2rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">{title}</p>
        <p className={`mt-2 text-[15px] font-light ${accent ? 'text-gris' : 'text-doux'}`}>{text}</p>
        {children}
      </div>
    </a>
  )
}

// Statut en direct : ouvert ou fermé, heure d'Abidjan, places restantes
export function LiveLine({ className = '' }) {
  const { status } = useContent()
  const { h, m, open } = useAbidjanClock(status.hours)
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-doux ${className}`}>
      <span className="flex items-center gap-2">
        <span className="relative flex size-2">
          {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#3BD16F] opacity-60" />}
          <span className={`relative size-2 rounded-full ${open ? 'bg-[#3BD16F]' : 'bg-doux'}`} />
        </span>
        <span className="text-current">{open ? 'Studio ouvert' : `Fermé, réouverture ${status.hours.open} h`}</span>
      </span>
      <span>Abidjan · <span className="tabular-nums">{pad(h)}:{pad(m)}</span></span>
      <span>{status.availability}</span>
    </div>
  )
}

// Les trois façons de nous joindre
export function ContactCards({ className = '' }) {
  const { contact } = useContent()
  const whatsappLink = useWhatsapp()
  const instagram = contact.socials.find((s) => s.label === 'Instagram' && s.href && s.href !== '#')
  return (
    <div data-reveal-stagger className={`grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr] ${className}`}>
      <Card
        href={whatsappLink()}
        external
        accent
        eyebrow="Le plus rapide"
        title="Écrire sur WhatsApp"
        text={`${prettyPhone(contact.whatsapp)} · réponse sous 24 h, en français, sans jargon.`}
      >
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1 text-xs font-medium text-encre">
          <span className="size-1.5 rounded-full bg-encre" /> WhatsApp
        </span>
      </Card>
      <Card href="/diagnostic" eyebrow="Pas sûr de quoi demander ?" title="Faire le diagnostic" text="Trois questions, une recommandation, 30 secondes." />
      {contact.email && (
        <Card href={`mailto:${contact.email}`} eyebrow="Pour un devis détaillé" title="Écrire un e-mail" text={contact.email} />
      )}
      {instagram && <Card href={instagram.href} external eyebrow="Nos coulisses" title="Suivre sur Instagram" text="Nos projets et la vie du studio." />}
    </div>
  )
}

// `compact` : seulement les liens et le logo (sur la page Contact, qui a déjà tout le reste)
export default function Closing({ compact = false }) {
  const { contact } = useContent()
  const socials = contact.socials.filter((s) => s.href && s.href !== '#')

  return (
    <footer id="contact" data-tone="dark" className="overflow-hidden bg-encre text-white">
      <div className={`mx-auto max-w-[1440px] px-5 md:px-[72px] ${compact ? 'pt-14' : 'pt-20 md:pt-32'}`}>
        {!compact && (
          <>
            <p className="label text-doux">Contact</p>
            <h2 className="mt-4 text-[clamp(2.75rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
              Un projet ?<br /><span className="text-doux">Parlons-en</span><Dot className="bg-bronze" />
            </h2>
            <LiveLine className="mt-8 [&>span:first-child]:text-white" />
            <ContactCards className="mt-12 md:mt-16" />
          </>
        )}

        {/* Pied de page */}
        <div className={`grid gap-8 border-t border-trait pt-6 text-[13px] font-light text-doux md:grid-cols-[1fr_auto] md:items-start ${compact ? '' : 'mt-16 md:mt-24'}`}>
          <nav aria-label="Pied de page" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            ))}
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">{s.label} ↗</a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {contact.email && <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">{contact.email}</a>}
            <span>Abidjan, Côte d’Ivoire</span>
            <span>© {new Date().getFullYear()} theLab</span>
            <ThemeToggle className="text-white" />
            <a href="#contenu" onClick={(e) => { e.preventDefault(); scrollToY(0) }} className="flex items-center gap-2 text-white transition-colors hover:text-bronze">
              Haut de page <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>

      <p className="label pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 text-center text-doux"></p>
    </footer>
  )
}
