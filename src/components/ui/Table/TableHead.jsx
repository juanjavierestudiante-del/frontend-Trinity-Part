export default function TableHead({ children, className = '', dark = false }) {
  return (
    <thead
      className={`text-xs uppercase ${
        dark
          ? 'bg-gray-800 text-gray-400'
          : 'bg-gray-50 text-gray-500'
      } ${className}`}
    >
      {children}
    </thead>
  )
}
