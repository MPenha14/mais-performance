import { motion } from 'framer-motion'
import { TrendingUp, Star } from 'lucide-react'
import { getPerformanceColor, getMedalConfig } from '@/utils/scoreCalculator'
import { formatCurrency, formatScore, getInitials } from '@/utils/formatters'

function Avatar({ name, foto, size = 'md' }) {
  const sizes = { sm: 'w-12 h-12 text-sm', md: 'w-20 h-20 text-lg', lg: 'w-24 h-24 text-xl' }
  return foto ? (
    <img src={foto} alt={name} className={`${sizes[size]} rounded-full object-cover ring-4 ring-brand-500/40`} />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-white ring-4 ring-brand-500/40`}>
      {getInitials(name)}
    </div>
  )
}

function PodiumCard({ collaborator, animDelay }) {
  if (!collaborator) return <div className="w-48" />

  const medal = getMedalConfig(collaborator.position)
  const perf = getPerformanceColor(collaborator.score)
  const heights = { 1: 'h-48', 2: 'h-36', 3: 'h-28' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay, type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative">
        <div className={`absolute -inset-1 rounded-full blur-md opacity-60 ${medal?.bg}`} />
        <Avatar name={collaborator.nome} foto={collaborator.foto} size={collaborator.position === 1 ? 'lg' : 'md'} />
        <span className="absolute -bottom-1 -right-1 text-2xl">{medal?.emoji}</span>
      </div>

      <div className="text-center">
        <p className="font-bold text-white text-sm leading-tight max-w-[140px] truncate">{collaborator.nome}</p>
        <p className="text-xs text-slate-400 mt-0.5">{collaborator.unidade}</p>
        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${perf.bg} ${perf.text} ${perf.border} border`}>
          {formatScore(collaborator.score)} pts
        </div>
        <p className="text-xs text-slate-300 mt-1">{formatCurrency(collaborator.valorVendido)}</p>
      </div>

      <div className={`w-full ${heights[collaborator.position]} rounded-t-xl flex flex-col items-center justify-end pb-3 relative overflow-hidden`}
        style={{ background: `linear-gradient(to top, ${medal?.color?.replace('text-', '') === 'text-yellow-400' ? '#854d0e' : medal?.color?.replace('text-', '') === 'text-slate-300' ? '#334155' : '#78350f'}, transparent)` }}
      >
        <div className={`absolute inset-0 ${medal?.bg} opacity-40`} />
        <span className={`relative text-3xl font-black ${medal?.color}`}>{medal?.label}</span>
      </div>
    </motion.div>
  )
}

export function TopThree({ collaborators }) {
  const [first, second, third] = [collaborators[0], collaborators[1], collaborators[2]]

  return (
    <div className="flex items-end justify-center gap-4 pb-4">
      <PodiumCard collaborator={second} animDelay={0.2} />
      <PodiumCard collaborator={first} animDelay={0} />
      <PodiumCard collaborator={third} animDelay={0.3} />
    </div>
  )
}
