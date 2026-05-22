/**
 * Taxa de conversão = agendamentos / total_atendimentos
 * Quanto maior, melhor (menos cancelamentos relativos).
 */
export function getConversionRate(agendamentos = 0, cancelamentos = 0) {
  const total = agendamentos + cancelamentos
  return total > 0 ? (agendamentos / total) * 100 : 0
}

/**
 * Previsão de fechamento do mês baseada no ritmo atual.
 * Ex: faltam 10 dias, vendeu R$10k em 20 dias → previsão R$15k
 */
export function getMonthForecast(valorAtual = 0, date = new Date()) {
  const day = date.getDate()
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  if (day === 0) return valorAtual
  return (valorAtual / day) * daysInMonth
}

/**
 * Comparativo percentual entre dois valores (ex: mês atual vs anterior)
 */
export function getGrowthPercent(current = 0, previous = 0) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Mês atual no formato "YYYY-MM"
 */
export function getCurrentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Mês anterior no formato "YYYY-MM"
 */
export function getPreviousMonthKey(date = new Date()) {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Converte "YYYY-MM" para label legível: "Abr/26"
 */
export function formatMonthKey(key) {
  if (!key) return ''
  const [year, month] = key.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(month, 10) - 1]}/${year.slice(-2)}`
}

/**
 * Detecta conquistas com base no histórico de um colaborador
 */
export function detectAchievements(history = []) {
  if (history.length === 0) return []

  const sorted = [...history].sort((a, b) => a.monthKey.localeCompare(b.monthKey))
  const achievements = []

  // Top 1 alguma vez
  const top1 = sorted.find(h => h.position === 1)
  if (top1) {
    achievements.push({
      id: 'top1',
      emoji: '🥇',
      title: 'Campeão',
      description: `Foi 1º lugar em ${formatMonthKey(top1.monthKey)}`,
      color: 'gold',
    })
  }

  // Streak Top 3 (3 meses consecutivos)
  let streak = 0
  let maxStreak = 0
  sorted.forEach(h => {
    if (h.position && h.position <= 3) {
      streak++
      maxStreak = Math.max(maxStreak, streak)
    } else {
      streak = 0
    }
  })
  if (maxStreak >= 3) {
    achievements.push({
      id: 'streak3',
      emoji: '🔥',
      title: 'Consistência',
      description: `${maxStreak} meses seguidos no Top 3`,
      color: 'orange',
    })
  }

  // Zero cancelamentos
  const zeroCancel = sorted.find(h => h.cancelamentos === 0 && h.agendamentos > 0)
  if (zeroCancel) {
    achievements.push({
      id: 'zerocancel',
      emoji: '💎',
      title: 'Zero Cancelamentos',
      description: `Mês inteiro sem cancelar (${formatMonthKey(zeroCancel.monthKey)})`,
      color: 'purple',
    })
  }

  // Crescimento +30% no score vs mês anterior
  for (let i = 1; i < sorted.length; i++) {
    const growth = getGrowthPercent(sorted[i].score, sorted[i - 1].score)
    if (growth >= 30) {
      achievements.push({
        id: 'growth30',
        emoji: '🚀',
        title: 'Em Ascensão',
        description: `+${growth.toFixed(0)}% de evolução em ${formatMonthKey(sorted[i].monthKey)}`,
        color: 'green',
      })
      break
    }
  }

  // Score máximo histórico ≥ 80
  const maxScore = Math.max(...sorted.map(h => h.score ?? 0))
  if (maxScore >= 80) {
    achievements.push({
      id: 'highscore',
      emoji: '👑',
      title: 'Elite',
      description: `Atingiu score máximo de ${maxScore.toFixed(1)} pts`,
      color: 'yellow',
    })
  }

  return achievements
}
