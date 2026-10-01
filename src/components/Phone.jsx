// Cadre de téléphone simple pour présenter les captures d'écran.
export default function Phone({ src, alt, className = '', children }) {
  return (
    <div className={`aspect-[9/19.5] rounded-[2.2rem] bg-encre p-[6px] shadow-[0_30px_60px_-20px_rgba(17,17,17,0.45)] ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-[1.85rem] bg-[#1d1d1d]">
        {src ? <img src={src} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" /> : children}
      </div>
    </div>
  )
}
