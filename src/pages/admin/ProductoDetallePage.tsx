import { useParams } from 'react-router-dom'
import { HiInformationCircle, HiPhotograph, HiCube } from 'react-icons/hi'
import { useProductoAdmin } from '../../hooks/admin/useProductosAdmin'
import ImagenEditor from '../../components/admin/ImagenEditor'
import VarianteEditor from '../../components/admin/VarianteEditor'
import ProductoFormPage from './ProductoFormPage'
import Tabs, { TabItem } from '../../components/ui/Tabs/Tabs'
import Loader from '../../components/ui/Loader/Loader'

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { data: producto, isLoading } = useProductoAdmin(Number(id))

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader size="xl" showText={false} />
    </div>
  )

  if (!producto) return <p className="text-red-500">Producto no encontrado</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-1">{producto.nombre}</h1>
      <p className="text-sm text-gray-400 mb-6">ID: {producto.idProducto} · {producto.slug}</p>

      <Tabs>
        <TabItem title="Información" icon={HiInformationCircle}>
          <ProductoFormPage />
        </TabItem>

        <TabItem title="Imágenes" icon={HiPhotograph}>
          <div className="mt-4">
            <ImagenEditor
              idProducto={producto.idProducto}
              imagenes={producto.imagenes}
            />
          </div>
        </TabItem>

        <TabItem title="Variantes" icon={HiCube}>
          <div className="mt-4">
            <VarianteEditor idProducto={producto.idProducto} />
          </div>
        </TabItem>
      </Tabs>
    </div>
  )
}
