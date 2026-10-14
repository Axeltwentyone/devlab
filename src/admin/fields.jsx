// Éditeurs de champs génériques : chaque rubrique du back-office est décrite par un schéma (schema.js)
// et rendue avec ces briques. Ajouter un champ au site = ajouter une ligne au schéma.
import { useState } from 'react'
import { api } from './api.js'
import { imageSrc } from '../content/images.js'

const input =
  'w-full rounded-xl border border-pierre bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-encre'

function Label({ field, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium">{field.label}</span>
      {children}
      {field.help && <span className="mt-1.5 block text-xs text-gris">{field.help}</span>}
    </label>
  )
}

function IconButton({ label, onClick, children, danger, disabled }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-30 ${
        danger ? 'text-[#C2412D] hover:bg-[#F7E4E1]' : 'text-gris hover:bg-fond hover:text-encre'
      }`}
    >
      {children}
    </button>
  )
}

const move = (arr, i, d) => {
  const next = [...arr]
  const j = i + d
  if (j < 0 || j >= next.length) return arr
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

// Valeur vide d'un champ, pour les nouveaux éléments
export function emptyValue(field) {
  switch (field.type) {
    case 'list':
    case 'objects':
    case 'images':
      return []
    case 'group':
      return Object.fromEntries(field.fields.map((f) => [f.key, emptyValue(f)]))
    case 'record':
      return {}
    case 'number':
      return 0
    case 'weeks':
      return [1, 2]
    case 'days':
      return [1, 2, 3, 4, 5]
    case 'color':
      return '#111111'
    default:
      return ''
  }
}

function TextList({ field, value = [], onChange }) {
  return (
    <Label field={field}>
      <div className="flex flex-col gap-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input className={input} value={v} onChange={(e) => onChange(value.map((x, k) => (k === i ? e.target.value : x)))} />
            <IconButton label="Monter" onClick={() => onChange(move(value, i, -1))} disabled={i === 0}>↑</IconButton>
            <IconButton label="Descendre" onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1}>↓</IconButton>
            <IconButton label="Supprimer" danger onClick={() => onChange(value.filter((_, k) => k !== i))}>✕</IconButton>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ''])} className="self-start text-sm font-medium text-bronze hover:underline">
          + Ajouter
        </button>
      </div>
    </Label>
  )
}

function Images({ field, value = [], onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const add = async (files) => {
    setErr('')
    setBusy(true)
    try {
      const urls = []
      for (const f of files) urls.push((await api.upload(f)).url)
      onChange([...value, ...urls])
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Label field={field}>
      <div className="flex flex-wrap gap-3">
        {value.map((key, i) => (
          <div key={key + i} className="group relative w-24">
            <img src={imageSrc(key)} alt="" className="aspect-[9/19.5] w-24 rounded-xl border border-pierre bg-fond object-cover object-top" />
            <div className="mt-1 flex justify-center">
              <IconButton label="Vers la gauche" onClick={() => onChange(move(value, i, -1))} disabled={i === 0}>←</IconButton>
              <IconButton label="Retirer" danger onClick={() => onChange(value.filter((_, k) => k !== i))}>✕</IconButton>
              <IconButton label="Vers la droite" onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1}>→</IconButton>
            </div>
          </div>
        ))}
        <label className={`flex aspect-[9/19.5] w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-pierre text-center text-xs text-gris transition-colors hover:border-encre hover:text-encre ${busy ? 'pointer-events-none opacity-50' : ''}`}>
          <span className="text-2xl font-light">+</span>
          {busy ? 'Envoi…' : 'Ajouter'}
          <input
            type="file"
            accept="image/webp,image/png,image/jpeg,image/gif,image/avif"
            multiple
            className="sr-only"
            onChange={(e) => { add([...e.target.files]); e.target.value = '' }}
          />
        </label>
      </div>
      {err && <span className="mt-2 block text-sm text-[#C2412D]">{err}</span>}
    </Label>
  )
}

function Objects({ field, value = [], onChange }) {
  const [open, setOpen] = useState(null)
  const title = (item, i) => (field.itemLabel ? field.itemLabel(item) : '') || `${field.itemName || 'Élément'} ${i + 1}`
  const add = () => {
    const item = field.newItem ? field.newItem() : emptyValue({ type: 'group', fields: field.fields })
    onChange([...value, item])
    setOpen(value.length)
  }
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium">{field.label}</p>
      {field.help && <p className="-mt-1 mb-3 text-xs text-gris">{field.help}</p>}
      <div className="flex flex-col gap-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-2xl border border-pierre bg-white">
            <div className="flex items-center gap-1 pl-4 pr-2">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-3 py-3 text-left">
                <span className={`text-xs text-gris transition-transform ${open === i ? 'rotate-90' : ''}`}>▶</span>
                <span className="truncate font-medium">{title(item, i)}</span>
              </button>
              <IconButton label="Monter" onClick={() => { onChange(move(value, i, -1)); setOpen(null) }} disabled={i === 0}>↑</IconButton>
              <IconButton label="Descendre" onClick={() => { onChange(move(value, i, 1)); setOpen(null) }} disabled={i === value.length - 1}>↓</IconButton>
              <IconButton
                label="Supprimer"
                danger
                onClick={() => {
                  if (window.confirm(`Supprimer « ${title(item, i)} » ?`)) {
                    onChange(value.filter((_, k) => k !== i))
                    setOpen(null)
                  }
                }}
              >
                ✕
              </IconButton>
            </div>
            {open === i && (
              <div className="border-t border-fond p-4">
                <Fields fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, k) => (k === i ? v : x)))} />
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={add} className="self-start rounded-full border border-pierre px-4 py-2 text-sm font-medium transition-colors hover:border-encre">
          + Ajouter {field.itemName ? field.itemName.toLowerCase() : 'un élément'}
        </button>
      </div>
    </div>
  )
}

// Objet à clés libres (ex. une recommandation par réponse du diagnostic)
function Record({ field, value = {}, onChange }) {
  const entries = Object.entries(value)
  const asList = entries.map(([k, v]) => ({ __key: k, ...v }))
  const toRecord = (list) => Object.fromEntries(list.map(({ __key, ...rest }) => [__key, rest]))
  return (
    <Objects
      field={{
        ...field,
        fields: [{ key: '__key', label: field.keyLabel || 'Clé', type: 'text', help: field.keyHelp }, ...field.fields],
        itemLabel: (it) => (field.itemLabel ? field.itemLabel(it) : it.__key),
        newItem: () => ({ __key: `nouveau-${entries.length + 1}`, ...emptyValue({ type: 'group', fields: field.fields }) }),
      }}
      value={asList}
      onChange={(list) => onChange(toRecord(list))}
    />
  )
}

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return (
        <Label field={field}>
          <textarea className={`${input} min-h-24 resize-y leading-relaxed`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Label>
      )
    case 'number':
      return (
        <Label field={field}>
          <input type="number" className={input} value={value ?? 0} min={field.min} max={field.max} onChange={(e) => onChange(Number(e.target.value))} />
        </Label>
      )
    case 'color':
      return (
        <Label field={field}>
          <div className="flex items-center gap-2">
            <span className="size-10 shrink-0 rounded-xl border border-pierre" style={{ background: value }} />
            <input className={input} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="#111111 ou rgba(…)" />
            {/^#[0-9a-f]{6}$/i.test(value || '') && (
              <input type="color" aria-label={`Choisir ${field.label}`} className="size-10 shrink-0 cursor-pointer rounded-xl border border-pierre bg-white p-1" value={value} onChange={(e) => onChange(e.target.value)} />
            )}
          </div>
        </Label>
      )
    case 'weeks':
      return (
        <Label field={field}>
          <div className="flex items-center gap-2 text-sm">
            <input type="number" min={1} max={12} className={`${input} w-20`} value={value?.[0] ?? 1} onChange={(e) => onChange([Number(e.target.value), value?.[1] ?? 1])} />
            à
            <input type="number" min={1} max={12} className={`${input} w-20`} value={value?.[1] ?? 1} onChange={(e) => onChange([value?.[0] ?? 1, Number(e.target.value)])} />
            semaines
          </div>
        </Label>
      )
    case 'days':
      return (
        <Label field={field}>
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((d, k) => {
              const on = (value || []).includes(k)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange(on ? value.filter((x) => x !== k) : [...(value || []), k].sort())}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? 'border-encre bg-encre text-white' : 'border-pierre'}`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </Label>
      )
    case 'list':
      return <TextList field={field} value={value} onChange={onChange} />
    case 'images':
      return <Images field={field} value={value} onChange={onChange} />
    case 'image':
      // Une seule capture : la dernière ajoutée remplace la précédente
      return <Images field={field} value={value ? [value] : []} onChange={(list) => onChange(list.at(-1) || '')} />
    case 'objects':
      return <Objects field={field} value={value} onChange={onChange} />
    case 'record':
      return <Record field={field} value={value} onChange={onChange} />
    case 'group':
      return (
        <fieldset className="rounded-2xl bg-fond p-4">
          <legend className="sr-only">{field.label}</legend>
          <p className="mb-3 text-[13px] font-medium">{field.label}</p>
          <Fields fields={field.fields} value={value || {}} onChange={onChange} columns={field.columns} />
        </fieldset>
      )
    default:
      return (
        <Label field={field}>
          <input className={input} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        </Label>
      )
  }
}

export function Fields({ fields, value, onChange, columns }) {
  return (
    <div className={`grid gap-4 ${columns ? 'sm:grid-cols-2' : ''}`}>
      {fields.map((f) => (
        <div key={f.key} className={columns && ['textarea', 'list', 'objects', 'images', 'group', 'record'].includes(f.type) ? 'sm:col-span-2' : ''}>
          <Field field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        </div>
      ))}
    </div>
  )
}
