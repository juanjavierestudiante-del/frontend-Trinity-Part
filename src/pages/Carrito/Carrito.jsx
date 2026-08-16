import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../../components/tienda/CartItem";
import CartSummary from "../../components/tienda/CartSummary";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import Card from "../../components/ui/Card/Card";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";
import Alert from "../../components/ui/Alert/Alert";

export default function Carrito() {
  const { user } = useAuth();
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await api.obtenerCarritoPorUsuario(user.id);
        const items = (data.detalles || []).map((d) => ({
          id: d.id_detalle || d.id || d.id_detalle,
          nombre: d.producto?.nombre || "Producto",
          cantidad: d.cantidad || 1,
          precio: Number(d.producto?.precio) || 0,
          imagen: d.imagenes && d.imagenes.length > 0 ? d.imagenes[0].url : undefined,
          raw: d,
        }));
        setItemsCarrito(items);
      } catch {
        setError("No se pudo cargar el carrito");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const eliminarDetalle = async (id_detalle) => {
    try {
      await api.eliminaDetalleCarrito(id_detalle);
      setItemsCarrito(itemsCarrito.filter((item) => item.id !== id_detalle));
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el artículo');
    }
  };

  const cambiarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarDetalle(id);
      return;
    }
    const prev = itemsCarrito;
    setItemsCarrito((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item)));
    try {
      await api.actualizarDetalleCarrito(id, nuevaCantidad);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      console.error(err);
      setItemsCarrito(prev);
      setError('No se pudo actualizar la cantidad');
    }
  };

  const total = itemsCarrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-black text-gray-800 font-display">MI CARRITO</h1>

        {!user ? (
          <Card hover={false} className="p-12 text-center">
            <p className="mb-4 text-2xl text-gray-600">Debes iniciar sesión para ver tu carrito</p>
            <Link to="/login" className="text-lg font-bold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </Card>
        ) : loading ? (
          <StatusMessage status="loading" message="Cargando carrito..." />
        ) : error ? (
          <Alert type="danger">{error}</Alert>
        ) : itemsCarrito.length === 0 ? (
          <Card hover={false} className="p-12 text-center">
            <p className="mb-4 text-2xl text-gray-600">Tu carrito está vacío</p>
            <Link to="/catalogo" className="text-lg font-bold text-primary hover:underline">
              Continuar comprando
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="overflow-hidden bg-white rounded-card shadow-lg lg:col-span-2">
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
            </div>

            <CartSummary items={itemsCarrito} total={total} />
          </div>
        )}
      </div>
    </div>
  );
}
