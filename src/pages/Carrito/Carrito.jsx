import { useMemo, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import CartItem from "../../components/tienda/CartItem";
import CartSummary from "../../components/tienda/CartSummary";
import { useAuthStore } from "../../store/auth.store";
import {
  useCarrito,
  useEliminarDelCarrito,
  useActualizarCantidadCarrito,
} from "../../hooks/useCarrito";
import Card from "../../components/ui/Card/Card";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";
import Alert from "../../components/ui/Alert/Alert";

const subscribeDesktop = (callback) => {
  const media = window.matchMedia("(min-width: 1024px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getDesktopSnapshot = () => window.matchMedia("(min-width: 1024px)").matches;
const getServerDesktopSnapshot = () => true;

export default function Carrito() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useCarrito();
  const eliminarMutation = useEliminarDelCarrito();
  const actualizarMutation = useActualizarCantidadCarrito();
  const [error, setError] = useState("");
  const esDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerDesktopSnapshot);

  const itemsCarrito = useMemo(
    () =>
      (data?.items || []).map((d) => ({
        id: d.idDetalle,
        idVariante: d.idVariante,
        nombre: d.producto?.nombre || d.sku || "Producto",
        cantidad: d.cantidad || 1,
        precio: Number(d.precioPorPresentacion) || 0,
        subtotal: Number(d.subtotal) || 0,
        imagen: d.producto?.imagen,
        sku: d.sku,
        raw: d,
      })),
    [data]
  );

  const eliminarDetalle = (id_detalle) => {
    eliminarMutation.mutate(
      { idDetalle: id_detalle },
      { onError: () => setError("No se pudo eliminar el artículo") }
    );
  };

  const cambiarCantidad = (id, delta) => {
    const item = data?.items?.find((detalle) => detalle.idDetalle === id);
    if (delta < 0 && item?.cantidad <= 1) {
      eliminarDetalle(id);
      return;
    }
    actualizarMutation.mutate(
      { idDetalle: id, delta },
      { onError: () => setError("No se pudo actualizar la cantidad") }
    );
  };

  const total = Number(data?.total) || 0;
  const gruposConPrecioCombinado = (data?.gruposPrecio || []).filter((grupo) =>
    grupo.idsVariantes?.length > 1 && grupo.cantidadMinimaAplicada > 1
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-4 py-6 sm:py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-black text-ink font-display sm:mb-8 sm:text-4xl">MI CARRITO</h1>

        {!user ? (
          <Card variant="default" padding={false} className="p-6 text-center sm:p-12">
            <p className="mb-4 text-2xl text-gray-600">Debes iniciar sesión para ver tu carrito</p>
            <Link to="/login" className="text-lg font-bold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </Card>
        ) : isLoading ? (
          <StatusMessage status="loading" message="Cargando carrito..." />
        ) : isError ? (
          <Alert type="danger">No se pudo cargar el carrito</Alert>
        ) : error ? (
          <Alert type="danger">{error}</Alert>
        ) : itemsCarrito.length === 0 ? (
          <Card variant="default" padding={false} className="p-6 text-center sm:p-12">
            <p className="mb-4 text-2xl text-gray-600">Tu carrito está vacío</p>
            <Link to="/catalogo" className="text-lg font-bold text-primary hover:underline">
              Continuar comprando
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {!esDesktop ? <div className="space-y-3">
                {itemsCarrito.map((item) => (
                  <CartItem
                    key={item.id}
                    mobile
                    item={{ id: item.id, name: item.nombre, quantity: item.cantidad, price: item.precio, subtotal: item.subtotal, image: item.imagen, raw: item.raw }}
                    pending={typeof item.id !== "number"}
                    onRemove={eliminarDetalle}
                    onQuantityChange={cambiarCantidad}
                  />
                ))}
              </div> : null}
              {esDesktop ? <Card variant="elevated" padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-100"><tr><th className="px-6 py-3 font-bold text-left">Producto</th><th className="px-6 py-3 font-bold text-center">Cantidad</th><th className="px-6 py-3 font-bold text-right">Precio</th><th className="px-6 py-3 font-bold text-center">Acción</th></tr></thead>
                    <tbody>{itemsCarrito.map((item) => (
                      <CartItem key={item.id} item={{ id: item.id, name: item.nombre, quantity: item.cantidad, price: item.precio, subtotal: item.subtotal, image: item.imagen, raw: item.raw }} pending={typeof item.id !== "number"} onRemove={eliminarDetalle} onQuantityChange={cambiarCantidad} />
                    ))}</tbody>
                  </table>
                </div>
              </Card> : null}
              {gruposConPrecioCombinado.length > 0 ? (
                <div className="space-y-2 border-t border-primary/10 bg-primary-light/15 px-5 py-4 text-sm text-primary-dark">
                  {gruposConPrecioCombinado.map((grupo) => (
                    <p key={`${grupo.idProducto}-${grupo.idListaPrecioEfectiva}`}>
                      <span className="font-semibold">Precio por cantidad aplicado:</span>{' '}
                      {grupo.cantidadTotalGrupo} presentaciones combinadas. Desde {grupo.cantidadMinimaAplicada}: Bs. {Number(grupo.precioPorPresentacion).toFixed(2)} c/u.
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <CartSummary total={total} sincronizando={itemsCarrito.some((item) => typeof item.id !== "number")} />
          </div>
        )}
      </div>
    </div>
  );
}
