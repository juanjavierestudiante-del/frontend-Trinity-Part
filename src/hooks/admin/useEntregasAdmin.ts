import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actualizarConfiguracionEntrega, actualizarPuntoEntrega, crearPuntoEntrega, listarPuntosEntrega, obtenerConfiguracionEntrega, type PuntoEntregaInput } from '../../services/admin/entrega.api';

export const usePuntosEntregaAdmin = () => useQuery({ queryKey: ['admin', 'entregas', 'puntos'], queryFn: listarPuntosEntrega });
export const useConfiguracionEntregaAdmin = () => useQuery({ queryKey: ['admin', 'entregas', 'configuracion'], queryFn: obtenerConfiguracionEntrega });

export const useCrearPuntoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: crearPuntoEntrega, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'entregas', 'puntos'] }) });
};
export const useActualizarPuntoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<PuntoEntregaInput> }) => actualizarPuntoEntrega(id, body), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'entregas', 'puntos'] }) });
};
export const useActualizarConfiguracionEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: actualizarConfiguracionEntrega, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'entregas', 'configuracion'] }) });
};
