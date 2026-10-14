// Le mot du fondateur
export default function FounderQuote({ dark = false, className = '' }) {
  return (
    <figure className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}>
      <blockquote className="max-w-3xl text-[clamp(1.6rem,3vw,2.75rem)] font-light leading-snug tracking-[-0.02em]">
        « On conçoit avec vous, on livre ce qu’on a promis, et on reste. »
      </blockquote>
      <figcaption className="flex shrink-0 items-baseline gap-3">
        <span className="font-sign text-[48px] leading-none">Seventeen</span>
        <span className={`text-[13px] font-light ${dark ? 'text-doux' : 'text-gris'}`}>Fondateur</span>
      </figcaption>
    </figure>
  )
}
