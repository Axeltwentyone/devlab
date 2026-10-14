import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

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

// `npm run build` : build classique pour Vercel.
// `npm run build:single` : tout dans un seul index.html (aperçu partageable).
export default defineConfig(({ mode }) => {
  // Rend ADMIN_PASSWORD (fichier .env.local) visible par l'API locale
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'ADMIN_'))
  return {
    plugins: [react(), tailwindcss(), localApi(), ...(mode === 'single' ? [viteSingleFile()] : [])],
    build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : {},
  }
})
