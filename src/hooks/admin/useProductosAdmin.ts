import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductosAdmin,
  getProductoAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/admin/producto.api';

export const useProductosAdmin = () =>
  useQuery({ queryKey: ['admin', 'productos'], queryFn: getProductosAdmin });

export const useProductoAdmin = (id: number) =>
  useQuery({
    queryKey: ['admin', 'producto', id],
    queryFn: () => getProductoAdmin(id),
    enabled: !!id,
  });

export const useCrearProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'productos'] }),
  });
};

export const useActualizarProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof actualizarProducto>[1] }) => actualizarProducto(id, body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin', 'productos'] });
      qc.invalidateQueries({ queryKey: ['admin', 'producto', variables.id] });
    },
  });
};

export const useEliminarProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'productos'] }),
  });
};

