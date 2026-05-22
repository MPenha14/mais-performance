import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus,
  DollarSign, Calendar, XCircle, Award, Target,
} from 'lucide-react'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useCollaboratorHistory } from '@/hooks/useHistory'
import { useFilters } from '@/hooks/useFilters'
import { ScoreEvolutionChart } from '@/components/profile/ScoreEvolutionChart'
import { AchievementBadges } from '@/components/profile/AchievementBadges'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPercent, formatScore, getInitials } from '@/utils/formatters'
import { getPerformanceColor, getMedalConfig } from '@/utils/scoreCalculator'
import {
  detectAchievements,
  getConversionRate,
  getGrowthPercent,
  formatMonthKey,
  getMonthForecast,
} from '@/utils/advancedMetrics'

export default function CollaboratorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { filters } = useFilters()
  const { collaborators, loading } = useCollaborators(filters)
  const { history, loading: historyLoading } = useCollaboratorHistory(id)

  const collaborator = collaborators.find(c => c.id === id)
  const achievements = useMemo(() => detectAchievements(history), [history])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!collaborator) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Colaborador não encontrado</p>
        <Button onClick={() => navigate('/')}><ArrowLeft size={16} /> Voltar</Button>
      </div>
    )
  }

  const perf = getPerformanceColor(collaborator.score)
  const medal = getMedalConfig(collaborator.position)
  const conversion = getConversionRate(collaborator.agendamentos, collaborator.cancelamentos)
  const forecast = getMonthForecast(collaborator.valorVendido)

  // Comparativo com mês anterior (penúltimo registro do histórico)
  const lastSnapshot = history[history.length - 1]
  const growthScore = lastSnapshot ? getGrowthPercent(collaborator.score, lastSnapshot.score) : 0
  const growthVendas = lastSnapshot ? getGrowthPercent(collaborator.valorVendido, lastSnapshot.valorVendido) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_60%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft size={16} /> Ranking</Button></Link>
          <h1 className="font-bold text-white">Perfil do Colaborador</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-full blur-lg opacity-50 bg-brand-500/40" />
            {collaborator.foto ? (
              <img src={collaborator.foto} alt={collaborator.nome}
                className="relative w-28 h-28 rounded-full object-cover ring-4 ring-brand-500/40" />
            ) : (
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-3xl font-black text-white ring-4 ring-brand-500/40">
                {getInitials(collaborator.nome)}
              </div>
            )}
            {medal && (
              <span className="absolute -bottom-1 -right-1 text-3xl">{medal.emoji}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-black text-white">{collaborator.nome}</h2>
            <p className="text-slate-400 mt-1">{collaborator.unidade}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <Badge variant="orange">#{collaborator.position} no ranking</Badge>
              {medal && <Badge variant="gold">Top {collaborator.position}</Badge>}
              {achievements.length > 0 && (
                <Badge variant="default">🏅 {achievements.length} conquistas</Badge>
              )}
            </div>
          </div>

          {/* Score */}
          <div className={`shrink-0 px-6 py-4 rounded-2xl border ${perf.bg} ${perf.border} text-center`}>
            <p className={`text-5xl font-black ${perf.text}`}>{formatScore(collaborator.score)}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Score Atual</p>
            {lastSnapshot && (
              <div className={`flex items-center justify-center gap-1 mt-2 text-xs font-bold ${
                growthScore > 0 ? 'text-emerald-400' : growthScore < 0 ? 'text-red-400' : 'text-slate-500'
              }`}>
                {growthScore > 0 ? <TrendingUp size={12} /> : growthScore < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                {growthScore > 0 ? '+' : ''}{growthScore.toFixed(1)}% vs último mês
              </div>
            )}
          </div>
        </motion.section>

        {/* Métricas atuais */}
        <section>
          <SectionTitle>Métricas Atuais</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              icon={DollarSign} color="emerald"
              label="Vendido" value={formatCurrency(collaborator.valorVendido)}
              hint={lastSnapshot ? `${growthVendas > 0 ? '+' : ''}${growthVendas.toFixed(0)}% vs anterior` : null}
              hintColor={growthVendas >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
            <MetricCard
              icon={Calendar} color="blue"
              label="Agendamentos" value={collaborator.agendamentos}
              hint={`Ticket: ${formatCurrency(collaborator.agendamentos > 0 ? collaborator.valorVendido / collaborator.agendamentos : 0)}`}
            />
            <MetricCard
              icon={TrendingUp} color="purple"
              label="Conversão" value={formatPercent(conversion)}
              hint={`${collaborator.cancelamentos} cancelamentos`}
              hintColor={conversion >= 80 ? 'text-emerald-400' : 'text-yellow-400'}
            />
            <MetricCard
              icon={Target} color="orange"
              label="Previsão Mês" value={formatCurrency(forecast)}
              hint="ritmo atual extrapolado"
            />
          </div>
        </section>

        {/* Gráfico de evolução */}
        <section>
          <SectionTitle>Evolução do Score</SectionTitle>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            {historyLoading ? (
              <div className="flex justify-center py-8 text-slate-500 text-sm">Carregando histórico...</div>
            ) : (
              <ScoreEvolutionChart history={history} metric="score" label="Score" />
            )}
          </div>
        </section>

        {/* Conquistas */}
        <section>
          <SectionTitle>Conquistas</SectionTitle>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            <AchievementBadges achievements={achievements} />
          </div>
        </section>

        {/* Histórico mensal */}
        {history.length > 0 && (
          <section>
            <SectionTitle>Histórico Mensal</SectionTitle>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wide">
                    <th className="p-3">Mês</th>
                    <th className="p-3 text-center">Posição</th>
                    <th className="p-3 text-right">Vendas</th>
                    <th className="p-3 text-right">Agend.</th>
                    <th className="p-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map(h => {
                    const hperf = getPerformanceColor(h.score)
                    return (
                      <tr key={h.id} className="border-b border-white/5">
                        <td className="p-3 font-medium">{formatMonthKey(h.monthKey)}</td>
                        <td className="p-3 text-center">
                          {h.position <= 3 ? getMedalConfig(h.position)?.emoji : `#${h.position}`}
                        </td>
                        <td className="p-3 text-right">{formatCurrency(h.valorVendido)}</td>
                        <td className="p-3 text-right">{h.agendamentos}</td>
                        <td className="p-3 text-right">
                          <span className={`font-bold ${hperf.text}`}>{formatScore(h.score)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-4 h-0.5 bg-brand-500 rounded-full" />
      {children}
    </h2>
  )
}

function MetricCard({ icon: Icon, color, label, value, hint, hintColor = 'text-slate-500' }) {
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-brand-500',
  }
  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${colors[color]}`}>
          <Icon size={14} className="text-white" />
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-xl font-black text-white">{value}</p>
      {hint && <p className={`text-xs ${hintColor}`}>{hint}</p>}
    </div>
  )
}
