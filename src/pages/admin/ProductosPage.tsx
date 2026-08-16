import { useNavigate } from 'react-router-dom'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import { useProductosAdmin, useEliminarProducto } from '../../hooks/admin/useProductosAdmin'
import Table from '../../components/ui/Table/Table'
import TableHead from '../../components/ui/Table/TableHead'
import TableBody from '../../components/ui/Table/TableBody'
import TableRow from '../../components/ui/Table/TableRow'
import TableCell from '../../components/ui/Table/TableCell'
import TableHeadCell from '../../components/ui/Table/TableHeadCell'
import Badge from '../../components/ui/Badge/Badge'
import Button from '../../components/ui/Button/Button'
import Loader from '../../components/ui/Loader/Loader'

const colorEstado: Record<string, string> = {
  Activo: 'success',
  Inactivo: 'warning',
  Borrador: 'gray',
  Descontinuado: 'danger',
}

export default function ProductosPage() {
  const navigate = useNavigate()
  const { data: productos, isLoading, isError } = useProductosAdmin()
  const { mutate: eliminar } = useEliminarProducto()

  const handleEliminar = (id: number, nombre: string) => {
    if (confirm(`¿Eliminar "${nombre}"?`)) eliminar(id)
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="xl" showText={false} />
    </div>
  )

  if (isError) return <p className="text-red-500">Error al cargar productos</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Productos</h1>
        <Button onClick={() => navigate('/admin/productos/nuevo')}>
          <HiPlus className="w-4 h-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <Table dark>
        <TableHead dark>
          <TableRow dark>
            <TableHeadCell>Nombre</TableHeadCell>
            <TableHeadCell>Categoría</TableHeadCell>
            <TableHeadCell>Variantes</TableHeadCell>
            <TableHeadCell>Estado</TableHeadCell>
            <TableHeadCell>Acciones</TableHeadCell>
          </TableRow>
        </TableHead>

        <TableBody dark>
          {productos?.map((producto) => (
            <TableRow key={producto.idProducto} dark hoverable>
              <TableCell dark className="font-medium">
                <div className="text-gray-100">{producto.nombre}</div>
                <div className="text-xs text-gray-500">{producto.slug}</div>
              </TableCell>

              <TableCell dark>{producto.categoria.nombre}</TableCell>

              <TableCell dark>{producto.variantes.length} variantes</TableCell>

              <TableCell dark>
                <Badge variant={colorEstado[producto.estado] || 'gray'}>
                  {producto.estado}
                </Badge>
              </TableCell>

              <TableCell dark>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => navigate(`/admin/productos/${producto.idProducto}/editar`)}
                  >
                    <HiPencil className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="xs"
                    variant="danger"
                    onClick={() => handleEliminar(producto.idProducto, producto.nombre)}
                  >
                    <HiTrash className="w-3 h-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {productos?.length === 0 && (
        <p className="py-12 text-center text-gray-500">No hay productos todavía.</p>
      )}
    </div>
  )
}
