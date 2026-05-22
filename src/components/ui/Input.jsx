export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <input
        className={`
          w-full px-3 py-2.5 rounded-lg bg-white/5 border text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all
          ${error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <select
        className={`
          w-full px-3 py-2.5 rounded-lg bg-slate-800 border text-white
          focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all
          ${error ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
