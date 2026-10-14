// Stockage : Vercel Blob en ligne, un simple dossier local (.data/) en développement.
// Une seule interface : get / set (JSON ou fichier) / delete / list.
import { del, get, list, put } from '@vercel/blob'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const LOCAL_DIR = process.env.THELAB_LOCAL_STORE
// Accès du store Vercel Blob (choisi à sa création) : « private » conseillé, « public » possible
const ACCESS = process.env.BLOB_ACCESS === 'public' ? 'public' : 'private'

const streamToBuffer = async (stream) => Buffer.from(await new Response(stream).arrayBuffer())

function blobStore() {
  return {
    async getBuffer(key) {
      const res = await get(key, { access: ACCESS, useCache: false })
      if (!res) return null
      if (!res.stream) return null
      return { data: await streamToBuffer(res.stream), type: res.blob?.contentType || res.headers.get('content-type') }
    },
    async getJSON(key) {
      const res = await this.getBuffer(key)
      return res ? JSON.parse(res.data.toString('utf8')) : null
    },
    async setJSON(key, value) {
      await put(key, JSON.stringify(value), { access: ACCESS, contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 })
    },
    async setFile(key, data, type) {
      await put(key, Buffer.from(data), { access: ACCESS, contentType: type, addRandomSuffix: false })
    },
    async delete(keys) {
      const all = [].concat(keys)
      if (all.length) await del(all)
    },
    async list(prefix) {
      const out = []
      let cursor
      do {
        const page = await list({ prefix, cursor, limit: 1000 })
        out.push(...page.blobs.map((b) => b.pathname))
        cursor = page.hasMore ? page.cursor : undefined
      } while (cursor)
      return out
    },
  }
}

function localStore() {
  const file = (key) => path.resolve(LOCAL_DIR, ...key.split('/').map(encodeURIComponent))
  const read = async (p) => { try { return await fs.readFile(p) } catch { return null } }
  return {
    async getBuffer(key) {
      const data = await read(file(key))
      if (!data) return null
      const meta = await read(`${file(key)}.__type`)
      return { data, type: meta?.toString('utf8') }
    },
    async getJSON(key) {
      const data = await read(file(key))
      return data ? JSON.parse(data.toString('utf8')) : null
    },
    async setJSON(key, value) {
      await fs.mkdir(path.dirname(file(key)), { recursive: true })
      await fs.writeFile(file(key), JSON.stringify(value))
    },
    async setFile(key, data, type) {
      await fs.mkdir(path.dirname(file(key)), { recursive: true })
      await fs.writeFile(file(key), Buffer.from(data))
      await fs.writeFile(`${file(key)}.__type`, type)
    },
    async delete(keys) {
      for (const k of [].concat(keys)) {
        await fs.rm(file(k), { force: true })
        await fs.rm(`${file(k)}.__type`, { force: true })
      }
    },
    async list(prefix) {
      const dir = path.dirname(file(`${prefix}x`))
      let names = []
      try { names = await fs.readdir(dir) } catch {}
      const base = prefix.slice(0, prefix.lastIndexOf('/') + 1)
      return names.filter((n) => !n.endsWith('.__type')).map((n) => base + decodeURIComponent(n)).filter((k) => k.startsWith(prefix))
    },
  }
}

export const store = LOCAL_DIR ? localStore() : blobStore()
