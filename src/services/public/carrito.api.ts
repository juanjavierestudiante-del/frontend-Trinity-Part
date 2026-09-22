import publicApi from '../axios';

export const getCarrito = async () => {
  const { data } = await publicApi.get('/carrito');
  return data;
};

// GET /carrito/count: contador liviano (solo suma de cantidades, sin includes).
export const getContadorCarrito = async (): Promise<{ items: number }> => {
  const { data } = await publicApi.get('/carrito/count');
  return data;
};

export const agregarAlCarrito = async (idVariante: number, cantidad = 1) => {
  const { data } = await publicApi.post('/carrito/items', { idVariante, cantidad });
  return data;
};

export const actualizarCantidad = async (idDetalle: number, cantidad: number) => {
  const { data } = await publicApi.put(`/carrito/items/${idDetalle}`, { cantidad });
  return data;
};

export const eliminarDelCarrito = async (idDetalle: number) => {
  await publicApi.delete(`/carrito/items/${idDetalle}`);
};

interface ContactoPedidoInput {
  nombreContacto: string;
  telefonoContacto: string;
  notas?: string | null;
}

export type CrearPedidoInput =
  | (ContactoPedidoInput & {
      metodoEntrega: 'PUNTO_ENTREGA' | 'RECOJO_TIENDA';
      idPuntoEntrega: number;
    })
  | (ContactoPedidoInput & {
      metodoEntrega: 'DELIVERY';
      deliveryZona: string;
      deliveryDireccion: string;
      deliveryReferencia?: string | null;
    });

export const crearPedido = async (body: CrearPedidoInput) => {
  const { data } = await publicApi.post('/pedidos', body);
  return data;
};

export const obtenerPedidos = async () => {
  const { data } = await publicApi.get('/pedidos');
  return data;
};
