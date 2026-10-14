import { useEffect, useState } from 'react'
import { api } from './api.js'

const STATUS_STYLE = {
  nouveau: 'bg-bronze text-white',
  contacté: 'bg-[#E3EEF9] text-[#1F4E8C]',
  'en cours': 'bg-[#FFF1D6] text-[#8A5A00]',
  gagné: 'bg-[#DDF5E4] text-[#1B6B36]',
  perdu: 'bg-fond text-gris',
}

const fmt = (iso) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Abidjan' }).format(new Date(iso))

function Lead({ lead, statuses, onChange, onDelete }) {
  const [note, setNote] = useState(lead.note || '')
  const a = lead.answers || {}
  return (
    <li className="rounded-3xl bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gris">{fmt(lead.createdAt)} · {lead.source}</p>
          <p className="mt-1 text-lg font-extrabold tracking-[-0.02em]">{lead.plan || a.besoin || 'Demande'}</p>
        </div>
        <select
          value={lead.status}
          onChange={(e) => onChange({ status: e.target.value })}
          aria-label="Statut"
          className={`rounded-full px-3 py-1.5 text-sm font-medium outline-none ${STATUS_STYLE[lead.status] || 'bg-fond'}`}
        >
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        {[['Profil', a.profil], ['Besoin', a.besoin], ['Quand', a.quand]].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-gris">{k}</dt>
            <dd className="mt-0.5">{v || '—'}</dd>
          </div>
        ))}
      </dl>
      {lead.message && <p className="mt-4 rounded-2xl bg-[#D9FDD3] px-4 py-3 text-sm leading-relaxed">{lead.message}</p>}
      <label className="mt-4 block">
        <span className="mb-1 block text-xs text-gris">Note interne</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== (lead.note || '') && onChange({ note })}
          placeholder="Ex. a écrit sur WhatsApp, rappeler jeudi…"
          className="min-h-16 w-full resize-y rounded-xl border border-pierre px-3 py-2 text-sm outline-none focus:border-encre"
        />
      </label>
      <button
        type="button"
        onClick={() => window.confirm('Supprimer cette demande ?') && onDelete()}
        className="mt-2 text-sm text-gris hover:text-[#C2412D]"
      >
        Supprimer
      </button>
    </li>
  )
}

export default function Leads({ onCount, onAuthLost }) {
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('tous')
  const [error, setError] = useState('')

  const fail = (e) => {
    if (e.status === 401) onAuthLost()
    setError(e.message)
  }

  useEffect(() => {
    api.leads().then(setData).catch(fail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data) onCount(data.leads.filter((l) => l.status === 'nouveau').length)
  }, [data, onCount])

  const update = async (id, patch) => {
    try {
      const { lead } = await api.updateLead(id, patch)
      setData((d) => ({ ...d, leads: d.leads.map((l) => (l.id === id ? lead : l)) }))
    } catch (e) {
      fail(e)
    }
  }
  const remove = async (id) => {
    try {
      await api.deleteLead(id)
      setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) }))
    } catch (e) {
      fail(e)
    }
  }

  if (error) return <p className="text-[#C2412D]">{error}</p>
  if (!data) return <p className="text-gris">Chargement…</p>

  const shown = filter === 'tous' ? data.leads : data.leads.filter((l) => l.status === filter)

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-[-0.035em] md:text-3xl">Demandes</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-gris">
        Chaque fois qu’un visiteur termine le diagnostic et clique sur « Envoyer sur WhatsApp », sa demande arrive ici.
        Le message lui-même part sur votre WhatsApp.
      </p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {['tous', ...data.statuses].map((s) => {
          const n = s === 'tous' ? data.leads.length : data.leads.filter((l) => l.status === s).length
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${filter === s ? 'border-encre bg-encre text-white' : 'border-pierre bg-white'}`}
            >
              {s} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      {shown.length ? (
        <ul className="mt-6 flex flex-col gap-3">
          {shown.map((l) => (
            <Lead key={l.id} lead={l} statuses={data.statuses} onChange={(p) => update(l.id, p)} onDelete={() => remove(l.id)} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-3xl border border-dashed border-pierre p-10 text-center text-gris">Aucune demande pour l’instant.</p>
      )}
    </section>
  )
}
