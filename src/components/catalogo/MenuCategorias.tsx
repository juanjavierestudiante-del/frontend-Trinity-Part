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
    <div className={esRaiz ? 'border-b border-white/40 last:border-b-0' : ''}>
      <div className="flex items-center justify-between">
        <Link
          to={`/categoria/${categoria.slug}`}
          className={`flex-1 block py-2 pr-2 text-sm transition-all duration-200 rounded-lg ${
            esRaiz ? 'px-3 font-semibold' : 'pl-2'
          } ${
            esActiva
              ? 'bg-white/70 text-primary-dark'
              : esRaiz
                ? 'text-primary-dark/90 hover:bg-white/30 hover:text-primary-dark'
                : 'text-primary-dark/80 hover:bg-white/20 hover:text-primary-dark'
          }`}
        >
          {!esRaiz && <span className="mr-1 text-primary/40">—</span>}
          {categoria.nombre}
        </Link>

        {tieneSub && (
          <button
            onClick={() => toggle(categoria.idCategoria)}
            className="p-2 text-primary-dark/60 transition-all duration-200 rounded-full hover:bg-white/30 hover:text-primary-dark"
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

  if (isLoading) return <p className="p-4 text-sm text-primary-dark/70">Cargando menú...</p>;

  return (
    <nav className="w-full max-w-xs p-4 space-y-2 bg-gradient-to-br from-white/30 via-white/15 to-white/10 border border-white/30 shadow-brand backdrop-blur-xl rounded-card">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-xs font-bold tracking-wider text-primary-dark/70 uppercase">
          Categorías
        </h2>

        {slug && (
          <Link
            to="/catalogo"
            className="flex items-center gap-1 text-xs font-semibold text-primary-dark hover:text-primary transition-colors"
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
