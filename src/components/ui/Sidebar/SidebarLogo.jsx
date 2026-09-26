export default function SidebarLogo(props) {
  const { as: Component = 'a', href, to, img, imgAlt, children, ...rest } = props

  return (
    <Component
      {...(href ? { href } : {})}
      {...(to ? { to } : {})}
      {...rest}
      className="flex min-h-16 items-center gap-3 border-b border-gray-700 px-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {img && (
        <img src={img} alt={imgAlt || ''} className="h-8 w-auto" />
      )}
      {children && (
        <span className="text-lg font-bold text-white">{children}</span>
      )}
    </Component>
  )
}
