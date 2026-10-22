import { useEffect, useRef, useState } from 'react'
import { Dot } from './Logo.jsx'
import { buildMessage, useContent, useWhatsapp } from '../content/ContentContext.jsx'

const TYPING_MS = 750

function BotBubble({ children, className = '' }) {
  return (
    <div className="chat-in flex max-w-[85%] items-end gap-2">
      <span aria-hidden="true" className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-encre text-[11px] font-extrabold text-white">
        t<span className="text-bronze">.</span>
      </span>
      <div className={`rounded-2xl rounded-bl-md bg-white dark:bg-[#2A2825] px-4 py-2.5 text-[15px] leading-snug text-encre shadow-[0_1px_0_rgba(17,17,17,0.06)] ${className}`}>
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children, onEdit }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      title="Modifier cette réponse"
      className="chat-in group ml-auto flex max-w-[80%] flex-col items-end"
    >
      <span className="rounded-2xl rounded-br-md bg-[#D9FDD3] dark:bg-[#1F4D3A] px-4 py-2.5 text-left text-[15px] leading-snug text-encre">
        {children} <span className="ml-1 text-[10px] text-[#53BDEB]">✓✓</span>
      </span>
      <span className="mt-1 text-[11px] text-gris opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Modifier</span>
    </button>
  )
}

function Typing() {
  return (
    <div className="chat-in flex items-end gap-2" aria-label="theLab écrit…">
      <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-encre text-[11px] font-extrabold text-white">
        t<span className="text-bronze">.</span>
      </span>
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white dark:bg-[#2A2825] px-4 py-3.5">
        {[0, 1, 2].map((k) => (
          <span key={k} className="typing-dot size-1.5 rounded-full bg-doux" style={{ animationDelay: `${k * 150}ms` }} />
        ))}
      </span>
    </div>
  )
}

function Recommendation({ reco }) {
  if (!reco) return null
  return (
    <div data-tone="dark" className="chat-in ml-9 max-w-[88%] rounded-2xl rounded-tl-md bg-encre p-5 text-white">
      <p className="text-xs font-medium text-doux">Notre recommandation</p>
      <h3 className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em]">
        {reco.title}<Dot className="bg-bronze" />
      </h3>
      <p className="mt-2 text-[14px] font-light leading-relaxed text-doux">{reco.text}</p>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-trait pt-3 text-[13px]">
        <div>
          <dt className="text-[11px] text-doux">Délai</dt>
          <dd className="mt-0.5">{reco.delay}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-doux">Formule</dt>
          <dd className="mt-0.5">{reco.plan}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-doux">Tarif</dt>
          <dd className="mt-0.5">{reco.price}</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Diagnostic({ page = false, onResult }) {
  const { diagnostic } = useContent()
  const { questions: QUESTIONS, recommendations: RECOMMENDATIONS } = diagnostic
  const whatsappLink = useWhatsapp()
  // Une réponse peut arriver par l'adresse (/diagnostic?profil=commerce), depuis l'aperçu de l'accueil
  const [answers, setAnswers] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const start = {}
    for (const q of QUESTIONS) {
      const v = params.get(q.id)
      if (!v || !q.options.some((o) => o.id === v)) break
      start[q.id] = v
    }
    return start
  })
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const timer = useRef(0)

  // La question en cours : la première sans réponse
  const step = QUESTIONS.findIndex((q) => !answers[q.id])
  const done = step === -1
  const current = done ? null : QUESTIONS[step]

  // Défile la conversation (et seulement elle) jusqu'au dernier message
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [answers, typing])
  useEffect(() => () => clearTimeout(timer.current), [])

  const choose = (qid, oid) => {
    setAnswers((a) => ({ ...a, [qid]: oid }))
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setTyping(false), TYPING_MS)
  }
  // Revenir sur une réponse efface celles qui suivent
  const editFrom = (i) => {
    clearTimeout(timer.current)
    setTyping(false)
    setAnswers((a) => Object.fromEntries(QUESTIONS.slice(0, i).map((q) => [q.id, a[q.id]])))
  }
  const reset = () => editFrom(0)

  const message = done ? buildMessage(QUESTIONS, answers) : ''

  // Garde une trace de la demande dans le back-office (sans bloquer l'ouverture de WhatsApp)
  const recordLead = () => {
    const label = (q) => q.options.find((o) => o.id === answers[q.id])?.label || ''
    const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, label(q)]))
    const body = JSON.stringify({
      source: 'diagnostic',
      answers: { profil: byId.profil, besoin: byId.besoin, quand: byId.quand },
      plan: RECOMMENDATIONS[answers.besoin]?.plan || '',
      message,
    })
    try {
      fetch('/api/leads', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {})
    } catch {}
  }
  const justLooking = answers.quand === 'info'

  // La page Diagnostic met en avant la recommandation obtenue
  useEffect(() => {
    onResult?.(done && !typing ? answers.besoin : null)
  }, [done, typing, answers.besoin, onResult])
  const Heading = page ? 'h1' : 'h2'

  return (
    <section id="diagnostic" className="bg-fond">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-[72px] md:py-28 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center lg:gap-20">
        <div>
          <p className="label text-gris">Diagnostic express</p>
          <Heading className="mt-4 text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Trois questions.<br /><span className="text-gris">Une recommandation</span><Dot className="bg-bronze" />
          </Heading>
          <p className="mt-6 max-w-md text-[17px] font-light leading-relaxed text-gris">
            30 secondes, sans inscription. Répondez comme sur WhatsApp, on vous dit ce dont vous avez vraiment besoin.
          </p>

          {/* Avancement (grand écran) */}
          <ol className="mt-10 hidden max-w-md flex-col gap-3 lg:flex">
            {QUESTIONS.map((q, i) => {
              const a = q.options.find((o) => o.id === answers[q.id])
              const isCurrent = i === step
              return (
                <li key={q.id} className="flex items-center gap-4 border-t border-pierre pt-3">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      a ? 'bg-encre text-white' : isCurrent ? 'border border-encre text-encre' : 'border border-pierre text-gris'
                    }`}
                  >
                    {a ? '✓' : i + 1}
                  </span>
                  <span className={`text-[15px] ${a || isCurrent ? 'text-encre' : 'text-gris'}`}>{q.title}</span>
                  {a && <span className="ml-auto truncate text-sm text-gris">{a.label}</span>}
                </li>
              )
            })}
          </ol>
        </div>

        {/* La conversation */}
        <div className="flex h-[min(640px,78svh)] flex-col overflow-hidden rounded-[28px] bg-[#EFEAE2] dark:bg-[#1B1A17] shadow-[0_40px_80px_-40px_rgba(17,17,17,0.4)] ring-1 ring-pierre">
          <div data-tone="dark" className="flex items-center gap-3 bg-encre px-5 py-3.5 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-extrabold text-encre">
              t<span className="text-bronze">.</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium leading-tight">theLab.</p>
              <p className="text-xs text-doux">{typing ? 'écrit…' : 'Diagnostic express · 30 s'}</p>
            </div>
            <span className="text-xs text-doux">{done ? QUESTIONS.length : step} / {QUESTIONS.length}</span>
          </div>

          <div ref={scrollRef} data-lenis-prevent className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5" aria-live="polite">
            <BotBubble>Bonjour 👋 Trois petites questions et on vous dit ce qu’il vous faut.</BotBubble>
            {QUESTIONS.map((q, i) => {
              const a = q.options.find((o) => o.id === answers[q.id])
              // La question suivante n'apparaît qu'une fois « écrite »
              if (i > 0 && !answers[QUESTIONS[i - 1].id]) return null
              if (i === step && typing) return null
              return (
                <div key={q.id} className="flex flex-col gap-3">
                  <BotBubble>{q.title}</BotBubble>
                  {a && <UserBubble onEdit={() => editFrom(i)}>{a.label}</UserBubble>}
                </div>
              )
            })}
            {typing && <Typing />}
            {done && !typing && (
              <>
                <BotBubble>Merci ! Voici ce qu’on vous recommande :</BotBubble>
                <Recommendation reco={RECOMMENDATIONS[answers.besoin]} />
              </>
            )}
          </div>

          {/* Zone de réponse : les choix, puis l'envoi */}
          <div className="border-t border-black/5 bg-[#F6F3EE] dark:border-white/5 dark:bg-[#161513] p-3">
            {current && !typing && (
              <div role="radiogroup" aria-label={current.title} className="flex flex-wrap gap-2">
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={false}
                    onClick={() => choose(current.id, o.id)}
                    className="chat-in rounded-full border border-pierre bg-white dark:bg-[#2A2825] px-4 py-2.5 text-[14px] transition-colors hover:border-encre hover:bg-encre hover:text-white"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            {typing && <p className="px-2 py-2.5 text-sm text-gris">…</p>}
            {done && !typing && (
              <div className="flex flex-col gap-2">
                <a
                  href={whatsappLink(message)}
                  onClick={recordLead}
                  target="_blank"
                  rel="noreferrer"
                  className="chat-in flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[15px] font-medium text-[#111] transition-opacity hover:opacity-90"
                >
                  {justLooking ? 'Poser une question sur WhatsApp' : 'Envoyer ma demande sur WhatsApp'} <span aria-hidden="true">↗</span>
                </a>
                <button type="button" onClick={reset} className="py-1 text-sm text-gris underline-offset-4 hover:underline">
                  Recommencer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .chat-in { animation: chat-in 380ms cubic-bezier(.2,.7,.2,1) both; }
        @keyframes chat-in { from { opacity: 0; transform: translateY(8px) scale(.98); } }
        .typing-dot { animation: typing 1s infinite ease-in-out; }
        @keyframes typing { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
      `}</style>
    </section>
  )
}
