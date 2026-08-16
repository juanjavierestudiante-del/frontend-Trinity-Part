export default function TableHeadCell({ children, className = '' }) {
  return (
    <th scope="col" className={`px-4 py-3 font-medium ${className}`}>
      {children}
    </th>
  )
}
