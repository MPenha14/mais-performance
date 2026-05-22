import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const signOutUser = () => signOut(auth)

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)
