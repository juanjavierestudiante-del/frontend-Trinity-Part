import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVariantesPorProducto,
  crearVariante,
  actualizarVariante,
  eliminarVariante,
  type VarianteBody,
} from '../../services/admin/variante.api';

export const useVariantesPorProducto = (idProducto: number) =>
  useQuery({
    queryKey: ['admin', 'variantes', idProducto],
    queryFn: () => getVariantesPorProducto(idProducto),
    enabled: !!idProducto,
  });

export const useCrearVariante = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearVariante,
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['admin', 'variantes', vars.idProducto] }),
  });
};

export const useActualizarVariante = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<VarianteBody> }) =>
      actualizarVariante(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

export const useEliminarVariante = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarVariante,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

