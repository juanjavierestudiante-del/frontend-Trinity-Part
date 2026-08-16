const SIZE_MAP = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const TEXT_SIZE_MAP = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base',
}

export default function Loader(props) {
  const {
    size = 'lg',
    text = 'Cargando...',
    className = '',
    showText = true,
  } = props

  const sz = SIZE_MAP[size] || SIZE_MAP.lg
  const txtSz = TEXT_SIZE_MAP[size] || TEXT_SIZE_MAP.lg

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg
        className={`${sz} animate-spin text-primary`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      {showText && text && (
        <p className={`${txtSz} font-medium text-gray-500 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )
}
