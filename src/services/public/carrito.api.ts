import cartApi from '../axios.cart';

export const getCarrito = async () => {
  const { data } = await cartApi.get('/carrito');
  return data;
};

export const agregarAlCarrito = async (idVariante: number, cantidad = 1) => {
  const { data } = await cartApi.post('/carrito/items', { idVariante, cantidad });
  return data;
};

export const actualizarCantidad = async (idDetalle: number, cantidad: number) => {
  const { data } = await cartApi.put(`/carrito/items/${idDetalle}`, { cantidad });
  return data;
};

export const eliminarDelCarrito = async (idDetalle: number) => {
  await cartApi.delete(`/carrito/items/${idDetalle}`);
};

export const crearPedido = async () => {
  const { data } = await cartApi.post('/pedidos');
  return data;
};

export const obtenerPedidos = async () => {
  const { data } = await cartApi.get('/pedidos');
  return data;
};
