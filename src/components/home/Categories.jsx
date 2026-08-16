import { useCategorias } from "../../hooks/useCatalogo";
import CategoriaCard from "../catalogo/CategoriaCard";

const CATEGORY_ICONS = {
  globos: '🎈',
  cotillon: '🎉',
  regalos: '🎁',
  decoracion: '🎀',
  default: '🎊',
};

export default function Categories() {
  const { data: categorias = [], isLoading } = useCategorias();

  if (isLoading) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-ink font-display">
        CATEGORÍAS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.idCategoria}
            categoria={categoria}
            icon={CATEGORY_ICONS[categoria.slug] ?? CATEGORY_ICONS.default}
          />
        ))}
      </div>
    </section>
  );
}
