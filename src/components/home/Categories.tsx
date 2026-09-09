import { useCategorias, useProductos } from "../../hooks/useCatalogo";
import CategoriaCard from "../catalogo/CategoriaCard";

export default function Categories() {
  const { data: categorias = [], isLoading } = useCategorias();
  const { data: productos, isLoading: productosLoading } = useProductos();

  if (isLoading || productosLoading) return null;

  const imagenesAdministradas = new Map<string, string>();
  categorias.forEach((categoria) => {
    if (categoria.imagenUrl) imagenesAdministradas.set(categoria.slug, categoria.imagenUrl);
  });

  const imagenesPorCategoria = new Map<string, string>();
  productos?.items.forEach((producto) => {
    const imagen = producto.imagenes.find((item) => item.principal)?.url
      ?? producto.imagenes[0]?.url;
    const slug = producto.categoria?.slug;

    if (imagen && slug && !imagenesPorCategoria.has(slug)) {
      imagenesPorCategoria.set(slug, imagen);
    }
  });

  const fallbackPorCategoria: Record<string, string | undefined> = {
    descartables: imagenesAdministradas.get('decoracion'),
    disfraces: imagenesAdministradas.get('cotillon'),
  };

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl">
      <h2 className="mb-12 text-3xl font-black text-center text-ink font-display">
        CATEGORÍAS
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.idCategoria}
            categoria={categoria}
            fallbackImage={
              imagenesPorCategoria.get(categoria.slug)
              ?? fallbackPorCategoria[categoria.slug]
              ?? null
            }
          />
        ))}
      </div>
    </section>
  );
}
