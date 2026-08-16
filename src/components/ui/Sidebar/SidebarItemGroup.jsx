export default function SidebarItemGroup({ children, className = '' }) {
  return <div className={`flex flex-col gap-1 px-3 py-2 ${className}`}>{children}</div>
}
