import { useEffect, useState } from 'react'
import { HOURS } from '../data/site.js'

// Heure d'Abidjan (UTC+0, pas d'heure d'été) mise à jour chaque seconde, et si le studio est ouvert
export default function useAbidjanClock() {
  const read = () => {
    const d = new Date()
    return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds(), day: d.getUTCDay() }
  }
  const [now, setNow] = useState(read)
  useEffect(() => {
    const id = setInterval(() => setNow(read()), 1000)
    return () => clearInterval(id)
  }, [])
  const open = HOURS.days.includes(now.day) && now.h >= HOURS.open && now.h < HOURS.close
  return { ...now, open }
}
