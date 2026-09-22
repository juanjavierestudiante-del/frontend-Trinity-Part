export default function SidebarItem(props) {
  const {
    children,
    icon: Icon,
    active = false,
    onClick,
    className = '',
    as: Component = 'button',
    ...rest
  } = props

  return (
    <Component
      {...(Component === 'button' ? { type: 'button' } : {})}
      onClick={onClick}
      {...rest}
      className={`flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        active
          ? 'bg-primary/20 text-primary-light'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      } ${className}`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span className="min-w-0 truncate">{children}</span>
    </Component>
  )
}
