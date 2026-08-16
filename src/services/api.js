// por elmomento esto no moveremos



import axios from "axios"

const API_URL = "http://localhost:4000/api/";

// ─── Productos ───────────────────────────────────────────
export const obtProductos = async () => {
  const resp = await axios.get(`${API_URL}productos`);
  return resp.data;
};
export const obtProductoPorId = async (id) => {
  const resp = await axios.get(`${API_URL}productos/${id}`);
  return resp.data;
}
export const crearProducto = async (producto) => {
  const resp = await axios.post(`${API_URL}productos`, producto);
  return resp.data;
};

export const eliminarProducto = async (id) => {
  const resp = await axios.delete(`${API_URL}productos/${id}`);
  return resp.status === 204;
};
export const obt3ProductosRelacionados = async (id) => {
  const resp = await axios.get(`${API_URL}productos/${id}/relacionados`);
  return resp.data;
};

// ─── Categorías ──────────────────────────────────────────
export const obtCategorias = async () => {
  const resp = await axios.get(`${API_URL}categorias`);
  return resp.data;
};

// ─── Usuarios ────────────────────────────────────────────
export const crearUsuario = async (usuario) => {
  const payload = {
    nombre: usuario.name || usuario.nombre,
    correo: usuario.email || usuario.correo,
    password: usuario.password,
  };
  const resp = await axios.post(`${API_URL}usuarios`, payload);
  return resp.data;
};

export const loginUsuario = async (email, password) => {
  const resp = await axios.get(`${API_URL}usuarios`);
  const usuarios = resp.data || [];
  return usuarios.find(
    (u) => u.correo?.toLowerCase() === email.toLowerCase() && u.password === password
  ) || null;
};

// ─── Carrito ─────────────────────────────────────────────
export const obtenerCarritoPorUsuario = async (idUsuario) => {
  const resp = await axios.get(`${API_URL}carrito/usuario/${idUsuario}`);
  return resp.data;
};

export const crearCarrito = async (carrito) => {
  const resp = await axios.post(`${API_URL}carrito`, carrito);
  return resp.data;
};

export const agregaDetalleCarrito = async (detalle) => {
  const resp = await axios.post(`${API_URL}carrito/detalle`, detalle);
  return resp.data;
};

export const eliminaDetalleCarrito = async (id_detalle) => {
  const resp = await axios.delete(`${API_URL}carrito/detalle/${id_detalle}`);
  return resp.status === 204;
};

export const actualizarDetalleCarrito = async (id_detalle, cantidad) => {
  const resp = await axios.put(`${API_URL}carrito/detalle/${id_detalle}`, { cantidad });
  return resp.data;
};

// ─── Pedidos ─────────────────────────────────────────────
export const obtenerPedidosPorUsuario = async (idUsuario) => {
  const resp = await axios.get(`${API_URL}pedidos/usuario/${idUsuario}`);
  return resp.data;
};

export const crearPedido = async (pedido) => {
  const resp = await axios.post(`${API_URL}pedidos`, pedido);
  return resp.data;
};

export const agregaDetallePedido = async (detalle) => {
  const resp = await axios.post(`${API_URL}pedidos/detalle`, detalle);
  return resp.data;
};

// ─── Imágenes ────────────────────────────────────────────
export const obtImagenesPorProducto = async (idProducto) => {
  const resp = await axios.get(`${API_URL}imagenesProductos/producto/${idProducto}`);
  return resp.data;
};

export const insertarImagen = async (idProducto, formData) => {
  const resp = await axios.post(`${API_URL}imagenesProductos/producto/${idProducto}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data;
};

export const borrarImagen = async (idImagen) => {
  const resp = await axios.delete(`${API_URL}imagenesProductos/${idImagen}`);
  return resp.status === 200 || resp.status === 204;
};

// ─── Export default ──────────────────────────────────────
export default {
  obtProductos,
  crearProducto,
  eliminarProducto,
  obtCategorias,
  crearUsuario,
  loginUsuario,
  obtenerCarritoPorUsuario,
  crearCarrito,
  agregaDetalleCarrito,
  eliminaDetalleCarrito,
  actualizarDetalleCarrito,
  obtenerPedidosPorUsuario,
  crearPedido,
  agregaDetallePedido,
  obtImagenesPorProducto,
  insertarImagen,
  borrarImagen,
};