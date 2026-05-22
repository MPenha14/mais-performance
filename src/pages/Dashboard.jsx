import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, Maximize2, Trophy, RefreshCw, Building2 } from 'lucide-react'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useFilters } from '@/hooks/useFilters'
import { useUnits } from '@/hooks/useUnits'
import { useAuth } from '@/hooks/useAuth'
import { TopThree } from '@/components/dashboard/TopThree'
import { RankingList } from '@/components/dashboard/RankingList'
import { StatsPanel } from '@/components/dashboard/StatsPanel'
import { Filters } from '@/components/dashboard/Filters'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { Button } from '@/components/ui/Button'

export default function Dashboard() {
  const { logout } = useAuth()
  const { filters, setFilter } = useFilters()
  const { collaborators, goals, loading } = useCollaborators(filters)
  const { units } = useUnits()
  const [previousPositions, setPreviousPositions] = useState({})
  const prevRef = useRef({})

  useEffect(() => {
    if (collaborators.length > 0) {
      const snap = {}
      collaborators.forEach(c => { snap[c.id] = c.position })
      setPreviousPositions(prevRef.current)
      prevRef.current = snap
    }
  }, [collaborators.map(c => c.id + c.position).join(',')])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }

  const top3 = collaborators.slice(0, 3)
  const rest = collaborators.slice(3)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1c1917_0%,_#0f172a_50%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Trophy size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="font-black text-white text-sm leading-tight">MAIS PERFORMANCE</p>
              <p className="text-[10px] text-slate-500 italic leading-tight hidden sm:block">
                "Resultado não é sorte. É disciplina, constância e foco."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/unidades">
              <Button variant="ghost" size="sm">
                <Building2 size={16} />
                <span className="hidden md:inline">Unidades</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleFullscreen}>
              <Maximize2 size={16} />
              <span className="hidden md:inline">TV</span>
            </Button>
            <Link to="/admin">
              <Button variant="secondary" size="sm">
                <Settings size={16} />
                <span className="hidden md:inline">Admin</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Motivational Quote — mobile */}
        <p className="sm:hidden text-xs text-slate-500 italic text-center">
          "Resultado não é sorte. É disciplina, constância e foco."
        </p>

        {/* Filters */}
        <Filters filters={filters} onFilter={setFilter} units={units} />

        {/* Alerts */}
        <AlertBanner collaborators={collaborators} goals={goals} />

        {/* Stats */}
        {!loading && <StatsPanel collaborators={collaborators} goals={goals} />}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-slate-500">
            <RefreshCw size={32} className="animate-spin" />
            <p>Carregando ranking...</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <section>
                <SectionTitle>Pódio</SectionTitle>
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
                  <TopThree collaborators={top3} />
                </div>
              </section>
            )}

            {/* Full Ranking */}
            <section>
              <SectionTitle>Ranking Completo</SectionTitle>
              <RankingList collaborators={collaborators} previousPositions={previousPositions} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-4 h-0.5 bg-brand-500 rounded-full" />
      {children}
    </h2>
  )
}
