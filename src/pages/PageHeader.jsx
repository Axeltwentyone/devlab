import { Dot } from '../components/Logo.jsx'
import { Words } from '../motion/reveal.jsx'

// En-tête des pages intérieures : même grammaire que les titres de l'accueil, en plus grand.
export default function PageHeader({ eyebrow, title, muted, intro, children }) {
  return (
    <header className="mx-auto max-w-[1440px] px-5 pb-12 pt-14 md:px-[72px] md:pb-20 md:pt-28">
      <p data-reveal className="label text-gris">{eyebrow}</p>
      <h1 data-reveal-stagger className="mt-4 max-w-5xl text-[clamp(2.75rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.05em]">
        <Words text={title} />
        {muted && <><br /><Words text={muted} className="accent" /></>}
        <Dot className="bg-bronze" />
      </h1>
      {intro && <p data-reveal style={{ '--i': 3 }} className="mt-8 max-w-xl text-lg font-light leading-relaxed text-gris">{intro}</p>}
      {children}
    </header>
  )
}
