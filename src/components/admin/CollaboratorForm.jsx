import { useState, useEffect } from 'react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const EMPTY = {
  nome: '', foto: '', unidade: '',
  presenca: '', notaProva: '', comportamento: '',
}

export function CollaboratorForm({ initial, units, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        nome: initial.nome ?? '',
        foto: initial.foto ?? '',
        unidade: initial.unidade ?? '',
        presenca: initial.presenca ?? '',
        notaProva: initial.notaProva ?? '',
        comportamento: initial.comportamento ?? '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial])

  const set = (key, value) => {
    setForm(p => ({ ...p, [key]: value }))
    setErrors(p => ({ ...p, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Nome obrigatório'
    if (!form.unidade) e.unidade = 'Unidade obrigatória'
    const scoreFields = ['presenca', 'notaProva', 'comportamento']
    scoreFields.forEach(f => {
      const v = Number(form[f])
      if (form[f] !== '' && (isNaN(v) || v < 0 || v > 10)) e[f] = 'Valor entre 0 e 10'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      nome: form.nome.trim(),
      foto: form.foto.trim(),
      unidade: form.unidade,
      presenca: Number(form.presenca) || 0,
      notaProva: Number(form.notaProva) || 0,
      comportamento: Number(form.comportamento) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nome *" value={form.nome} onChange={e => set('nome', e.target.value)} error={errors.nome} placeholder="Nome completo" />
        <Input label="Foto (URL)" value={form.foto} onChange={e => set('foto', e.target.value)} placeholder="https://..." />
      </div>

      <Select label="Unidade *" value={form.unidade} onChange={e => set('unidade', e.target.value)} error={errors.unidade}>
        <option value="">Selecione a unidade</option>
        {units.map(u => <option key={u.id ?? u.name} value={u.name}>{u.name}</option>)}
      </Select>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Avaliação Final (0–10)</p>
        <p className="text-xs text-slate-500 mb-3">Notas qualitativas — atualize ao realizar avaliações (geralmente mensal).</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Nota da Prova" type="number" min="0" max="10" step="0.1" value={form.notaProva} onChange={e => set('notaProva', e.target.value)} error={errors.notaProva} placeholder="0–10" />
          <Input label="Assiduidade / Presença" type="number" min="0" max="10" step="0.1" value={form.presenca} onChange={e => set('presenca', e.target.value)} error={errors.presenca} placeholder="0–10" />
          <Input label="Comportamento" type="number" min="0" max="10" step="0.1" value={form.comportamento} onChange={e => set('comportamento', e.target.value)} error={errors.comportamento} placeholder="0–10" />
        </div>
      </div>

      <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 text-xs text-slate-300">
        💡 <strong>Vendas, agendamentos e cancelamentos</strong> são lançados na aba <strong>"Lançamentos Diários"</strong>.
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? 'Salvar alterações' : 'Adicionar colaborador'}</Button>
      </div>
    </form>
  )
}
