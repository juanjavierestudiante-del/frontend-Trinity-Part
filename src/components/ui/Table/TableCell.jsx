export default function TableCell({ children, className = '', dark = false }) {
  return (
    <td
      className={`px-4 py-3 ${
        dark ? 'text-gray-100' : 'text-gray-900'
      } ${className}`}
    >
      {children}
    </td>
  )
}
