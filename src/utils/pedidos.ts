import type { PedidoDetalleAdmin } from '../services/admin/pedido.api';

export function getNombreDetallePedido(detalle: PedidoDetalleAdmin): string {
  const nombre =
    detalle.nombreProductoSnapshot ??
    detalle.variante?.producto?.nombre ??
    detalle.skuSnapshot ??
    detalle.variante?.sku ??
    'Producto';

  const idAtributoPrincipal = detalle.variante?.producto?.idAtributoPrincipal;
  if (!idAtributoPrincipal) return nombre;

  const atributo = detalle.variante?.varianteAtributo?.find(
    (item) => item.valorAtributo?.idAtributo === idAtributoPrincipal,
  );
  const valor = detalle.valorAtributoPrincipalSnapshot ?? atributo?.valorAtributo?.valor;

  return valor ? `${nombre} · ${valor}` : nombre;
}
