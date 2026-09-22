import adminApi from '../axios.admin';

export type TipoPuntoEntrega = 'PUNTO_ENTREGA' | 'RECOJO_TIENDA';

export interface PuntoEntregaAdmin {
  idPuntoEntrega: number;
  nombre: string;
  descripcion: string | null;
  referencia: string | null;
  tipo: TipoPuntoEntrega;
  activo: boolean;
  orden: number;
}

export interface ConfiguracionEntregaAdmin {
  id?: number;
  deliveryHabilitado: boolean;
  montoMinimoDelivery: string;
  mensajeDelivery: string | null;
}

export type PuntoEntregaInput = Omit<PuntoEntregaAdmin, 'idPuntoEntrega'>;

export const listarPuntosEntrega = async (): Promise<PuntoEntregaAdmin[]> => (await adminApi.get('/admin/puntos-entrega')).data;
export const crearPuntoEntrega = async (body: PuntoEntregaInput): Promise<PuntoEntregaAdmin> => (await adminApi.post('/admin/puntos-entrega', body)).data;
export const actualizarPuntoEntrega = async (id: number, body: Partial<PuntoEntregaInput>): Promise<PuntoEntregaAdmin> => (await adminApi.patch(`/admin/puntos-entrega/${id}`, body)).data;
export const obtenerConfiguracionEntrega = async (): Promise<ConfiguracionEntregaAdmin> => (await adminApi.get('/admin/configuracion-entrega')).data;
export const actualizarConfiguracionEntrega = async (body: { deliveryHabilitado: boolean; montoMinimoDelivery: number; mensajeDelivery: string | null }): Promise<ConfiguracionEntregaAdmin> => (await adminApi.patch('/admin/configuracion-entrega', body)).data;
