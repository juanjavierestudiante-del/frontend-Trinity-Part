import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { useCategorias } from '../../hooks/useCatalogo';
import type { Categoria } from '../../types/catalogo.types';

interface NodoCategoriaProps {
  categoria: Categoria;
  slug?: string;
  abiertas: Record<number, boolean>;
  toggle: (id: number) => void;
  nivel: number;
}

function NodoCategoria({ categoria, slug, abiertas, toggle, nivel }: NodoCategoriaProps) {
  const esRaiz = nivel === 0;
  const tieneSub = !!categoria.subcategorias?.length;
  const estaAbierta = !!abiertas[categoria.idCategoria];
  const esActiva = categoria.slug === slug;

  return (
    <div className={esRaiz ? 'border-b border-gray-100 last:border-b-0' : ''}>
      <div className="flex items-center justify-between">
        <Link
          to={`/categoria/${categoria.slug}`}
          className={`flex-1 block py-2 pr-2 text-sm transition-all duration-200 rounded-lg ${
            esRaiz ? 'px-3 font-semibold' : 'pl-2'
          } ${
            esActiva
              ? esRaiz
                ? 'bg-primary-light text-primary-dark'
                : 'bg-gray-100 text-gray-900'
              : esRaiz
                ? 'text-gray-800 hover:bg-primary-light/50 hover:text-primary-dark'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {!esRaiz && <span className="mr-1 text-gray-300">—</span>}
          {categoria.nombre}
        </Link>

        {tieneSub && (
          <button
            onClick={() => toggle(categoria.idCategoria)}
            className="p-2 text-gray-400 transition-all duration-200 rounded-full hover:bg-primary-light/50 hover:text-primary-dark"
            aria-label="Expandir subcategorías"
          >
            <ChevronDown
              size={esRaiz ? 16 : 14}
              className={`transition-transform duration-200 ${estaAbierta ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {tieneSub && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            estaAbierta ? 'max-h-[60rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-1 pl-4 space-y-1">
            {categoria.subcategorias.map((sub) => (
              <NodoCategoria
                key={sub.idCategoria}
                categoria={sub}
                slug={slug}
                abiertas={abiertas}
                toggle={toggle}
                nivel={nivel + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuCategorias() {
  const { data: categorias, isLoading } = useCategorias();
  const { slug } = useParams<{ slug: string }>();
  const [abiertas, setAbiertas] = useState<Record<number, boolean>>({});

  const toggle = (id: number) => {
    setAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) return <p className="p-4 text-sm text-gray-500">Cargando menú...</p>;

  return (
    <nav className="w-full max-w-xs p-4 space-y-2 bg-white border border-gray-200 shadow-sm rounded-card">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          Categorías
        </h2>

        {slug && (
          <Link
            to="/catalogo"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <X size={12} />
            Quitar filtro
          </Link>
        )}
      </div>

      {categorias?.map((categoria) => (
        <NodoCategoria
          key={categoria.idCategoria}
          categoria={categoria}
          slug={slug}
          abiertas={abiertas}
          toggle={toggle}
          nivel={0}
        />
      ))}
    </nav>
  );
}
