import { Link } from 'react-router-dom';
import type { Categoria } from '../../types/catalogo.types';
import Card from '../ui/Card/Card';

interface Props {
  categoria: Categoria;
}

export default function CategoriaCard({ categoria }: Props) {
  return (
    <Link to={`/categoria/${categoria.slug}`} className="group block">
      <Card padding={false} className="overflow-hidden hover:-translate-y-1">
        <div className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-secondary aspect-[16/9]">
          {categoria.imagenUrl ? (
            <img
              src={categoria.imagenUrl}
              alt={categoria.nombre}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
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
      </Card>
    </Link>
  );
}