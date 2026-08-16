export default function Table({ children, hoverable = false, className = '', dark = false }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full text-left text-sm ${
          dark ? 'text-gray-300' : 'text-gray-700'
        } ${className}`}
      >
        {children}
      </table>
    </div>
  )
}
