// Hooks para Inventario en el admin (listado, alertas, historial y ajustes).

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventario,
  getAlertasInventario,
  getHistorialInventario,
  actualizarStockInventario,
  ajustarStockInventario,
  type ActualizarStockBody,
  type AjustarStockBody,
} from '../../services/admin/inventario.api';

const KEY = ['admin', 'inventario'];

// ── Queries ────────────────────────────────────────────────────────

export const useInventario = () =>
  useQuery({ queryKey: KEY, queryFn: getInventario });

export const useAlertasInventario = () =>
  useQuery({ queryKey: [...KEY, 'alertas'], queryFn: getAlertasInventario });

export const useHistorialInventario = (idVariante: number | null) =>
  useQuery({
    queryKey: [...KEY, 'historial', idVariante],
    queryFn: () => getHistorialInventario(idVariante as number),
    enabled: !!idVariante,
  });

// ── Mutations ──────────────────────────────────────────────────────

export const useActualizarStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, body }: { idVariante: number; body: ActualizarStockBody }) =>
      actualizarStockInventario(idVariante, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useAjustarStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idVariante, body }: { idVariante: number; body: AjustarStockBody }) =>
      ajustarStockInventario(idVariante, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
