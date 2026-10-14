import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CONTENT, mergeContent } from './defaults.js'

const ContentContext = createContext(DEFAULT_CONTENT)

// Le site s'affiche tout de suite avec le contenu par défaut, puis prend celui du back-office.
// Si l'API ne répond pas (aperçu sans serveur), le contenu par défaut reste.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  useEffect(() => {
    let alive = true
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.content) setContent(mergeContent(d.content)) })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)

const DEFAULT_MESSAGE = 'Bonjour theLab ! J’aimerais parler d’un projet.'
export const waLink = (number, message = DEFAULT_MESSAGE) =>
  `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

// Lien WhatsApp avec le numéro du back-office
export function useWhatsapp() {
  const { contact } = useContent()
  return (message) => waLink(contact.whatsapp, message)
}

// Message prérempli à partir des réponses du diagnostic
export function buildMessage(questions, answers) {
  const phrases = questions.map((q) => q.options.find((o) => o.id === answers[q.id])?.phrase).filter(Boolean)
  if (!phrases.length) return DEFAULT_MESSAGE
  const [first, ...rest] = phrases
  return `Bonjour theLab ! ${first.charAt(0).toUpperCase() + first.slice(1)}${rest.map((p) => `, ${p}`).join('')}. On peut en parler ?`
}
