import { Link } from 'react-router-dom';
import type { Categoria } from '../../types/catalogo.types';
import Card from '../ui/Card/Card';
import { cloudinaryUrl } from '../../utils/cloudinary';

interface Props {
  categoria: Categoria;
}

export default function CategoriaCard({ categoria }: Props) {
  return (
    <Link to={`/categoria/${categoria.slug}`} className="group block">
      <Card variant="interactive" padding="none" className="overflow-hidden">
        <div className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-light via-primary-light/70 to-secondary/30 aspect-[16/9]">
          {categoria.imagenUrl ? (
            <img
              src={cloudinaryUrl(categoria.imagenUrl, 'w_400,q_auto,f_auto')}
              alt={categoria.nombre}
              loading="lazy"
              decoding="async"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-5xl drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
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
