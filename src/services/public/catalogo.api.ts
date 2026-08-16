// Todas las peticiones del catálogo público.
// Usan publicApi (Axios) para hacer el fetch al backend.
// TanStack Query llama a estas funciones — no las usás directo en los componentes.

import publicApi from '../axios';
import type { Categoria, Producto } from '../../types/catalogo.types';

// GET /api/categorias  
// Trae el árbol completo de categorías para el menú de navegación
export const getCategorias = async (): Promise<Categoria[]> => {
  const { data } = await publicApi.get('/categorias');
  return data;
};

// GET /api/productos
// Trae lista de productos activos, con filtros opcionales
export const getProductos = async (params?: {
  categoria?: string; // slug de la categoría (ej: "globos")
  q?: string;         // texto de búsqueda (ej: "globo rojo")
}): Promise<Producto[]> => {
  const { data } = await publicApi.get('/productos', { params });
  return data;
};

// GET /api/productos/:slug
// Trae UN producto completo con todas sus variantes, atributos, imágenes y stock
export const getProductoPorSlug = async (slug: string): Promise<Producto> => {
  const { data } = await publicApi.get(`/productos/${slug}`);
  return data;
};