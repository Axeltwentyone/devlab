import { Dot } from './Logo.jsx'
import { whatsappLink } from '../data/site.js'

export default function NextProject() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-[72px] md:pb-32">
      <div className="border-t border-encre pt-12 md:pt-20">
        <h2 className="max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
          Le prochain projet<br /><span className="text-gris">commence peut-être ici</span><Dot className="bg-bronze" />
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-lg font-light leading-relaxed text-gris">
            Une idée, une boutique à mettre en ligne, une app à lancer : dites-nous où vous en êtes, on vous dit par où commencer.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-encre px-7 py-4 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Écrire sur WhatsApp ↗
            </a>
            <a href="#diagnostic" className="border-b border-encre pb-0.5 text-[15px] font-medium">Faire le diagnostic</a>
          </div>
        </div>
      </div>
    </section>
  )
}
