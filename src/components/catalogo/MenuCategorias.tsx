import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { useCategorias } from '../../hooks/useCatalogo';

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

      {categorias?.map((categoria) => {
        const tieneSub = categoria.subcategorias?.length > 0;
        const estaAbierta = abiertas[categoria.idCategoria];
        const esActiva = categoria.slug === slug;

        return (
          <div key={categoria.idCategoria} className="border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between">
              <Link
                to={`/categoria/${categoria.slug}`}
                className={`flex-1 block px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  esActiva
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-gray-800 hover:bg-primary-light/50 hover:text-primary-dark'
                }`}
              >
                {categoria.nombre}
              </Link>

              {tieneSub && (
                <button
                  onClick={() => toggle(categoria.idCategoria)}
                  className="p-2 text-gray-400 transition-all duration-200 rounded-full hover:bg-primary-light/50 hover:text-primary-dark"
                  aria-label="Expandir subcategorías"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${estaAbierta ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>

            {tieneSub && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  estaAbierta ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="py-1 pl-4 space-y-1">
                  {categoria.subcategorias.map((sub) => {
                    const subActiva = sub.slug === slug;
                    return (
                      <Link
                        key={sub.idCategoria}
                        to={`/categoria/${sub.slug}`}
                        className={`block px-3 py-2 text-sm transition-all duration-200 rounded-lg ${
                          subActiva
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        — {sub.nombre}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
