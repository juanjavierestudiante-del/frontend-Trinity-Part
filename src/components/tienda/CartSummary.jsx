import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import Button from "../ui/Button/Button";
import Card from "../ui/Card/Card";

export default function CartSummary({ items, total }) {
  const subtotal = total;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + tax;
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const pedido = await api.crearPedido({ total: finalTotal, id_usuario: user.id, estado: 'pendiente' });
      const id_pedido = pedido.id_pedido || pedido.id;
      for (const it of items) {
        await api.agregaDetallePedido({ cantidad: it.quantity, precio_unitario: it.price, id_pedido, id_producto: it.raw?.producto?.id || it.raw?.id_producto || it.id });
      }
      window.dispatchEvent(new CustomEvent('cart-updated'));
      navigate('/perfil');
    } catch (err) {
      console.error(err);
      alert('Error al crear el pedido');
    }
  };

  return (
    <Card hover={false} className="p-6 h-fit sticky top-24">
      <h3 className="text-2xl font-bold mb-6 font-display">RESUMEN</h3>
      <div className="space-y-4 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Envío:</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Impuestos (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between text-2xl font-black mb-6">
        <span>TOTAL:</span>
        <span className="text-primary">${finalTotal.toFixed(2)}</span>
      </div>
      <Button onClick={handleCheckout} className="w-full mb-3" variant="primary" size="lg">
        Proceder al pago
      </Button>
      <Link
        to="/catalogo"
        className="block w-full text-center border-2 border-primary text-primary py-3 rounded-md font-bold hover:bg-primary-light transition-all duration-200"
      >
        Continuar comprando
      </Link>
    </Card>
  );
}
