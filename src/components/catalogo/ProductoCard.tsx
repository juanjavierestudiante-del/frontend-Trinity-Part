import { Link } from 'react-router-dom';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';
import type { Producto } from '../../types/catalogo.types';
import Button from '../ui/Button/Button';
import Card from '../ui/Card/Card';
import { cloudinaryUrl } from '../../utils/cloudinary';

interface Props {
  producto: Producto;
  featured?: boolean;
  badge?: string;
  onAddToCart?: (producto: Producto) => void;
}

function getStockBadge(producto: Producto): { label: string; variant: string } | null {
  const variantesActivas = (producto.variantes ?? []).filter((v) => v.estado === 'Activo');
  if (variantesActivas.length === 0) return null;

  const todoAgotado = variantesActivas.every(
    (v) => (v.inventario?.stockActual ?? 0) === 0
  );
  if (todoAgotado) return { label: 'Sin stock', variant: 'danger' };

  if (producto.destacado) return { label: 'Nuevo', variant: 'secondary' };

  return null;
}

const BADGE_STYLES: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  danger: 'bg-red-500 text-white',
}

export default function ProductoCard({ producto, badge: externalBadge, onAddToCart }: Props) {
  const imagen = (producto.imagenes ?? []).find((i) => i.principal) ?? producto.imagenes?.[0];
  const precioDesde = producto.precioDesde;

  const autoBadge = getStockBadge(producto);
  const badgeLabel = externalBadge ?? autoBadge?.label;
  const badgeVariant = autoBadge?.variant ?? 'primary';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(producto);
  };

  return (
    <Card variant="interactive" padding="none" className="group overflow-hidden">
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
              src={cloudinaryUrl(imagen.url, 'w_500,q_auto,f_auto')}
              alt={producto.nombre}
              loading="lazy"
              decoding="async"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="w-full h-full bg-primary-light/30 flex items-center justify-center text-5xl text-primary-dark/40" role="img" aria-label={producto.nombre}>
              <ImageIcon className="w-16 h-16" aria-hidden="true" />
              <span className="sr-only">{producto.nombre}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="min-w-0 p-3 sm:p-4">
        <Link to={`/productos/${producto.slug}`} className="block">
          <h3 className="min-w-0 text-sm font-extrabold sm:text-base text-ink font-display leading-tight line-clamp-2">
            {producto.nombre}
          </h3>
          {producto.descripcionCorta && (
            <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm text-muted leading-5 line-clamp-2">
              {producto.descripcionCorta}
            </p>
          )}
        </Link>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            {precioDesde != null && (
              <p className="text-base font-black sm:text-lg tracking-tight text-primary font-display">
                {producto.tieneVariacionPrecio ? 'Desde ' : ''}Bs. {Number(precioDesde).toFixed(2)}
              </p>
            )}
          </div>

          {onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              icon={ShoppingCart}
              onClick={handleAddToCart}
              aria-label={`Agregar ${producto.nombre} al carrito`}
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
