import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAtributos,
  crearAtributo,
  crearValorAtributo,
  asignarAtributoVariante,
  quitarAtributoVariante,
} from '../../services/admin/atributo.api';

// Lista todos los atributos con sus valores
export const useAtributos = () =>
  useQuery({ queryKey: ['admin', 'atributos'], queryFn: getAtributos });

// Crear atributo nuevo
export const useCrearAtributo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearAtributo,
    // Al crear, refresca la lista de atributos
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'atributos'] }),
  });
};

// Crear valor dentro de un atributo existente
export const useCrearValorAtributo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idAtributo, valor }: { idAtributo: number; valor: string }) =>
      crearValorAtributo(idAtributo, valor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'atributos'] }),
  });
};

// Asignar valor a una variante
export const useAsignarAtributo = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, idValor }: { idVariante: number; idValor: number }) =>
      asignarAtributoVariante(idVariante, idValor),
    // Al asignar, refresca las variantes del producto
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

// Quitar atributo de una variante
export const useQuitarAtributo = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, idValor }: { idVariante: number; idValor: number }) =>
      quitarAtributoVariante(idVariante, idValor),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

