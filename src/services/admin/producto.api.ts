import adminApi from '../axios.admin';
import type { Producto } from '../../types/catalogo.types';

export const getProductosAdmin = async (): Promise<Producto[]> => {
  const { data } = await adminApi.get('/admin/productos');
  return data;
};

export const getProductoAdmin = async (id: number): Promise<Producto> => {
  const { data } = await adminApi.get(`/admin/productos/${id}`);
  return data;
};

export const crearProducto = async (body: {
  idCategoria: number;
  nombre: string;
  descripcionCorta?: string;
  descripcion?: string;
  destacado?: boolean;
  estado?: string;
  rating?: number;
}): Promise<Producto> => {
  const { data } = await adminApi.post('/admin/productos', body);
  return data;
};

export const actualizarProducto = async (
  id: number,
  body: Partial<Parameters<typeof crearProducto>[0]>
): Promise<Producto> => {
  const { data } = await adminApi.put(`/admin/productos/${id}`, body);
  return data;
};

export const eliminarProducto = async (id: number): Promise<void> => {
  await adminApi.delete(`/admin/productos/${id}`);
};


