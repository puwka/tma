import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Light mesh background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_60%,rgba(139,92,246,0.07),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_80%,rgba(6,182,212,0.06),transparent_55%)]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #6366f1 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            left: `${10 + i * 8}%`,
            top: `${18 + (i % 4) * 18}%`,
            background: i % 2 === 0 ? 'rgba(56,189,248,0.3)' : 'rgba(139,92,246,0.25)',
          }}
          animate={{ y: [0, -16 - i * 2, 0], opacity: [0.15, 0.6, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div
        className="relative flex flex-col items-center gap-7 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Robot */}
        <motion.div
          className="relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl border border-indigo-300/40"
              style={{ margin: -(10 + i * 8) }}
              animate={{ scale: [1, 1.1], opacity: [0.35, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
            />
          ))}

          <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
            <defs>
              <linearGradient id="lb" x1="30" y1="40" x2="90" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="lv" x1="32" y1="20" x2="88" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="lg" x1="60" y1="120" x2="60" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
              </linearGradient>
              <filter id="ls">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#818cf8" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Ground shadow */}
            <motion.ellipse
              cx="60" cy="136" rx="35" ry="4" fill="url(#lg)"
              animate={{ rx: [32, 38, 32], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <g filter="url(#ls)">
              {/* Legs */}
              <rect x="38" y="108" width="10" height="18" rx="4" fill="#c7d2fe" />
              <rect x="72" y="108" width="10" height="18" rx="4" fill="#c7d2fe" />
              <rect x="36" y="122" width="14" height="6" rx="3" fill="#a5b4fc" />
              <rect x="70" y="122" width="14" height="6" rx="3" fill="#a5b4fc" />

              {/* Body */}
              <motion.g
                animate={{ scaleY: [1, 1.015, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '60px 85px' }}
              >
                <rect x="30" y="58" width="60" height="52" rx="14" fill="url(#lb)" />
                <rect x="40" y="66" width="40" height="20" rx="6" fill="rgba(255,255,255,0.2)" />
                <motion.circle
                  cx="60" cy="76" r="6" fill="white"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="60" cy="76" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                  animate={{ opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <rect x="42" y="92" width="12" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
                <rect x="58" y="92" width="20" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
                <rect x="42" y="97" width="36" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
              </motion.g>

              {/* Arms */}
              <motion.rect
                x="16" y="64" width="12" height="32" rx="6" fill="#818cf8"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '22px 64px' }}
              />
              <motion.rect
                x="92" y="64" width="12" height="32" rx="6" fill="#818cf8"
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '98px 64px' }}
              />
              <circle cx="22" cy="66" r="4" fill="#a5b4fc" />
              <circle cx="98" cy="66" r="4" fill="#a5b4fc" />

              {/* Neck */}
              <rect x="52" y="50" width="16" height="10" rx="4" fill="#c7d2fe" />

              {/* Head */}
              <rect x="32" y="18" width="56" height="36" rx="12" fill="url(#lv)" />
              <rect x="38" y="24" width="44" height="18" rx="8" fill="rgba(255,255,255,0.2)" />

              {/* Eyes with blink */}
              <motion.g
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, times: [0, 0.03, 0.06] }}
                style={{ transformOrigin: '60px 33px' }}
              >
                <circle cx="48" cy="33" r="4.5" fill="white">
                  <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="72" cy="33" r="4.5" fill="white">
                  <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="48" cy="32.5" r="2" fill="#6366f1" />
                <circle cx="72" cy="32.5" r="2" fill="#6366f1" />
                <circle cx="49" cy="31.5" r="1" fill="white" opacity="0.9" />
                <circle cx="73" cy="31.5" r="1" fill="white" opacity="0.9" />
              </motion.g>

              {/* Smile */}
              <motion.path
                d="M52 45 Q60 50 68 45"
                fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Ear panels */}
              <rect x="28" y="28" width="5" height="12" rx="2.5" fill="#7c3aed" opacity="0.6" />
              <rect x="87" y="28" width="5" height="12" rx="2.5" fill="#7c3aed" opacity="0.6" />

              {/* Antenna */}
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '60px 18px' }}
              >
                <line x1="60" y1="18" x2="60" y2="6" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle
                  cx="60" cy="4" r="3.5" fill="#818cf8"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M52 2 Q56 -3 60 -4 Q64 -3 68 2"
                  fill="none" stroke="#a5b4fc" strokeWidth="1" strokeLinecap="round"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.path
                  d="M48 4 Q54 -5 60 -7 Q66 -5 72 4"
                  fill="none" stroke="#a5b4fc" strokeWidth="0.8" strokeLinecap="round"
                  animate={{ opacity: [0, 0.35, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
              </motion.g>
            </g>
          </svg>
        </motion.div>

        {/* Brand */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">AI</span>
            <span className="text-slate-800">Home</span>
          </h1>
          <motion.p
            className="text-sm text-slate-400 mt-2 font-medium"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Загружаем приложение
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-44 h-1 rounded-full bg-slate-200 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '55%' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
