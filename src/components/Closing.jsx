import Logo, { Dot } from './Logo.jsx'
import { AVAILABILITY, HOURS, SOCIALS, WHATSAPP_NUMBER, whatsappLink } from '../data/site.js'
import useAbidjanClock from '../hooks/useAbidjanClock.js'

const pad = (n) => String(n).padStart(2, '0')
// 2250797589617 → +225 07 97 58 96 17
const prettyPhone = (n) => `+${n.slice(0, 3)} ${n.slice(3).replace(/(\d{2})(?=\d)/g, '$1 ')}`

const LINKS = [
  { href: '#pourquoi', label: 'Pourquoi nous' },
  { href: '#methode', label: 'Méthode' },
  { href: '#index', label: 'Projets' },
  { href: '#diagnostic', label: 'Diagnostic' },
  { href: '#formules', label: 'Formules' },
]

function Card({ href, external, eyebrow, title, text, accent, children }) {
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

export default function Closing() {
  const { h, m, open } = useAbidjanClock()
  const instagram = SOCIALS.find((s) => s.label === 'Instagram')
  const socials = SOCIALS.filter((s) => s.href && s.href !== '#')

  return (
    <footer id="contact" className="overflow-hidden bg-encre text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-20 md:px-[72px] md:pt-32">
        <p className="text-sm font-medium text-doux">Contact</p>
        <h2 className="mt-4 text-[clamp(2.75rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
          Un projet ?<br /><span className="text-doux">Parlons-en</span><Dot className="bg-bronze" />
        </h2>

        {/* Infos en direct */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-doux">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#3BD16F] opacity-60" />}
              <span className={`relative size-2 rounded-full ${open ? 'bg-[#3BD16F]' : 'bg-doux'}`} />
            </span>
            <span className="text-white">{open ? 'Studio ouvert' : `Fermé, réouverture ${HOURS.open} h`}</span>
          </span>
          <span>Abidjan · <span className="tabular-nums">{pad(h)}:{pad(m)}</span></span>
          <span>{AVAILABILITY}</span>
        </div>

        {/* Trois façons de nous joindre */}
        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <Card
            href={whatsappLink()}
            external
            accent
            eyebrow="Le plus rapide"
            title="Écrire sur WhatsApp"
            text={`${prettyPhone(WHATSAPP_NUMBER)} · réponse sous 24 h, en français, sans jargon.`}
          >
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1 text-xs font-medium text-encre">
              <span className="size-1.5 rounded-full bg-encre" /> WhatsApp
            </span>
          </Card>
          <Card href="#diagnostic" eyebrow="Pas sûr de quoi demander ?" title="Faire le diagnostic" text="Trois questions, une recommandation, 30 secondes." />
          {instagram && (
            <Card href={instagram.href} external eyebrow="Nos coulisses" title="Suivre sur Instagram" text="@devlab.ci : nos projets et la vie du studio." />
          )}
        </div>

        {/* Le mot du fondateur */}
        <figure className="mt-16 flex flex-col gap-3 border-t border-trait pt-10 md:mt-24 md:flex-row md:items-end md:justify-between md:gap-10">
          <blockquote className="max-w-3xl text-[clamp(1.35rem,2.4vw,2.1rem)] font-light leading-snug">
            « On conçoit avec vous, on livre ce qu’on a promis, et on reste. »
          </blockquote>
          <figcaption className="flex shrink-0 items-baseline gap-3">
            <span className="font-sign text-[44px] leading-none">Seventeen</span>
            <span className="text-[13px] font-light text-doux">Fondateur</span>
          </figcaption>
        </figure>

        {/* Pied de page */}
        <div className="mt-14 grid gap-8 border-t border-trait pt-6 text-[13px] font-light text-doux md:grid-cols-[1fr_auto] md:items-start">
          <nav aria-label="Pied de page" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            ))}
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">{s.label} ↗</a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Abidjan, Côte d’Ivoire</span>
            <span>© {new Date().getFullYear()} DevLab</span>
            <a href="#top" className="flex items-center gap-2 text-white transition-colors hover:text-bronze">
              Haut de page <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="-mb-[0.09em] mt-8 flex justify-center pb-[env(safe-area-inset-bottom)]">
        <Logo className="text-[22vw] md:text-[19.5vw] xl:text-[318px]" dotClassName="bg-bronze" />
      </div>
    </footer>
  )
}
