import { AnimatePresence, motion } from 'framer-motion'
import { RankingCard } from './RankingCard'
import { Users } from 'lucide-react'

export function RankingList({ collaborators, previousPositions = {} }) {
  if (collaborators.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4 py-16 text-slate-500"
      >
        <Users size={48} strokeWidth={1} />
        <p className="text-lg">Nenhum colaborador encontrado</p>
        <p className="text-sm">Adicione colaboradores no painel admin</p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {collaborators.map((c, i) => (
          <RankingCard
            key={c.id}
            collaborator={c}
            index={i}
            previousPosition={previousPositions[c.id]}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
