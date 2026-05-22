import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { calculateScore } from '@/utils/scoreCalculator'
import { getCurrentMonthKey, getPreviousMonthKey } from '@/utils/advancedMetrics'

/**
 * Salva snapshot de TODOS os colaboradores referentes ao mês informado.
 * Usa batch para garantir atomicidade.
 */
export async function saveMonthSnapshot(monthKey, collaborators, unitGoals = {}) {
  const ranked = [...collaborators]
    .map(c => ({ ...c, score: calculateScore(c, collaborators, unitGoals[c.unidade] ?? 0) }))
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({ ...c, position: i + 1 }))

  const batch = writeBatch(db)
  ranked.forEach(c => {
    const ref = doc(db, 'history', `${c.id}_${monthKey}`)
    batch.set(ref, {
      collaboratorId: c.id,
      monthKey,
      nome: c.nome,
      foto: c.foto ?? '',
      unidade: c.unidade,
      valorVendido: c.valorVendido ?? 0,
      agendamentos: c.agendamentos ?? 0,
      cancelamentos: c.cancelamentos ?? 0,
      notaProva: c.notaProva ?? 0,
      presenca: c.presenca ?? 0,
      comportamento: c.comportamento ?? 0,
      score: c.score,
      position: c.position,
      savedAt: serverTimestamp(),
    }, { merge: true })
  })

  const stateRef = doc(db, 'meta', 'snapshotState')
  batch.set(stateRef, {
    lastProcessedMonth: monthKey,
    updatedAt: serverTimestamp(),
  }, { merge: true })

  await batch.commit()
  return ranked.length
}

/**
 * Verifica se o mês anterior já foi snapshotado. Se não, dispara snapshot automático.
 * Roda na inicialização do dashboard.
 */
export async function autoSnapshotPreviousMonth(collaborators, unitGoals = {}) {
  if (collaborators.length === 0) return false

  const previousMonth = getPreviousMonthKey()
  const stateRef = doc(db, 'meta', 'snapshotState')
  const stateDoc = await getDoc(stateRef)
  const lastProcessed = stateDoc.exists() ? stateDoc.data().lastProcessedMonth : null

  if (lastProcessed === previousMonth) return false

  await saveMonthSnapshot(previousMonth, collaborators, unitGoals)
  return true
}

/**
 * Listener do histórico de um colaborador específico
 */
export function subscribeToCollaboratorHistory(collaboratorId, callback) {
  const q = query(
    collection(db, 'history'),
    where('collaboratorId', '==', collaboratorId),
    orderBy('monthKey', 'asc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

/**
 * Listener de todo o histórico (para análises gerais)
 */
export function subscribeToAllHistory(callback) {
  const q = query(collection(db, 'history'), orderBy('monthKey', 'desc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}
