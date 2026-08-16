export default function Sidebar({ children, className = '' }) {
  return (
    <aside
      className={`flex flex-col w-64 min-h-screen bg-ink border-r border-gray-700 ${className}`}
    >
      {children}
    </aside>
  )
}
