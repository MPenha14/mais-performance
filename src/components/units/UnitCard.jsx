import { motion } from 'framer-motion'
import { Target, Users, TrendingUp, DollarSign, BarChart3, AlertCircle } from 'lucide-react'
import { formatCurrency, formatPercent, formatScore, getInitials } from '@/utils/formatters'
import { getPerformanceColor } from '@/utils/scoreCalculator'

export function UnitCard({ unit, index }) {
  const {
    nome, meta, totalVendido, percentMeta, colaboradores, scoreMedio,
    topPerformer, ticketMedio, taxaConversao, totalCancelamentos,
  } = unit

  const perf = getPerformanceColor(scoreMedio)
  const goalReached = percentMeta >= 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 180, damping: 22 }}
      className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Unidade</p>
          <h3 className="text-lg font-black text-white truncate">{nome}</h3>
        </div>
        <div className={`shrink-0 px-3 py-1 rounded-lg border text-center ${perf.bg} ${perf.border}`}>
          <p className={`text-xl font-black ${perf.text}`}>{formatScore(scoreMedio)}</p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">score médio</p>
        </div>
      </div>

      {/* Goal progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Target size={12} /> Meta: <strong className="text-slate-200">{formatCurrency(meta)}</strong>
          </span>
          <span className={`font-bold ${goalReached ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {formatPercent(percentMeta)}
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentMeta, 100)}%` }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${goalReached
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              : 'bg-gradient-to-r from-brand-500 to-yellow-400'}`}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Vendido</span>
          <span className="font-bold text-white">{formatCurrency(totalVendido)}</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2">
        <Metric icon={Users}      label="Colaboradores"  value={colaboradores.length} />
        <Metric icon={BarChart3}  label="Ticket Médio"   value={formatCurrency(ticketMedio)} />
        <Metric icon={TrendingUp} label="Conversão"      value={formatPercent(taxaConversao)} valueColor={taxaConversao > 80 ? 'text-emerald-400' : 'text-yellow-400'} />
        <Metric icon={AlertCircle} label="Cancelamentos" value={totalCancelamentos} valueColor={totalCancelamentos > 10 ? 'text-red-400' : 'text-slate-200'} />
      </div>

      {/* Top performer */}
      {topPerformer && (
        <div className="border-t border-white/5 pt-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">🏆 Top da Unidade</p>
          <div className="flex items-center gap-3">
            {topPerformer.foto ? (
              <img src={topPerformer.foto} alt={topPerformer.nome}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-brand-500/30">
                {getInitials(topPerformer.nome)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{topPerformer.nome}</p>
              <p className="text-[10px] text-slate-500">{formatCurrency(topPerformer.valorVendido)} em vendas</p>
            </div>
            <span className="text-sm font-black text-brand-400">{formatScore(topPerformer.score)}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function Metric({ icon: Icon, label, value, valueColor = 'text-slate-200' }) {
  return (
    <div className="bg-white/3 rounded-lg p-2 flex items-center gap-2">
      <Icon size={14} className="text-slate-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[9px] text-slate-500 uppercase tracking-wide truncate">{label}</p>
        <p className={`text-sm font-bold ${valueColor} truncate`}>{value}</p>
      </div>
    </div>
  )
}
