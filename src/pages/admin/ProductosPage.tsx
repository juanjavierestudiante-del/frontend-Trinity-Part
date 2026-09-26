import { useNavigate } from 'react-router-dom'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import { useProductosAdmin, useEliminarProducto } from '../../hooks/admin/useProductosAdmin'
import { useAuthStore } from '../../store/auth.store'
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
  const usuario = useAuthStore((state) => state.user)
  const isAdmin = usuario?.rol === 'ADMIN'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Productos</h1>
        {isAdmin && (
          <Button size="md" icon={HiPlus} onClick={() => navigate('/admin/productos/nuevo')}>
            Nuevo producto
          </Button>
        )}
      </div>

      <Table dark>
        <TableHead dark>
          <TableRow dark>
            <TableHeadCell>Nombre</TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">Categoría</TableHeadCell>
            <TableHeadCell className="hidden md:table-cell">Variantes</TableHeadCell>
            <TableHeadCell>Estado</TableHeadCell>
            <TableHeadCell>Acciones</TableHeadCell>
          </TableRow>
        </TableHead>

        <TableBody dark>
          {productos?.map((producto) => (
            <TableRow key={producto.idProducto} dark hoverable>
              <TableCell dark className="font-medium">
                <div className="max-w-[10rem] truncate text-gray-100 sm:max-w-none">{producto.nombre}</div>
                <div className="hidden text-xs text-gray-500 sm:block">{producto.slug}</div>
                <div className="mt-1 text-xs text-gray-400 md:hidden">{producto.categoria.nombre} · {producto.variantes.length} variantes</div>
              </TableCell>

              <TableCell dark className="hidden md:table-cell">{producto.categoria.nombre}</TableCell>

              <TableCell dark className="hidden md:table-cell">{producto.variantes.length} variantes</TableCell>

              <TableCell dark>
                <Badge variant={colorEstado[producto.estado] || 'gray'}>
                  {producto.estado}
                </Badge>
              </TableCell>

              <TableCell dark>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    size="icon"
                    variant="light"
                    icon={HiPencil}
                    aria-label={"Editar " + producto.nombre}
                    className="min-h-11 min-w-11 sm:h-9 sm:w-auto sm:min-h-0 sm:min-w-0 sm:px-3"
                    onClick={() => navigate(`/admin/productos/${producto.idProducto}/editar`)}
                    title="Editar"
                  >
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="danger"
                      icon={HiTrash}
                      aria-label={"Eliminar " + producto.nombre}
                      className="min-h-11 min-w-11 sm:h-9 sm:w-auto sm:min-h-0 sm:min-w-0 sm:px-3"
                      onClick={() => handleEliminar(producto.idProducto, producto.nombre)}
                      title="Eliminar"
                    >
                      <span className="hidden sm:inline">Eliminar</span>
                    </Button>
                  )}
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
