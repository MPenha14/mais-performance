/**
 * Helpers para converter o filtro de período em intervalo de dateKeys ("YYYY-MM-DD").
 */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDateRangeForPeriod(period, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (period === 'day') {
    const key = toDateKey(today)
    return { fromDateKey: key, toDateKey: key, label: 'Hoje' }
  }

  if (period === 'week') {
    const from = new Date(today)
    from.setDate(today.getDate() - 6) // janela de 7 dias incluindo hoje
    return { fromDateKey: toDateKey(from), toDateKey: toDateKey(today), label: 'Últimos 7 dias' }
  }

  // default month
  const from = new Date(today.getFullYear(), today.getMonth(), 1)
  return { fromDateKey: toDateKey(from), toDateKey: toDateKey(today), label: 'Este mês' }
}

export function formatDateBR(date) {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : (date instanceof Date ? date : new Date(date))
  return d.toLocaleDateString('pt-BR')
}

export function formatDateKeyBR(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-')
  return `${d}/${m}/${y}`
}
