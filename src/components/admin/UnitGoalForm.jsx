import { useState } from 'react'
import { Target, Plus } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { setUnitGoal, setUnit } from '@/services/goalService'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

export function UnitGoalForm({ units, goals }) {
  const [newUnit, setNewUnit] = useState('')
  const [goalInputs, setGoalInputs] = useState({})
  const [saving, setSaving] = useState({})

  const handleSaveGoal = async (unitName) => {
    const value = Number(goalInputs[unitName])
    if (!value || value <= 0) return toast.error('Informe um valor válido')
    setSaving(p => ({ ...p, [unitName]: true }))
    await setUnitGoal(unitName, value)
    setSaving(p => ({ ...p, [unitName]: false }))
    toast.success(`Meta de ${unitName} atualizada!`)
  }

  const handleAddUnit = async () => {
    if (!newUnit.trim()) return
    await setUnit(newUnit.trim())
    setNewUnit('')
    toast.success(`Unidade "${newUnit.trim()}" adicionada!`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add Unit */}
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-3">Nova Unidade</p>
        <div className="flex gap-2">
          <Input
            value={newUnit}
            onChange={e => setNewUnit(e.target.value)}
            placeholder="Ex: Unidade Centro"
            onKeyDown={e => e.key === 'Enter' && handleAddUnit()}
          />
          <Button onClick={handleAddUnit} variant="secondary">
            <Plus size={16} /> Adicionar
          </Button>
        </div>
      </div>

      {/* Unit Goals */}
      {units.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">Metas por Unidade</p>
          <div className="flex flex-col gap-3">
            {units.map(u => (
              <div key={u.id ?? u.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Target size={16} className="text-brand-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  <p className="text-xs text-slate-500">
                    Meta atual: {goals?.[u.name]?.meta ? formatCurrency(goals[u.name].meta) : 'Não definida'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="R$ meta"
                    value={goalInputs[u.name] ?? ''}
                    onChange={e => setGoalInputs(p => ({ ...p, [u.name]: e.target.value }))}
                    className="w-36"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveGoal(u.name)}
                    loading={saving[u.name]}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
