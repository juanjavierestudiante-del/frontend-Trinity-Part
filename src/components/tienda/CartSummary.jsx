import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button/Button";
import Card from "../ui/Card/Card";

export default function CartSummary({ total }) {
  const subtotal = total;
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <Button onClick={handleCheckout} className="w-full mb-3" variant="primary" size="lg">
        Proceder al pago
      </Button>
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
