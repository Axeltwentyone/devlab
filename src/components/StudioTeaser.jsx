import { Dot } from './Logo.jsx'
import MoreLink from './MoreLink.jsx'
import { useContent } from '../content/ContentContext.jsx'

// Aperçu du studio sur l'accueil : les premières lignes du manifeste, la suite est sur /studio.
export default function StudioTeaser() {
  const { studio } = useContent()
  const lines = (studio.manifesto || []).slice(0, 3)
  if (!lines.length) return null
  return (
    <section id="studio" className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-32">
      <p className="label text-gris">Le studio</p>
      <a href="/studio" className="group mt-6 block">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`text-[clamp(2rem,5.4vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] transition-colors duration-500 ${
              i === 0 ? 'text-encre' : 'text-pierre group-hover:text-gris'
            }`}
          >
            {line}
            {i === lines.length - 1 && <Dot className="bg-bronze" />}
          </p>
        ))}
      </a>
      <MoreLink href="/studio" className="mt-10">Lire le manifeste</MoreLink>
    </section>
  )
}
