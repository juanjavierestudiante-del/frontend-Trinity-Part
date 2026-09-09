import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import type { Categoria } from '../../types/catalogo.types';
import Card from '../ui/Card/Card';

interface Props {
  categoria: Categoria;
  fallbackImage?: string | null;
}

export default function CategoriaCard({ categoria, fallbackImage }: Props) {
  const imageUrl = categoria.imagenUrl || fallbackImage;

  return (
    <Link to={`/categoria/${categoria.slug}`} className="group block">
      <Card variant="interactive" padding="none" className="overflow-hidden">
        <div className="flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-light via-primary-light/70 to-secondary/30 aspect-[16/9]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={categoria.nombre}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImageIcon className="h-14 w-14 text-primary/45" aria-hidden="true" />
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
