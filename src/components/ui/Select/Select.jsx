const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
}

export default function Select(props) {
  const {
    name,
    id,
    label,
    options = [],
    value,
    onChange,
    error,
    className = '',
    sizing = 'md',
    dark = false,
    children,
    ...rest
  } = props

  const sizeClass = SIZE_CLASSES[sizing] || SIZE_CLASSES.md

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label
          htmlFor={id || name}
          className={`block mb-1 text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}
        >
          {label}
        </label>
      ) : null}

      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-md border px-3 ${sizeClass} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          dark
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        } ${error ? 'border-red-500' : ''}`}
        {...rest}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
      </select>

      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  )
}
