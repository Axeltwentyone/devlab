// Diagnostic express : 3 questions → une recommandation + un message WhatsApp prérempli.
// La recommandation dépend surtout de la question 2 (le besoin).

export const QUESTIONS = [
  {
    id: 'profil',
    title: 'Vous êtes…',
    options: [
      { id: 'commerce', label: 'Un commerce', phrase: 'j’ai un commerce' },
      { id: 'startup', label: 'Une startup', phrase: 'je lance une startup' },
      { id: 'entreprise', label: 'Une entreprise établie', phrase: 'je représente une entreprise' },
      { id: 'association', label: 'Une association', phrase: 'je représente une association' },
    ],
  },
  {
    id: 'besoin',
    title: 'Vous voulez…',
    options: [
      { id: 'visible', label: 'Être visible en ligne', phrase: 'je veux être visible en ligne' },
      { id: 'vendre', label: 'Vendre en ligne', phrase: 'je veux vendre en ligne' },
      { id: 'app', label: 'Lancer une application', phrase: 'je veux lancer une application' },
      { id: 'suivi', label: 'Être accompagné sur la durée', phrase: 'je cherche un partenaire tech sur la durée' },
    ],
  },
  {
    id: 'quand',
    title: 'Pour quand ?',
    options: [
      { id: 'vite', label: 'Dès que possible', phrase: 'dès que possible' },
      { id: 'bientot', label: 'Dans 1 à 3 mois', phrase: 'idéalement dans 1 à 3 mois' },
      { id: 'info', label: 'Je me renseigne', phrase: 'pour l’instant je me renseigne' },
    ],
  },
]

// TODO : ajuster les délais et formules à ta réalité.
export const RECOMMENDATIONS = {
  visible: {
    title: 'Un site vitrine rapide et bien référencé',
    text: 'Quelques pages claires, trouvées sur Google, avec un contact WhatsApp direct. Vous le modifiez vous-même.',
    delay: '2 à 3 semaines',
    plan: 'Site vitrine',
    price: '150 000 FCFA',
  },
  vendre: {
    title: 'Une boutique en ligne avec paiement Mobile Money',
    text: 'Catalogue, commandes et paiement Mobile Money intégré via GeniusPay. Vous gérez tout depuis votre téléphone.',
    delay: '6 à 8 semaines',
    plan: 'Boutique en ligne',
    price: 'Dès 450 000 FCFA',
  },
  app: {
    title: 'Une application iOS et Android',
    text: 'Une seule base de code pour les deux stores, pensée pour le terrain ivoirien, avec son back-office.',
    delay: '8 à 12 semaines',
    plan: 'Application mobile',
    price: 'Sur devis',
  },
  suivi: {
    title: 'Un partenariat tech au mois',
    text: 'On devient votre équipe tech : maintenance, évolutions et conseil, avec un interlocuteur unique.',
    delay: 'Démarrage sous 2 semaines',
    plan: 'Partenariat au mois',
    price: 'Sur devis',
  },
}

export function buildMessage(answers) {
  const [profil, besoin, quand] = QUESTIONS.map((q) => q.options.find((o) => o.id === answers[q.id]))
  return `Bonjour DevLab ! ${capitalize(profil.phrase)}, ${besoin.phrase}, ${quand.phrase}. On peut en parler ?`
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
