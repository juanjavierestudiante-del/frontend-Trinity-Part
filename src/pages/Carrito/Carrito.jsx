import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../../components/tienda/CartItem";
import CartSummary from "../../components/tienda/CartSummary";
import { useAuth } from "../../context/AuthContext";
import {
  useCarrito,
  useEliminarDelCarrito,
  useActualizarCantidadCarrito,
} from "../../hooks/useCarrito";
import Card from "../../components/ui/Card/Card";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";
import Alert from "../../components/ui/Alert/Alert";

export default function Carrito() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useCarrito();
  const eliminarMutation = useEliminarDelCarrito();
  const actualizarMutation = useActualizarCantidadCarrito();
  const [error, setError] = useState("");

  const itemsCarrito = useMemo(
    () =>
      (data?.items || []).map((d) => ({
        id: d.idDetalle,
        idVariante: d.variante?.idVariante || d.idVariante,
        nombre: d.variante?.producto?.nombre || d.variante?.sku || "Producto",
        cantidad: d.cantidad || 1,
        precio: Number(d.variante?.precioOferta || d.variante?.precioVenta) || 0,
        imagen:
          d.variante?.imagenes?.find((i) => i.principal)?.url ??
          d.variante?.imagenes?.[0]?.url ??
          d.variante?.producto?.imagenes?.find((i) => i.principal)?.url,
        sku: d.variante?.sku,
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

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDetalle(id);
      return;
    }
    actualizarMutation.mutate(
      { idDetalle: id, cantidad: nuevaCantidad },
      { onError: () => setError("No se pudo actualizar la cantidad") }
    );
  };

  const total = itemsCarrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-black text-gray-800 font-display">MI CARRITO</h1>

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
            <Card variant="elevated" padding="none" className="overflow-hidden lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 font-bold text-left">Producto</th>
                      <th className="px-6 py-3 font-bold text-center">Cantidad</th>
                      <th className="px-6 py-3 font-bold text-right">Precio</th>
                      <th className="px-6 py-3 font-bold text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsCarrito.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          id: item.id,
                          name: item.nombre,
                          quantity: item.cantidad,
                          price: item.precio,
                          image: item.imagen,
                          raw: item.raw,
                        }}
                        onRemove={eliminarDetalle}
                        onQuantityChange={cambiarCantidad}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <CartSummary total={total} />
          </div>
        )}
      </div>
    </div>
  );
}
