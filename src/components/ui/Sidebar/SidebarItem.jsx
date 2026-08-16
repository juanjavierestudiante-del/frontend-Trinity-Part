export default function SidebarItem(props) {
  const {
    children,
    icon: Icon,
    active = false,
    onClick,
    className = '',
  } = props

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/20 text-primary-light'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      } ${className}`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span>{children}</span>
    </button>
  )
}
