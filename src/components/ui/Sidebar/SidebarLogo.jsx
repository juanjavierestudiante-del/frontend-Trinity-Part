export default function SidebarLogo(props) {
  const { href, img, imgAlt, children } = props

  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-4 border-b border-gray-700"
    >
      {img && (
        <img src={img} alt={imgAlt || ''} className="h-8 w-auto" />
      )}
      {children && (
        <span className="text-lg font-bold text-white">{children}</span>
      )}
    </a>
  )
}
