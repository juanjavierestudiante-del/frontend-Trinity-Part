// Peticiones de atributos y valores para el admin.

import adminApi from '../axios.admin';
import type { TipoVisualizacionAtributo } from '../../types/catalogo.types';

export interface ValorAtributo {
  idValor: number;
  valor: string;
  idAtributo: number;
  visualValue: string | null;
}

export interface Atributo {
  idAtributo: number;
  nombre: string;
  tipoVisualizacion: TipoVisualizacionAtributo;
  valores: ValorAtributo[];
}

// GET /api/admin/atributos
export const getAtributos = async (): Promise<Atributo[]> => {
  const { data } = await adminApi.get('/admin/atributos');
  return data;
};

// POST /api/admin/atributos
export const crearAtributo = async (nombre: string): Promise<Atributo> => {
  const { data } = await adminApi.post('/admin/atributos', { nombre });
  return data;
};

export const actualizarAtributo = async (
  idAtributo: number,
  body: { tipoVisualizacion: TipoVisualizacionAtributo }
): Promise<Atributo> => {
  const { data } = await adminApi.patch(`/admin/atributos/${idAtributo}`, body);
  return data;
};

// POST /api/admin/atributos/:id/valores
export const crearValorAtributo = async (
  idAtributo: number,
  valor: string,
  visualValue?: string | null
): Promise<ValorAtributo> => {
  const { data } = await adminApi.post(`/admin/atributos/${idAtributo}/valores`, { valor, visualValue });
  return data;
};

export const actualizarValorAtributo = async (
  idAtributo: number,
  idValor: number,
  body: { valor?: string; visualValue?: string | null }
): Promise<ValorAtributo> => {
  const { data } = await adminApi.patch(`/admin/atributos/${idAtributo}/valores/${idValor}`, body);
  return data;
};

// POST /api/admin/variantes/:id/atributos
export const asignarAtributoVariante = async (
  idVariante: number,
  idValor: number
): Promise<void> => {
  await adminApi.post(`/admin/variantes/${idVariante}/atributos`, { idValor });
};

// DELETE /api/admin/variantes/:id/atributos/:idValor
export const quitarAtributoVariante = async (
  idVariante: number,
  idValor: number
): Promise<void> => {
  await adminApi.delete(`/admin/variantes/${idVariante}/atributos/${idValor}`);
};

