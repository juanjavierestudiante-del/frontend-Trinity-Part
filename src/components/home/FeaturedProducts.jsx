import ProductCard from "../catalogo/ProductoCard";
import { useProductos } from "../../hooks/useCatalogo";

export default function FeaturedProducts() {
  const {
    data: productos = [],
    isLoading,
    isError,
  } = useProductos();

  const featured = productos.slice(0, 3);

  if (isLoading || isError) return null;

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl">
      <h2 className="mb-12 text-3xl font-black text-center text-gray-800 font-display">
        PRODUCTOS DESTACADOS
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((producto) => (
          <ProductCard
            key={producto.idProducto}
            producto={producto}
            featured
          />
        ))}
      </div>
    </section>
  );
}
