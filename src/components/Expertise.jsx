import { EXPERTISE } from '../data/site.js'

export default function Expertise() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-[72px] md:py-32">
      <h2 className="mb-6 text-sm font-medium text-gris md:mb-8">Savoir-faire</h2>
      <p className="text-[clamp(1.9rem,4.45vw,4rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
        {EXPERTISE.map((item, i) => (
          <span key={item}>
            <span className={i === EXPERTISE.length - 1 ? 'text-gris' : ''}>{item}</span>
            {i < EXPERTISE.length - 1 && <span aria-hidden="true" className="text-pierre"> · </span>}
          </span>
        ))}
      </p>
      <a href="#formules" className="mt-10 inline-block border-b border-encre pb-0.5 text-[15px] font-medium">
        Voir les formules
      </a>
    </section>
  )
}
