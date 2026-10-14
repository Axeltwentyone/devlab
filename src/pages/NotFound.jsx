import { usePageTitle } from '../router.jsx'
import PageHeader from './PageHeader.jsx'

export default function NotFound() {
  usePageTitle('Page introuvable')
  return (
    <PageHeader eyebrow="Erreur 404" title="Cette page" muted="n’existe pas" intro="Le lien est peut-être ancien, ou la page a changé d’adresse.">
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="/" className="rounded-full bg-encre px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-bronze">Retour à l’accueil</a>
        <a href="/projets" className="rounded-full border border-pierre px-6 py-4 text-[15px] font-medium transition-colors hover:border-encre">Voir les projets</a>
      </div>
    </PageHeader>
  )
}
