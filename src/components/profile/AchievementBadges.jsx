import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

const COLOR_MAP = {
  gold:   { bg: 'bg-yellow-400/10', border: 'border-yellow-400/40', text: 'text-yellow-300' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-300' },
  green:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-300' },
  yellow: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-300' },
}

export function AchievementBadges({ achievements = [] }) {
  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-slate-500 text-sm">
        <Trophy size={28} strokeWidth={1} />
        <p>Nenhuma conquista ainda</p>
        <p className="text-xs">Continue evoluindo para desbloquear medalhas!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {achievements.map((a, i) => {
        const c = COLOR_MAP[a.color] ?? COLOR_MAP.orange
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 22 }}
            className={`rounded-xl border p-3 ${c.bg} ${c.border}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${c.text}`}>{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">{a.description}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
