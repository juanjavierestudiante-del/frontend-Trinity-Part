import ProductCard from "../catalogo/ProductoCard";

export default function ProductosRelacionados({ productos }) {
  if (!productos || productos.length === 0) return null;

  return (
    <div>
      <h2 className="mb-8 text-3xl font-black text-gray-800">
        PRODUCTOS RELACIONADOS
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((prod) => (
          <ProductCard key={prod.idProducto} producto={prod} />
        ))}
      </div>
    </div>
  );
}
