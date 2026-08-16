import { Plus, Minus, ShoppingCart } from "lucide-react";
import Button from "../ui/Button/Button";

export default function ProductoDetalles({ product, quantity, setQuantity, onAddToCart }) {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="mb-4 text-4xl font-black text-gray-800 font-display">
        {product.nombre}
      </h1>

      <div className="flex items-center mb-6">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`text-2xl ${
                index < product.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="ml-2 text-lg text-gray-600">
          {product.rating} / 5
        </span>
      </div>

      <p className="mb-6 text-3xl font-bold text-primary font-display">
        ${product.precio}
      </p>

      <p className="mb-8 leading-relaxed text-gray-700">
        {product.descripcion}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <span className="font-bold">Cantidad:</span>

        <Button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          variant="ghost"
          size="sm"
          className="p-2 bg-gray-200 rounded-md"
        >
          <Minus size={20} />
        </Button>

        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-16 px-3 py-2 font-bold text-center border border-gray-300 rounded-md"
        />

        <Button
          onClick={() => setQuantity(quantity + 1)}
          variant="ghost"
          size="sm"
          className="p-2 bg-gray-200 rounded-md"
        >
          <Plus size={20} />
        </Button>
      </div>

      <Button
        onClick={onAddToCart}
        className="w-full mb-4"
        variant="primary"
        size="lg"
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingCart size={20} />
          Agregar al carrito
        </span>
      </Button>

      <Button className="w-full" variant="outline" size="lg">
        Comprar ahora
      </Button>
    </div>
  );
}
