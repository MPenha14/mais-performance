import { useEffect, useState } from 'react'
import { subscribeToCollaboratorHistory, subscribeToAllHistory } from '@/services/historyService'

export function useCollaboratorHistory(collaboratorId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!collaboratorId) return
    const unsub = subscribeToCollaboratorHistory(collaboratorId, data => {
      setHistory(data)
      setLoading(false)
    })
    return unsub
  }, [collaboratorId])

  return { history, loading }
}

export function useAllHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToAllHistory(data => {
      setHistory(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { history, loading }
}
