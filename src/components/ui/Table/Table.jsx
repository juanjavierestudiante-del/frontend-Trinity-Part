import Card from '../Card/Card'

export default function Table({ children, hoverable = false, className = '', dark = false, ariaLabel = undefined }) {
  return (
    <Card variant={dark ? 'admin' : 'default'} padding="none" className="overflow-x-auto overscroll-x-contain">
      <table
        aria-label={ariaLabel}
        className={`w-full text-left text-sm ${
          dark ? 'text-gray-300' : 'text-gray-700'
        } ${hoverable ? (dark ? "[&_tbody_tr]:hover:bg-gray-700" : "[&_tbody_tr]:hover:bg-gray-50") : ""} ${className}`}
      >
        {children}
      </table>
    </Card>
  )
}
