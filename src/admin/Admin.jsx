import { useCallback, useEffect, useMemo, useState } from 'react'
import Logo from '../components/Logo.jsx'
import { api } from './api.js'
import { Fields } from './fields.jsx'
import { SECTIONS } from './schema.js'
import Leads from './Leads.jsx'
import { mergeContent } from '../content/defaults.js'

const btn = 'rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40'

function Login({ onDone }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.login(password)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-fond px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_30px_60px_-30px_rgba(17,17,17,0.3)]">
        <Logo mark className="text-3xl" />
        <h1 className="mt-6 text-xl font-extrabold tracking-[-0.03em]">Back-office</h1>
        <p className="mt-1 text-sm text-gris">Connectez-vous pour modifier le site.</p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-[13px] font-medium">Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-pierre px-3.5 py-3 outline-none focus:border-encre"
          />
        </label>
        {error && <p className="mt-3 text-sm text-[#C2412D]">{error}</p>}
        <button type="submit" disabled={busy || !password} className={`${btn} mt-6 w-full bg-encre py-3.5 text-white hover:bg-bronze`}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}

function History({ onRestore, onClose }) {
  const [versions, setVersions] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    api.history().then((d) => setVersions(d.versions)).catch((e) => setError(e.message))
  }, [])
  const fmt = (iso) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Abidjan' }).format(new Date(iso))
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Historique">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-[-0.03em]">Historique</h2>
          <button type="button" onClick={onClose} className="text-sm text-gris hover:text-encre">Fermer</button>
        </div>
        <p className="mt-1 text-sm text-gris">Les 10 dernières versions enregistrées. Restaurer remplace le contenu en ligne.</p>
        {error && <p className="mt-4 text-sm text-[#C2412D]">{error}</p>}
        {versions && !versions.length && <p className="mt-6 text-sm text-gris">Pas encore d’ancienne version.</p>}
        <ul className="mt-6 flex flex-col gap-2 overflow-y-auto">
          {versions?.map((v) => (
            <li key={v.key} className="flex items-center justify-between rounded-xl border border-pierre px-4 py-3">
              <span className="text-sm">{fmt(v.savedAt)}</span>
              <button
                type="button"
                className={`${btn} border border-pierre hover:border-encre`}
                onClick={() => window.confirm('Remplacer le contenu en ligne par cette version ?') && onRestore(v.key)}
              >
                Restaurer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Admin() {
  const [auth, setAuth] = useState('checking') // checking | out | in
  const [content, setContent] = useState(null)
  const [saved, setSaved] = useState('')
  const [tab, setTab] = useState('leads')
  const [newLeads, setNewLeads] = useState(0)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [history, setHistory] = useState(false)

  useEffect(() => {
    document.title = 'Back-office · theLab.'
    api.me().then(() => setAuth('in')).catch(() => setAuth('out'))
  }, [])

  const load = useCallback(async () => {
    const d = await api.getContent()
    const c = mergeContent(d.content)
    setContent(c)
    setSaved(JSON.stringify(c))
  }, [])
  useEffect(() => { if (auth === 'in') load().catch((e) => setToast(e.message)) }, [auth, load])

  const dirty = content && JSON.stringify(content) !== saved

  // Prévient avant de quitter la page avec des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const save = async () => {
    setSaving(true)
    try {
      await api.saveContent(content)
      setSaved(JSON.stringify(content))
      setToast('Enregistré, le site est à jour.')
    } catch (e) {
      if (e.status === 401) setAuth('out')
      setToast(e.message)
    } finally {
      setSaving(false)
    }
  }

  const restore = async (key) => {
    try {
      const d = await api.restore(key)
      const c = mergeContent(d.content)
      setContent(c)
      setSaved(JSON.stringify(c))
      setHistory(false)
      setToast('Version restaurée.')
    } catch (e) {
      setToast(e.message)
    }
  }

  const logout = async () => {
    if (dirty && !window.confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) return
    await api.logout().catch(() => {})
    setAuth('out')
    setContent(null)
  }

  const section = useMemo(() => SECTIONS.find((s) => s.id === tab), [tab])

  if (auth === 'checking') return <main className="min-h-svh bg-fond" />
  if (auth === 'out') return <Login onDone={() => setAuth('in')} />

  const TABS = [{ id: 'leads', title: 'Demandes', badge: newLeads }, ...SECTIONS]

  return (
    <div className="min-h-svh bg-fond text-encre">
      <header className="sticky top-0 z-30 border-b border-pierre bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Logo mark className="text-[22px]" />
            <span className="text-sm text-gris">Back-office</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setHistory(true)} className={`${btn} hidden hover:bg-fond sm:block`}>Historique</button>
            <a href="/" target="_blank" rel="noreferrer" className={`${btn} hover:bg-fond`}>Voir le site ↗</a>
            <button type="button" onClick={logout} className={`${btn} text-gris hover:bg-fond hover:text-encre`}>Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 pb-32 md:grid-cols-[220px_minmax(0,1fr)] md:py-10">
        <nav aria-label="Rubriques" className="-mx-5 flex gap-1 overflow-x-auto px-5 md:sticky md:top-24 md:mx-0 md:flex-col md:self-start md:overflow-visible md:px-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[15px] transition-colors ${
                tab === t.id ? 'bg-encre text-white' : 'hover:bg-white'
              }`}
            >
              {t.title}
              {t.badge > 0 && <span className="rounded-full bg-bronze px-2 py-0.5 text-xs text-white">{t.badge}</span>}
            </button>
          ))}
          <button type="button" onClick={() => setHistory(true)} className="shrink-0 rounded-xl px-3.5 py-2.5 text-left text-[15px] text-gris hover:bg-white sm:hidden">
            Historique
          </button>
        </nav>

        <main className="min-w-0">
          {tab === 'leads' ? (
            <Leads onCount={setNewLeads} onAuthLost={() => setAuth('out')} />
          ) : !content ? (
            <p className="text-gris">Chargement…</p>
          ) : (
            <section className="rounded-3xl bg-white p-5 md:p-8">
              <h1 className="text-2xl font-extrabold tracking-[-0.035em] md:text-3xl">{section.title}</h1>
              {section.intro && <p className="mt-1 max-w-2xl text-[15px] text-gris">{section.intro}</p>}
              <div className="mt-8">
                {section.list ? (
                  <Fields
                    fields={[{ key: section.path, label: '', type: 'objects', ...section.list }]}
                    value={content}
                    onChange={(v) => setContent(v)}
                  />
                ) : (
                  <Fields fields={section.fields} value={content[section.path]} onChange={(v) => setContent({ ...content, [section.path]: v })} />
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Barre d'enregistrement */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pierre bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <span className="flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-bronze" /> Modifications non enregistrées
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setContent(JSON.parse(saved))} className={`${btn} hover:bg-fond`}>Annuler</button>
              <button type="button" onClick={save} disabled={saving} className={`${btn} bg-encre px-6 text-white hover:bg-bronze`}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-encre px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {history && <History onRestore={restore} onClose={() => setHistory(false)} />}
    </div>
  )
}
