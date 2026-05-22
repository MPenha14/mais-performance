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
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const COLL = 'collaborators'

export function subscribeToCollaborators(filters, callback) {
  // Sempre traz todos — filtros de período e unidade são aplicados no useCollaborators
  // (período usa entries, unidade é client-side para evitar índices compostos).
  let q = collection(db, COLL)

  if (filters?.unidade && filters.unidade !== 'all') {
    q = query(q, where('unidade', '==', filters.unidade))
  }

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export async function createCollaborator(data) {
  return addDoc(collection(db, COLL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateCollaborator(id, data) {
  return updateDoc(doc(db, COLL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCollaborator(id) {
  return deleteDoc(doc(db, COLL, id))
}

export async function saveMonthlySnapshot(collaboratorId, monthKey, data) {
  const ref = doc(db, 'history', `${collaboratorId}_${monthKey}`)
  return setDoc(ref, { ...data, collaboratorId, monthKey, savedAt: serverTimestamp() }, { merge: true })
}

export function subscribeToHistory(collaboratorId, callback) {
  const q = query(
    collection(db, 'history'),
    where('collaboratorId', '==', collaboratorId),
    orderBy('savedAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}
