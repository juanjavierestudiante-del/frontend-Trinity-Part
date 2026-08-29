import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Producto } from '../../types/catalogo.types';
import Button from '../ui/Button/Button';
import Card from '../ui/Card/Card';

interface Props {
  producto: Producto;
  featured?: boolean;
  badge?: string;
  onAddToCart?: (producto: Producto) => void;
}

function getStockBadge(producto: Producto): { label: string; variant: string } | null {
  const variantesActivas = producto.variantes.filter((v) => v.estado === 'Activo');
  if (variantesActivas.length === 0) return null;

  const todoAgotado = variantesActivas.every(
    (v) => (v.inventario?.stockActual ?? 0) === 0
  );
  if (todoAgotado) return { label: 'Sin stock', variant: 'danger' };

  const tieneOferta = variantesActivas.some((v) => v.precioOferta != null);
  if (tieneOferta) return { label: 'Oferta', variant: 'primary' };

  if (producto.destacado) return { label: 'Nuevo', variant: 'secondary' };

  return null;
}

const BADGE_STYLES: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  danger: 'bg-red-500 text-white',
}

export default function ProductoCard({ producto, featured = false, badge: externalBadge, onAddToCart }: Props) {
  const imagen = producto.imagenes.find((i) => i.principal);
  const variantesActivas = producto.variantes.filter((v) => v.estado === 'Activo');
  const precioMinimo = variantesActivas.length > 0
    ? Math.min(...variantesActivas.map((v) => Number(v.precioOferta ?? v.precioVenta)))
    : null;

  const autoBadge = getStockBadge(producto);
  const badgeLabel = externalBadge ?? autoBadge?.label;
  const badgeVariant = autoBadge?.variant ?? 'primary';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(producto);
  };

  return (
    <Card padding={false} className="group relative overflow-hidden hover:-translate-y-1">
      {/* Badge */}
      {badgeLabel && (
        <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold rounded-md backdrop-blur-sm ${BADGE_STYLES[badgeVariant] || BADGE_STYLES.primary}`}>
          {badgeLabel}
        </span>
      )}

      {/* Imagen */}
      <Link to={`/productos/${producto.slug}`} className="block overflow-hidden">
        <div className="aspect-[4/5] overflow-hidden">
          {imagen ? (
            <img
              src={imagen.url}
              alt={producto.nombre}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-primary-light/30 flex items-center justify-center text-5xl">
              🎈
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4">
        <Link to={`/productos/${producto.slug}`} className="block">
          <h3 className="text-base font-bold text-ink font-display leading-tight line-clamp-2">
            {producto.nombre}
          </h3>
          {producto.descripcionCorta && (
            <p className="mt-1.5 text-sm text-muted leading-5 line-clamp-2">
              {producto.descripcionCorta}
            </p>
          )}
        </Link>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            {precioMinimo != null && (
              <p className="text-lg font-bold text-primary font-display">
                Bs. {precioMinimo.toFixed(2)}
              </p>
            )}
          </div>

          {onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              icon={ShoppingCart}
              onClick={handleAddToCart}
              className="shrink-0"
            >
              Agregar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
