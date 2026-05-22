export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-slate-300',
    high: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low: 'bg-red-500/20 text-red-400 border border-red-500/30',
    gold: 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40',
    orange: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
