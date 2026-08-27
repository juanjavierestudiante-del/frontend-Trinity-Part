// Servicio API para Inventario en el panel admin.

import adminApi from '../axios.admin';

export interface FilaInventario {
  idProducto: number;
  producto: string;
  idVariante: number;
  sku: string;
  marca: string | null;
  unidad: string | null;
  estado: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number | null;
  tieneRegistro: boolean;
}

export interface FilaAlertaInventario {
  idProducto: number;
  producto: string;
  idVariante: number;
  sku: string;
  marca: string | null;
  unidad: string | null;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number | null;
  tieneRegistro: boolean;
}

export interface MovimientoInventario {
  idMovimiento: number;
  tipo: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string | null;
  usuario: string | null;
  fecha: string;
}

export interface ActualizarStockBody {
  stockActual?: number;
  stockMinimo?: number;
  stockMaximo?: number | null;
  motivo?: string;
}

export interface AjustarStockBody {
  cantidad: number;
  motivo?: string;
}

// GET /api/admin/inventario — listado global de variantes con su stock
export const getInventario = async (): Promise<FilaInventario[]> => {
  const { data } = await adminApi.get('/admin/inventario');
  return data;
};

// GET /api/admin/inventario/alertas — variantes en/bajo el mínimo (o sin registro)
export const getAlertasInventario = async (): Promise<FilaAlertaInventario[]> => {
  const { data } = await adminApi.get('/admin/inventario/alertas');
  return data;
};

// GET /api/admin/inventario/:idVariante/historial — movimientos, más recientes primero
export const getHistorialInventario = async (
  idVariante: number
): Promise<MovimientoInventario[]> => {
  const { data } = await adminApi.get(`/admin/inventario/${idVariante}/historial`);
  return data;
};

// PUT /api/admin/inventario/:idVariante — fija valores absolutos
export const actualizarStockInventario = async (
  idVariante: number,
  body: ActualizarStockBody
) => {
  const { data } = await adminApi.put(`/admin/inventario/${idVariante}`, body);
  return data;
};

// PATCH /api/admin/inventario/:idVariante/ajustar — suma/resta un delta
export const ajustarStockInventario = async (idVariante: number, body: AjustarStockBody) => {
  const { data } = await adminApi.patch(`/admin/inventario/${idVariante}/ajustar`, body);
  return data;
};
