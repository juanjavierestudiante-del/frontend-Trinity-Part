const VARIANTS = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  failure: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  primary: 'bg-primary-light text-primary-dark',
  gray: 'bg-gray-100 text-gray-800',
  indigo: 'bg-indigo-100 text-indigo-800',
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}

export default function Badge(props) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
  } = props

  const cls = VARIANTS[variant] || VARIANTS.primary
  const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeCls} ${cls} ${className}`}>
      {children}
    </span>
  )
}
