import Logo from './Logo.jsx'
import { SOCIALS, whatsappLink } from '../data/site.js'

export default function Closing() {
  return (
    <footer id="contact" className="overflow-hidden bg-encre text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-20 md:px-[72px] md:pt-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.75rem,6.7vw,6rem)] font-extrabold leading-none tracking-[-0.045em]">
            Un projet ?<br />Parlons-en.
          </h2>
          <div className="flex flex-col gap-3 md:items-end">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="self-start border-b border-white pb-1 text-xl font-medium md:self-auto md:text-[22px]">
              WhatsApp ↗
            </a>
            <p className="text-[15px] font-light text-doux">Réponse sous 24 h, en français, sans jargon.</p>
          </div>
        </div>

        <figure className="mt-16 flex flex-col gap-2 md:mt-24 md:flex-row md:items-baseline md:gap-6">
          <blockquote className="text-xl font-light leading-snug text-doux md:text-[26px]">
            « On conçoit avec vous, on livre ce qu’on a promis, et on reste. »
          </blockquote>
          <figcaption className="flex items-baseline gap-3">
            <span className="font-sign text-[38px] leading-none">Seventeen</span>
            <span className="text-[13px] font-light text-doux">Fondateur</span>
          </figcaption>
        </figure>

        <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-trait pt-5 text-[13px] font-light text-doux">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white">{s.label}</a>
          ))}
          <span>Abidjan, Côte d’Ivoire</span>
          <span>© {new Date().getFullYear()} DevLab</span>
        </div>
      </div>
      <div aria-hidden="true" className="-mb-[0.09em] mt-8 flex justify-center pb-[env(safe-area-inset-bottom)]">
        <Logo className="text-[22vw] md:text-[19.5vw] xl:text-[318px]" dotClassName="bg-bronze" />
      </div>
    </footer>
  )
}
