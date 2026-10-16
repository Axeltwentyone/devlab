// Titres, descriptions et images d'aperçu de chaque page.
// Utilisé par le site (onglet du navigateur) et au build (pages HTML lues par WhatsApp, Google, réseaux sociaux).
import { PLANS, PROJECTS } from '../data/site.js'

const SITE = 'theLab.'
export const DEFAULT_META = {
  title: 'theLab. — Studio web & mobile à Abidjan',
  description: 'theLab conçoit, livre et fait vivre des sites et applications pour les entreprises d’Abidjan et d’ailleurs.',
  image: '/og/default.png',
}

const vitrine = PLANS.find((p) => p.unit)
const priceLine = vitrine ? `${vitrine.name} dès ${vitrine.price} ${vitrine.unit}, ` : ''

export const PAGE_META = {
  '/studio': { title: 'Le studio', description: 'Le manifeste, l’histoire et les outils de theLab, studio web & mobile à Abidjan.' },
  '/projets': { title: 'Projets', description: 'Les sites et applications de theLab, pensés pour la Côte d’Ivoire, avec leurs études de cas.' },
  '/formules': { title: 'Formules', description: `${priceLine}boutiques en ligne et applications sur devis : comparez les formules de theLab.` },
  '/diagnostic': { title: 'Diagnostic', description: 'Trois questions, une recommandation : découvrez en 30 secondes ce dont votre projet a besoin.' },
  '/contact': { title: 'Contact', description: 'Écrivez à theLab sur WhatsApp ou par e-mail. Réponse sous 24 h, en français, sans jargon.' },
}

export const projectMeta = (p) => ({
  title: p.name,
  description: [p.tagline, p.summary].filter(Boolean).join(' '),
  image: `/og/${p.id.toLowerCase()}.png`,
})

// Toutes les adresses à générer au build
export function allRoutes() {
  const routes = { '/': DEFAULT_META }
  for (const [path, m] of Object.entries(PAGE_META)) routes[path] = { ...DEFAULT_META, ...m, title: `${m.title} · ${SITE}` }
  for (const p of PROJECTS.filter((x) => !x.href)) {
    const m = projectMeta(p)
    routes[`/projets/${p.id.toLowerCase()}`] = { ...m, title: `${m.title} · ${SITE}` }
  }
  return routes
}
