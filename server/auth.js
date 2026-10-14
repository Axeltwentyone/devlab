// Connexion administrateur : un mot de passe (variable ADMIN_PASSWORD) et un jeton signé dans un cookie.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const COOKIE = 'thelab_admin'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

const secret = () => process.env.ADMIN_SECRET || `thelab:${process.env.ADMIN_PASSWORD || ''}`
const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url')
const sha = (s) => createHash('sha256').update(String(s)).digest()

export const passwordConfigured = () => Boolean(process.env.ADMIN_PASSWORD)

export function checkPassword(given) {
  if (!passwordConfigured()) return false
  return timingSafeEqual(sha(given), sha(process.env.ADMIN_PASSWORD))
}

export function sessionCookie(req) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, n: randomBytes(6).toString('hex') })).toString('base64url')
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`
}

export const clearCookie = () => `${COOKIE}=; Path=/api; HttpOnly; SameSite=Strict; Max-Age=0`

export function isAdmin(req) {
  if (!passwordConfigured()) return false
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))
  if (!raw) return false
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.')
  if (!payload || !sig) return false
  const expected = sign(payload)
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp > Date.now()
  } catch {
    return false
  }
}
