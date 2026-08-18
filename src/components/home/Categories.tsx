import { useCategorias } from "../../hooks/useCatalogo";
import CategoriaCard from "../catalogo/CategoriaCard";

export default function Categories() {
  const { data: categorias = [], isLoading } = useCategorias();

  if (isLoading) return null;

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
          />
        ))}
      </div>
    </section>
  );
}
