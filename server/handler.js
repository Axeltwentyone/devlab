// API du site et du back-office (Vercel en ligne, Vite en local). `route` = le chemin après /api/.
//
// Public :
//   GET    content              contenu du site (null si jamais enregistré : le site garde ses valeurs par défaut)
//   GET    files/:key           une image envoyée depuis le back-office
//   POST   leads                une demande issue du diagnostic
// Administrateur (cookie de session) :
//   POST   login  logout        GET me
//   PUT    content              enregistrer le contenu (l'ancienne version part dans l'historique)
//   GET    history              les dernières versions      POST history/:key/restore
//   POST   upload               envoyer une image (corps brut, type dans Content-Type)
//   GET    leads                liste des demandes          PATCH / DELETE leads/:id
import { store } from './store.js'
import { checkPassword, clearCookie, isAdmin, passwordConfigured, sessionCookie } from './auth.js'

const CURRENT = 'content/current.json'
const HISTORY = 'content/history/'
const HISTORY_MAX = 10
const IMAGE_MAX = 4 * 1024 * 1024 // les fonctions Vercel acceptent 4,5 Mo par requête
const IMAGE_TYPES = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/avif': 'avif' }
const LEAD_STATUSES = ['nouveau', 'contacté', 'en cours', 'gagné', 'perdu']

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })
const error = (message, status) => json({ error: message }, status)
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
const safeKey = (k) => /^[a-z0-9-]+(\.[a-z0-9]+)?$/i.test(k || '')

async function readJSON(req, limit) {
  const text = await req.text()
  if (text.length > limit) throw Object.assign(new Error('Contenu trop volumineux'), { status: 413 })
  try {
    return JSON.parse(text)
  } catch {
    throw Object.assign(new Error('JSON invalide'), { status: 400 })
  }
}

// ---- Contenu -------------------------------------------------------------

async function archiveCurrent() {
  const current = await store.getJSON(CURRENT)
  if (!current) return
  await store.setJSON(`${HISTORY}${Date.now()}.json`, current)
  const keys = (await store.list(HISTORY)).sort()
  await store.delete(keys.slice(0, -HISTORY_MAX))
}

async function putContent(req) {
  const body = await readJSON(req, 1024 * 1024)
  if (!body || typeof body.content !== 'object' || Array.isArray(body.content)) return error('Contenu invalide', 400)
  await archiveCurrent()
  await store.setJSON(CURRENT, body.content)
  return json({ ok: true, savedAt: new Date().toISOString() })
}

async function listHistory() {
  const keys = (await store.list(HISTORY)).sort().reverse()
  const versions = keys.map((key) => {
    const ts = Number(key.slice(HISTORY.length).replace('.json', ''))
    return { key: String(ts), savedAt: new Date(ts).toISOString() }
  })
  return json({ versions })
}

async function restoreHistory(ts) {
  if (!/^\d+$/.test(ts)) return error('Version introuvable', 404)
  const version = await store.getJSON(`${HISTORY}${ts}.json`)
  if (!version) return error('Version introuvable', 404)
  await archiveCurrent()
  await store.setJSON(CURRENT, version)
  return json({ ok: true, content: version })
}

// ---- Images --------------------------------------------------------------

async function upload(req) {
  const type = (req.headers.get('content-type') || '').split(';')[0].trim()
  const ext = IMAGE_TYPES[type]
  if (!ext) return error('Format accepté : WebP, PNG, JPEG, GIF ou AVIF', 415)
  const data = await req.arrayBuffer()
  if (data.byteLength > IMAGE_MAX) return error('Image trop lourde (4 Mo maximum)', 413)
  if (!data.byteLength) return error('Image vide', 400)
  const key = `${newId()}.${ext}`
  await store.setFile(`files/${key}`, data, type)
  return json({ url: `/api/files/${key}` })
}

async function getFile(key) {
  if (!safeKey(key)) return new Response('Introuvable', { status: 404 })
  const file = await store.getBuffer(`files/${key}`)
  if (!file) return new Response('Introuvable', { status: 404 })
  return new Response(file.data, {
    headers: { 'content-type': file.type || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable' },
  })
}

// ---- Demandes (diagnostic) -----------------------------------------------

const clean = (v, max = 300) => (typeof v === 'string' ? v.slice(0, max) : '')

async function createLead(req) {
  const body = await readJSON(req, 4096)
  const answers = body && typeof body.answers === 'object' ? body.answers : {}
  const lead = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: 'nouveau',
    source: clean(body?.source, 40) || 'diagnostic',
    answers: { profil: clean(answers.profil, 80), besoin: clean(answers.besoin, 80), quand: clean(answers.quand, 80) },
    plan: clean(body?.plan, 120),
    message: clean(body?.message, 600),
    note: '',
  }
  await store.setJSON(`leads/${lead.id}.json`, lead)
  return json({ ok: true }, 201)
}

async function listLeads() {
  const keys = await store.list('leads/')
  const leads = (await Promise.all(keys.map((k) => store.getJSON(k)))).filter(Boolean)
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return json({ leads, statuses: LEAD_STATUSES })
}

async function updateLead(req, id) {
  if (!safeKey(id)) return error('Demande introuvable', 404)
  const lead = await store.getJSON(`leads/${id}.json`)
  if (!lead) return error('Demande introuvable', 404)
  const body = await readJSON(req, 4096)
  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status)) return error('Statut inconnu', 400)
    lead.status = body.status
  }
  if (body.note !== undefined) lead.note = clean(body.note, 2000)
  await store.setJSON(`leads/${id}.json`, lead)
  return json({ ok: true, lead })
}

// ---- Routeur -------------------------------------------------------------

export default async function handle(req, route = '') {
  const [name, id, action] = route.split('/').filter(Boolean).map(decodeURIComponent)
  const method = req.method

  try {
    // Public
    if (name === 'content' && method === 'GET') return json({ content: await store.getJSON(CURRENT) })
    if (name === 'files' && id && method === 'GET') return await getFile(id)
    if (name === 'leads' && !id && method === 'POST') return await createLead(req)

    if (name === 'login' && method === 'POST') {
      if (!passwordConfigured()) return error('Back-office non configuré : ajoutez ADMIN_PASSWORD dans les variables d’environnement.', 503)
      const { password } = await readJSON(req, 1024)
      if (!checkPassword(password || '')) {
        await new Promise((r) => setTimeout(r, 600)) // ralentit les essais au hasard
        return error('Mot de passe incorrect', 401)
      }
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(req) })
    }
    if (name === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'set-cookie': clearCookie() })

    // Administrateur
    if (!isAdmin(req)) return error('Connexion requise', 401)
    if (name === 'me' && method === 'GET') return json({ ok: true })
    if (name === 'content' && method === 'PUT') return await putContent(req)
    if (name === 'history' && !id && method === 'GET') return await listHistory()
    if (name === 'history' && id && action === 'restore' && method === 'POST') return await restoreHistory(id)
    if (name === 'upload' && method === 'POST') return await upload(req)
    if (name === 'leads' && !id && method === 'GET') return await listLeads()
    if (name === 'leads' && id && method === 'PATCH') return await updateLead(req, id)
    if (name === 'leads' && id && method === 'DELETE') {
      if (!safeKey(id)) return error('Demande introuvable', 404)
      await store.delete(`leads/${id}.json`)
      return json({ ok: true })
    }
    return error('Route inconnue', 404)
  } catch (e) {
    if (e.status) return error(e.message, e.status)
    console.error(e)
    return error('Erreur serveur', 500)
  }
}
