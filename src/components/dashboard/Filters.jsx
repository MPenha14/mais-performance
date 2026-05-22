import { getPeriodLabel } from '@/utils/formatters'

const PERIODS = ['day', 'week', 'month']

export function Filters({ filters, onFilter, units }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => onFilter('period', p)}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${filters.period === p
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
          >
            {getPeriodLabel(p)}
          </button>
        ))}
      </div>

      <select
        value={filters.unidade}
        onChange={e => onFilter('unidade', e.target.value)}
        className="bg-slate-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      >
        <option value="all">Todas as unidades</option>
        {units?.map(u => (
          <option key={u.id ?? u.name} value={u.name}>{u.name}</option>
        ))}
      </select>
    </div>
  )
}
