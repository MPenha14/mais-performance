import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatScore, getInitials } from '@/utils/formatters'
import { getPerformanceLevel } from '@/utils/scoreCalculator'

export function CollaboratorTable({ collaborators, onEdit, onDelete }) {
  if (collaborators.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
        <User size={40} strokeWidth={1} />
        <p>Nenhum colaborador cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wide">
            <th className="pb-3 pr-4">Colaborador</th>
            <th className="pb-3 pr-4">Unidade</th>
            <th className="pb-3 pr-4 text-right">Vendas</th>
            <th className="pb-3 pr-4 text-right">Agend.</th>
            <th className="pb-3 pr-4 text-right">Cancel.</th>
            <th className="pb-3 pr-4 text-center">Score</th>
            <th className="pb-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {collaborators.map((c, i) => {
              const level = getPerformanceLevel(c.score)
              return (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {c.foto ? (
                        <img src={c.foto} alt={c.nome} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(c.nome)}
                        </div>
                      )}
                      <span className="font-medium text-white">{c.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{c.unidade}</td>
                  <td className="py-3 pr-4 text-right text-slate-200">{formatCurrency(c.valorVendido)}</td>
                  <td className="py-3 pr-4 text-right text-slate-200">{c.agendamentos}</td>
                  <td className="py-3 pr-4 text-right text-slate-200">{c.cancelamentos}</td>
                  <td className="py-3 pr-4 text-center">
                    <Badge variant={level}>{formatScore(c.score)}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(c)} className="p-1.5">
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(c)} className="p-1.5">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
