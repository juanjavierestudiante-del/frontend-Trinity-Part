import { HiShoppingBag, HiCube, HiExclamation } from 'react-icons/hi'
import { useAuthStore } from '../../store/auth.store'
import Card from '../../components/ui/Card/Card'

export default function DashboardPage() {
  const usuario = useAuthStore((state) => state.usuario)

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-100 font-display">Dashboard</h1>
      <p className="mb-6 text-gray-400">Bienvenido, {usuario?.nombre}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700" hover={false}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-md">
              <HiShoppingBag className="text-2xl text-primary-light" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Productos activos</p>
              <p className="text-2xl font-bold text-gray-100">—</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700" hover={false}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900/50 rounded-md">
              <HiCube className="text-2xl text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Variantes en stock</p>
              <p className="text-2xl font-bold text-gray-100">—</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700" hover={false}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-900/50 rounded-md">
              <HiExclamation className="text-2xl text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Bajo stock</p>
              <p className="text-2xl font-bold text-gray-100">—</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
