import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Dark mesh background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_60%,rgba(139,92,246,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(6,182,212,0.08),transparent_55%)]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 1.5,
            height: 2 + (i % 3) * 1.5,
            left: `${8 + i * 7.5}%`,
            top: `${15 + (i % 4) * 20}%`,
            background: i % 2 === 0 ? 'rgba(56,189,248,0.5)' : 'rgba(139,92,246,0.4)',
          }}
          animate={{ y: [0, -20 - i * 3, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
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
              className="absolute inset-0 rounded-3xl border border-cyan-400/30"
              style={{ margin: -(10 + i * 8) }}
              animate={{ scale: [1, 1.1], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
            />
          ))}

          <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
            <defs>
              <linearGradient id="lb" x1="30" y1="40" x2="90" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="lv" x1="32" y1="20" x2="88" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="lg" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <filter id="ls">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#22d3ee" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Ground glow */}
            <motion.ellipse
              cx="60" cy="136" rx="35" ry="4" fill="url(#lg)"
              animate={{ rx: [32, 38, 32], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <g filter="url(#ls)">
              {/* Legs */}
              <rect x="38" y="108" width="10" height="18" rx="4" fill="#475569" />
              <rect x="72" y="108" width="10" height="18" rx="4" fill="#475569" />
              <rect x="36" y="122" width="14" height="6" rx="3" fill="#64748b" />
              <rect x="70" y="122" width="14" height="6" rx="3" fill="#64748b" />

              {/* Body */}
              <motion.g
                animate={{ scaleY: [1, 1.015, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '60px 85px' }}
              >
                <rect x="30" y="58" width="60" height="52" rx="14" fill="url(#lb)" />
                <rect x="40" y="66" width="40" height="20" rx="6" fill="rgba(255,255,255,0.12)" />
                <motion.circle
                  cx="60" cy="76" r="6" fill="white"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="60" cy="76" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                  animate={{ opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <rect x="42" y="92" width="12" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
                <rect x="58" y="92" width="20" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
                <rect x="42" y="97" width="36" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
              </motion.g>

              {/* Arms */}
              <motion.rect
                x="16" y="64" width="12" height="32" rx="6" fill="#6366f1"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '22px 64px' }}
              />
              <motion.rect
                x="92" y="64" width="12" height="32" rx="6" fill="#6366f1"
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '98px 64px' }}
              />
              <circle cx="22" cy="66" r="4" fill="#818cf8" />
              <circle cx="98" cy="66" r="4" fill="#818cf8" />

              {/* Neck */}
              <rect x="52" y="50" width="16" height="10" rx="4" fill="#475569" />

              {/* Head */}
              <rect x="32" y="18" width="56" height="36" rx="12" fill="url(#lv)" />
              <rect x="38" y="24" width="44" height="18" rx="8" fill="rgba(0,0,0,0.3)" />

              {/* Eyes with blink */}
              <motion.g
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, times: [0, 0.03, 0.06] }}
                style={{ transformOrigin: '60px 33px' }}
              >
                <circle cx="48" cy="33" r="4" fill="#22d3ee">
                  <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="72" cy="33" r="4" fill="#22d3ee">
                  <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="48" cy="32" r="1.5" fill="white" opacity="0.8" />
                <circle cx="72" cy="32" r="1.5" fill="white" opacity="0.8" />
              </motion.g>

              {/* Mouth LED */}
              <motion.rect
                x="50" y="44" width="20" height="3" rx="1.5" fill="#22d3ee"
                animate={{ opacity: [0.4, 1, 0.4], width: [16, 20, 16] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Ear panels */}
              <rect x="28" y="28" width="5" height="12" rx="2.5" fill="#4f46e5" />
              <rect x="87" y="28" width="5" height="12" rx="2.5" fill="#4f46e5" />

              {/* Antenna */}
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '60px 18px' }}
              >
                <line x1="60" y1="18" x2="60" y2="6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle
                  cx="60" cy="4" r="3.5" fill="#22d3ee"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M52 2 Q56 -3 60 -4 Q64 -3 68 2"
                  fill="none" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round"
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.path
                  d="M48 4 Q54 -5 60 -7 Q66 -5 72 4"
                  fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round"
                  animate={{ opacity: [0, 0.4, 0] }}
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
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">AI</span>
            <span className="text-white">Home</span>
          </h1>
          <motion.p
            className="text-sm text-slate-400 mt-2 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Загружаем приложение
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-44 h-1 rounded-full bg-slate-800 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"
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
