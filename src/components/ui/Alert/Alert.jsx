const VARIANTS = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    iconColor: 'text-green-500',
  },
  danger: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  loading: {
    bg: 'bg-primary-light/30',
    text: 'text-primary-dark',
    border: 'border-primary/20',
    iconColor: 'text-primary',
  },
  empty: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    iconColor: 'text-gray-400',
  },
}

export default function Alert(props) {
  const {
    type = 'info',
    children,
    onDismiss,
    icon: CustomIcon,
    className = '',
  } = props

  const config = VARIANTS[type] || VARIANTS.info

  return (
    <div
      role={type === 'danger' || type === 'warning' ? 'alert' : 'status'}
      aria-live={type === 'danger' || type === 'warning' ? 'assertive' : 'polite'}
      className={`flex items-start gap-3 rounded-card border p-4 shadow-sm ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {CustomIcon ? (
        <span className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`}>{CustomIcon}</span>
      ) : null}
      <div className="flex-1 text-sm">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`ml-auto flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${config.text}`}
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  )
}
