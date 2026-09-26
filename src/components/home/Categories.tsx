import { useCategorias } from "../../hooks/useCatalogo";
import CategoriaCard from "../catalogo/CategoriaCard";
import CategoriaCardSkeleton from "../catalogo/CategoriaCardSkeleton";
import Alert from "../ui/Alert/Alert";

const SKELETON_COUNT = 6;

export default function Categories() {
  const { data: categorias = [], isLoading, isError } = useCategorias();

  return (
    <section className="px-4 py-16 mx-auto max-w-7xl" aria-busy={isLoading}>
      <h2 className="mb-12 text-3xl font-black text-center text-ink font-display">
        CATEGORÍAS
      </h2>
      {isError ? <Alert type="danger">No se pudieron cargar las categorías.</Alert> : null}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => <CategoriaCardSkeleton key={index} />)}
        </div>
      ) : !isError ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categorias.map((categoria) => (
            <CategoriaCard key={categoria.idCategoria} categoria={categoria} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
