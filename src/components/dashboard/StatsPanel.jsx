import { motion } from 'framer-motion'
import { DollarSign, Target, TrendingUp, XCircle, Users, BarChart3, Zap, LineChart } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { getConversionRate, getMonthForecast } from '@/utils/advancedMetrics'

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 items-start min-w-0"
    >
      <div className={`p-2 rounded-lg shrink-0 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide truncate">{label}</p>
        <p className="text-base font-black text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
    </motion.div>
  )
}

export function StatsPanel({ collaborators, goals }) {
  const totalVendido = collaborators.reduce((s, c) => s + (c.valorVendido ?? 0), 0)
  const totalAgendamentos = collaborators.reduce((s, c) => s + (c.agendamentos ?? 0), 0)
  const totalCancelamentos = collaborators.reduce((s, c) => s + (c.cancelamentos ?? 0), 0)
  const totalAtendimentos = totalAgendamentos + totalCancelamentos
  const taxaCancelamento = totalAtendimentos > 0 ? (totalCancelamentos / totalAtendimentos) * 100 : 0
  const taxaConversao = getConversionRate(totalAgendamentos, totalCancelamentos)
  const ticketMedio = totalAgendamentos > 0 ? totalVendido / totalAgendamentos : 0

  const unidades = [...new Set(collaborators.map(c => c.unidade).filter(Boolean))]
  const metaTotal = unidades.reduce((s, u) => s + (goals?.[u]?.meta ?? 0), 0)
  const metaPct = metaTotal > 0 ? (totalVendido / metaTotal) * 100 : 0

  const forecast = getMonthForecast(totalVendido)
  const forecastPct = metaTotal > 0 ? (forecast / metaTotal) * 100 : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <StatCard icon={DollarSign} label="Total Vendido" value={formatCurrency(totalVendido)} color="bg-emerald-500" delay={0} />
      <StatCard icon={Target} label="Meta Total" value={formatCurrency(metaTotal)} sub={`${formatPercent(metaPct)} atingido`} color="bg-brand-500" delay={0.05} />
      <StatCard icon={TrendingUp} label="% da Meta" value={formatPercent(metaPct)} sub={metaPct >= 100 ? '🎉 Meta batida!' : `Faltam ${formatCurrency(metaTotal - totalVendido)}`} color={metaPct >= 100 ? 'bg-emerald-600' : 'bg-yellow-600'} delay={0.1} />
      <StatCard icon={LineChart} label="Previsão Mês" value={formatCurrency(forecast)} sub={metaTotal > 0 ? `${formatPercent(forecastPct)} da meta` : 'ritmo atual'} color="bg-indigo-600" delay={0.15} />
      <StatCard icon={BarChart3} label="Ticket Médio" value={formatCurrency(ticketMedio)} sub={`${totalAgendamentos} atendimentos`} color="bg-purple-600" delay={0.2} />
      <StatCard icon={Zap} label="Taxa Conversão" value={formatPercent(taxaConversao)} sub={taxaConversao >= 80 ? '✅ Excelente' : 'agend. concluídos'} color={taxaConversao >= 80 ? 'bg-emerald-600' : 'bg-yellow-600'} delay={0.25} />
      <StatCard icon={XCircle} label="Cancelamentos" value={formatPercent(taxaCancelamento)} sub={`${totalCancelamentos} total`} color={taxaCancelamento > 20 ? 'bg-red-600' : 'bg-slate-600'} delay={0.3} />
      <StatCard icon={Users} label="Colaboradores" value={collaborators.length} sub="no período" color="bg-cyan-600" delay={0.35} />
    </div>
  )
}
