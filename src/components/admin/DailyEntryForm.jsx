import { useState, useEffect } from 'react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toDateKey } from '@/utils/dateRange'

function todayDateKey() {
  return toDateKey(new Date())
}

const EMPTY = {
  collaboratorId: '',
  dateKey: todayDateKey(),
  valorVendido: '',
  agendamentos: '',
  cancelamentos: '',
}

export function DailyEntryForm({ initial, collaborators, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        collaboratorId: initial.collaboratorId ?? '',
        dateKey: initial.dateKey ?? todayDateKey(),
        valorVendido: initial.valorVendido ?? '',
        agendamentos: initial.agendamentos ?? '',
        cancelamentos: initial.cancelamentos ?? '',
      })
    } else {
      setForm({ ...EMPTY })
    }
  }, [initial])

  const set = (key, value) => {
    setForm(p => ({ ...p, [key]: value }))
    setErrors(p => ({ ...p, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.collaboratorId) e.collaboratorId = 'Selecione o colaborador'
    if (!form.dateKey) e.dateKey = 'Data obrigatória'
    const num = ['valorVendido', 'agendamentos', 'cancelamentos']
    num.forEach(f => {
      if (form[f] !== '' && isNaN(Number(form[f]))) e[f] = 'Valor inválido'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const [year, month, day] = form.dateKey.split('-').map(Number)
    onSubmit({
      collaboratorId: form.collaboratorId,
      dateKey: form.dateKey,
      date: new Date(year, month - 1, day),
      valorVendido: Number(form.valorVendido) || 0,
      agendamentos: Number(form.agendamentos) || 0,
      cancelamentos: Number(form.cancelamentos) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Colaborador *"
          value={form.collaboratorId}
          onChange={e => set('collaboratorId', e.target.value)}
          error={errors.collaboratorId}
          disabled={!!initial}
        >
          <option value="">Selecione...</option>
          {collaborators.map(c => (
            <option key={c.id} value={c.id}>{c.nome} — {c.unidade}</option>
          ))}
        </Select>
        <Input
          label="Data *"
          type="date"
          value={form.dateKey}
          onChange={e => set('dateKey', e.target.value)}
          error={errors.dateKey}
          max={todayDateKey()}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Valor Vendido (R$)"
          type="number" min="0" step="0.01"
          value={form.valorVendido}
          onChange={e => set('valorVendido', e.target.value)}
          error={errors.valorVendido}
          placeholder="0,00"
        />
        <Input
          label="Agendamentos"
          type="number" min="0"
          value={form.agendamentos}
          onChange={e => set('agendamentos', e.target.value)}
          error={errors.agendamentos}
          placeholder="0"
        />
        <Input
          label="Cancelamentos"
          type="number" min="0"
          value={form.cancelamentos}
          onChange={e => set('cancelamentos', e.target.value)}
          error={errors.cancelamentos}
          placeholder="0"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Salvar alterações' : 'Lançar'}
        </Button>
      </div>
    </form>
  )
}
