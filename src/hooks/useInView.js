import { useEffect, useRef, useState } from 'react'

// true dès que l'élément entre à l'écran (une seule fois)
export default function useInView({ threshold = 0.35, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold, rootMargin])
  return [ref, inView]
}
