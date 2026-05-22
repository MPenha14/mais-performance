import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import { getPerformanceColor, getMedalConfig } from '@/utils/scoreCalculator'
import { formatCurrency, formatScore, formatPercent, getInitials } from '@/utils/formatters'

function Avatar({ name, foto }) {
  return foto ? (
    <img src={foto} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
      {getInitials(name)}
    </div>
  )
}

export function RankingCard({ collaborator, index, previousPosition }) {
  const { id, position, nome, foto, unidade, score, valorVendido, agendamentos, cancelamentos } = collaborator
  const medal = getMedalConfig(position)
  const perf = getPerformanceColor(score)

  const totalAtendimentos = agendamentos + cancelamentos
  const cancelRate = totalAtendimentos > 0 ? (cancelamentos / totalAtendimentos) * 100 : 0

  const positionDelta = previousPosition ? previousPosition - position : 0

  const TrendIcon = positionDelta > 0 ? TrendingUp : positionDelta < 0 ? TrendingDown : Minus
  const trendColor = positionDelta > 0 ? 'text-emerald-400' : positionDelta < 0 ? 'text-red-400' : 'text-slate-500'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 25 }}
    >
    <Link
      to={`/colaborador/${id}`}
      className={`
        group relative flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300
        ${medal ? `${medal.bg} ${medal.border}` : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'}
        ${medal?.glow ? `shadow-lg ${medal.glow}` : ''}
      `}
    >
      {/* Position */}
      <div className="flex flex-col items-center w-8 shrink-0">
        {medal ? (
          <span className="text-xl">{medal.emoji}</span>
        ) : (
          <span className="text-lg font-black text-slate-400">{position}</span>
        )}
        <div className={`flex items-center gap-0.5 ${trendColor}`}>
          <TrendIcon size={10} />
          {Math.abs(positionDelta) > 0 && (
            <span className="text-[10px] font-bold">{Math.abs(positionDelta)}</span>
          )}
        </div>
      </div>

      {/* Avatar */}
      <Avatar name={nome} foto={foto} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-white truncate text-sm">{nome}</p>
          {position === 1 && <span className="text-xs">⭐ Melhor da semana</span>}
        </div>
        <p className="text-xs text-slate-400 truncate">{unidade}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
        <div className="text-center">
          <p className="font-semibold text-slate-200">{formatCurrency(valorVendido)}</p>
          <p>Vendas</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-200">{agendamentos}</p>
          <p>Agend.</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${cancelRate > 20 ? 'text-red-400' : 'text-slate-200'}`}>
            {formatPercent(cancelRate)}
          </p>
          <p>Cancelam.</p>
        </div>
      </div>

      {/* Score */}
      <div className={`shrink-0 px-3 py-1.5 rounded-lg border text-center ${perf.bg} ${perf.border}`}>
        <p className={`text-base font-black ${perf.text}`}>{formatScore(score)}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide">score</p>
      </div>

      <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
    </Link>
    </motion.div>
  )
}
