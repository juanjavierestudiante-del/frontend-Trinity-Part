import { Link } from 'react-router-dom';
import type { Categoria } from '../../types/catalogo.types';

interface Props {
  categoria: Categoria;
}

export default function CategoriaCard({ categoria }: Props) {
  return (
    <Link
      to={`/categoria/${categoria.slug}`}
      className="group block bg-surface rounded-card shadow-brand overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-brand-lg"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
        {categoria.imagenUrl ? (
          <img
            src={categoria.imagenUrl}
            alt={categoria.nombre}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <span className="text-6xl transition-transform duration-200 group-hover:scale-110">
            🎉
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-ink font-display">
          {categoria.nombre}
        </h3>
      </div>
    </Link>
  );
}
