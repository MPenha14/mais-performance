export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)

export const formatPercent = (value, decimals = 1) =>
  `${(value ?? 0).toFixed(decimals)}%`

export const formatScore = (score) =>
  `${(score ?? 0).toFixed(1)}`

export const getPeriodLabel = (period) => {
  const labels = { day: 'Hoje', week: 'Últimos 7 dias', month: 'Este Mês' }
  return labels[period] ?? period
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
