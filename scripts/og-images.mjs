// Génère les images d'aperçu de partage (1200×630) dans public/og/ avec Chrome en mode headless.
// À relancer quand un projet change :  node scripts/og-images.mjs
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { PROJECTS } from '../src/data/site.js'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public/og')
mkdirSync(OUT, { recursive: true })

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;800&family=Instrument+Serif&family=DM+Mono&display=swap'
const mark = (ring, lens = '#A9774A', h = 56) =>
  `<svg viewBox="0 0 64 44" height="${h}"><defs><clipPath id="c"><circle cx="22" cy="22" r="18"/></clipPath></defs>
   <circle cx="42" cy="22" r="18" fill="${lens}" clip-path="url(#c)"/>
   <circle cx="22" cy="22" r="18" fill="none" stroke="${ring}" stroke-width="4"/>
   <circle cx="42" cy="22" r="18" fill="none" stroke="${ring}" stroke-width="4"/></svg>`
const wordmark = (color, size) =>
  `<span style="font:800 ${size}px 'Inter Tight';letter-spacing:-0.055em;color:${color}">the</span><span style="font:400 ${size * 1.2}px 'Instrument Serif';letter-spacing:-0.045em;color:${color}">Lab</span><span style="display:inline-block;width:${size * 0.17}px;height:${size * 0.17}px;border-radius:99px;background:#A9774A;margin-left:${size * 0.05}px"></span>`
const page = (body, bg) => `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTS}" rel="stylesheet">
  <style>*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:${bg};overflow:hidden;font-family:'Inter Tight'}</style></head><body>${body}</body></html>`
const img = (key) => `file://${path.join(ROOT, 'src/assets', `${key}.webp`)}`
const phone = (key, rot, extra = '') =>
  `<div style="width:230px;aspect-ratio:9/19.5;border-radius:36px;background:#111;padding:7px;transform:rotate(${rot}deg);box-shadow:0 30px 60px -20px rgba(0,0,0,.5);${extra}">
     <img src="${img(key)}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:30px;display:block"></div>`

const pages = {
  default: page(`
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 96px">
      <div style="font:400 15px 'DM Mono';letter-spacing:.14em;text-transform:uppercase;color:#6E6B64">Studio web &amp; mobile — Abidjan</div>
      <div style="margin-top:28px;display:flex;align-items:center;gap:30px">${mark('#111', '#A9774A', 110)}<div style="display:flex;align-items:baseline;line-height:1">${wordmark('#111', 150)}</div></div>
      <div style="margin-top:44px;font:400 34px 'Inter Tight';color:#111;max-width:900px;line-height:1.2">Des sites et des applications qui <span style="font:400 38px 'Instrument Serif'">tiennent</span>, pensés pour la Côte d’Ivoire.</div>
    </div>`, '#F3F2EE'),
}
for (const p of PROJECTS.filter((x) => !x.href)) {
  const t = p.theme
  const shots = p.images.slice(0, 2)
  pages[p.id.toLowerCase()] = page(`
    <div style="position:absolute;inset:0;padding:72px 0 72px 80px;display:flex;flex-direction:column;justify-content:space-between;color:${t.fg};width:640px">
      <div style="font:400 14px 'DM Mono';letter-spacing:.14em;text-transform:uppercase;color:${t.muted}">${p.kind} · ${p.year}</div>
      <div>
        <div style="font:800 112px 'Inter Tight';letter-spacing:-0.055em;line-height:.92">${p.name}<span style="display:inline-block;width:19px;height:19px;border-radius:99px;background:${t.accent};margin-left:6px"></span></div>
        <div style="margin-top:22px;font:400 34px 'Instrument Serif';color:${t.muted}">${p.tagline}</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px">${mark(t.fg, '#A9774A', 30)}<div style="display:flex;align-items:baseline;line-height:1">${wordmark(t.fg, 34)}</div><span style="font:400 13px 'DM Mono';letter-spacing:.14em;text-transform:uppercase;color:${t.muted};margin-left:10px">Étude de cas</span></div>
    </div>
    <div style="position:absolute;right:40px;top:0;bottom:0;width:520px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:40px;border-radius:999px;background:radial-gradient(circle, ${t.accent}55, transparent 68%)"></div>
      ${shots.map((k, i) => phone(k, i ? 7 : -7, `margin:0 -28px;position:relative;top:${i ? 40 : -10}px`)).join('')}
    </div>`, t.bg)
}

// Chrome headless + protocole DevTools : une capture par page
const profile = path.join(tmpdir(), `thelab-og-${Date.now()}`)
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9334', `--user-data-dir=${profile}`, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
try {
  // Attend que Chrome réponde (jusqu'à 15 s)
  let targets = null
  for (let i = 0; i < 30 && !targets; i++) {
    await sleep(500)
    targets = await fetch('http://127.0.0.1:9334/json').then((r) => r.json()).catch(() => null)
  }
  if (!targets) throw new Error('Chrome ne répond pas (CHROME_PATH ?)')
  const target = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const pending = {}
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d.result); delete pending[d.id] } }
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })) })
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
  await send('Page.enable')
  for (const [name, html] of Object.entries(pages)) {
    const file = path.join(profile, `${name}.html`)
    writeFileSync(file, html)
    await send('Page.navigate', { url: `file://${file}` })
    await sleep(2500)
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(shot.data, 'base64'))
    console.log('og/' + name + '.png')
  }
  ws.close()
} finally {
  chrome.kill()
  await sleep(1000)
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
}
