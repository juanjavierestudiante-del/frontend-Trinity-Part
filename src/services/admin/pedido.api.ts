import adminApi from '../axios.admin';

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';

export interface ResultadoPedidos {
  items: unknown[];
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
