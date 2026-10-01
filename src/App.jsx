import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Hero from './components/Hero.jsx'
import ProjectIndex from './components/ProjectIndex.jsx'
import Diagnostic from './components/Diagnostic.jsx'
import Expertise from './components/Expertise.jsx'
import Plans from './components/Plans.jsx'
import Closing from './components/Closing.jsx'
import Cursor from './components/Cursor.jsx'
import Loader, { introSeen } from './components/Loader.jsx'

export default function App() {
  // Le site est monté quand le rideau commence à se lever, pour que l'animation du Hero se joue à ce moment-là
  const [revealed, setRevealed] = useState(introSeen)
  const [loading, setLoading] = useState(() => !introSeen())

  useEffect(() => {
    document.documentElement.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      {loading && <Loader onReveal={() => setRevealed(true)} onDone={() => setLoading(false)} />}
      {revealed && (
        <>
          <a href="#index" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">
            Aller au contenu
          </a>
          <TopBar />
          <main>
            <Hero />
            <ProjectIndex />
            <Diagnostic />
            <Expertise />
            <Plans />
          </main>
          <Closing />
          <Cursor />
        </>
      )}
    </>
  )
}
