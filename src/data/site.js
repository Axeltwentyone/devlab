// Toutes les infos à modifier facilement se trouvent ici.
export const WHATSAPP_NUMBER = '2250797589617'

export const whatsappLink = (message = 'Bonjour DevLab ! J’aimerais parler d’un projet.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/devlab.ci/' },
  { label: 'LinkedIn', href: '#' }, // TODO : lien LinkedIn
]

export const AVAILABILITY = '2 places ce trimestre'

// Statut en direct du Hero : ce qui tourne au studio en ce moment (défile tout seul).
// TODO : garder ces lignes à jour, elles doivent rester vraies.
export const NOW = [
  'On construit Subci, l’app d’abonnements partagés',
  'On suit les précommandes de Tiakolisé',
  'On fait évoluer ShopTonGba',
]

// Horaires du studio, heure d'Abidjan. TODO : vérifier.
export const HOURS = { open: 8, close: 19, days: [1, 2, 3, 4, 5, 6] } // lundi → samedi

export const PROJECTS = [
  {
    id: 'shoptonGba',
    name: 'ShopTonGba',
    kind: 'Application mobile · Flutter',
    year: '2026',
    status: 'Livré',
    // Univers du projet : la section prend ces couleurs quand le projet est à l'écran
    theme: { bg: '#161414', fg: '#F4F0EA', muted: 'rgba(244,240,234,0.55)', line: 'rgba(244,240,234,0.14)', accent: '#C8102E', card: '#262222' },
    tagline: 'Une voiture. Maintenant.',
    summary: 'Location de véhicules à Abidjan : réservation en quelques secondes, paiement Mobile Money.',
    images: ['shoptongba-onboarding', 'shoptongba-accueil'],
    // TODO : vérifier ces textes et ajouter un vrai chiffre (utilisateurs, réservations, délai de livraison…)
    caseStudy: {
      problem: 'Louer une voiture à Abidjan passe encore par des appels, des allers-retours et du cash.',
      solution: 'Une app qui trouve les véhicules autour de soi, réserve en quelques secondes et encaisse en Mobile Money.',
      facts: ['Flutter · iOS & Android', 'Paiement Mobile Money', 'Livré en 2026'],
    },
  },
  {
    id: 'subci',
    name: 'Subci',
    kind: 'Application mobile',
    year: '2026',
    status: 'En cours',
    theme: { bg: '#F3F1EC', fg: '#141414', muted: '#77726B', line: 'rgba(20,20,20,0.12)', accent: '#F26B3A', card: '#FFFFFF' },
    tagline: 'Vos abonnements, à plusieurs.',
    summary: 'Acheter et partager ses abonnements à plusieurs, simplement, en Côte d’Ivoire.',
    images: ['subci-accueil', 'subci-explorer', 'subci-abonnements', 'subci-offre'],
    // TODO : vérifier ces textes et ajouter un vrai chiffre quand il y en aura
    caseStudy: {
      problem: 'Partager un abonnement entre inconnus, c’est risqué : qui paie, qui a accès, qui part sans prévenir ?',
      solution: 'Une app où chacun rejoint ou propose une offre, fixe le prix par place et suit ses renouvellements.',
      facts: ['Streaming, musique, IA, sport', 'Prix par place conseillé', 'Lancement 2026'],
    },
  },
  {
    id: 'tiakolise',
    name: 'Tiakolisé',
    kind: 'Site e-commerce · Précommande',
    year: '2026',
    status: 'En ligne',
    url: 'https://tiakoliseetfier.com',
    theme: { bg: '#B9532A', fg: '#FBF1E6', muted: 'rgba(251,241,230,0.72)', line: 'rgba(251,241,230,0.28)', accent: '#1B110E', card: '#1B110E' },
    tagline: 'Fait par nous, pour nous.',
    summary: 'La boutique de précommande des t-shirts « Tiakolisé et fiers », la série limitée de la communauté de Tiakola.',
    images: ['tiakolise-produit', 'tiakolise-passion', 'tiakolise-collection'],
    // TODO : vérifier ces textes et ajouter un vrai chiffre (pièces vendues, commandes…)
    caseStudy: {
      problem: 'Vendre une série limitée à une communauté de fans, sans passer par les DM ni perdre le fil des stocks.',
      solution: 'Un site où l’on choisit sa pièce et sa taille, voit les stocks restants, paie avec Wave et se fait livrer par Yango.',
      facts: ['Paiement Wave', 'Livraison Yango à Abidjan', 'Stock en temps réel'],
    },
  },
  {
    id: 'vous',
    name: 'Votre projet',
    kind: '—',
    year: '—',
    status: 'Ouvert',
    theme: { bg: '#111111', fg: '#F4F2EE', muted: '#A8A29A', line: 'rgba(244,242,238,0.14)', accent: '#9C7A4E', card: '#1C1C1C' },
    tagline: 'La prochaine app, c’est la vôtre.',
    summary: 'Trois questions pour savoir ce dont vous avez besoin.',
    href: '#diagnostic',
    images: [],
  },
]

// Formules affichées dans la section « Formules ». Le contenu reprend les recommandations du diagnostic.
export const PLANS = [
  {
    id: 'vitrine',
    name: 'Site vitrine',
    price: '150 000',
    unit: 'FCFA',
    delay: '2 à 3 semaines',
    features: [
      'Quelques pages claires sur votre activité',
      'Bien référencé sur Google',
      'Contact WhatsApp direct',
      'Vous le modifiez vous-même',
    ],
  },
  {
    id: 'ecommerce',
    name: 'Boutique en ligne',
    price: 'Sur devis',
    delay: '6 à 8 semaines',
    features: [
      'Catalogue et gestion des commandes',
      'Paiement Mobile Money intégré',
      'Tout se gère depuis votre téléphone',
    ],
  },
  {
    id: 'app',
    name: 'Application mobile',
    price: 'Sur devis',
    delay: '8 à 12 semaines',
    features: [
      'iOS et Android, une seule base de code',
      'Back-office pour gérer vos données',
      'Pensée pour le terrain ivoirien',
    ],
  },
]

// Section « Pourquoi devlab » : uniquement des engagements tenus ailleurs sur le site.
export const REASONS = [
  { title: 'Zéro surprise', text: 'Vous connaissez le prix et la date de livraison avant qu’on écrive la première ligne de code.' },
  { title: 'Une réponse sous 24 h', text: 'Un seul interlocuteur, joignable sur WhatsApp, qui parle français et pas jargon.' },
  { title: 'Pensé pour ici', text: 'Des sites et des apps faits pour les téléphones, les connexions et le Mobile Money de Côte d’Ivoire.' },
  { title: 'On reste', text: 'Après la mise en ligne, on corrige, on fait évoluer et on vous conseille. Le projet ne s’arrête pas à la livraison.' },
]

// Section « La méthode devlab ». TODO : ajuster à ta façon de travailler.
export const STEPS = [
  { title: 'Un message', text: 'Vous nous écrivez sur WhatsApp. On répond sous 24 h et on cale un appel pour comprendre votre activité.' },
  { title: 'Un prix clair', text: 'On fixe ensemble le contenu, le prix et la date de livraison. Rien ne change ensuite sans votre accord.' },
  { title: 'On construit', text: 'Vous voyez l’avancement et validez chaque étape, directement depuis votre téléphone.' },
  { title: 'En ligne, et on reste', text: 'Mise en ligne, prise en main, puis corrections et évolutions quand vous en avez besoin.' },
]

export const EXPERTISE = [
  'Sites vitrines',
  'Applications mobiles',
  'Boutiques en ligne & Mobile Money',
  'Équipe tech externalisée',
]
