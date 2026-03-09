import { motion } from 'framer-motion'

interface CharacterProps {
  imageUrl?: string | null
  accentColor?: string
  name?: string
  className?: string
}

/**
 * Персонаж (маскот). Если передан imageUrl — показывается картинка, иначе — стильная заглушка.
 */
export function Character({ imageUrl, accentColor = '#6366f1', name, className = '' }: CharacterProps) {
  if (imageUrl) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-3xl bg-white/90 shadow-md ring-1 ring-slate-200/80 ${className}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <img
          src={imageUrl}
          alt={name || 'Персонаж'}
          className="w-full h-full object-contain object-center"
        />
      </motion.div>
    )
  }

  // Яркий контрастный фон под робота: градиент + рамка
  const lightAccent = accentColor + '22'

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 ${className}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        background: `linear-gradient(165deg, ${lightAccent} 0%, rgba(255,255,255,0.98) 35%, rgba(248,250,252,0.99) 70%, rgba(241,245,249,1) 100%)`,
      }}
    >
      <svg
        viewBox="0 0 200 220"
        className="w-[85%] max-w-[200px] h-auto object-contain drop-shadow-sm"
        fill="none"
      >
        {/* Мягкая тень под ногами */}
        <defs>
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity={1} />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity={0.9} />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
          </filter>
        </defs>
        <ellipse cx="100" cy="208" rx="42" ry="6" fill="rgba(0,0,0,0.06)" />
        {/* Тело: один мягкий blob */}
        <path
          d="M75 95 L75 175 Q75 200 100 205 Q125 200 125 175 L125 95 Q125 75 100 68 Q75 75 75 95 Z"
          fill="url(#bodyGrad)"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />
        {/* Голова: круг с градиентом */}
        <circle
          cx="100"
          cy="72"
          r="42"
          fill="url(#headGrad)"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          filter="url(#softShadow)"
        />
        {/* Глаза: большие и добрые */}
        <ellipse cx="85" cy="68" rx="8" ry="10" fill="#334155" />
        <ellipse cx="115" cy="68" rx="8" ry="10" fill="#334155" />
        <circle cx="87" cy="65" r="2.5" fill="white" />
        <circle cx="117" cy="65" r="2.5" fill="white" />
        {/* Улыбка */}
        <path
          d="M82 82 Q100 92 118 82"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
        {/* Акцент на груди (значок инструмента по цвету) */}
        <circle cx="100" cy="135" r="14" fill="white" stroke={accentColor} strokeWidth="2" opacity={0.95} />
        <circle cx="100" cy="135" r="8" fill={accentColor} fillOpacity={0.25} />
      </svg>
    </motion.div>
  )
}
