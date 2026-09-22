export default function Textarea(props) {
  const {
    label,
    error,
    placeholder,
    rows = 4,
    value,
    name,
    id,
    onChange,
    required = false,
    className = '',
    dark = false,
    ...rest
  } = props

  const textareaId = id || name
  const errorId = error && textareaId ? `${textareaId}-error` : undefined

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          dark
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        } ${error ? 'border-red-500' : ''}`}
        {...rest}
      />
      {error && <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
