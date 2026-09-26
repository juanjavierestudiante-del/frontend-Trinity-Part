export default function SidebarItems({ children, className = '' }) {
  return <div className={`flex min-h-0 flex-1 flex-col ${className}`}>{children}</div>
}
