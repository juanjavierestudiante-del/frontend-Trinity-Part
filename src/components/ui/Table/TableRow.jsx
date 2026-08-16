export default function TableRow({ children, className = '', dark = false, hoverable = false }) {
  return (
    <tr
      className={`${
        dark ? 'bg-gray-800' : 'bg-white'
      } ${
        hoverable
          ? dark
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-50'
          : ''
      } ${className}`}
    >
      {children}
    </tr>
  )
}
