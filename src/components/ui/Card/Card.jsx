const VARIANTS = {
  default:
    'border-white/45 bg-gradient-to-br from-primary-light/80 via-primary-light/65 to-secondary/10 shadow-sm backdrop-blur-lg',
  glass:
    'border-white/35 bg-gradient-to-br from-primary-light/60 via-primary-light/45 to-secondary/10 shadow-brand backdrop-blur-xl',
  solid: 'bg-surface border-gray-200 shadow-sm',
  elevated:
    'border-white/55 bg-gradient-to-br from-primary-light/85 via-primary-light/70 to-secondary/15 shadow-[0_14px_36px_-22px_rgba(91,31,184,0.45)] backdrop-blur-xl',
  interactive:
    'border-white/50 bg-gradient-to-br from-primary-light/75 via-primary-light/60 to-secondary/10 shadow-brand backdrop-blur-xl',
  highlight:
    'border-white/50 bg-gradient-to-br from-primary-light/80 via-primary-light/60 to-secondary/15 shadow-brand backdrop-blur-xl',
  subtle:
    'border-white/30 bg-gradient-to-br from-primary-light/45 via-primary-light/30 to-secondary/5 shadow-sm backdrop-blur-lg',
  admin: 'border-gray-700 bg-gray-800 text-gray-100 shadow-sm',
  metric:
    'border-primary/15 bg-primary-light/70 text-ink shadow-sm backdrop-blur-lg',
  danger: 'border-red-300/60 bg-red-50/90 shadow-sm',
  warning: 'border-amber-300/60 bg-amber-50/90 shadow-sm',
}

const PADDING = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const ACCENTS = {
  brand: 'bg-gradient-to-r from-primary via-secondary to-primary-light',
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  danger: 'bg-red-500',
}

/**
 * @param {{
 *   as?: any,
 *   children?: import('react').ReactNode,
 *   className?: string,
 *   hover?: boolean,
 *   interactive?: boolean,
 *   variant?: keyof typeof VARIANTS,
 *   padding?: boolean | keyof typeof PADDING,
 *   accent?: keyof typeof ACCENTS,
 *   [key: string]: any
 * }} props
 */
export default function Card({
  as: Component = 'div',
  children,
  className = '',
  hover = false,
  interactive = false,
  variant = 'glass',
  padding = true,
  accent = undefined,
  ...props
}) {
  const paddingKey = typeof padding === 'boolean' ? (padding ? 'md' : 'none') : padding
  const isInteractive = interactive || variant === 'interactive' || hover
  const resolvedAccent = accent || (variant === 'highlight' ? 'brand' : null)

  return (
    <Component
      className={`relative border rounded-card ${VARIANTS[variant] || VARIANTS.default} ${PADDING[paddingKey] ?? PADDING.md} ${isInteractive ? 'transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:shadow-brand-lg' : ''} ${className}`}
      {...props}
    >
      {resolvedAccent && (
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 z-10 h-1 ${ACCENTS[resolvedAccent] || ACCENTS.brand}`}
        />
      )}
      {children}
    </Component>
  )
}
