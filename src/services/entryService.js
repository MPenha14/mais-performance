import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

const COLL = 'entries'

/**
 * Cria uma entrada de performance para um colaborador num dia específico.
 * dateKey: "YYYY-MM-DD"
 */
export async function createEntry({ collaboratorId, dateKey, date, valorVendido, agendamentos, cancelamentos }) {
  return addDoc(collection(db, COLL), {
    collaboratorId,
    dateKey,
    date: date instanceof Date ? Timestamp.fromDate(date) : date,
    valorVendido: Number(valorVendido) || 0,
    agendamentos: Number(agendamentos) || 0,
    cancelamentos: Number(cancelamentos) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateEntry(id, data) {
  return updateDoc(doc(db, COLL, id), {
    ...data,
    valorVendido: Number(data.valorVendido) || 0,
    agendamentos: Number(data.agendamentos) || 0,
    cancelamentos: Number(data.cancelamentos) || 0,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEntry(id) {
  return deleteDoc(doc(db, COLL, id))
}

/**
 * Listener de entradas dentro de um intervalo de datas.
 * fromDateKey/toDateKey no formato "YYYY-MM-DD" (inclusivos).
 */
export function subscribeToEntries({ fromDateKey, toDateKey }, callback) {
  let q = collection(db, COLL)
  const constraints = []
  if (fromDateKey) constraints.push(where('dateKey', '>=', fromDateKey))
  if (toDateKey) constraints.push(where('dateKey', '<=', toDateKey))
  if (constraints.length > 0) q = query(q, ...constraints, orderBy('dateKey', 'desc'))
  else q = query(q, orderBy('dateKey', 'desc'))

  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

/**
 * Listener de entradas de um colaborador (todas)
 */
export function subscribeToCollaboratorEntries(collaboratorId, callback) {
  const q = query(
    collection(db, COLL),
    where('collaboratorId', '==', collaboratorId),
    orderBy('dateKey', 'desc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

/**
 * Migração one-shot: para cada colaborador que tem valores armazenados
 * (valorVendido > 0 ou agendamentos > 0 ou cancelamentos > 0) e não tem
 * o flag `migratedAt`, cria um lançamento referente a hoje com esses valores
 * e marca o colaborador como migrado.
 */
export async function migrateLegacyCollaborators(collaborators) {
  const today = new Date()
  const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const candidates = collaborators.filter(c =>
    !c.migratedAt &&
    ((c.valorVendido ?? 0) > 0 || (c.agendamentos ?? 0) > 0 || (c.cancelamentos ?? 0) > 0)
  )

  if (candidates.length === 0) return 0

  const batch = writeBatch(db)
  for (const c of candidates) {
    const entryRef = doc(collection(db, COLL))
    batch.set(entryRef, {
      collaboratorId: c.id,
      dateKey,
      date: Timestamp.fromDate(today),
      valorVendido: c.valorVendido ?? 0,
      agendamentos: c.agendamentos ?? 0,
      cancelamentos: c.cancelamentos ?? 0,
      legacy: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    const collabRef = doc(db, 'collaborators', c.id)
    batch.update(collabRef, {
      migratedAt: serverTimestamp(),
      valorVendido: 0,
      agendamentos: 0,
      cancelamentos: 0,
    })
  }
  await batch.commit()
  return candidates.length
}
