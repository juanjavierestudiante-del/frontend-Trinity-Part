export default function TableBody({ children, className = '', dark = false }) {
  return (
    <tbody
      className={`divide-y ${
        dark ? 'divide-gray-700' : 'divide-gray-200'
      } ${className}`}
    >
      {children}
    </tbody>
  )
}
