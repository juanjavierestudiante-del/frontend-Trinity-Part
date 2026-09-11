import adminApi from '../axios.admin';
import type { Producto } from '../../types/catalogo.types';

export interface ProductoAdminBody {
  idCategoria: number;
  idAtributoPrincipal?: number | null;
  nombre: string;
  descripcionCorta?: string;
  descripcion?: string;
  destacado?: boolean;
  estado?: string;
  rating?: number;
}

export const getProductosAdmin = async (): Promise<Producto[]> => {
  const { data } = await adminApi.get('/admin/productos');
  return data;
};

export const getProductoAdmin = async (id: number): Promise<Producto> => {
  const { data } = await adminApi.get(`/admin/productos/${id}`);
  return data;
};

export const crearProducto = async (body: ProductoAdminBody): Promise<Producto> => {
  const { data } = await adminApi.post('/admin/productos', body);
  return data;
};

export const actualizarProducto = async (
  id: number,
  body: Partial<ProductoAdminBody>
): Promise<Producto> => {
  const { data } = await adminApi.put(`/admin/productos/${id}`, body);
  return data;
};

export const eliminarProducto = async (id: number): Promise<void> => {
  await adminApi.delete(`/admin/productos/${id}`);
};

