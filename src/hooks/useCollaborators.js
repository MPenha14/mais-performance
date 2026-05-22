import { useEffect, useMemo, useRef, useState } from 'react'
import {
  subscribeToCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '@/services/collaboratorService'
import { subscribeToGoals } from '@/services/goalService'
import { autoSnapshotPreviousMonth } from '@/services/historyService'
import { migrateLegacyCollaborators } from '@/services/entryService'
import { useEntries } from './useEntries'
import { applyRankingWithCollaborators } from '@/utils/scoreCalculator'
import toast from 'react-hot-toast'

export function useCollaborators(filters = {}) {
  const [rawCollaborators, setRawCollaborators] = useState([])
  const [goals, setGoals] = useState({})
  const [loading, setLoading] = useState(true)
  const autoSnapshotDone = useRef(false)
  const migrationDone = useRef(false)

  // 1. Base estática dos colaboradores (sempre todos — filtro de unidade é aplicado depois)
  useEffect(() => {
    const unsub = subscribeToCollaborators({}, (data) => {
      setRawCollaborators(data)
      setLoading(false)
    })
    return unsub
  }, [])

  // 2. Metas
  useEffect(() => {
    const unsub = subscribeToGoals((g) => setGoals(g))
    return unsub
  }, [])

  // 3. Lançamentos do período selecionado
  const { entries, aggregated, range, loading: entriesLoading } = useEntries(filters.period ?? 'month')

  const unitGoalsMap = useMemo(() => (
    Object.fromEntries(Object.entries(goals).map(([unit, g]) => [unit, g.meta ?? 0]))
  ), [goals])

  // 4. Combina dados estáticos + agregados de entries, depois aplica filtro de unidade
  const merged = useMemo(() => {
    return rawCollaborators
      .map(c => {
        const agg = aggregated[c.id] ?? { valorVendido: 0, agendamentos: 0, cancelamentos: 0 }
        return {
          ...c,
          valorVendido: agg.valorVendido,
          agendamentos: agg.agendamentos,
          cancelamentos: agg.cancelamentos,
        }
      })
      .filter(c => filters.unidade === 'all' || !filters.unidade ? true : c.unidade === filters.unidade)
  }, [rawCollaborators, aggregated, filters.unidade])

  const ranked = useMemo(() => applyRankingWithCollaborators(merged, unitGoalsMap), [merged, unitGoalsMap])

  // 5. Migração automática (uma vez) dos campos legados → entries
  useEffect(() => {
    if (migrationDone.current || rawCollaborators.length === 0) return
    migrationDone.current = true
    migrateLegacyCollaborators(rawCollaborators)
      .then(count => { if (count > 0) toast.success(`${count} colaborador(es) migrado(s) para lançamentos diários`) })
      .catch(() => { /* silencioso */ })
  }, [rawCollaborators.length])

  // 6. Auto-snapshot do mês anterior (uma vez)
  useEffect(() => {
    if (autoSnapshotDone.current || ranked.length === 0) return
    autoSnapshotDone.current = true
    autoSnapshotPreviousMonth(ranked, unitGoalsMap).catch(() => {})
  }, [ranked.length])

  const create = async (data) => {
    await createCollaborator(data)
    toast.success('Colaborador adicionado!')
  }

  const update = async (id, data) => {
    await updateCollaborator(id, data)
    toast.success('Colaborador atualizado!')
  }

  const remove = async (id) => {
    await deleteCollaborator(id)
    toast.success('Colaborador removido.')
  }

  return {
    collaborators: ranked,
    rawCollaborators,
    entries,
    range,
    goals,
    loading: loading || entriesLoading,
    create,
    update,
    remove,
  }
}
