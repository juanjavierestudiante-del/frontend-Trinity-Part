import publicApi from '../axios';

export const getCarrito = async () => {
  const { data } = await publicApi.get('/carrito');
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

export const crearPedido = async () => {
  const { data } = await publicApi.post('/pedidos');
  return data;
};

export const obtenerPedidos = async () => {
  const { data } = await publicApi.get('/pedidos');
  return data;
};
