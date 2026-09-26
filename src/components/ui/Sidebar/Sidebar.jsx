export default function Sidebar({ children, className = '', open = false, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {onClose && (
        <div
          className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Navegación de administración"
        className={`
          fixed inset-y-0 left-0 z-40 flex min-h-screen w-72 max-w-[calc(100vw-2rem)] flex-col overflow-y-auto overscroll-contain
          bg-ink border-r border-gray-700
          transform transition-transform duration-200 ease-in-out
          lg:sticky lg:top-0 lg:transform-none lg:transition-none
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        {children}
      </aside>
    </>
  )
}
