import { useId } from 'react'

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
    tone = 'default',
    endAdornment,
    helperText,
    helperTextClassName = '',
    ...rest
  } = props

  const sizeClass = SIZE_CLASSES[sizing] || SIZE_CLASSES.md
  const glassTone = tone === 'glass'
  const labelClass = glassTone
    ? 'text-ink'
    : dark
      ? 'text-gray-200'
      : 'text-gray-700'
  const inputClass = glassTone
    ? 'bg-white/20 border-white/35 text-ink placeholder:text-primary-dark/45 backdrop-blur-md shadow-sm focus:ring-primary/30 focus:border-white/50'
    : dark
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary focus:border-transparent'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary focus:border-transparent'
  const iconClass = glassTone
    ? 'text-primary-dark/70'
    : dark
      ? 'text-gray-400'
      : 'text-gray-400'

  const generatedId = useId()
  const inputId = id || name || generatedId
  const errorId = error ? inputId + "-error" : undefined
  const helperId = helperText ? inputId + "-helper" : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined
  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className={`mb-1 block text-sm font-medium ${labelClass}`}
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <div aria-hidden="true" className={`absolute left-3 top-2.5 ${iconClass}`}>
            {icon}
          </div>
        ) : null}
        <input
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`block w-full rounded-md border px-3 ${sizeClass} focus:outline-none focus:ring-2 ${inputClass} ${icon ? 'pl-10' : ''} ${endAdornment ? 'pr-12' : ''} ${error ? 'border-red-500' : ''}`}
          {...rest}
        />
        {endAdornment ? <div className="absolute right-1 top-1/2 -translate-y-1/2">{endAdornment}</div> : null}
      </div>

      {helperText ? <p id={helperId} className={`mt-1 text-sm text-muted ${helperTextClassName}`}>{helperText}</p> : null}
      {error ? <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  )
}
