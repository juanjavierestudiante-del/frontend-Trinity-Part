export default function SidebarItems({ children, className = '' }) {
  return <div className={`flex flex-col flex-1 ${className}`}>{children}</div>
}
