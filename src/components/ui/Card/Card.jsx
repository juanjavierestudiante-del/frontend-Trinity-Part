const VARIANTS = {
  glass:
    'border-white/30 bg-gradient-to-br from-white/30 via-white/15 to-white/10 shadow-brand backdrop-blur-xl',
  solid: 'bg-surface border-gray-200 shadow-sm',
}

export default function Card({ children, className = '', hover = true, variant = 'glass', padding = true }) {
  return (
    <div className={`${VARIANTS[variant]} ${padding ? 'p-4' : ''} border rounded-card ${hover ? 'hover:shadow-brand-lg transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  )
}