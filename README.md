# theLab. — site vitrine

React 19 + Vite + Tailwind CSS v4.

## Lancer en local

```bash
npm install
npm run dev
```

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Accueil : Hero, projets, et un aperçu du studio, du diagnostic et des formules |
| `/studio` | Manifeste, notre histoire (masquée tant qu'elle est vide), nos outils, mot du fondateur |
| `/projets` | Tous les projets, filtrables par type, et le savoir-faire |
| `/projets/<identifiant>` | Étude de cas d'un projet (ex. `/projets/tiakolise`) |
| `/formules` | Formules en détail, nos engagements, questions fréquentes |
| `/diagnostic` | Le diagnostic, les recommandations possibles, la suite après l'envoi |
| `/contact` | Moyens de contact, la méthode, horaires de la semaine |
| `/admin` | Back-office |

Les pages sont gérées par un petit routeur maison (`src/router.jsx`) ; `vercel.json` renvoie toutes les adresses vers `index.html`.

## Mettre en ligne sur Vercel

Le site se déploie depuis le dépôt GitHub. `vercel.json` contient déjà la configuration : build Vite, dossier `dist`, fonction `/api` du back-office et redirection de toutes les pages vers `index.html`.

## Back-office

Adresse : `/admin` (ex. `https://votre-site.vercel.app/admin`).

Il permet de modifier tout le contenu du site (statut en direct, projets et captures, formules, FAQ, diagnostic, studio, méthode, savoir-faire, contact) et de suivre les **demandes** envoyées depuis le diagnostic. Chaque enregistrement est visible tout de suite sur le site, sans redéploiement. Les 10 dernières versions sont gardées dans « Historique ».

### Mise en place (une seule fois)

1. Vercel → votre projet → *Storage* → *Create* → **Blob** → accès **Private** → le relier au projet. Vercel ajoute automatiquement la variable `BLOB_READ_WRITE_TOKEN`.
2. *Settings* → *Environment Variables* → ajouter `ADMIN_PASSWORD` (un mot de passe long, gardé secret).
3. Optionnel : `ADMIN_SECRET` (une longue chaîne au hasard) pour signer les sessions indépendamment du mot de passe. Si vous avez créé un store Blob **Public**, ajoutez aussi `BLOB_ACCESS=public`.
4. Redéployer.

Le contenu, les images envoyées et les demandes sont stockés dans **Vercel Blob**. Tant que rien n'a été enregistré, le site affiche le contenu des fichiers `src/data/`.

### En local

`npm run dev` sert aussi l'API (`/api/*`), avec un stockage dans le dossier `.data/` (non versionné). Le mot de passe local se met dans `.env.local` (voir `.env.example`).

### Fichiers

| Fichier | Rôle |
|---|---|
| `api/handler.js` | Fonction Vercel : reçoit toutes les adresses `/api/*` |
| `server/` | API (contenu, images, demandes, connexion), stockage (Vercel Blob / dossier local) et sessions |
| `src/admin/` | Interface du back-office ; `schema.js` décrit les champs de chaque rubrique |
| `src/content/` | Contenu par défaut, chargement depuis l'API, images |

## Où modifier quoi

Le plus simple : le back-office (`/admin`). Les fichiers ci-dessous contiennent le **contenu par défaut**, utilisé tant que rien n'a été enregistré depuis le back-office.

| Fichier | Contenu |
|---|---|
| `src/data/site.js` | Numéro WhatsApp, réseaux sociaux, statut, projets, pourquoi, méthode, savoir-faire, formules |
| `src/data/diagnostic.js` | Questions du diagnostic, recommandations, délais, formules |
| `src/assets/` | Captures d'écran des projets |
| `src/index.css` | Couleurs et polices de la charte |

## À compléter

- Lien LinkedIn dans `src/data/site.js`
- Délais et formules du diagnostic dans `src/data/diagnostic.js`
- Captures de Subci quand le projet sera prêt (ajouter le nom des images dans `PROJECTS`)
- Page tarifs (pour l'instant, « Demander les tarifs » ouvre WhatsApp)

## Aperçus de partage (WhatsApp, réseaux sociaux, Google)

Au build, chaque adresse (`/studio`, `/projets/tiakolise`…) reçoit sa propre page HTML avec son titre, sa description et son image d'aperçu (`vite.config.js` → `pageMeta`, textes dans `src/content/seo.js`). Vercel les sert grâce à `cleanUrls` dans `vercel.json`.

- **Adresse du site** : définir `SITE_URL` (ex. `https://thelab.ci`) dans les variables Vercel. Sans elle, le domaine de production Vercel est utilisé.
- **Images** : `public/og/` (1200×630). Après l'ajout ou la modification d'un projet, les régénérer avec Chrome installé :

```bash
node scripts/og-images.mjs
```

Les aperçus reprennent le contenu des fichiers `src/data/` (pas celui modifié dans le back-office).

## Mouvement

- Défilement fluide : Lenis (`src/motion/scroll.js`). Pour défiler par code, utiliser `scrollToY` / `scrollToEl`, pas `window.scrollTo`.
- Apparitions : ajouter `data-reveal` (un bloc) ou `data-reveal-stagger` (ses enfants l'un après l'autre) à un élément (`src/motion/reveal.jsx`).
- Transition entre pages : rideau encre dans `src/router.jsx`.
