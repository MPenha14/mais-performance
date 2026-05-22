import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useCollaborators } from '@/hooks/useCollaborators'
import { getPerformanceColor, getMedalConfig } from '@/utils/scoreCalculator'
import { formatCurrency, formatScore, getInitials } from '@/utils/formatters'

const AUTO_FULLSCREEN = true
const SLIDE_INTERVAL = 8000

function TVCard({ collaborator, rank }) {
  const medal = getMedalConfig(rank)
  const perf = getPerformanceColor(collaborator.score)

  return (
    <motion.div
      layout
      key={collaborator.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`
        relative flex items-center gap-5 px-6 py-4 rounded-2xl border
        ${medal ? `${medal.bg} ${medal.border} shadow-xl ${medal.glow}` : 'bg-white/5 border-white/10'}
      `}
    >
      {/* Rank */}
      <div className="shrink-0 w-12 text-center">
        {medal ? (
          <span className="text-4xl">{medal.emoji}</span>
        ) : (
          <span className="text-2xl font-black text-slate-500">{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="shrink-0">
        {collaborator.foto ? (
          <img src={collaborator.foto} alt={collaborator.nome}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/10" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xl font-black text-white ring-4 ring-white/10">
            {getInitials(collaborator.nome)}
          </div>
        )}
      </div>

      {/* Name + Unit */}
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-white truncate">{collaborator.nome}</p>
        <p className="text-sm text-slate-400 mt-0.5">{collaborator.unidade}</p>
      </div>

      {/* Stats */}
      <div className="hidden md:flex gap-8 text-center shrink-0">
        <div>
          <p className="text-xl font-black text-white">{formatCurrency(collaborator.valorVendido)}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Vendas</p>
        </div>
        <div>
          <p className="text-xl font-black text-white">{collaborator.agendamentos}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Agend.</p>
        </div>
      </div>

      {/* Score */}
      <div className={`shrink-0 px-5 py-3 rounded-xl border ${perf.bg} ${perf.border}`}>
        <p className={`text-3xl font-black ${perf.text}`}>{formatScore(collaborator.score)}</p>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest text-center">pts</p>
      </div>
    </motion.div>
  )
}

export default function TVMode() {
  const { collaborators, loading } = useCollaborators({ period: 'month', unidade: 'all' })
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 5

  const pages = Math.ceil(collaborators.length / PAGE_SIZE)
  const currentCollabs = collaborators.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  useEffect(() => {
    if (AUTO_FULLSCREEN && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (pages <= 1) return
    const interval = setInterval(() => {
      setPage(p => (p + 1) % pages)
    }, SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [pages])

  const now = new Date()
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1c1917_0%,_#0f172a_60%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Trophy size={24} className="text-brand-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">MAIS PERFORMANCE</p>
            <p className="text-xs text-slate-500 italic">
              "Resultado não é sorte. É disciplina, constância e foco."
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white tabular-nums">{timeStr}</p>
          <p className="text-sm text-slate-400 capitalize">{dateStr}</p>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col px-10 py-6 gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-0.5 bg-brand-500 rounded-full" />
            Ranking do Mês
          </h2>
          {pages > 1 && (
            <div className="flex gap-1.5">
              {[...Array(pages)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-brand-400 w-5' : 'bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              {currentCollabs.map((c, i) => (
                <TVCard key={c.id} collaborator={c} rank={c.position} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer ticker */}
      {collaborators.length > 0 && (
        <footer className="relative z-10 border-t border-white/10 overflow-hidden h-10 flex items-center bg-brand-500/10">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-8 whitespace-nowrap text-sm text-brand-300 px-4"
          >
            {[...collaborators, ...collaborators].map((c, i) => (
              <span key={`${c.id}-${i}`} className="flex items-center gap-2">
                <span className="font-bold">{c.nome}</span>
                <span className="text-brand-500">•</span>
                <span>{formatScore(c.score)} pts</span>
                <span className="mx-3 text-white/10">|</span>
              </span>
            ))}
          </motion.div>
        </footer>
      )}
    </div>
  )
}
