import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40',
  ghost: 'hover:bg-white/10 text-slate-400 hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
