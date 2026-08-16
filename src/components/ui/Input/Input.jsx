const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
}

export default function Input(props) {
  const {
    label,
    error,
    placeholder,
    type = 'text',
    value,
    name,
    id,
    onChange,
    required = false,
    className = '',
    icon,
    sizing = 'md',
    dark = false,
    ...rest
  } = props

  const sizeClass = SIZE_CLASSES[sizing] || SIZE_CLASSES.md

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label
          htmlFor={id || name}
          className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-700'}`}
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <div className={`absolute left-3 top-2.5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            {icon}
          </div>
        ) : null}
        <input
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          aria-invalid={!!error}
          className={`block w-full rounded-md border px-3 ${sizeClass} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            dark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
          {...rest}
        />
      </div>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
