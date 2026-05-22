import { useAuthContext } from '@/contexts/AuthContext'
import { signIn, signOutUser } from '@/services/authService'
import { useState } from 'react'

export function useAuth() {
  const { user, loading } = useAuthContext()
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const login = async (email, password) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      await signIn(email, password)
    } catch (err) {
      const messages = {
        'auth/invalid-credential': 'Credenciais inválidas.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      }
      setAuthError(messages[err.code] ?? 'Erro ao fazer login.')
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => signOutUser()

  return { user, loading, authLoading, authError, login, logout }
}
