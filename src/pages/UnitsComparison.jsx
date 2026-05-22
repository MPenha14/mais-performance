import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, TrendingUp, Award } from 'lucide-react'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useUnits } from '@/hooks/useUnits'
import { useFilters } from '@/hooks/useFilters'
import { useUnitStats } from '@/hooks/useUnitStats'
import { Button } from '@/components/ui/Button'
import { Filters } from '@/components/dashboard/Filters'
import { UnitCard } from '@/components/units/UnitCard'
import { formatCurrency, formatPercent, formatScore } from '@/utils/formatters'

export default function UnitsComparison() {
  const { filters, setFilter } = useFilters({ unidade: 'all' })
  const { collaborators, goals, loading } = useCollaborators({ ...filters, unidade: 'all' })
  const { units } = useUnits()
  const stats = useUnitStats(collaborators, goals, units)

  // Totais agregados
  const totalVendido = stats.reduce((s, u) => s + u.totalVendido, 0)
  const totalMeta = stats.reduce((s, u) => s + u.meta, 0)
  const metaPct = totalMeta > 0 ? (totalVendido / totalMeta) * 100 : 0
  const topUnit = [...stats].sort((a, b) => b.scoreMedio - a.scoreMedio)[0]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_60%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft size={16} /> Ranking</Button></Link>
          <h1 className="font-bold text-white flex items-center gap-2">
            <Building2 size={18} className="text-brand-400" /> Comparativo de Unidades
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Period filter only — unit doesn't make sense here */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Filters
            filters={{ ...filters, unidade: 'all' }}
            onFilter={(k, v) => k === 'period' && setFilter(k, v)}
            units={[]}
          />
          <p className="text-xs text-slate-500">{stats.length} unidades · {collaborators.length} colaboradores</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SummaryCard
            icon="💰" label="Total Vendido (todas)"
            value={formatCurrency(totalVendido)}
            sub={`Meta total: ${formatCurrency(totalMeta)}`}
            color="emerald"
          />
          <SummaryCard
            icon="🎯" label="% Meta Global"
            value={formatPercent(metaPct)}
            sub={metaPct >= 100 ? '🎉 Meta global batida!' : `Faltam ${formatCurrency(Math.max(0, totalMeta - totalVendido))}`}
            color={metaPct >= 100 ? 'emerald' : 'orange'}
          />
          <SummaryCard
            icon="🏆" label="Unidade Líder"
            value={topUnit?.nome ?? '—'}
            sub={topUnit ? `Score médio: ${formatScore(topUnit.scoreMedio)}` : 'Sem dados ainda'}
            color="yellow"
          />
        </div>

        {/* Unit cards */}
        {loading ? (
          <div className="flex justify-center py-12 text-slate-500">Carregando unidades...</div>
        ) : stats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
            <Building2 size={40} strokeWidth={1} />
            <p>Nenhuma unidade cadastrada ainda</p>
            <Link to="/admin"><Button size="sm">Ir para Admin</Button></Link>
          </div>
        ) : (
          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-500 rounded-full" />
              Unidades por Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {stats.map((u, i) => (
                <UnitCard key={u.nome} unit={u} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function SummaryCard({ icon, label, value, sub, color }) {
  const colors = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    orange:  'border-brand-500/30 bg-brand-500/5',
    yellow:  'border-yellow-500/30 bg-yellow-500/5',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${colors[color]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-black text-white mt-0.5 truncate">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </div>
    </motion.div>
  )
}
