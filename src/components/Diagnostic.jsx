import { useState } from 'react'
import { Dot } from './Logo.jsx'
import { QUESTIONS, RECOMMENDATIONS, buildMessage } from '../data/diagnostic.js'
import { whatsappLink } from '../data/site.js'

function Question({ question, index, value, onChange, hiddenOnMobile }) {
  return (
    <fieldset className={`border-t border-pierre py-6 md:py-7 ${hiddenOnMobile ? 'hidden md:block' : ''}`}>
      <legend className="sr-only">{question.title}</legend>
      <p aria-hidden="true" className="flex items-baseline gap-4">
        <span className="text-sm text-gris">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-[22px] font-extrabold tracking-[-0.03em] md:text-[28px]">{question.title}</span>
      </p>
      <div role="radiogroup" aria-label={question.title} className="mt-5 flex flex-wrap gap-2.5">
        {question.options.map((o) => {
          const checked = value === o.id
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(question.id, o.id)}
              className={`rounded-full border px-5 py-3 text-[15px] transition-colors md:px-[22px] md:py-3.5 md:text-base ${
                checked ? 'border-encre bg-encre text-white' : 'border-pierre hover:border-encre'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function Result({ answers, onReset }) {
  const reco = RECOMMENDATIONS[answers.besoin]
  const message = buildMessage(answers)
  const justLooking = answers.quand === 'info'
  return (
    <div className="flex flex-col gap-5 bg-encre p-7 text-white md:p-10">
      <p className="text-xs font-medium text-doux">Notre recommandation</p>
      <h3 className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[34px]">
        {reco.title}<Dot className="bg-bronze" />
      </h3>
      <p className="font-light leading-relaxed text-doux">{reco.text}</p>
      <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-trait pt-4">
        <div>
          <dt className="text-xs text-doux">Délai estimé</dt>
          <dd className="mt-1">{reco.delay}</dd>
        </div>
        <div>
          <dt className="text-xs text-doux">Formule</dt>
          <dd className="mt-1">{reco.plan}</dd>
        </div>
        <div>
          <dt className="text-xs text-doux">Tarif</dt>
          <dd className="mt-1">{reco.price}</dd>
        </div>
      </dl>
      <figure className="rounded-[14px] rounded-bl-[4px] bg-[#1E1E1E] px-[18px] py-4">
        <blockquote className="text-[15px] font-light leading-relaxed">{message}</blockquote>
        <figcaption className="mt-1.5 text-right text-xs text-doux">Message prérempli</figcaption>
      </figure>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-white py-[18px] text-center font-medium text-encre transition-opacity hover:opacity-85"
      >
        {justLooking ? 'Poser une question sur WhatsApp ↗' : 'Envoyer sur WhatsApp ↗'}
      </a>
      <button type="button" onClick={onReset} className="self-start text-sm text-doux underline-offset-4 hover:underline">
        Recommencer
      </button>
    </div>
  )
}

export default function Diagnostic() {
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0) // utilisé sur mobile : une question à la fois
  const answered = QUESTIONS.filter((q) => answers[q.id]).length
  const done = answered === QUESTIONS.length

  const choose = (qid, oid) => {
    const next = { ...answers, [qid]: oid }
    setAnswers(next)
    const idx = QUESTIONS.findIndex((q) => q.id === qid)
    if (idx === step && step < QUESTIONS.length - 1) setStep(step + 1)
  }
  const reset = () => { setAnswers({}); setStep(0) }

  return (
    <section id="diagnostic" className="bg-fond">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-[72px] md:py-32">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-gris">Diagnostic express</p>
            <h2 className="mt-4 text-[clamp(2.1rem,5.3vw,4.75rem)] font-extrabold leading-none tracking-[-0.045em]">
              Trois questions.<br />Une recommandation<Dot />
            </h2>
          </div>
          <p className="max-w-xs font-light leading-relaxed text-gris md:text-right md:text-lg">
            30 secondes, sans inscription. On vous dit ce dont vous avez vraiment besoin.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-[1.25fr_1fr] md:gap-14">
          <div>
            <div className="mb-2 flex gap-1.5 md:hidden" aria-hidden="true">
              {QUESTIONS.map((q, i) => (
                <span key={q.id} className={`h-[3px] flex-1 ${answers[q.id] || i === step ? 'bg-encre' : 'bg-pierre'}`} />
              ))}
            </div>
            {QUESTIONS.map((q, i) => (
              <Question key={q.id} question={q} index={i} value={answers[q.id]} onChange={choose} hiddenOnMobile={i !== step} />
            ))}
            <div className="border-t border-pierre" />
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="mt-4 text-sm text-gris md:hidden">
                ← Retour
              </button>
            )}
          </div>

          <div aria-live="polite">
            {done ? (
              <Result answers={answers} onReset={reset} />
            ) : (
              <div className="hidden h-full min-h-80 flex-col justify-between border border-dashed border-pierre p-10 md:flex">
                <p className="max-w-xs text-2xl font-extrabold leading-tight tracking-[-0.03em] text-gris">
                  Votre recommandation s’affichera ici.
                </p>
                <p className="text-sm text-gris">{answered} / {QUESTIONS.length} réponses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
