// Captures livrées avec le site. Une image envoyée depuis le back-office est une URL (/api/files/…),
// une image d'origine est une clé de ce fichier.
import shoptongbaOnboarding from '../assets/shoptongba-onboarding.webp'
import shoptongbaAccueil from '../assets/shoptongba-accueil.webp'
import subciAccueil from '../assets/subci-accueil.webp'
import subciExplorer from '../assets/subci-explorer.webp'
import subciAbonnements from '../assets/subci-abonnements.webp'
import subciOffre from '../assets/subci-offre.webp'
import tiakoliseProduit from '../assets/tiakolise-produit.webp'
import tiakolisePassion from '../assets/tiakolise-passion.webp'
import tiakoliseCollection from '../assets/tiakolise-collection.webp'

export const IMAGES = {
  'shoptongba-onboarding': shoptongbaOnboarding,
  'shoptongba-accueil': shoptongbaAccueil,
  'subci-accueil': subciAccueil,
  'subci-explorer': subciExplorer,
  'subci-abonnements': subciAbonnements,
  'subci-offre': subciOffre,
  'tiakolise-produit': tiakoliseProduit,
  'tiakolise-passion': tiakolisePassion,
  'tiakolise-collection': tiakoliseCollection,
}
export const ALT = {
  'shoptongba-onboarding': 'ShopTongba : écran d’accueil « Une voiture. Maintenant. »',
  'shoptongba-accueil': 'ShopTongba : recherche de véhicules autour de soi à Abidjan',
  'subci-accueil': 'Subci : accueil avec l’abonnement en cours d’activation et les offres populaires',
  'subci-explorer': 'Subci : explorer les abonnements partagés disponibles et leurs prix',
  'subci-abonnements': 'Subci : mes abonnements actifs et les économies du mois',
  'subci-offre': 'Subci : gérer une offre partagée, prix par place et nombre de places',
  'tiakolise-produit': 'Tiakolisé : fiche du t-shirt Mélo Décalé, tailles et prix',
  'tiakolise-passion': 'Tiakolisé : « Plus qu’une passion », la série limitée',
  'tiakolise-collection': 'Tiakolisé : stocks restants et la collection complète',
}

export const imageSrc = (key) => IMAGES[key] || key
export const imageAlt = (key, fallback = '') => ALT[key] || fallback
