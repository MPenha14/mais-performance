import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, AlertTriangle, TrendingDown, Zap } from 'lucide-react'

function buildAlerts(collaborators, goals) {
  const alerts = []

  collaborators.forEach(c => {
    const goal = goals?.[c.unidade]?.meta
    if (goal && c.valorVendido >= goal) {
      alerts.push({ id: `goal-${c.id}`, type: 'success', icon: Trophy, message: `🎯 ${c.nome} bateu a meta de ${c.unidade}!` })
    }

    const total = c.agendamentos + c.cancelamentos
    const cancelRate = total > 0 ? (c.cancelamentos / total) * 100 : 0
    if (cancelRate > 30) {
      alerts.push({ id: `cancel-${c.id}`, type: 'warning', icon: AlertTriangle, message: `⚠️ ${c.nome} com ${cancelRate.toFixed(0)}% de cancelamentos` })
    }
  })

  const leader = collaborators[0]
  if (leader) {
    alerts.push({ id: 'leader', type: 'info', icon: Zap, message: `⚡ Liderança: ${leader.nome} com ${leader.score.toFixed(1)} pts` })
  }

  return alerts
}

export function AlertBanner({ collaborators, goals }) {
  const alerts = buildAlerts(collaborators, goals)
  if (alerts.length === 0) return null

  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    info: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {alerts.slice(0, 3).map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${colors[alert.type]}`}
          >
            {alert.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
