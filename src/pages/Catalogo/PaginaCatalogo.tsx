import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductos } from "../../hooks/useCatalogo";
import ProductoCard from "../../components/catalogo/ProductoCard";
import MenuCategorias from "../../components/catalogo/MenuCategorias";
import BuscadorProductos from "../../components/catalogo/BuscadorProductos";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";

export default function Catalogo() {
  const { slug } = useParams<{ slug: string }>();
  const [busqueda, setBusqueda] = useState("");

  const {
    data: productos,
    isLoading,
    isError,
  } = useProductos({
    categoria: slug,
    q: busqueda || undefined,
  });

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Catálogo
          </p>
          <h1 className="text-4xl font-black text-gray-900 font-display">
            Explora todos nuestros productos
          </h1>
          <p className="max-w-2xl text-gray-600">
            Descubre las últimas variantes, precios y presentaciones disponibles.
          </p>

          <div className="max-w-md">
            <BuscadorProductos onBuscar={setBusqueda} />
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-6">
              <MenuCategorias />
            </div>
          </aside>

          <section className="flex-1">
            {isLoading && (
              <StatusMessage status="loading" message="Cargando productos..." />
            )}

            {isError && (
              <StatusMessage status="error" message="Error al cargar el catálogo." />
            )}

            {!isLoading && !isError && productos && productos.length === 0 && (
              <StatusMessage
                status="empty"
                message="No se encontraron productos. Intenta con otra categoría o cambia los términos de búsqueda."
              />
            )}

            {!isLoading && !isError && productos && productos.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {productos.map((producto, index) => (
                  <div
                    key={producto.idProducto}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <ProductoCard producto={producto} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
