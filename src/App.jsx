import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Hero from './components/Hero.jsx'
import ProjectIndex from './components/ProjectIndex.jsx'
import StudioTeaser from './components/StudioTeaser.jsx'
import DiagnosticTeaser from './components/DiagnosticTeaser.jsx'
import PlansTeaser from './components/PlansTeaser.jsx'
import Closing from './components/Closing.jsx'
import Cursor from './components/Cursor.jsx'
import Loader, { introSeen } from './components/Loader.jsx'
import { usePageTitle, useRouter } from './router.jsx'
import { lockScroll } from './motion/scroll.js'
import { useReveal } from './motion/reveal.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import PlansPage from './pages/PlansPage.jsx'
import StudioPage from './pages/StudioPage.jsx'
import NotFound from './pages/NotFound.jsx'
import DiagnosticPage from './pages/DiagnosticPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

function Home() {
  usePageTitle(null)
  return (
    <>
      <Hero />
      <ProjectIndex />
      <StudioTeaser />
      <DiagnosticTeaser />
      <PlansTeaser />
    </>
  )
}

function Page({ path }) {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') return <Home />
  if (clean === '/projets') return <ProjectsPage />
  if (clean.startsWith('/projets/')) return <ProjectPage id={decodeURIComponent(clean.slice('/projets/'.length))} />
  if (clean === '/formules') return <PlansPage />
  if (clean === '/studio') return <StudioPage />
  if (clean === '/diagnostic') return <DiagnosticPage />
  if (clean === '/contact') return <ContactPage />
  return <NotFound />
}

export default function App() {
  const { path } = useRouter()
  useReveal()
  // Le site est monté quand le rideau commence à se lever, pour que l'animation du Hero se joue à ce moment-là
  const [revealed, setRevealed] = useState(introSeen)
  const [loading, setLoading] = useState(() => !introSeen())

  useEffect(() => {
    lockScroll(loading)
  }, [loading])

  return (
    <>
      {loading && <Loader onReveal={() => setRevealed(true)} onDone={() => setLoading(false)} />}
      {revealed && (
        <>
          <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">
            Aller au contenu
          </a>
          <TopBar />
          <main id="contenu">
            <Page key={path} path={path} />
          </main>
          <Closing compact={path.replace(/\/+$/, '') === '/contact'} />
          <Cursor />
        </>
      )}
    </>
  )
}
