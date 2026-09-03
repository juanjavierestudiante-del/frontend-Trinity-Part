import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPedidosAdmin,
  cambiarEstadoPedido,
  type EstadoPedido,
} from '../../services/admin/pedido.api';

export const usePedidosAdmin = () =>
  useQuery({ queryKey: ['admin', 'pedidos'], queryFn: getPedidosAdmin });

export const useCambiarEstadoPedido = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      cambiarEstadoPedido(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pedidos'] }),
  });
};
