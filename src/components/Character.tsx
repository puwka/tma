import { motion } from 'framer-motion'

interface CharacterProps {
  imageUrl?: string | null
  accentColor?: string
  name?: string
  toolId?: string
  className?: string
}

const floatY = {
  animate: { y: [0, -5, 0] },
  transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const },
}

const blink = {
  animate: { scaleY: [1, 1, 0.05, 1, 1] },
  transition: { duration: 4.5, repeat: Infinity, times: [0, 0.46, 0.49, 0.52, 1] },
}

function SlovoedActivity({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      {/* Right arm raised holding mic to mouth */}
      <motion.g
        animate={{ rotate: [-12, -8, -12] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '136px 112px' }}
      >
        <rect x="132" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="148" y="86" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="153" cy="88" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        {/* Hand + mic */}
        <rect x="146" y="76" width="14" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <rect x="150" y="60" width="6" height="18" rx="3" fill="#64748b" />
        <circle cx="153" cy="57" r="8" fill={color} />
        <rect x="147" y="54" width="12" height="5" rx="2.5" fill={color} opacity={0.85} />
        <line x1="150" y1="54" x2="150" y2="59" stroke="white" strokeWidth="0.5" opacity={0.4} />
        <line x1="153" y1="52" x2="153" y2="59" stroke="white" strokeWidth="0.5" opacity={0.4} />
        <line x1="156" y1="54" x2="156" y2="59" stroke="white" strokeWidth="0.5" opacity={0.4} />
      </motion.g>

      {/* Sound waves expanding from mic */}
      {[0, 0.4, 0.8].map((delay, i) => (
        <motion.path
          key={i}
          d={`M164 ${54 - i * 4} Q${170 + i * 4} ${48 - i * 2} ${164} ${42 - i * 4}`}
          stroke={color} strokeWidth={1.8 - i * 0.3} strokeLinecap="round" fill="none"
          animate={{ opacity: [0, 0.7, 0], x: [0, 3, 6] }}
          transition={{ duration: 1.2, repeat: Infinity, delay }}
        />
      ))}

      {/* Mouth LED pulsing like talking */}
      <motion.rect
        x="88" y="72" width="24" height="5" rx="2.5"
        fill={color}
        animate={{ opacity: [0.3, 0.8, 0.3, 0.9, 0.3], width: [24, 18, 26, 16, 24] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Flying text particles (transcribed words) */}
      {['Aa', 'Бб', '...'].map((txt, i) => (
        <motion.text
          key={i}
          x={30 + i * 16} y={70 + i * 14}
          fontSize="9" fontWeight="600" fill={color}
          animate={{
            opacity: [0, 0.6, 0],
            y: [70 + i * 14, 58 + i * 10, 46 + i * 6],
            x: [30 + i * 16, 24 + i * 12, 18 + i * 8],
          }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7 }}
        >{txt}</motion.text>
      ))}

      {/* Left arm relaxed */}
      <motion.g
        animate={{ rotate: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '64px 112px' }}
      >
        <rect x="48" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="40" y="116" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="45" cy="116" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="36" y="142" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
      </motion.g>
    </g>
  )
}

function DesignerActivity({ color, uid }: { color: string; uid: string }) {
  const strokeColors = ['#ef4444', '#3b82f6', '#22c55e', color]
  return (
    <g>
      {/* Right arm actively painting — sweeping up and down */}
      <motion.g
        animate={{ rotate: [-18, 8, -18] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '136px 112px' }}
      >
        <rect x="132" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="148" y="90" width="10" height="26" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="153" cy="92" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="146" y="80" width="14" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Brush */}
        <rect x="152" y="50" width="5" height="32" rx="2" fill="#a78bfa" />
        <rect x="150" y="44" width="9" height="8" rx="2" fill={color} />
        <path d="M150 44 L154.5 36 L159 44" fill="#f97316" />
      </motion.g>

      {/* Paint strokes appearing on invisible canvas */}
      {strokeColors.map((sc, i) => (
        <motion.path
          key={i}
          d={`M${24 + i * 8} ${100 + i * 12} Q${30 + i * 6} ${94 + i * 8} ${38 + i * 10} ${98 + i * 10}`}
          stroke={sc} strokeWidth="3" strokeLinecap="round" fill="none"
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      {/* Paint drops falling from brush */}
      {[0, 0.5, 1.1].map((delay, i) => (
        <motion.circle
          key={i}
          cx={155 + i * 2} cy={38}
          r="2" fill={strokeColors[i % strokeColors.length]}
          animate={{ cy: [38, 60, 80], opacity: [0.8, 0.5, 0], r: [2, 1.5, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, delay }}
        />
      ))}

      {/* Left arm holding palette */}
      <motion.g
        animate={{ rotate: [3, -1, 3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '64px 112px' }}
      >
        <rect x="48" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="38" y="116" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="43" cy="116" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="30" y="142" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Palette */}
        <ellipse cx="36" cy="136" rx="16" ry="11" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="28" cy="133" r="3.5" fill="#ef4444" />
        <circle cx="36" cy="128" r="3.5" fill="#3b82f6" />
        <circle cx="44" cy="133" r="3.5" fill="#22c55e" />
        <circle cx="36" cy="140" r="3.5" fill="#eab308" />
      </motion.g>

      {/* Sparkles around the work */}
      {[{ x: 22, y: 88, d: 0 }, { x: 46, y: 120, d: 1 }].map((s, i) => (
        <motion.g key={i}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.d }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      ))}
    </g>
  )
}

function CoachActivity({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      {/* Left arm holding clipboard up — writing */}
      <motion.g
        animate={{ rotate: [6, 3, 6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '64px 112px' }}
      >
        <rect x="48" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="34" y="90" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="39" cy="92" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="28" y="80" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Clipboard */}
        <rect x="16" y="56" width="28" height="36" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="24" y="53" width="12" height="6" rx="3" fill={color} />
        {/* Writing lines that appear one by one */}
        <motion.line
          x1="21" y1="66" x2="39" y2="66"
          stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"
          animate={{ x2: [21, 39, 39], opacity: [0, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 1] }}
        />
        <motion.line
          x1="21" y1="72" x2="35" y2="72"
          stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"
          animate={{ x2: [21, 35, 35], opacity: [0, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.6, times: [0, 0.4, 1] }}
        />
        <motion.line
          x1="21" y1="78" x2="32" y2="78"
          stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"
          animate={{ x2: [21, 32, 32], opacity: [0, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.2, times: [0, 0.4, 1] }}
        />
        {/* Checkmark appearing */}
        <motion.path
          d="M22 84 L26 88 L36 78"
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          animate={{ pathLength: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 2, repeatDelay: 1.5 }}
        />
      </motion.g>

      {/* Right arm gesturing — pen in hand */}
      <motion.g
        animate={{ rotate: [0, -10, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '136px 112px' }}
      >
        <rect x="132" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="150" y="96" width="10" height="24" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="155" cy="98" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="148" y="86" width="14" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Pen */}
        <rect x="153" y="68" width="3" height="20" rx="1.5" fill="#64748b" />
        <path d="M153 68 L154.5 62 L156 68" fill={color} />
      </motion.g>

      {/* Floating thought bubbles */}
      {[
        { x: 162, y: 50, r: 4, d: 0 },
        { x: 170, y: 38, r: 6, d: 0.4 },
        { x: 174, y: 22, r: 9, d: 0.8 },
      ].map((b, i) => (
        <motion.circle
          key={i}
          cx={b.x} cy={b.y} r={b.r}
          fill="white" stroke={color} strokeWidth="0.8"
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: b.d }}
          style={{ transformOrigin: `${b.x}px ${b.y}px` }}
        />
      ))}
      {/* Lightbulb inside biggest bubble */}
      <motion.g
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
      >
        <circle cx="174" cy="21" r="4" fill="#fbbf24" opacity={0.6} />
        <rect x="172.5" y="25" width="3" height="3" rx="1" fill="#94a3b8" />
      </motion.g>

      {/* Mouth LED calm */}
      <motion.rect
        x="88" y="72" width="24" height="5" rx="2.5"
        fill={color} opacity={0.4}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  )
}

function QuizmasterActivity({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      {/* Right arm raised with trophy */}
      <motion.g
        animate={{ rotate: [-20, -14, -20] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '136px 112px' }}
      >
        <rect x="132" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="150" y="82" width="10" height="30" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="155" cy="84" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="148" y="72" width="14" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Trophy */}
        <rect x="150" y="66" width="8" height="4" rx="1" fill="#b45309" />
        <rect x="152" y="58" width="4" height="10" rx="1" fill="#b45309" />
        <path d="M146 44 L148 58 L160 58 L162 44 Z" fill={color} />
        <path d="M146 44 Q141 50 145 56" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M162 44 Q167 50 163 56" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <motion.path
          d="M151 49 L154 46 L157 49 L156 53 L152 53 Z"
          fill="white" opacity={0.9}
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ transformOrigin: '154px 50px' }}
        />
      </motion.g>

      {/* Left arm relaxed */}
      <motion.g
        animate={{ rotate: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '64px 112px' }}
      >
        <rect x="48" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="40" y="116" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="45" cy="116" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="36" y="142" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
      </motion.g>

      {/* Flying question marks / quiz particles */}
      {[
        { x: 30, y: 80, sz: 14, d: 0 },
        { x: 42, y: 60, sz: 11, d: 0.8 },
        { x: 24, y: 100, sz: 10, d: 1.6 },
      ].map((q, i) => (
        <motion.text
          key={i}
          x={q.x} y={q.y}
          fontSize={q.sz} fontWeight="bold" fill={color}
          animate={{
            opacity: [0, 0.7, 0],
            y: [q.y, q.y - 18, q.y - 36],
            rotate: [0, 15, -10],
          }}
          transition={{ duration: 2.8, repeat: Infinity, delay: q.d }}
        >?</motion.text>
      ))}

      {/* Confetti / celebration particles around trophy */}
      {[
        { x: 140, y: 34, c: '#ef4444' },
        { x: 166, y: 30, c: '#3b82f6' },
        { x: 148, y: 26, c: '#22c55e' },
        { x: 158, y: 38, c: '#a855f7' },
        { x: 144, y: 42, c: color },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r="2"
          fill={p.c}
          animate={{
            cy: [p.y, p.y - 14, p.y - 28],
            cx: [p.x, p.x + (i % 2 === 0 ? 6 : -6), p.x + (i % 2 === 0 ? 10 : -10)],
            opacity: [0, 1, 0],
            r: [0, 2.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}

      {/* Mouth LED happy pulse */}
      <motion.rect
        x="86" y="72" width="28" height="5" rx="2.5"
        fill={color}
        animate={{ opacity: [0.5, 0.9, 0.5], width: [28, 22, 28] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  )
}

function DefaultArms({ uid }: { uid: string }) {
  return (
    <g>
      <motion.g
        animate={{ rotate: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '64px 112px' }}
      >
        <rect x="48" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="40" y="116" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="45" cy="116" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="36" y="142" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        style={{ transformOrigin: '136px 112px' }}
      >
        <rect x="132" y="108" width="20" height="10" rx="5" fill={`url(#metalDark-${uid})`} />
        <rect x="150" y="116" width="10" height="28" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="155" cy="116" r="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="146" y="142" width="18" height="8" rx="4" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
      </motion.g>
    </g>
  )
}

export function Character({ imageUrl, accentColor = '#6366f1', name, toolId, className = '' }: CharacterProps) {
  if (imageUrl) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-3xl ${className}`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.img
          src={imageUrl}
          alt={name || 'Персонаж'}
          className="w-full h-full object-contain object-center"
          {...floatY}
        />
      </motion.div>
    )
  }

  const uid = (accentColor + (toolId || '')).replace(/[^a-zA-Z0-9]/g, '')
  const hasActivity = toolId && ['slovoed', 'designer', 'coach', 'quizmaster'].includes(toolId)

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-3xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute w-32 h-32 rounded-full blur-3xl"
        style={{ background: accentColor + '25' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        viewBox="0 0 200 260"
        className="relative w-[85%] max-w-[190px] h-auto"
        fill="none"
        {...floatY}
      >
        <defs>
          <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id={`metalDark-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={`visor-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`accent-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.75} />
          </linearGradient>
          <linearGradient id={`chest-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.2} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.05} />
          </linearGradient>
          <filter id={`glow-${uid}`}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={`shadow-${uid}`}>
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <motion.ellipse
          cx="100" cy="248" rx="38" ry="5"
          fill="rgba(0,0,0,0.08)"
          animate={{ rx: [38, 33, 38] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Legs */}
        <rect x="80" y="192" width="12" height="30" rx="6" fill={`url(#metalDark-${uid})`} />
        <rect x="108" y="192" width="12" height="30" rx="6" fill={`url(#metalDark-${uid})`} />
        <rect x="74" y="218" width="24" height="10" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <rect x="102" y="218" width="24" height="10" rx="5" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="86" cy="195" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <circle cx="114" cy="195" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

        {/* Body */}
        <motion.g
          animate={{ scaleY: [1, 1.008, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 155px' }}
        >
          <rect x="66" y="100" width="68" height="95" rx="16" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="1" filter={`url(#shadow-${uid})`} />
          <rect x="74" y="108" width="52" height="36" rx="10" fill={`url(#chest-${uid})`} stroke={accentColor} strokeWidth="0.8" strokeOpacity={0.3} />
          <motion.circle
            cx="100" cy="126" r="12"
            fill={`url(#accent-${uid})`}
            filter={`url(#glow-${uid})`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 126px' }}
          />
          <circle cx="100" cy="126" r="5" fill="white" fillOpacity={0.5} />
          <line x1="78" y1="152" x2="122" y2="152" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="82" y1="162" x2="118" y2="162" stroke="#cbd5e1" strokeWidth="0.6" opacity={0.6} />
          <g opacity={0.4}>
            <rect x="69" y="155" width="3" height="8" rx="1" fill="#94a3b8" />
            <rect x="69" y="166" width="3" height="8" rx="1" fill="#94a3b8" />
            <rect x="128" y="155" width="3" height="8" rx="1" fill="#94a3b8" />
            <rect x="128" y="166" width="3" height="8" rx="1" fill="#94a3b8" />
          </g>
        </motion.g>

        {/* Arms + activity (or default arms) */}
        {toolId === 'slovoed' && <SlovoedActivity color={accentColor} uid={uid} />}
        {toolId === 'designer' && <DesignerActivity color={accentColor} uid={uid} />}
        {toolId === 'coach' && <CoachActivity color={accentColor} uid={uid} />}
        {toolId === 'quizmaster' && <QuizmasterActivity color={accentColor} uid={uid} />}
        {!hasActivity && <DefaultArms uid={uid} />}

        {/* Neck */}
        <rect x="90" y="84" width="20" height="18" rx="6" fill={`url(#metalDark-${uid})`} />

        {/* Head */}
        <g filter={`url(#shadow-${uid})`}>
          <rect x="58" y="18" width="84" height="70" rx="20" fill={`url(#metal-${uid})`} stroke="#cbd5e1" strokeWidth="1" />
          <rect x="52" y="38" width="10" height="22" rx="5" fill={`url(#accent-${uid})`} />
          <rect x="138" y="38" width="10" height="22" rx="5" fill={`url(#accent-${uid})`} />
          <rect x="68" y="38" width="64" height="28" rx="12" fill={`url(#visor-${uid})`} />
          <motion.g {...blink} style={{ transformOrigin: '86px 52px' }}>
            <rect x="76" y="44" width="20" height="14" rx="6" fill={accentColor} opacity={0.9} />
            <rect x="79" y="47" width="6" height="6" rx="2" fill="white" opacity={0.7} />
          </motion.g>
          <motion.g {...blink} style={{ transformOrigin: '114px 52px' }}>
            <rect x="104" y="44" width="20" height="14" rx="6" fill={accentColor} opacity={0.9} />
            <rect x="107" y="47" width="6" height="6" rx="2" fill="white" opacity={0.7} />
          </motion.g>
          {/* Mouth — default for non-special */}
          {!hasActivity && (
            <motion.rect
              x="88" y="72" width="24" height="5" rx="2.5"
              fill={accentColor} opacity={0.4}
              animate={{ opacity: [0.3, 0.6, 0.3], width: [24, 20, 24] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <rect x="82" y="24" width="36" height="4" rx="2" fill={accentColor} opacity={0.15} />
        </g>

        {/* Antenna */}
        <motion.g
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 18px' }}
        >
          <line x1="100" y1="18" x2="100" y2="4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <motion.circle
            cx="100" cy="3" r="5"
            fill={accentColor}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.path
            d="M108 6 Q112 0 108 -6"
            stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" fill="none"
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M92 6 Q88 0 92 -6"
            stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" fill="none"
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  )
}
