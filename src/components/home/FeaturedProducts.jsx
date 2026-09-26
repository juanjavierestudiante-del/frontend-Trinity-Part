import ProductCard from "../catalogo/ProductoCard";
import ProductoCardSkeleton from "../catalogo/ProductoCardSkeleton";
import { useProductos } from "../../hooks/useCatalogo";
import Alert from "../ui/Alert/Alert";

const SKELETON_COUNT = 3;

export default function FeaturedProducts() {
  const {
    data,
    isLoading,
    isError,
  } = useProductos();

  const featured = (data?.items ?? []).slice(0, 3);

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl" aria-busy={isLoading}>
      <h2 className="mb-12 text-3xl font-black text-center text-gray-800 font-display">
        PRODUCTOS DESTACADOS
      </h2>

      {isError ? <Alert type="danger">No se pudieron cargar los productos destacados.</Alert> : null}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => <ProductoCardSkeleton key={index} />)}
        </div>
      ) : !isError ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((producto) => (
            <ProductCard key={producto.idProducto} producto={producto} featured />
          ))}
        </div>
      ) : null}
    </section>
  );
}
