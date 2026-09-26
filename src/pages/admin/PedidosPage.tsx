// Listado de pedidos en el panel admin con filtro por estado y detalle expandible.

import { useState } from 'react';
import type { AxiosError } from 'axios';
import { HiChevronDown, HiChevronRight, HiCheckCircle } from 'react-icons/hi';
import {
  usePedidosAdmin,
  useCambiarEstadoPedido,
} from '../../hooks/admin/usePedidosAdmin';
import type {
  EstadoPedido,
  MetodoEntregaPedido,
  PedidoAdmin,
  PedidoDetalleAdmin,
} from '../../services/admin/pedido.api';
import ItemPedidoRow from '../../components/pedidos/ItemPedidoRow';
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

const metodoEntregaLabel: Record<MetodoEntregaPedido, string> = {
  PUNTO_ENTREGA: 'Punto de entrega',
  RECOJO_TIENDA: 'Recojo en tienda',
  DELIVERY: 'Delivery',
};

const metodoEntregaVariant: Record<MetodoEntregaPedido, string> = {
  PUNTO_ENTREGA: 'info',
  RECOJO_TIENDA: 'primary',
  DELIVERY: 'success',
};

function MetodoEntregaBadge({ metodoEntrega }: { metodoEntrega?: MetodoEntregaPedido | null }) {
  if (!metodoEntrega) {
    return <Badge variant="gray">Anterior</Badge>;
  }

  return (
    <Badge variant={metodoEntregaVariant[metodoEntrega]}>
      {metodoEntregaLabel[metodoEntrega]}
    </Badge>
  );
}

function DetalleEntrega({ pedido }: { pedido: PedidoAdmin }) {
  const punto = (
    <>
      <p className="text-sm text-gray-200 break-words">
        <span className="font-medium text-gray-400">Punto: </span>
        {pedido.puntoEntregaNombre || 'Punto no registrado'}
      </p>
      {pedido.puntoEntregaReferencia ? (
        <p className="mt-1 text-sm text-gray-200 break-words">
          <span className="font-medium text-gray-400">Referencia: </span>
          {pedido.puntoEntregaReferencia}
        </p>
      ) : null}
    </>
  );

  if (pedido.metodoEntrega === 'PUNTO_ENTREGA' || pedido.metodoEntrega === 'RECOJO_TIENDA') {
    return (
      <div>
        <p className="mb-2 text-sm text-gray-200">
          <span className="font-medium text-gray-400">Método: </span>
          {metodoEntregaLabel[pedido.metodoEntrega]}
        </p>
        {punto}
      </div>
    );
  }

  if (pedido.metodoEntrega === 'DELIVERY') {
    return (
      <div>
        <p className="mb-2 text-sm text-gray-200">
          <span className="font-medium text-gray-400">Método: </span>
          Delivery
        </p>
        <p className="text-sm text-gray-200 break-words">
          <span className="font-medium text-gray-400">Zona: </span>
          {pedido.deliveryZona || 'No registrada'}
        </p>
        <p className="mt-1 text-sm text-gray-200 break-words">
          <span className="font-medium text-gray-400">Dirección: </span>
          {pedido.deliveryDireccion || 'No registrada'}
        </p>
        {pedido.deliveryReferencia ? (
          <p className="mt-1 text-sm text-gray-200 break-words">
            <span className="font-medium text-gray-400">Referencia: </span>
            {pedido.deliveryReferencia}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-gray-200">
          <span className="font-medium text-gray-400">Teléfono: </span>
          {pedido.telefonoContacto}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-200">Entrega anterior / método no registrado</p>
      {pedido.direccionEntrega ? (
        <p className="mt-1 text-sm text-gray-200 break-words">
          <span className="font-medium text-gray-400">Dirección registrada anteriormente: </span>
          {pedido.direccionEntrega}
        </p>
      ) : null}
    </div>
  );
}

export default function PedidosPage() {
  const { data: pedidos, isLoading, isError } = usePedidosAdmin();
  const { mutate: cambiarEstado, isPending, error: mutError } =
    useCambiarEstadoPedido();

  const [filtro, setFiltro] = useState<EstadoPedido | 'TODOS'>('TODOS');
  const [expandido, setExpandido] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);

  const pedidosTipados = pedidos?.items ?? [];

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
    <div className="w-full min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Pedidos</h1>
      </div>

      {/* Tabs de filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFiltro(f.key)}
            className={`min-w-0 max-w-full rounded-md border px-3 py-1.5 text-center text-sm font-medium leading-5 transition-colors ${
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

      {/*
        Contenedor con scroll horizontal (funciona con el dedo en móvil).
        - w-full + max-w-full + min-w-0: no se estira con el contenido.
        - [&_table]:w-max: la tabla toma el ancho de su contenido y el
          contenedor hace scroll, en lugar de comprimir las columnas.
      */}
      <div
        className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-gray-700 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]"
      >
        <div className="w-full sm:w-max sm:min-w-full [&_table]:w-full [&_table]:table-fixed sm:[&_table]:w-max sm:[&_table]:min-w-full [&_th]:whitespace-nowrap [&_th]:px-2 [&_td]:px-2 sm:[&_th]:px-4 sm:[&_td]:px-4 sm:[&_td]:whitespace-nowrap">
          <Table dark>
            <TableHead dark>
              <TableRow dark>
                <TableHeadCell className="w-[10%] px-1 lg:w-auto">{''}</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell">N° Pedido</TableHeadCell>
                <TableHeadCell className="w-[40%] px-1 lg:w-auto lg:px-4">Cliente</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell">Fecha</TableHeadCell>
                <TableHeadCell className="w-[23%] px-1 lg:w-auto lg:px-4">Total</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell">Entrega</TableHeadCell>
                <TableHeadCell className="w-[27%] px-1 lg:w-auto lg:px-4">Estado</TableHeadCell>
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
        </div>
      </div>

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
  pedido: PedidoAdmin;
  items: PedidoDetalleAdmin[];
  estaExpandido: boolean;
  onToggle: () => void;
  onChangeEstado: (estado: EstadoPedido) => void;
  estadoActual: EstadoPedido;
  isPending: boolean;
}) {
  return (
    <>
      <TableRow dark hoverable>
        <TableCell dark className="w-8 px-2">
          <Button
            size="sm"
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

        <TableCell dark className="hidden lg:table-cell">
          <div className="font-medium text-gray-100">#{pedido.idPedido}</div>
        </TableCell>

        <TableCell dark>
          <div className="text-gray-100">{pedido.nombreContacto}</div>
          <div className="hidden text-xs text-gray-500 sm:block">{pedido.telefonoContacto}</div>
        </TableCell>

        <TableCell dark className="hidden lg:table-cell">
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

        {/* Total + cantidad de items en una sola columna */}
        <TableCell dark>
          <div className="font-semibold text-gray-100 whitespace-nowrap">
            Bs. {Number(pedido.total).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">{items.length} item(s)</div>
        </TableCell>

        <TableCell dark className="hidden lg:table-cell">
          <MetodoEntregaBadge metodoEntrega={pedido.metodoEntrega} />
        </TableCell>

        {/* Estado + cambio de estado en una sola columna */}
        <TableCell dark>
          <div className="flex w-full min-w-0 flex-col gap-1.5 xl:min-w-[9rem]">
            <div>
              <Badge variant={colorEstado[pedido.estado] || 'gray'}>
                {estadoLabel(pedido.estado)}
              </Badge>
            </div>
            <Select
              dark
              sizing="sm"
              className="hidden sm:block"
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

      <tr className="sm:hidden">
        <td colSpan={7} className="px-2 pb-3 pt-0">
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
        </td>
      </tr>

      {estaExpandido && (
        <tr className="bg-gray-900/50">
          <td colSpan={7} className="px-4 py-3 !whitespace-normal">
            {/*
              El detalle se queda pegado a la izquierda y con el ancho de la
              pantalla, para que no se estire junto con la tabla al hacer scroll.
            */}
            <div className="sticky left-0 w-[calc(100vw-4rem)] max-w-[56rem] space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Productos
                </h4>
                <div className="space-y-3">
                  {items.map((det) => (
                    <ItemPedidoRow key={det.idDetalle} detalle={det} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0 !whitespace-normal">
                  <h4 className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Entrega
                  </h4>
                  <DetalleEntrega pedido={pedido} />
                </div>
                <div className="min-w-0 !whitespace-normal">
                  <h4 className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Notas
                  </h4>
                  <p className="text-sm text-gray-200 break-words">
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