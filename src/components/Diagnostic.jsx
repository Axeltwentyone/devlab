import { useEffect, useRef, useState } from 'react'
import { Dot } from './Logo.jsx'
import { QUESTIONS, RECOMMENDATIONS, buildMessage } from '../data/diagnostic.js'
import { whatsappLink } from '../data/site.js'

const TYPING_MS = 750

function BotBubble({ children, className = '' }) {
  return (
    <div className="chat-in flex max-w-[85%] items-end gap-2">
      <span aria-hidden="true" className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-encre text-[11px] font-extrabold text-white">
        d<span className="text-bronze">.</span>
      </span>
      <div className={`rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[15px] leading-snug text-encre shadow-[0_1px_0_rgba(17,17,17,0.06)] ${className}`}>
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
      <span className="rounded-2xl rounded-br-md bg-[#D9FDD3] px-4 py-2.5 text-left text-[15px] leading-snug text-encre">
        {children} <span className="ml-1 text-[10px] text-[#53BDEB]">✓✓</span>
      </span>
      <span className="mt-1 text-[11px] text-gris opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Modifier</span>
    </button>
  )
}

function Typing() {
  return (
    <div className="chat-in flex items-end gap-2" aria-label="devlab écrit…">
      <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-encre text-[11px] font-extrabold text-white">
        d<span className="text-bronze">.</span>
      </span>
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5">
        {[0, 1, 2].map((k) => (
          <span key={k} className="typing-dot size-1.5 rounded-full bg-doux" style={{ animationDelay: `${k * 150}ms` }} />
        ))}
      </span>
    </div>
  )
}

function Recommendation({ answers }) {
  const reco = RECOMMENDATIONS[answers.besoin]
  return (
    <div className="chat-in ml-9 max-w-[88%] rounded-2xl rounded-tl-md bg-encre p-5 text-white">
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

export default function Diagnostic() {
  const [answers, setAnswers] = useState({})
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

  const message = done ? buildMessage(answers) : ''
  const justLooking = answers.quand === 'info'

  return (
    <section id="diagnostic" className="bg-fond">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-[72px] md:py-32 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center lg:gap-20">
        <div>
          <p className="text-sm font-medium text-gris">Diagnostic express</p>
          <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
            Trois questions.<br /><span className="text-gris">Une recommandation</span><Dot className="bg-bronze" />
          </h2>
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
        <div className="flex h-[min(640px,78svh)] flex-col overflow-hidden rounded-[28px] bg-[#EFEAE2] shadow-[0_40px_80px_-40px_rgba(17,17,17,0.4)] ring-1 ring-pierre">
          <div className="flex items-center gap-3 bg-encre px-5 py-3.5 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-extrabold text-encre">
              d<span className="text-bronze">.</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium leading-tight">devlab.</p>
              <p className="text-xs text-doux">{typing ? 'écrit…' : 'Diagnostic express · 30 s'}</p>
            </div>
            <span className="text-xs text-doux">{done ? 3 : step} / {QUESTIONS.length}</span>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5" aria-live="polite">
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
                <Recommendation answers={answers} />
              </>
            )}
          </div>

          {/* Zone de réponse : les choix, puis l'envoi */}
          <div className="border-t border-black/5 bg-[#F6F3EE] p-3">
            {current && !typing && (
              <div role="radiogroup" aria-label={current.title} className="flex flex-wrap gap-2">
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={false}
                    onClick={() => choose(current.id, o.id)}
                    className="chat-in rounded-full border border-pierre bg-white px-4 py-2.5 text-[14px] transition-colors hover:border-encre hover:bg-encre hover:text-white"
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
                  target="_blank"
                  rel="noreferrer"
                  className="chat-in flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[15px] font-medium text-encre transition-opacity hover:opacity-90"
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
