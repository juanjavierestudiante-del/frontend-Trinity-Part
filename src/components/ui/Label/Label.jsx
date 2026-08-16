export default function Label(props) {
  const {
    htmlFor,
    children,
    className = '',
    dark = false,
    required = false,
  } = props

  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium ${
        dark ? 'text-gray-200' : 'text-gray-700'
      } ${className}`}
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  )
}
