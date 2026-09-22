import publicApi from '../axios';

export type TipoPuntoEntrega = 'PUNTO_ENTREGA' | 'RECOJO_TIENDA';

export interface PuntoEntregaPublico {
  idPuntoEntrega: number;
  nombre: string;
  descripcion: string | null;
  referencia: string | null;
  tipo: TipoPuntoEntrega;
  orden: number;
}

export interface ConfiguracionEntregaPublica {
  deliveryHabilitado: boolean;
  montoMinimoDelivery: string;
  mensajeDelivery: string | null;
}

export const obtenerPuntosEntrega = async (): Promise<PuntoEntregaPublico[]> => {
  const { data } = await publicApi.get('/entrega/puntos');
  return data;
};

export const obtenerConfiguracionEntrega = async (): Promise<ConfiguracionEntregaPublica> => {
  const { data } = await publicApi.get('/entrega/configuracion');
  return data;
};
