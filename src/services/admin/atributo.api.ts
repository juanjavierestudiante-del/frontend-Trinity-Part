// Peticiones de atributos y valores para el admin.

import adminApi from '../axios.admin';

export interface ValorAtributo {
  idValor: number;
  valor: string;
  idAtributo: number;
}

export interface Atributo {
  idAtributo: number;
  nombre: string;
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

// POST /api/admin/atributos/:id/valores
export const crearValorAtributo = async (
  idAtributo: number,
  valor: string
): Promise<ValorAtributo> => {
  const { data } = await adminApi.post(`/admin/atributos/${idAtributo}/valores`, { valor });
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


