// Hooks para categorías en el admin (listado, CRUD e imágenes).

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategoriasAdmin,
  getCategoriaAdmin,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
  subirImagenCategoria,
  eliminarImagenCategoria,
} from '../../services/admin/categoria.api';
import type { Categoria } from '../../types/catalogo.types';

// ── Queries ────────────────────────────────────────────────────────

export const useCategoriasAdmin = () =>
  useQuery({ queryKey: ['admin', 'categorias'], queryFn: getCategoriasAdmin });

export const useCategoriaAdmin = (id: number) =>
  useQuery({
    queryKey: ['admin', 'categoria', id],
    queryFn: () => getCategoriaAdmin(id),
    enabled: !!id,
  });

// ── Mutations ──────────────────────────────────────────────────────

export const useCrearCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categorias'] }),
  });
};

export const useActualizarCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => actualizarCategoria(id, body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin', 'categorias'] });
      qc.invalidateQueries({ queryKey: ['admin', 'categoria', variables.id] });
    },
  });
};

export const useCambiarEstadoCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'Activo' | 'Inactivo' }) =>
      cambiarEstadoCategoria(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categorias'] }),
  });
};
// ── Mutations para subir y eliminar imagenes ─────────────────────────
//¡¡¡alerta no usando, la imagen al estamos manejamdo cona actualización de la categoría, pero si queremos subir
export const useSubirImagenCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archivo }: { id: number; archivo: File }) =>
      subirImagenCategoria(id, archivo),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin', 'categorias'] });
      qc.invalidateQueries({ queryKey: ['admin', 'categoria', variables.id] });
    },
  });
};

export const useEliminarImagenCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarImagenCategoria(id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['admin', 'categorias'] });
      qc.invalidateQueries({ queryKey: ['admin', 'categoria', variables] });
    },
  });
};
