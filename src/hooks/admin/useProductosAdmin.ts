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
    mutationFn: ({ id, body }: { id: number; body: any }) => actualizarProducto(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'productos'] }),
  });
};

export const useEliminarProducto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'productos'] }),
  });
};


