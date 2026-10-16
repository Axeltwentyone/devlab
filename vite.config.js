import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// En développement, /api/* est servi par le même code que sur Vercel (server/handler.js),
// avec un stockage dans le dossier local .data/ à la place de Vercel Blob.
function localApi() {
  return {
    name: 'thelab-local-api',
    configureServer(server) {
      process.env.THELAB_LOCAL_STORE ||= '.data'
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        try {
          const { default: handle } = await server.ssrLoadModule('/server/handler.js')
          const chunks = []
          for await (const c of req) chunks.push(c)
          const body = ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
          const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, body })
          const response = await handle(request, req.url.slice('/api/'.length).split('?')[0])
          res.statusCode = response.status
          response.headers.forEach((v, k) => { if (k !== 'set-cookie') res.setHeader(k, v) })
          const cookies = response.headers.getSetCookie()
          if (cookies.length) res.setHeader('set-cookie', cookies)
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          next(e)
        }
      })
    },
  }
}

// Au build : une page HTML par adresse, avec son titre, sa description et son image d'aperçu.
// WhatsApp, Google et les réseaux sociaux lisent ces balises sans exécuter le JavaScript.
// L'adresse du site (pour les images) vient de SITE_URL, ou du domaine de production Vercel.
function pageMeta() {
  return {
    name: 'thelab-page-meta',
    apply: 'build',
    async closeBundle() {
      const { allRoutes } = await import('./src/content/seo.js')
      const dist = path.resolve('dist')
      const base = readFileSync(path.join(dist, 'index.html'), 'utf8')
      const site = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')).replace(/\/$/, '')
      const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
      for (const [route, m] of Object.entries(allRoutes())) {
        const url = `${site}${route === '/' ? '/' : route}`
        const image = `${site}${m.image}`
        const tags = [
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="theLab." />`,
          `<meta property="og:locale" content="fr_FR" />`,
          `<meta property="og:title" content="${esc(m.title)}" />`,
          `<meta property="og:description" content="${esc(m.description)}" />`,
          `<meta property="og:image" content="${esc(image)}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          site && `<meta property="og:url" content="${esc(url)}" />`,
          site && `<link rel="canonical" href="${esc(url)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${esc(m.title)}" />`,
          `<meta name="twitter:description" content="${esc(m.description)}" />`,
          `<meta name="twitter:image" content="${esc(image)}" />`,
        ].filter(Boolean).join('\n    ')
        const html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
          .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
          .replace('</head>', `    ${tags}\n  </head>`)
        const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
        mkdirSync(path.dirname(path.join(dist, file)), { recursive: true })
        writeFileSync(path.join(dist, file), html)
      }
    },
  }
}

// `npm run build` : build classique pour Vercel.
// `npm run build:single` : tout dans un seul index.html (aperçu partageable).
export default defineConfig(({ mode }) => {
  // Rend ADMIN_PASSWORD (fichier .env.local) visible par l'API locale
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'ADMIN_'))
  return {
    plugins: [react(), tailwindcss(), localApi(), ...(mode === 'single' ? [viteSingleFile()] : [pageMeta()])],
    build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : {},
  }
})
