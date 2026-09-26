import Card from '../ui/Card/Card'
import Skeleton from '../ui/Skeleton/Skeleton'

export default function CategoriaCardSkeleton() {
  return (
    <Card variant="interactive" padding="none" aria-hidden="true" className="overflow-hidden">
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="flex justify-center p-4">
        <Skeleton className="h-5 w-3/5" />
      </div>
    </Card>
  )
}
