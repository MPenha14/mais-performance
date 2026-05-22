import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export function subscribeToGoals(callback) {
  return onSnapshot(collection(db, 'goals'), (snap) => {
    const goals = {}
    snap.docs.forEach(d => {
      goals[d.id] = { id: d.id, ...d.data() }
    })
    callback(goals)
  })
}

export async function setUnitGoal(unidade, meta) {
  return setDoc(doc(db, 'goals', unidade), { meta, updatedAt: serverTimestamp() }, { merge: true })
}

export function subscribeToUnits(callback) {
  return onSnapshot(collection(db, 'units'), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export async function setUnit(name) {
  return setDoc(doc(db, 'units', name), { name, createdAt: serverTimestamp() }, { merge: true })
}
