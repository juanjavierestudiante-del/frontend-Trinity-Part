// Hooks que usan TanStack Query para cachear, revalidar y manejar
// los estados de carga y error automáticamente.
// Los componentes llaman a ESTOS hooks, nunca a los servicios directamente.

import { useQuery } from '@tanstack/react-query';
import { getCategorias, getProductos, getProductoPorSlug } from '../services/public/catalogo.api';

// ─── Categorías ───────────────────────────────────────────────────────────────

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],       // clave de caché — si ya las pediste, no vuelve a pedir
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 10,     // considera los datos frescos por 10 minutos
  });
};

// ─── Lista de productos ───────────────────────────────────────────────────────

interface FiltrosProductos {
  categoria?: string;
  q?: string; // búsqueda en tiempo real
}

export const useProductos = (filtros?: FiltrosProductos) => {
  return useQuery({
    // La queryKey incluye los filtros: si cambia la categoría o el texto,
    // TanStack Query hace una nueva petición automáticamente
    queryKey: ['productos', filtros],
    queryFn: () => getProductos(filtros),

    // Considera los datos frescos por 5 minutos (el catálogo cambia poco)
    staleTime: 1000 * 60 * 5,

    // Solo hace la petición si la búsqueda tiene al menos 2 caracteres
    // (evita peticiones innecesarias mientras el usuario escribe)
    enabled: !filtros?.q || filtros.q.length >= 2,
  });
};

// ─── Detalle de producto ──────────────────────────────────────────────────────

export const useProducto = (slug: string) => {
  return useQuery({
    queryKey: ['producto', slug],   // caché por slug — cada producto tiene su propia entrada
    queryFn: () => getProductoPorSlug(slug),
    enabled: !!slug,                // solo hace la petición si hay slug
    staleTime: 1000 * 60 * 5,     // frescos por 5 minutos (el detalle cambia poco)
  });
};