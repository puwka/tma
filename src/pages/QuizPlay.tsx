import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '../store/useQuizStore'

export function QuizPlay() {
  const { id: idOrSlug } = useParams<{ id: string }>()
  const getQuiz = useQuizStore((s) => s.getQuiz)
  const getQuizBySlug = useQuizStore((s) => s.getQuizBySlug)
  const quiz = idOrSlug
    ? getQuiz(idOrSlug) ?? getQuizBySlug(idOrSlug)
    : undefined

  const [step, setStep] = useState<'start' | 'questions' | 'contacts' | 'results' | 'thanks'>('start')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  if (!idOrSlug || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <p className="text-slate-600 font-medium">Квиз не найден</p>
        <p className="text-sm text-slate-500 mt-1">Ссылка могла устареть или квиз удалён</p>
      </div>
    )
  }

  const currentQuestion = quiz.questions.length > 0 ? quiz.questions[questionIndex] : null
  const isLastQuestion = quiz.questions.length > 0 && questionIndex >= quiz.questions.length - 1

  const handleStart = () => {
    if (quiz.questions.length === 0) {
      if (quiz.contactsEnabled) setStep('contacts')
      else setStep('thanks')
    } else {
      setStep('questions')
    }
  }

  const handleAnswer = (optionId: string, points?: number) => {
    if (!currentQuestion) return
    const next: Record<string, string[]> = { ...answers, [currentQuestion.id]: [optionId] }
    setAnswers(next)
    if (typeof points === 'number') setTotalScore((s) => s + points)
    if (isLastQuestion) {
      if (quiz.contactsEnabled) setStep('contacts')
      else if (quiz.resultsEnabled && quiz.resultVariants.length > 0) setStep('results')
      else setStep('thanks')
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }

  const handleContactsSubmit = () => {
    if (quiz.resultsEnabled && quiz.resultVariants.length > 0) setStep('results')
    else setStep('thanks')
  }

  const currentResult = quiz.resultsEnabled && quiz.resultVariants.length > 0
    ? quiz.resultVariants.find(
        (r) => totalScore >= r.minScore && totalScore <= r.maxScore
      ) ?? quiz.resultVariants[0]
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              {quiz.startPage.imageUrl && (
                <img
                  src={quiz.startPage.imageUrl}
                  alt=""
                  className="w-full aspect-video object-cover rounded-2xl mb-4"
                />
              )}
              {quiz.startPage.textTop && (
                <p className="text-sm text-slate-500 mb-2">{quiz.startPage.textTop}</p>
              )}
              <h1 className="text-2xl font-bold text-slate-900">{quiz.startPage.title || 'Квиз'}</h1>
              <p className="text-slate-600 mt-2">{quiz.startPage.description}</p>
              {quiz.startPage.textBottom && (
                <p className="text-sm text-slate-500 mt-4">{quiz.startPage.textBottom}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="w-full max-w-md mx-auto py-3.5 rounded-xl bg-amber-500 text-white font-semibold"
            >
              {quiz.startPage.buttonText || 'Начать'}
            </button>
          </motion.div>
        )}

        {step === 'questions' && currentQuestion !== undefined && currentQuestion !== null && (
          <motion.div
            key={`q-${currentQuestion.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 max-w-md mx-auto w-full">
              <p className="text-xs text-slate-500 mb-2">
                Вопрос {questionIndex + 1} из {quiz.questions.length}
              </p>
              <h2 className="text-lg font-semibold text-slate-800 mb-6">{currentQuestion.questionText}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAnswer(opt.id, opt.points ?? 0)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 font-medium text-slate-800"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'contacts' && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 max-w-md mx-auto w-full">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Оставьте контакты</h2>
              <p className="text-sm text-slate-500 mb-4">Мы свяжемся с вами</p>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Имя"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 mb-3"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>
            <button
              type="button"
              onClick={handleContactsSubmit}
              className="w-full max-w-md mx-auto py-3.5 rounded-xl bg-amber-500 text-white font-semibold"
            >
              Далее
            </button>
          </motion.div>
        )}

        {step === 'results' && currentResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center">
              <h2 className="text-xl font-bold text-slate-900">{currentResult.title}</h2>
              <p className="text-slate-600 mt-2">{currentResult.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep('thanks')}
              className="w-full max-w-md mx-auto py-3.5 rounded-xl bg-amber-500 text-white font-semibold"
            >
              Далее
            </button>
          </motion.div>
        )}

        {step === 'thanks' && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center text-center">
              {quiz.thankYouPage.imageUrl && (
                <img
                  src={quiz.thankYouPage.imageUrl}
                  alt=""
                  className="w-full max-h-48 object-cover rounded-2xl mx-auto mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-slate-900">{quiz.thankYouPage.title}</h2>
              <p className="text-slate-600 mt-2">{quiz.thankYouPage.description}</p>
            </div>
            {quiz.thankYouPage.buttonText && quiz.thankYouPage.buttonUrl && (
              <a
                href={quiz.thankYouPage.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-md mx-auto py-3.5 rounded-xl bg-amber-500 text-white font-semibold text-center"
              >
                {quiz.thankYouPage.buttonText}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
