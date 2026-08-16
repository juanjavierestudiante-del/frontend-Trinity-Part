// Datos auxiliares para los selects: marcas y unidades.
// Necesitan dos endpoints nuevos en el backend (los agrego al final).

import adminApi from '../axios.admin';

export interface Marca { idMarca: number; nombre: string; }
export interface UnidadMedida { idUnidad: number; nombre: string; abreviatura: string; }

export const getMarcas = async (): Promise<Marca[]> => {
  const { data } = await adminApi.get('/admin/marcas');
  return data;
};

export const getUnidades = async (): Promise<UnidadMedida[]> => {
  const { data } = await adminApi.get('/admin/unidades');
  return data;
};

