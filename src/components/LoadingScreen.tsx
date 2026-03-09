import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const APP_NAME = 'AI Tools'

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6 px-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          animate={{
            boxShadow: [
              '0 10px 40px -10px rgba(99, 102, 241, 0.35)',
              '0 10px 50px -10px rgba(99, 102, 241, 0.5)',
              '0 10px 40px -10px rgba(99, 102, 241, 0.35)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Zap className="text-white" size={40} strokeWidth={2} />
        </motion.div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{APP_NAME}</h1>
          <p className="text-sm text-slate-500 mt-1">Загружаем приложение...</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
