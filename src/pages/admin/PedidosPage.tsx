// Listado de pedidos en el panel admin con filtro por estado y detalle expandible.

import { useState } from 'react';
import type { AxiosError } from 'axios';
import { HiChevronDown, HiChevronRight, HiCheckCircle } from 'react-icons/hi';
import {
  usePedidosAdmin,
  useCambiarEstadoPedido,
} from '../../hooks/admin/usePedidosAdmin';
import type { EstadoPedido } from '../../services/admin/pedido.api';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Loader from '../../components/ui/Loader/Loader';
import Table from '../../components/ui/Table/Table';
import TableHead from '../../components/ui/Table/TableHead';
import TableBody from '../../components/ui/Table/TableBody';
import TableRow from '../../components/ui/Table/TableRow';
import TableCell from '../../components/ui/Table/TableCell';
import TableHeadCell from '../../components/ui/Table/TableHeadCell';
import Select from '../../components/ui/Select/Select';
import Alert from '../../components/ui/Alert/Alert';

interface PedidoDetalle {
  idDetalle: number;
  idVariante: number;
  cantidad: number;
  precioUnitario: number | string;
  variante?: {
    sku?: string;
    producto?: { nombre?: string };
  };
}

interface Pedido {
  idPedido: number;
  estado: EstadoPedido;
  total: number | string;
  fechaCreacion: string;
  nombreContacto: string;
  telefonoContacto: string;
  direccionEntrega?: string | null;
  notas?: string | null;
  items?: PedidoDetalle[];
  usuario?: { nombre?: string; email?: string };
}

const FILTROS: { key: EstadoPedido | 'TODOS'; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PENDIENTE', label: 'Pendiente' },
  { key: 'CONFIRMADO', label: 'Confirmado' },
  { key: 'CANCELADO', label: 'Cancelado' },
];

const colorEstado: Record<EstadoPedido, string> = {
  PENDIENTE: 'warning',
  CONFIRMADO: 'success',
  CANCELADO: 'danger',
};

function estadoLabel(estado: EstadoPedido) {
  switch (estado) {
    case 'CONFIRMADO':
      return 'Confirmado';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return 'Pendiente';
  }
}

export default function PedidosPage() {
  const { data: pedidos, isLoading, isError } = usePedidosAdmin();
  const { mutate: cambiarEstado, isPending, error: mutError } =
    useCambiarEstadoPedido();

  const [filtro, setFiltro] = useState<EstadoPedido | 'TODOS'>('TODOS');
  const [expandido, setExpandido] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);

  const pedidosTipados = (pedidos as Pedido[] | undefined) ?? [];

  const filtrados =
    filtro === 'TODOS'
      ? pedidosTipados
      : pedidosTipados.filter((p) => p.estado === filtro);

  const toggleExpandir = (id: number) => {
    setExpandido((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCambiarEstado = (id: number, estado: EstadoPedido) => {
    cambiarEstado(
      { id, estado },
      {
        onSuccess: () => setFeedback(`Estado del pedido #${id} actualizado a ${estadoLabel(estado)}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="xl" showText={false} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error al cargar pedidos</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Pedidos</h1>
      </div>

      {/* Tabs de filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              filtro === f.key
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {feedback && (
        <Alert
          type="success"
          className="mb-4"
          icon={<HiCheckCircle className="h-5 w-5" />}
          onDismiss={() => setFeedback(null)}
        >
          {feedback}
        </Alert>
      )}

      {mutError && (
        <Alert type="danger" className="mb-4" onDismiss={() => {}}>
          {(mutError as AxiosError<{ error?: string }>)?.response?.data?.error ||
            'No se pudo actualizar el pedido'}
        </Alert>
      )}

      <Table dark>
        <TableHead dark>
          <TableRow dark>
            <TableHeadCell>{''}</TableHeadCell>
            <TableHeadCell>N° Pedido</TableHeadCell>
            <TableHeadCell>Cliente</TableHeadCell>
            <TableHeadCell>Fecha</TableHeadCell>
            <TableHeadCell>Items</TableHeadCell>
            <TableHeadCell>Total</TableHeadCell>
            <TableHeadCell>Estado</TableHeadCell>
            <TableHeadCell>Cambiar estado</TableHeadCell>
          </TableRow>
        </TableHead>

        <TableBody dark>
          {filtrados.map((pedido) => {
            const estaExpandido = expandido.has(pedido.idPedido);
            const items = pedido.items ?? [];
            return (
              <FragmentPedido
                key={pedido.idPedido}
                pedido={pedido}
                items={items}
                estaExpandido={estaExpandido}
                onToggle={() => toggleExpandir(pedido.idPedido)}
                onChangeEstado={(estado) => handleCambiarEstado(pedido.idPedido, estado)}
                estadoActual={pedido.estado}
                isPending={isPending}
              />
            );
          })}
        </TableBody>
      </Table>

      {filtrados.length === 0 && (
        <p className="py-12 text-center text-gray-500">No hay pedidos con este estado.</p>
      )}
    </div>
  );
}

function FragmentPedido({
  pedido,
  items,
  estaExpandido,
  onToggle,
  onChangeEstado,
  estadoActual,
  isPending,
}: {
  pedido: Pedido;
  items: PedidoDetalle[];
  estaExpandido: boolean;
  onToggle: () => void;
  onChangeEstado: (estado: EstadoPedido) => void;
  estadoActual: EstadoPedido;
  isPending: boolean;
}) {
  return (
    <>
      <TableRow dark hoverable>
        <TableCell dark className="w-8">
          <Button
            size="xs"
            variant="ghost"
            onClick={onToggle}
            className="text-gray-400 p-1"
            title={estaExpandido ? 'Ocultar detalle' : 'Ver detalle'}
          >
            {estaExpandido ? (
              <HiChevronDown className="w-4 h-4" />
            ) : (
              <HiChevronRight className="w-4 h-4" />
            )}
          </Button>
        </TableCell>

        <TableCell dark>
          <div className="font-medium text-gray-100">#{pedido.idPedido}</div>
        </TableCell>

        <TableCell dark>
          <div className="text-gray-100">{pedido.nombreContacto}</div>
          <div className="text-xs text-gray-500">{pedido.telefonoContacto}</div>
        </TableCell>

        <TableCell dark>
          <span className="text-gray-300 whitespace-nowrap">
            {new Date(pedido.fechaCreacion).toLocaleDateString('es-BO')}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(pedido.fechaCreacion).toLocaleTimeString('es-BO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </TableCell>

        <TableCell dark>{items.length} item(s)</TableCell>

        <TableCell dark className="font-semibold text-gray-100">
          Bs. {Number(pedido.total).toFixed(2)}
        </TableCell>

        <TableCell dark>
          <Badge variant={colorEstado[pedido.estado] || 'gray'}>
            {estadoLabel(pedido.estado)}
          </Badge>
        </TableCell>

        <TableCell dark>
          <div className="w-36">
            <Select
              dark
              sizing="sm"
              value={estadoActual}
              disabled={isPending}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onChangeEstado(e.target.value as EstadoPedido)
              }
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="CANCELADO">Cancelado</option>
            </Select>
          </div>
        </TableCell>
      </TableRow>

      {estaExpandido && (
        <tr className="bg-gray-900/50">
          <td colSpan={8} className="px-4 py-3">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Productos
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="py-1 pr-2 font-medium">Producto</th>
                      <th className="py-1 pr-2 font-medium">Cantidad</th>
                      <th className="py-1 font-medium">Precio unitario</th>
                      <th className="py-1 pl-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {items.map((det) => (
                      <tr key={det.idDetalle}>
                        <td className="py-1.5 pr-2 text-gray-200">
                          {det.variante?.producto?.nombre || det.variante?.sku || 'Producto'}
                        </td>
                        <td className="py-1.5 pr-2 text-gray-400">{det.cantidad}</td>
                        <td className="py-1.5 text-gray-300">
                          Bs. {Number(det.precioUnitario).toFixed(2)}
                        </td>
                        <td className="py-1.5 pl-2 text-gray-200 text-right">
                          Bs. {(Number(det.precioUnitario) * det.cantidad).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Entrega
                  </h4>
                  <p className="text-sm text-gray-200">
                    {pedido.direccionEntrega
                      ? pedido.direccionEntrega
                      : 'Retiro en tienda'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Notas
                  </h4>
                  <p className="text-sm text-gray-200">
                    {pedido.notas ? pedido.notas : '—'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end text-sm">
                <span className="font-semibold text-gray-400">Total: </span>
                <span className="ml-2 font-bold text-gray-100">
                  Bs. {Number(pedido.total).toFixed(2)}
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
