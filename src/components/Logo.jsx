// Le logo theLab. — le signe (deux cercles, l'intersection en bronze), « the » en grotesque très gras,
// « Lab » en serif fine et étroite, un point bronze collé. Recréé en code pour rester net à toutes les tailles.
export function Dot({ className = 'bg-encre' }) {
  return <span aria-hidden="true" className={`ml-[0.06em] inline-block size-[0.17em] rounded-full ${className}`} />
}

// Le signe : le design et le code qui se recouvrent, le produit au milieu
export function Mark({ className = 'size-[1em]', ring = 'currentColor', lens = 'var(--color-bronze)' }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true">
      <defs>
        <clipPath id="thelab-mark-left">
          <circle cx="22" cy="22" r="18" />
        </clipPath>
      </defs>
      <circle cx="42" cy="22" r="18" fill={lens} clipPath="url(#thelab-mark-left)" />
      <circle cx="22" cy="22" r="18" fill="none" stroke={ring} strokeWidth="4" />
      <circle cx="42" cy="22" r="18" fill="none" stroke={ring} strokeWidth="4" />
    </svg>
  )
}

export default function Logo({ className = '', dotClassName = 'bg-bronze', mark = false }) {
  return (
    <span role="img" aria-label="theLab." className={`inline-flex items-baseline leading-none ${className}`}>
      {mark && <Mark className="mr-[0.28em] h-[0.78em] w-auto self-center" />}
      <span aria-hidden="true" className="font-extrabold tracking-[-0.055em]">the</span>
      <span aria-hidden="true" className="ml-[0.01em] font-lab text-[1.2em] font-normal tracking-[-0.045em]">Lab</span>
      <span aria-hidden="true" className={`ml-[0.05em] inline-block size-[0.17em] rounded-full ${dotClassName}`} />
    </span>
  )
}
