/**
 * Score = (50% Vendas) + (20% Agendamentos) - (10% Cancelamentos) + (20% Avaliação Final)
 * Avaliação Final = média de (notaProva + presenca + comportamento) / 30 * 100
 *
 * Vendas e Agendamentos são normalizados relativo ao máximo do grupo ou à meta da unidade.
 * Cancelamentos impactam pela taxa (cancelamentos / total_atendimentos) * 100.
 */
export function calculateScore(collaborator, allCollaborators, unitGoal = 0) {
  const {
    valorVendido = 0,
    agendamentos = 0,
    cancelamentos = 0,
    presenca = 0,
    notaProva = 0,
    comportamento = 0,
  } = collaborator

  // Normalização de Vendas: relativo à meta da unidade ou ao maior valor do grupo
  const refVendas = unitGoal > 0
    ? unitGoal
    : Math.max(...allCollaborators.map(c => c.valorVendido ?? 0), 1)
  const scoreVendas = Math.min((valorVendido / refVendas) * 100, 150)

  // Normalização de Agendamentos: relativo ao maior do grupo
  const maxAgendamentos = Math.max(...allCollaborators.map(c => c.agendamentos ?? 0), 1)
  const scoreAgendamentos = (agendamentos / maxAgendamentos) * 100

  // Impacto de Cancelamentos: taxa percentual sobre total de atendimentos
  const totalAtendimentos = agendamentos + cancelamentos
  const taxaCancelamento = totalAtendimentos > 0 ? (cancelamentos / totalAtendimentos) * 100 : 0

  // Avaliação Final: cada sub-métrica é 0–10
  const avaliacaoFinal = ((notaProva + presenca + comportamento) / 30) * 100

  const score =
    0.5 * scoreVendas +
    0.2 * scoreAgendamentos -
    0.1 * taxaCancelamento +
    0.2 * avaliacaoFinal

  return Math.max(0, Math.round(score * 10) / 10)
}

export function getPerformanceLevel(score) {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export function getPerformanceColor(score) {
  if (score >= 70) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' }
  if (score >= 40) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' }
  return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40' }
}

export function getMedalConfig(position) {
  const medals = {
    1: { emoji: '🥇', label: '1º', color: 'text-yellow-400', glow: 'shadow-yellow-400/50', bg: 'bg-yellow-400/10', border: 'border-yellow-400/50' },
    2: { emoji: '🥈', label: '2º', color: 'text-slate-300', glow: 'shadow-slate-300/50', bg: 'bg-slate-300/10', border: 'border-slate-300/50' },
    3: { emoji: '🥉', label: '3º', color: 'text-amber-600', glow: 'shadow-amber-600/50', bg: 'bg-amber-600/10', border: 'border-amber-600/50' },
  }
  return medals[position] ?? null
}

export function applyRankingWithCollaborators(collaborators, unitGoals = {}) {
  return collaborators
    .map(c => {
      const goal = unitGoals[c.unidade] ?? 0
      return { ...c, score: calculateScore(c, collaborators, goal) }
    })
    .sort((a, b) => b.score - a.score)
    .map((c, index) => ({ ...c, position: index + 1 }))
}
