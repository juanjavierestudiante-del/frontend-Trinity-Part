import { useProductos } from '../../hooks/useCatalogo';
import ProductoCard from '../../components/catalogo/ProductoCard';
import StatusMessage from '../../components/ui/StatusMessage/StatusMessage';

export default function Home() {
  const { data: productos, isLoading, isError } = useProductos();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <StatusMessage status="loading" message="Cargando productos..." className="max-w-3xl mx-auto" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <StatusMessage status="error" message="Error al cargar productos." className="max-w-3xl mx-auto" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Bienvenido</p>
          <h1 className="text-4xl font-black text-gray-900 font-display">Explora nuestros productos</h1>
          <p className="max-w-2xl text-gray-600">
            Encuentra la mejor selección de productos con precios claros y variedad de presentaciones.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos?.map((producto) => (
            <ProductoCard key={producto.idProducto} producto={producto} />
          ))}
        </div>
      </div>
    </main>
  );
}
