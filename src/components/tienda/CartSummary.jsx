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
    <Card hover={false} className="p-6 h-fit sticky top-24">
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
      <Link
        to="/catalogo"
        className="block w-full text-center border-2 border-primary text-primary py-3 rounded-md font-bold hover:bg-primary-light transition-all duration-200"
      >
        Continuar comprando
      </Link>
    </Card>
  );
}
