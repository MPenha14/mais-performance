import { useMemo } from 'react'
import { getConversionRate } from '@/utils/advancedMetrics'

/**
 * Recebe a lista de colaboradores já com score calculado e agrupa por unidade.
 * Retorna um array de unidades com indicadores agregados.
 */
export function useUnitStats(collaborators = [], goals = {}, units = []) {
  return useMemo(() => {
    const map = {}

    // Garante que toda unidade cadastrada apareça, mesmo sem colaboradores
    units.forEach(u => {
      map[u.name] = {
        nome: u.name,
        meta: goals[u.name]?.meta ?? 0,
        colaboradores: [],
        totalVendido: 0,
        totalAgendamentos: 0,
        totalCancelamentos: 0,
        scoreMedio: 0,
        topPerformer: null,
        ticketMedio: 0,
        taxaConversao: 0,
        percentMeta: 0,
      }
    })

    collaborators.forEach(c => {
      if (!c.unidade) return
      if (!map[c.unidade]) {
        map[c.unidade] = {
          nome: c.unidade,
          meta: goals[c.unidade]?.meta ?? 0,
          colaboradores: [],
          totalVendido: 0,
          totalAgendamentos: 0,
          totalCancelamentos: 0,
          scoreMedio: 0,
          topPerformer: null,
          ticketMedio: 0,
          taxaConversao: 0,
          percentMeta: 0,
        }
      }
      const u = map[c.unidade]
      u.colaboradores.push(c)
      u.totalVendido += c.valorVendido ?? 0
      u.totalAgendamentos += c.agendamentos ?? 0
      u.totalCancelamentos += c.cancelamentos ?? 0
    })

    Object.values(map).forEach(u => {
      const totalScore = u.colaboradores.reduce((s, c) => s + (c.score ?? 0), 0)
      u.scoreMedio = u.colaboradores.length > 0 ? totalScore / u.colaboradores.length : 0
      u.topPerformer = u.colaboradores.length > 0
        ? [...u.colaboradores].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
        : null
      u.ticketMedio = u.totalAgendamentos > 0 ? u.totalVendido / u.totalAgendamentos : 0
      u.taxaConversao = getConversionRate(u.totalAgendamentos, u.totalCancelamentos)
      u.percentMeta = u.meta > 0 ? (u.totalVendido / u.meta) * 100 : 0
    })

    return Object.values(map).sort((a, b) => b.scoreMedio - a.scoreMedio)
  }, [collaborators, goals, units])
}
