// Toutes les infos à modifier facilement se trouvent ici.
export const WHATSAPP_NUMBER = '2250797589617'
export const EMAIL = 'thelab2225@gmail.com'

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
    // Contenu tiré des écrans de l'app. TODO : ajouter un vrai chiffre (véhicules, réservations…) quand il y en aura
    caseStudy: {
      problem: 'Louer une voiture à Abidjan passe encore par des appels, des allers-retours et du cash. On ne sait pas ce qui est disponible, ni à quel prix, avant d’avoir eu quelqu’un au téléphone.',
      solution: 'Une app qui montre les véhicules disponibles autour de soi, réserve pour les dates voulues en quelques secondes et encaisse en Wave et Mobile Money. Les propriétaires y proposent aussi leurs véhicules, depuis la même app.',
      audience: [
        { title: 'Les locataires', text: 'Ils trouvent un véhicule près d’eux (berline, SUV, avec chauffeur ou moto), choisissent leurs dates et paient depuis leur téléphone.' },
        { title: 'Les hôtes', text: 'Ils passent en mode « Hôte » pour proposer leurs véhicules à la location, sans changer d’application.' },
      ],
      features: [
        { image: 'shoptongba-onboarding', title: 'Bienvenue', text: 'Trois écrans pour comprendre l’app avant de commencer : des véhicules disponibles à Abidjan, une réservation en quelques secondes, un paiement Wave et Mobile Money. On peut aussi passer l’introduction ou se connecter directement.' },
        { image: 'shoptongba-accueil', title: 'La recherche', text: 'Dès l’accueil : le nombre de véhicules autour de soi, le lieu, les dates de prise et de retour, et un seul bouton « Chercher ». Dessous, les catégories (berlines, SUV/4x4, avec chauffeur, moto) et une sélection près de chez soi avec les prix. Un bouton bascule entre locataire et hôte.' },
      ],
      facts: ['Flutter · iOS & Android', 'Paiement Wave et Mobile Money', 'Véhicules autour de soi', 'Avec ou sans chauffeur', 'Deux rôles : locataire ou hôte', 'Livré en 2026'],
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
    // Contenu tiré des écrans de l'app. TODO : ajouter un vrai chiffre (inscrits, abonnements partagés…) quand il y en aura
    caseStudy: {
      problem: 'Netflix, Spotify, ChatGPT… les abonnements s’additionnent vite. Les partager entre amis ou inconnus fait baisser la facture, mais c’est risqué : qui paie, qui a accès, qui part sans prévenir ?',
      solution: 'Une app qui met en relation ceux qui ont des places libres et ceux qui en cherchent. Chacun voit le prix par mois, les places restantes et la date de renouvellement ; celui qui partage fixe son prix et garde la main sur son offre.',
      audience: [
        { title: 'Ceux qui rejoignent', text: 'Ils trouvent une place libre sur Netflix, Spotify ou Apple Music et ne paient que leur part, chaque mois, en voyant ce qu’ils économisent.' },
        { title: 'Ceux qui partagent', text: 'Ils mettent en ligne les places libres de leur abonnement, choisissent le prix par place et suivent qui en profite.' },
      ],
      features: [
        { image: 'subci-accueil', title: 'L’accueil', text: 'L’abonnement en cours d’activation passe en premier, avec son prix au mois et l’accès en un geste. Dessous : les catégories (streaming, musique, IA & outils, sport) et les offres populaires avec leurs places restantes.' },
        { image: 'subci-explorer', title: 'Explorer', text: 'On cherche un service (Netflix, Spotify, ChatGPT…) et on filtre par catégorie, par disponibilité et par budget. Chaque offre affiche son prix par mois, la réduction par rapport au prix normal et le nombre de places libres.' },
        { image: 'subci-abonnements', title: 'Mes abonnements', text: 'Deux onglets, « Je rejoins » et « Je partage ». En haut, ce que coûte le mois et ce qui a été économisé ; dessous, chaque abonnement avec son statut et sa date de renouvellement automatique.' },
        { image: 'subci-offre', title: 'Gérer une offre', text: 'Celui qui partage règle le prix par place avec un curseur. L’app lui montre la fourchette conseillée et le prévient quand son prix risque de ralentir les inscriptions. Il choisit aussi les appareils autorisés et le nombre de places.' },
      ],
      facts: ['Streaming, musique, IA, sport', 'Prix par place conseillé', 'Renouvellement automatique', 'Économies suivies chaque mois', 'Deux rôles : rejoindre ou partager', 'Lancement 2026'],
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
    // Pas de « problème » à résoudre ici : l'étude de cas présente le projet directement.
    caseStudy: {
      problem: '',
      solution: 'La boutique de précommande de « Tiakolisé et fiers », une série limitée de t-shirts oversize pour la communauté de Tiakola. Un site à l’image du mouvement : couleurs chaudes, typographie affiche, photos du shooting. On choisit sa pièce, on voit combien il en reste, on paie avec Wave et on se fait livrer partout à Abidjan.',
      features: [
        { image: 'tiakolise-produit', title: 'Les pièces', text: 'Les quatre t-shirts défilent un par un, en grand. On retourne le t-shirt pour voir le dos, on choisit sa taille (S à XL) et on l’ajoute au panier. Sous chaque pièce, le nombre d’exemplaires restants rappelle que la série est limitée.' },
        { image: 'tiakolise-passion', title: 'L’univers', text: '« Plus qu’une passion » : une section qui raconte l’état d’esprit Tiakolisé, avec la pièce phare de la série mise en avant et les photos du shooting.' },
        { image: 'tiakolise-collection', title: 'Stock et collection', text: 'Le compteur de la série limitée affiche les pièces encore disponibles, modèle par modèle. Dessous, toute la collection avec son prix et un accès direct à chaque pièce.' },
      ],
      facts: ['Série limitée, stock en direct', 'Recto et verso de chaque pièce', 'Tailles S à XL', 'Paiement Wave', 'Livraison Yango à Abidjan'],
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
    href: '/diagnostic',
    images: [],
  },
]

// Formules affichées dans la section « Formules ». Le contenu reprend les recommandations du diagnostic.
export const PLANS = [
  {
    id: 'vitrine',
    name: 'Site vitrine',
    pitch: 'Pour être trouvé sur Google et contacté.',
    price: '150 000',
    unit: 'FCFA',
    delay: '2 à 3 semaines',
    weeks: [2, 3],
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
    pitch: 'Pour vendre en ligne et encaisser en Mobile Money.',
    price: 'Sur devis',
    delay: '6 à 8 semaines',
    weeks: [6, 8],
    reference: { name: 'Tiakolisé', href: 'https://tiakoliseetfier.com' },
    features: [
      'Catalogue et gestion des commandes',
      'Paiement Mobile Money intégré',
      'Tout se gère depuis votre téléphone',
    ],
  },
  {
    id: 'app',
    name: 'Application mobile',
    pitch: 'Pour un service que vos clients utilisent chaque jour.',
    price: 'Sur devis',
    delay: '8 à 12 semaines',
    weeks: [8, 12],
    reference: { name: 'ShopTonGba', href: '#index' },
    features: [
      'iOS et Android, une seule base de code',
      'Back-office pour gérer vos données',
      'Pensée pour le terrain ivoirien',
    ],
  },
]

// Section « Pourquoi le lab » : uniquement des engagements tenus ailleurs sur le site.
// Section « Pourquoi le lab » : quatre engagements, chacun avec son visuel.
export const REASONS = [
  { id: 'prix', title: 'Zéro surprise', text: 'Le prix et la date de livraison sont fixés avant la première ligne de code.' },
  { id: 'reponse', title: 'Une réponse sous 24 h', text: 'Un seul interlocuteur sur WhatsApp, qui parle français et pas jargon.' },
  { id: 'ici', title: 'Pensé pour ici', text: 'Fait pour les téléphones, les connexions et les paiements de Côte d’Ivoire.' },
  { id: 'reste', title: 'On reste', text: 'Après la mise en ligne, on corrige, on fait évoluer et on vous conseille.' },
]

// Section « La méthode theLab ». TODO : ajuster à ta façon de travailler.
export const STEPS = [
  { title: 'Un message', text: 'Vous nous écrivez sur WhatsApp. On répond sous 24 h et on cale un appel pour comprendre votre activité.' },
  { title: 'Un prix clair', text: 'On fixe ensemble le contenu, le prix et la date de livraison. Rien ne change ensuite sans votre accord.' },
  { title: 'On construit', text: 'Vous voyez l’avancement et validez chaque étape, directement depuis votre téléphone.' },
  { title: 'En ligne, et on reste', text: 'Mise en ligne, prise en main, puis corrections et évolutions quand vous en avez besoin.' },
]

// Section « Savoir-faire » : une ligne par expertise, avec ses outils et un projet qui le prouve.
export const EXPERTISE = [
  { name: 'Sites vitrines', text: 'Des pages rapides, trouvées sur Google, qui donnent envie de vous écrire.', tags: ['React', 'Référencement Google', 'WhatsApp'] },
  { name: 'Applications mobiles', text: 'iOS et Android avec une seule base de code.', tags: ['Flutter', 'iOS', 'Android'], proof: 'ShopTonGba, Subci' },
  { name: 'Boutiques en ligne & Mobile Money', text: 'Catalogue, stock, commandes et paiement local.', tags: ['Wave', 'Orange Money', 'GeniusPay'], proof: 'Tiakolisé' },
  { name: 'Équipe tech externalisée', text: 'Maintenance, évolutions et conseil au mois, avec un interlocuteur unique.', tags: ['Maintenance', 'Évolutions', 'Conseil'] },
]

// Questions fréquentes de la page Formules. Les réponses reprennent ce que le site promet déjà ailleurs.
// TODO : ajuster (conditions de paiement, maintenance…) à ta façon de travailler.
export const FAQ = [
  { q: 'Combien coûte un projet ?', a: 'Le site vitrine démarre à 150 000 FCFA. Les boutiques en ligne et les applications sont sur devis, selon ce qu’il faut construire. Dans tous les cas, le prix est fixé avec vous avant de commencer.' },
  { q: 'Combien de temps ça prend ?', a: 'Comptez 2 à 3 semaines pour un site vitrine, 6 à 8 semaines pour une boutique en ligne et 8 à 12 semaines pour une application. La date de livraison est fixée avant la première ligne de code.' },
  { q: 'Comment on démarre ?', a: 'Vous nous écrivez sur WhatsApp. On cale un appel pour comprendre votre activité, puis on fixe ensemble le contenu, le prix et la date de livraison.' },
  { q: 'Je pourrai modifier mon site moi-même ?', a: 'Oui : le site vitrine est pensé pour que vous puissiez changer vos textes et vos photos sans nous.' },
  { q: 'Mes clients pourront payer en Mobile Money ?', a: 'Oui. Les boutiques en ligne intègrent le paiement Mobile Money, et tout se gère depuis votre téléphone.' },
  { q: 'Et après la mise en ligne ?', a: 'On reste : on corrige, on fait évoluer et on vous conseille. Le projet ne s’arrête pas à la livraison.' },
]

// Page « Le studio ». Le manifeste reprend ce que le site promet déjà ; l'histoire reste vide (section masquée)
// tant qu'elle n'est pas écrite. TODO : valider le manifeste, écrire l'histoire, confirmer les outils.
export const STUDIO = {
  // 3 phrases : le manifeste se lit en un peu plus d'un écran
  manifesto: [
    'Un partenaire, pas un prestataire.',
    'On construit pour ici.',
    'On livre ce qu’on a promis. Et on reste.',
  ],
  story: { title: 'Notre histoire', paragraphs: [] },
  tools: [
    { name: 'Flutter', category: 'Applications mobiles', why: 'Une seule base de code pour iOS et Android.' },
    { name: 'React', category: 'Sites web', why: 'Des sites rapides, y compris sur téléphone.' },
    { name: 'Wave', category: 'Paiement', why: 'Le paiement mobile que vos clients utilisent déjà.' },
    { name: 'GeniusPay', category: 'Paiement', why: 'Le Mobile Money intégré aux boutiques en ligne.' },
  ],
}
