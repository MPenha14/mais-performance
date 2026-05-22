import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
