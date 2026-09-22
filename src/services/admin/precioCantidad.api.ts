import adminApi from '../axios.admin'

export interface ReglaPrecioCantidadBorrador { idReglaPrecio?: number; nombre: string; cantidadMinima: number; precioPorPresentacion: string; principal: boolean; activo: boolean; orden: number }
export type ReglaPrecioCantidadPersistida = Omit<ReglaPrecioCantidadBorrador, 'idReglaPrecio'> & { idReglaPrecio: number }
export interface ListaPrecioAdmin { idListaPrecio: number; nombre: string; principal: boolean; activo: boolean; reglas: ReglaPrecioCantidadPersistida[] }
export interface VariantePrecioCantidadAdmin { idVariante: number; sku: string; nombreVisible: string; idListaPrecio: number | null; listaEfectiva: number | null }
export interface ConfiguracionPrecioCantidadAdmin { producto: { idProducto: number; nombre: string }; listasPrecio: ListaPrecioAdmin[]; variantes: VariantePrecioCantidadAdmin[] }
export interface PreviewPrecioCantidad { cantidad: number; idReglaPrecio: number; cantidadMinimaAplicada: number; precioPorPresentacion: string; subtotal: string }
export type ListaPrecioPayload = Omit<ListaPrecioAdmin, 'idListaPrecio' | 'reglas'> & { reglas: ReglaPrecioCantidadBorrador[] }

export const getConfiguracionPrecioCantidad = async (idProducto: number): Promise<ConfiguracionPrecioCantidadAdmin> => (await adminApi.get(`/admin/productos/${idProducto}/precios-cantidad`)).data
export const crearListaPrecio = async (idProducto: number, body: ListaPrecioPayload) => (await adminApi.post(`/admin/productos/${idProducto}/listas-precio`, body)).data
export const guardarListaPrecio = async (idProducto: number, idListaPrecio: number, body: ListaPrecioPayload) => (await adminApi.put(`/admin/productos/${idProducto}/listas-precio/${idListaPrecio}`, body)).data
export const eliminarListaPrecio = async (idProducto: number, idListaPrecio: number) => adminApi.delete(`/admin/productos/${idProducto}/listas-precio/${idListaPrecio}`)
export const asignarListaPrecio = async (idProducto: number, idsVariante: number[], idListaPrecio: number | null) => adminApi.put(`/admin/productos/${idProducto}/variantes/lista-precio`, { idsVariante, idListaPrecio })
export const previsualizarPrecioCantidad = async (cantidad: number, reglas: ReglaPrecioCantidadBorrador[]): Promise<PreviewPrecioCantidad> => (await adminApi.post('/admin/precios-cantidad/previsualizar', { cantidad, reglas })).data
