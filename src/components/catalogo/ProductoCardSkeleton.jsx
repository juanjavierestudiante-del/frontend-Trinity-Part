import Card from '../ui/Card/Card'
import Skeleton from '../ui/Skeleton/Skeleton'

export default function ProductoCardSkeleton() {
  return (
    <Card variant="interactive" padding="none" aria-hidden="true" className="overflow-hidden">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="space-y-2 p-3 sm:p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 bg-primary-light/30" />
        <Skeleton className="mt-3 h-5 w-1/2" />
      </div>
    </Card>
  )
}
