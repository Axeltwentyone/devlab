// Fonction Vercel : toutes les adresses /api/* arrivent ici (voir vercel.json),
// avec le chemin d'origine dans le paramètre `route`.
import handle from '../server/handler.js'

const run = (request) => handle(request, new URL(request.url).searchParams.get('route') || '')

export const GET = run
export const POST = run
export const PUT = run
export const PATCH = run
export const DELETE = run
