import adminApi from '../axios.admin';

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
export type MetodoEntregaPedido =
  | 'PUNTO_ENTREGA'
  | 'RECOJO_TIENDA'
  | 'DELIVERY';

export interface ValorAtributoPedido {
  idValor: number;
  idAtributo: number;
  valor: string;
}

export interface PedidoDetalleAdmin {
  idDetalle: number;
  idVariante: number;
  cantidad: number;
  precioUnitario: number | string;
  nombreProductoSnapshot?: string | null;
  skuSnapshot?: string | null;
  nombreAtributoPrincipalSnapshot?: string | null;
  valorAtributoPrincipalSnapshot?: string | null;
  variante?: {
    sku?: string;
    producto?: {
      idProducto?: number;
      nombre?: string;
      idAtributoPrincipal?: number | null;
    };
    varianteAtributo?: { valorAtributo?: ValorAtributoPedido }[];
  };
}

export interface PedidoAdmin {
  idPedido: number;
  estado: EstadoPedido;
  total: number | string;
  fechaCreacion: string;
  nombreContacto: string;
  telefonoContacto: string;
  metodoEntrega?: MetodoEntregaPedido | null;
  idPuntoEntrega?: number | null;
  puntoEntregaNombre?: string | null;
  puntoEntregaReferencia?: string | null;
  deliveryZona?: string | null;
  deliveryDireccion?: string | null;
  deliveryReferencia?: string | null;
  direccionEntrega?: string | null;
  notas?: string | null;
  items?: PedidoDetalleAdmin[];
  usuario?: { nombre?: string; email?: string };
}

export interface ResultadoPedidos {
  items: PedidoAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPedidosAdmin = async (): Promise<ResultadoPedidos> => {
  const { data } = await adminApi.get('/admin/pedidos');
  return data;
};

export const cambiarEstadoPedido = async (
  idPedido: number,
  estado: EstadoPedido
): Promise<unknown> => {
  const { data } = await adminApi.patch(`/admin/pedidos/${idPedido}/estado`, { estado });
  return data;
};
