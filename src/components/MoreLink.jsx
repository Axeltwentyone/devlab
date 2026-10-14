// Lien « voir plus » de l'accueil vers une page dédiée
export default function MoreLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 border-b border-current pb-0.5 text-[15px] font-medium transition-colors hover:text-bronze ${className}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}
