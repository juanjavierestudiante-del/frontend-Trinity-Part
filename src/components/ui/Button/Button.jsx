import Loader from '../Loader/Loader'

const VARIANT_CLASSES = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
  glass: 'border border-white/35 bg-white/20 text-primary-dark hover:bg-white/30 backdrop-blur-md',
  light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  gray: 'bg-gray-500 text-white hover:bg-gray-600',
}

const SIZE_CLASSES = {
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  'icon-sm': 'h-9 w-9 p-0',
  icon: 'h-10 w-10 p-0',
  'icon-lg': 'h-11 w-11 p-0',
}

export default function Button(props) {
  const {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    pill = false,
    type = 'button',
    onClick,
    className = '',
    icon: Icon,
    children,
    ...rest
  } = props

  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md
  const radiusClass = pill ? 'rounded-full' : 'rounded-md'

  const isNativeButton = Component === 'button'
  const isDisabled = disabled || loading
  const base = `inline-flex min-w-0 max-w-full shrink-0 touch-manipulation items-center justify-center gap-2 border border-transparent text-center font-semibold leading-none whitespace-nowrap transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${radiusClass} ${sizeClass}`

  const handleClick = (event) => {
    if (isDisabled && !isNativeButton) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  return (
    <Component
      {...(isNativeButton ? { type } : {})}
      onClick={handleClick}
      {...(isNativeButton ? { disabled: isDisabled } : {})}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...(!isNativeButton && isDisabled ? { tabIndex: -1 } : {})}
      className={`${base} ${variantClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader size={size === 'xs' || size === 'sm' ? 'sm' : 'md'} className="shrink-0" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </Component>
  )
}
