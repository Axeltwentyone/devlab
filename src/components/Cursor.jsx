import { useEffect, useRef, useState } from 'react'

// Curseur point bronze. Actif seulement avec une vraie souris, et désactivé si l'utilisateur limite les animations.
export default function Cursor() {
  const dot = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.body.classList.add('has-dot-cursor')

    let x = -100, y = -100, cx = -100, cy = -100, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      setLabel(Boolean(e.target.closest?.('[data-cursor="voir"]')))
    }
    const tick = () => {
      cx += (x - cx) * 0.35; cy += (y - cy) * 0.35
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-dot-cursor')
    }
  }, [])

  if (!enabled) return null
  return (
    <div ref={dot} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-50">
      <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze transition-[width,height] duration-200 ${label ? 'size-16' : 'size-3'}`}>
        {label && <span className="flex h-full items-center justify-center text-[11px] font-medium text-white">voir</span>}
      </div>
    </div>
  )
}
