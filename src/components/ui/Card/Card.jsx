export default function Card(props) {
  const { children, className = '', hover = true } = props
  return (
    <div className={`bg-white border border-gray-200 rounded-card p-4 shadow-sm ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}
