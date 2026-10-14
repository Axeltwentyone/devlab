// Contenu par défaut du site : celui des fichiers src/data/*.
// Le back-office enregistre une version modifiée de cet objet ; le site l'applique par-dessus.
import { AVAILABILITY, EXPERTISE, FAQ, HOURS, STUDIO, NOW, PLANS, PROJECTS, REASONS, SOCIALS, STEPS, WHATSAPP_NUMBER, EMAIL } from '../data/site.js'
import { QUESTIONS, RECOMMENDATIONS } from '../data/diagnostic.js'

export const DEFAULT_CONTENT = {
  contact: { whatsapp: WHATSAPP_NUMBER, email: EMAIL, socials: SOCIALS },
  status: { availability: AVAILABILITY, now: NOW, hours: HOURS },
  projects: PROJECTS,
  reasons: REASONS,
  steps: STEPS,
  expertise: EXPERTISE,
  plans: PLANS,
  faq: FAQ,
  studio: STUDIO,
  diagnostic: { questions: QUESTIONS, recommendations: RECOMMENDATIONS },
}

// Les rubriques composées (contact, statut, diagnostic) sont fusionnées champ par champ :
// un contenu enregistré avant l'ajout d'un champ garde la valeur par défaut de ce champ.
export function mergeContent(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_CONTENT
  const merged = { ...DEFAULT_CONTENT, ...saved }
  for (const key of ['contact', 'status', 'diagnostic', 'studio']) {
    merged[key] = { ...DEFAULT_CONTENT[key], ...(saved[key] || {}) }
  }
  return merged
}
