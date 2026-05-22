import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Target, Users, ArrowLeft, Trash2, Archive, Calendar } from 'lucide-react'
import { useCollaborators } from '@/hooks/useCollaborators'
import { useFilters } from '@/hooks/useFilters'
import { useUnits } from '@/hooks/useUnits'
import { useEntries } from '@/hooks/useEntries'
import { CollaboratorTable } from '@/components/admin/CollaboratorTable'
import { CollaboratorForm } from '@/components/admin/CollaboratorForm'
import { UnitGoalForm } from '@/components/admin/UnitGoalForm'
import { DailyEntryForm } from '@/components/admin/DailyEntryForm'
import { DailyEntryTable } from '@/components/admin/DailyEntryTable'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { saveMonthSnapshot } from '@/services/historyService'
import { getCurrentMonthKey, getPreviousMonthKey, formatMonthKey } from '@/utils/advancedMetrics'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'entries', label: 'Lançamentos Diários', icon: Calendar },
  { id: 'collaborators', label: 'Colaboradores', icon: Users },
  { id: 'goals', label: 'Metas / Unidades', icon: Target },
]

export default function Admin() {
  const [tab, setTab] = useState('entries')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCollaborator, setEditingCollaborator] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [snapshotModal, setSnapshotModal] = useState(null)
  const [snapshotLoading, setSnapshotLoading] = useState(false)

  // Lançamentos
  const [entryFormOpen, setEntryFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [confirmDeleteEntry, setConfirmDeleteEntry] = useState(null)
  const [entryLoading, setEntryLoading] = useState(false)
  const [entryPeriod, setEntryPeriod] = useState('month')

  const { filters, setFilter } = useFilters()
  const { collaborators, rawCollaborators, goals, loading, create, update, remove } = useCollaborators(filters)
  const { units } = useUnits()
  const { entries, range, add: addEntry, edit: editEntry, remove: removeEntry } = useEntries(entryPeriod)

  const handleSnapshot = async (which) => {
    const monthKey = which === 'previous' ? getPreviousMonthKey() : getCurrentMonthKey()
    const goalsMap = Object.fromEntries(Object.entries(goals).map(([k, v]) => [k, v.meta ?? 0]))
    setSnapshotLoading(true)
    try {
      const count = await saveMonthSnapshot(monthKey, collaborators, goalsMap)
      toast.success(`Snapshot de ${formatMonthKey(monthKey)} salvo (${count} colaboradores)`)
      setSnapshotModal(null)
    } catch (e) {
      toast.error('Erro ao salvar snapshot')
    } finally {
      setSnapshotLoading(false)
    }
  }

  const handleOpenNew = () => {
    setEditingCollaborator(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (c) => {
    setEditingCollaborator(c)
    setFormOpen(true)
  }

  const handleEntrySubmit = async (data) => {
    setEntryLoading(true)
    try {
      if (editingEntry) await editEntry(editingEntry.id, data)
      else await addEntry(data)
      setEntryFormOpen(false)
      setEditingEntry(null)
    } catch {
      toast.error('Erro ao salvar lançamento')
    } finally {
      setEntryLoading(false)
    }
  }

  const handleDeleteEntryConfirm = async () => {
    if (!confirmDeleteEntry) return
    await removeEntry(confirmDeleteEntry.id)
    setConfirmDeleteEntry(null)
  }

  const handleSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (editingCollaborator) await update(editingCollaborator.id, data)
      else await create(data)
      setFormOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    await remove(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#0f172a_60%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} /> Ranking
              </Button>
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <h1 className="font-bold text-white">Painel Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSnapshotModal('previous')}>
              <Archive size={15} />
              <span className="hidden sm:inline">Fechar Mês</span>
            </Button>
            {tab === 'collaborators' && (
              <Button onClick={handleOpenNew}>
                <Plus size={16} /> <span className="hidden sm:inline">Novo colaborador</span>
              </Button>
            )}
            {tab === 'entries' && (
              <Button onClick={() => { setEditingEntry(null); setEntryFormOpen(true) }}>
                <Plus size={16} /> <span className="hidden sm:inline">Novo lançamento</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === t.id ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-white/10 rounded-2xl p-6"
        >
          {tab === 'collaborators' && (
            loading ? (
              <p className="text-slate-500 text-center py-8">Carregando...</p>
            ) : (
              <CollaboratorTable
                collaborators={collaborators}
                onEdit={handleOpenEdit}
                onDelete={(c) => setConfirmDelete(c)}
              />
            )
          )}

          {tab === 'goals' && (
            <UnitGoalForm units={units} goals={goals} />
          )}

          {tab === 'entries' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {['day', 'week', 'month'].map(p => (
                    <button
                      key={p}
                      onClick={() => setEntryPeriod(p)}
                      className={`px-4 py-1.5 text-xs font-medium transition-colors
                        ${entryPeriod === p ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                      {p === 'day' ? 'Hoje' : p === 'week' ? 'Últimos 7d' : 'Este mês'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  {entries.length} lançamento(s) · {range.fromDateKey} → {range.toDateKey}
                </p>
              </div>
              <DailyEntryTable
                entries={entries}
                collaborators={rawCollaborators}
                onEdit={(e) => { setEditingEntry(e); setEntryFormOpen(true) }}
                onDelete={(e) => setConfirmDeleteEntry(e)}
              />
            </div>
          )}
        </motion.div>
      </main>

      {/* Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}
        size="lg"
      >
        <CollaboratorForm
          initial={editingCollaborator}
          units={units}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-slate-300">
            Tem certeza que deseja remover <strong className="text-white">{confirmDelete?.nome}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              <Trash2 size={15} /> Excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Entry Form Modal */}
      <Modal
        open={entryFormOpen}
        onClose={() => { setEntryFormOpen(false); setEditingEntry(null) }}
        title={editingEntry ? 'Editar Lançamento' : 'Novo Lançamento Diário'}
        size="md"
      >
        <DailyEntryForm
          initial={editingEntry}
          collaborators={rawCollaborators}
          onSubmit={handleEntrySubmit}
          onCancel={() => { setEntryFormOpen(false); setEditingEntry(null) }}
          loading={entryLoading}
        />
      </Modal>

      {/* Delete Entry Modal */}
      <Modal open={!!confirmDeleteEntry} onClose={() => setConfirmDeleteEntry(null)} title="Excluir lançamento" size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-slate-300 text-sm">
            Excluir o lançamento do dia <strong className="text-white">{confirmDeleteEntry?.dateKey}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmDeleteEntry(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDeleteEntryConfirm}>
              <Trash2 size={15} /> Excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Snapshot Modal */}
      <Modal open={!!snapshotModal} onClose={() => setSnapshotModal(null)} title="Salvar Snapshot do Mês" size="md">
        <div className="flex flex-col gap-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Salva um <strong className="text-white">registro permanente</strong> da performance atual de todos os colaboradores para um mês específico. Esses dados são usados nos gráficos de evolução e nas conquistas.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSnapshotModal('previous')}
              className={`p-4 rounded-xl border text-left transition-all ${snapshotModal === 'previous' ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'}`}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wide">Mês anterior</p>
              <p className="text-lg font-bold text-white mt-1">{formatMonthKey(getPreviousMonthKey())}</p>
              <p className="text-xs text-slate-400 mt-1">Recomendado no fim/início do mês</p>
            </button>
            <button
              onClick={() => setSnapshotModal('current')}
              className={`p-4 rounded-xl border text-left transition-all ${snapshotModal === 'current' ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'}`}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wide">Mês atual</p>
              <p className="text-lg font-bold text-white mt-1">{formatMonthKey(getCurrentMonthKey())}</p>
              <p className="text-xs text-slate-400 mt-1">Atualiza se já existir</p>
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <Button variant="ghost" onClick={() => setSnapshotModal(null)}>Cancelar</Button>
            <Button onClick={() => handleSnapshot(snapshotModal)} loading={snapshotLoading}>
              <Archive size={15} /> Salvar Snapshot
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
