import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducto } from '../../hooks/useCatalogo';
import type { ImagenProducto, ImagenVariante, Variante } from '../../types/catalogo.types';
import StatusMessage from '../../components/ui/StatusMessage/StatusMessage';
import Card from '../../components/ui/Card/Card';
import Seo from '../../components/seo/Seo';
import ProductoGaleria from '../../components/producto/ProductoGaleria';
import BuyBox, { ResumenProducto } from '../../components/producto/BuyBox';
import { useAuth } from '../../context/AuthContext';
import { useAgregarAlCarrito } from '../../hooks/useCarrito';

export default function PaginaProducto() {
  const { slug } = useParams<{ slug: string }>();
  const { data: producto, isLoading, isError } = useProducto(slug!);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<Variante | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const { mutate: agregarAlCarrito, isPending: agregando } = useAgregarAlCarrito();
  const { user } = useAuth();

  const seleccionarVariante = useCallback((variante: Variante | null) => {
    setVarianteSeleccionada(variante);
  }, []);

  useEffect(() => {
    const inicial = producto?.variantes.find((variante) => variante.estado === 'Activo') ?? null;
    setVarianteSeleccionada(inicial);
    setCantidad(1);
  }, [producto?.idProducto]);

  const stock = varianteSeleccionada?.inventario?.stockActual ?? 0;

  useEffect(() => {
    setCantidad((actual) => Math.min(Math.max(1, actual), Math.max(1, stock)));
  }, [varianteSeleccionada?.idVariante, stock]);

  const imagenes = useMemo(() => {
    if (!producto) return [];
    const vistas: Array<ImagenProducto | ImagenVariante> = [
      ...(varianteSeleccionada?.imagenes ?? []),
      ...producto.imagenes,
    ];
    return vistas.filter((imagen, indice, lista) =>
      lista.findIndex((otra) => otra.idImagen === imagen.idImagen || otra.url === imagen.url) === indice
    );
  }, [producto, varianteSeleccionada]);

  if (isLoading) {
    return <div className="min-h-screen px-4 py-16"><StatusMessage status="loading" message="Cargando producto..." className="mx-auto max-w-3xl" /></div>;
  }

  if (isError || !producto) {
    return <div className="min-h-screen px-4 py-16"><StatusMessage status="error" message="Producto no encontrado." className="mx-auto max-w-3xl" /></div>;
  }

  const imagenPrincipal = imagenes.find((imagen) => imagen.principal)?.url ?? imagenes[0]?.url;
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion ?? producto.descripcionCorta ?? undefined,
    image: imagenPrincipal,
    sku: varianteSeleccionada?.sku,
    brand: varianteSeleccionada?.marca?.nombre ? { '@type': 'Brand', name: varianteSeleccionada.marca.nombre } : undefined,
    ...(varianteSeleccionada ? {
      offers: {
        '@type': 'Offer',
        price: Number(varianteSeleccionada.precioOferta ?? varianteSeleccionada.precioVenta).toFixed(2),
        priceCurrency: 'BOB',
        availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    } : {}),
  };

  const handleCantidad = (nuevaCantidad: number) => setCantidad(Math.min(Math.max(1, nuevaCantidad), Math.max(1, stock)));
  const handleAgregarAlCarrito = () => {
    if (!varianteSeleccionada || !user || stock === 0) return;
    agregarAlCarrito(
      { idVariante: varianteSeleccionada.idVariante, cantidad },
      { onError: (err: any) => alert(err?.response?.data?.error || 'Error al agregar al carrito') }
    );
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <Seo title={`${producto.nombre} | Trinity Party & Events`} description={producto.descripcionCorta ?? producto.descripcion ?? undefined} jsonLd={jsonLdProduct} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 lg:hidden"><ResumenProducto producto={producto} variante={varianteSeleccionada} stock={stock} /></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.98fr)] lg:gap-10">
          <ProductoGaleria imagenes={imagenes} nombre={producto.nombre} />
          <div className="lg:sticky lg:top-24">
            <BuyBox producto={producto} variante={varianteSeleccionada} stock={stock} cantidad={cantidad} onCantidadChange={handleCantidad} onSeleccionarVariante={seleccionarVariante} onAgregarAlCarrito={handleAgregarAlCarrito} agregando={agregando} usuario={user} />
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.98fr)]">
          <Card variant="subtle" padding="lg">
            <h2 className="text-2xl font-bold text-ink">Descripción</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{producto.descripcion || producto.descripcionCorta || 'Sin descripción adicional.'}</p>
          </Card>
          <Card variant="subtle" padding="lg">
            <h2 className="text-2xl font-bold text-ink">Información adicional</h2>
            <dl className="mt-4 divide-y divide-white/45 text-sm">
              {varianteSeleccionada?.sku && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">SKU</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.sku}</dd></div>}
              {producto.categoria?.nombre && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Categoría</dt><dd className="text-right font-semibold text-ink">{producto.categoria.nombre}</dd></div>}
              {varianteSeleccionada?.marca?.nombre && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Marca</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.marca.nombre}</dd></div>}
              {varianteSeleccionada && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Presentación</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.cantidadContenido} {varianteSeleccionada.unidad?.nombre ?? varianteSeleccionada.unidad?.abreviatura ?? ''}</dd></div>}
            </dl>
          </Card>
        </div>
      </div>
    </main>
  );
}
