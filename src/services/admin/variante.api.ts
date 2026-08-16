// Peticiones CRUD de variantes para el admin.

import adminApi from '../axios.admin';

export interface VarianteBody {
  idProducto: number;
  idMarca?: number;
  idUnidad?: number;
  cantidadContenido?: number;
  sku: string;
  codigoBarras?: string;
  precioVenta: number;
  precioOferta?: number;
  peso?: number;
  estado?: 'Activo' | 'Inactivo';
}

export const getVariantesPorProducto = async (idProducto: number) => {
  const { data } = await adminApi.get(`/admin/variantes/producto/${idProducto}`);
  return data;
};

export const crearVariante = async (body: VarianteBody) => {
  const { data } = await adminApi.post('/admin/variantes', body);
  return data;
};

export const actualizarVariante = async (id: number, body: Partial<VarianteBody>) => {
  const { data } = await adminApi.put(`/admin/variantes/${id}`, body);
  return data;
};

export const eliminarVariante = async (id: number): Promise<void> => {
  await adminApi.delete(`/admin/variantes/${id}`);
};

