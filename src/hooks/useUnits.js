import { useEffect, useState } from 'react'
import { subscribeToUnits, setUnit } from '@/services/goalService'
import toast from 'react-hot-toast'

export function useUnits() {
  const [units, setUnits] = useState([])

  useEffect(() => {
    const unsub = subscribeToUnits(setUnits)
    return unsub
  }, [])

  const addUnit = async (name) => {
    await setUnit(name)
    toast.success(`Unidade "${name}" adicionada!`)
  }

  return { units, addUnit }
}
