import Loader from '../Loader/Loader'

const VARIANT_CLASSES = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
  light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  gray: 'bg-gray-500 text-white hover:bg-gray-600',
}

const SIZE_CLASSES = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
}

export default function Button(props) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    icon: Icon,
    children,
    ...rest
  } = props

  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md

  const base = `inline-flex items-center justify-center rounded-md font-semibold transition-shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={`${base} ${variantClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader size={size === 'xs' || size === 'sm' ? 'sm' : 'md'} className="mr-2" />
      ) : Icon ? (
        <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  )
}
