import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Trophy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function Login() {
  const { user, loading, authLoading, authError, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_60%)]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-400 rounded-full opacity-20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Trophy size={32} className="text-brand-400" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white">Mais Performance</h1>
              <p className="text-sm text-slate-400 mt-1">Ranking de Colaboradores</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@empresa.com"
              autoComplete="email"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {authError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center"
              >
                {authError}
              </motion.p>
            )}

            <Button type="submit" loading={authLoading} size="lg" className="mt-2 w-full justify-center">
              <LogIn size={18} />
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Acesso restrito a administradores
          </p>
        </div>
      </motion.div>
    </div>
  )
}
