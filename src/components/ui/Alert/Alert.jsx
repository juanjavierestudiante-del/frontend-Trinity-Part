import { Loader } from 'lucide-react'

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
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-4 ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {CustomIcon ? (
        <span className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`}>{CustomIcon}</span>
      ) : null}
      <div className="flex-1 text-sm">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`ml-auto shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100 ${config.text}`}
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  )
}
