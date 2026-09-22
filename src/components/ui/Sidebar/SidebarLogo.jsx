export default function SidebarLogo(props) {
  const { as: Component = 'a', href, to, img, imgAlt, children, ...rest } = props

  return (
    <Component
      {...(href ? { href } : {})}
      {...(to ? { to } : {})}
      {...rest}
      className="flex items-center gap-3 px-4 py-4 border-b border-gray-700"
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
