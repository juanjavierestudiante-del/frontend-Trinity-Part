import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import Button from "../ui/Button/Button";
import Card from "../ui/Card/Card";

export default function CartSummary({ total, sincronizando = false }) {
  const subtotal = total;
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Card variant="highlight" padding="lg" className="h-fit sticky top-24">
      <h3 className="text-2xl font-bold mb-6 font-display">RESUMEN</h3>
      <div className="space-y-4 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>Bs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Envío:</span>
          <span>Bs. 0.00</span>
        </div>
      </div>
      <div className="flex justify-between text-2xl font-black mb-6">
        <span>TOTAL:</span>
        <span className="text-primary">Bs. {subtotal.toFixed(2)}</span>
      </div>
      <Button onClick={handleCheckout} disabled={sincronizando} aria-describedby={sincronizando ? 'carrito-sincronizando' : undefined} className="w-full mb-3" variant="primary" size="lg">
        Proceder al pago
      </Button>
      {sincronizando ? <p id="carrito-sincronizando" role="status" className="mb-3 text-sm text-muted">Actualizando carrito…</p> : null}
      <Button
        as={Link}
        to="/catalogo"
        variant="outline"
        size="lg"
        className="w-full border-2 border-primary text-primary hover:bg-primary-light"
      >
        Continuar comprando
      </Button>
    </Card>
  );
}
