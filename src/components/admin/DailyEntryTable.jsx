import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency, getInitials } from '@/utils/formatters'
import { formatDateKeyBR } from '@/utils/dateRange'

export function DailyEntryTable({ entries, collaborators, onEdit, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
        <Calendar size={40} strokeWidth={1} />
        <p>Nenhum lançamento ainda neste período.</p>
        <p className="text-xs">Clique em "+ Novo lançamento" para começar.</p>
      </div>
    )
  }

  const collaboratorById = Object.fromEntries(collaborators.map(c => [c.id, c]))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wide">
            <th className="pb-3 pr-4">Data</th>
            <th className="pb-3 pr-4">Colaborador</th>
            <th className="pb-3 pr-4 text-right">Vendas</th>
            <th className="pb-3 pr-4 text-right">Agend.</th>
            <th className="pb-3 pr-4 text-right">Cancel.</th>
            <th className="pb-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {entries.map((e, i) => {
              const c = collaboratorById[e.collaboratorId]
              return (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="py-3 pr-4 text-slate-300 tabular-nums">{formatDateKeyBR(e.dateKey)}</td>
                  <td className="py-3 pr-4">
                    {c ? (
                      <div className="flex items-center gap-2.5">
                        {c.foto ? (
                          <img src={c.foto} alt={c.nome} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white">
                            {getInitials(c.nome)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{c.nome}</p>
                          <p className="text-[10px] text-slate-500">{c.unidade}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">— removido —</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-200">{formatCurrency(e.valorVendido)}</td>
                  <td className="py-3 pr-4 text-right text-slate-200">{e.agendamentos}</td>
                  <td className="py-3 pr-4 text-right text-slate-200">{e.cancelamentos}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(e)} className="p-1.5">
                        <Edit2 size={13} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(e)} className="p-1.5">
                        <Trash2 size={13} />
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
