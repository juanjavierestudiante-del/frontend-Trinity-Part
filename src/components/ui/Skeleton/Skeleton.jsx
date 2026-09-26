export default function Skeleton({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded bg-primary-light/35 ${className}`}
    />
  )
}
