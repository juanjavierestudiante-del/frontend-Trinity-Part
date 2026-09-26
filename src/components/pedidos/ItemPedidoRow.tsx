import type { PedidoDetalleAdmin } from '../../services/admin/pedido.api';
import { getNombreDetallePedido } from '../../utils/pedidos';

interface ItemPedidoRowProps {
  detalle: PedidoDetalleAdmin;
}

export default function ItemPedidoRow({ detalle }: ItemPedidoRowProps) {
  const sku = detalle.skuSnapshot ?? detalle.variante?.sku;
  const precio = Number(detalle.precioUnitario);
  const subtotal = precio * Number(detalle.cantidad);

  return (
    <div className="flex flex-col">
      <p className="text-base font-medium">{getNombreDetallePedido(detalle)}</p>
      {sku ? <p className="mt-0.5 text-[11px] font-normal text-gray-400">{sku}</p> : null}
      <p className="mt-1.5 text-sm">
        {detalle.cantidad} unidades × Bs. {precio.toFixed(2)}
      </p>
      <p className="mt-1 font-semibold">Subtotal: Bs. {subtotal.toFixed(2)}</p>
    </div>
  );
}
