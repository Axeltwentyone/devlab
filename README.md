# devlab. — site vitrine

React 19 + Vite + Tailwind CSS v4.

## Lancer en local

```bash
npm install
npm run dev
```

## Mettre en ligne sur Netlify

- Commande de build : `npm run build`
- Dossier publié : `dist`

## Où modifier quoi

| Fichier | Contenu |
|---|---|
| `src/data/site.js` | Numéro WhatsApp, réseaux sociaux, disponibilité, projets, savoir-faire |
| `src/data/diagnostic.js` | Questions du diagnostic, recommandations, délais, formules |
| `src/assets/` | Captures d'écran des projets |
| `src/index.css` | Couleurs et polices de la charte |

## À compléter

- Lien LinkedIn dans `src/data/site.js`
- Délais et formules du diagnostic dans `src/data/diagnostic.js`
- Captures de Subci quand le projet sera prêt (ajouter le nom des images dans `PROJECTS`)
- Page tarifs (pour l'instant, « Demander les tarifs » ouvre WhatsApp)
