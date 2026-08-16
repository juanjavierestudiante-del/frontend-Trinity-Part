import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  subirImagenProducto,
  subirImagenVariante,
  eliminarImagenProducto,
  eliminarImagenVariante,
  subirMultiplesImagenesVariante,
  marcarImagenPrincipal,
  subirMultiplesImagenesProducto,
  marcarImagenPrincipalProducto,
} from '../../services/admin/imagen.api';

// Imágenes de producto
export const useSubirImagenProducto = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ archivo, principal }: { archivo: File; principal?: boolean }) =>
      subirImagenProducto(idProducto, archivo, principal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'producto', idProducto] }),
  });
};

export const useEliminarImagenProducto = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarImagenProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'producto', idProducto] }),
  });
};

// Subida múltiple de imágenes de producto
export const useSubirMultiplesImagenesProducto = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ archivos }: { archivos: File[] }) =>
      subirMultiplesImagenesProducto(idProducto, archivos),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'producto', idProducto] }),
  });
};

// Marcar imagen de producto como principal
export const useMarcarImagenPrincipalProducto = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idImagen: number) => marcarImagenPrincipalProducto(idImagen),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'producto', idProducto] }),
  });
};

// Imágenes de variante
export const useSubirImagenVariante = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, archivo, principal }: {
      idVariante: number; archivo: File; principal?: boolean;
    }) => subirImagenVariante(idVariante, archivo, principal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

export const useEliminarImagenVariante = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eliminarImagenVariante,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

// Subida múltiple de imágenes de variante
export const useSubirMultiplesImagenesVariante = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, archivos }: { idVariante: number; archivos: File[] }) =>
      subirMultiplesImagenesVariante(idVariante, archivos),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

// Marcar imagen de variante como principal
export const useMarcarImagenPrincipal = (idProducto: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idImagen: number) => marcarImagenPrincipal(idImagen),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'variantes', idProducto] }),
  });
};

