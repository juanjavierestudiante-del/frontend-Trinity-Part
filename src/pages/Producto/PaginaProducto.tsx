import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducto, usePrecioProducto } from '../../hooks/useCatalogo';
import type { ImagenProducto, ImagenVariante, Variante } from '../../types/catalogo.types';
import StatusMessage from '../../components/ui/StatusMessage/StatusMessage';
import Card from '../../components/ui/Card/Card';
import Seo from '../../components/seo/Seo';
import ProductoGaleria from '../../components/producto/ProductoGaleria';
import BuyBox, { ResumenProducto } from '../../components/producto/BuyBox';
import BarraCompraMovil from '../../components/producto/BarraCompraMovil';
import { useAuthStore } from '../../store/auth.store';
import { useAgregarAlCarrito } from '../../hooks/useCarrito';
import Alert from '../../components/ui/Alert/Alert';

const normalizarAtributo = (nombre: string) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const obtenerValorAtributo = (variante: Variante | null, nombres: string[]) => variante?.varianteAtributo.find(({ valorAtributo }) =>
  nombres.some((nombre) => normalizarAtributo(valorAtributo.atributo.nombre) === normalizarAtributo(nombre))
)?.valorAtributo.valor;

export default function PaginaProducto() {
  const { slug } = useParams<{ slug: string }>();
  const { data: producto, isLoading, isError } = useProducto(slug!);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<Variante | null>(null);
  const [atributoPendiente, setAtributoPendiente] = useState<{ idAtributo: number; nombre: string } | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');
  const [agregado, setAgregado] = useState(false);
  const ultimoClickAgregar = useRef(0);
  const { mutate: agregarAlCarrito } = useAgregarAlCarrito();
  const user = useAuthStore((state) => state.user);

  const seleccionarVariante = useCallback((variante: Variante | null) => {
    setVarianteSeleccionada(variante);
  }, []);

  const solicitarAtributo = useCallback(() => {
    const destino = atributoPendiente ? document.getElementById(`atributo-${atributoPendiente.idAtributo}`) : document.getElementById('selector-atributos');
    destino?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => destino?.focus(), 350);
  }, [atributoPendiente]);

  useEffect(() => {
    const inicial = producto?.variantes.find((variante) => variante.estado === 'Activo') ?? null;
    setVarianteSeleccionada(inicial);
    setCantidad(1);
  }, [producto?.idProducto]);

  const stock = varianteSeleccionada?.inventario?.stockActual ?? 0;
  const precioQuery = usePrecioProducto(producto?.idProducto, varianteSeleccionada?.idVariante, cantidad);
  const precioLinea = precioQuery.data?.lineas[0];
  const listaEfectiva = varianteSeleccionada
    ? producto?.listaPrecios.find((lista) => lista.idListaPrecio === varianteSeleccionada.idListaPrecio)
      ?? producto?.listaPrecios.find((lista) => lista.principal)
    : undefined;

  const material = obtenerValorAtributo(varianteSeleccionada, ['material']);
  const tamano = obtenerValorAtributo(varianteSeleccionada, ['tamano', 'tamaño']);

  useEffect(() => {
    setCantidad((actual) => Math.min(Math.max(1, actual), Math.max(1, stock)));
  }, [varianteSeleccionada?.idVariante, stock]);

  useEffect(() => {
    if (!agregado) return undefined;
    const timeout = window.setTimeout(() => setAgregado(false), 1_500);
    return () => window.clearTimeout(timeout);
  }, [agregado]);

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
    ...(varianteSeleccionada && precioLinea ? {
      offers: {
        '@type': 'Offer',
        price: precioLinea?.precioPorPresentacion,
        priceCurrency: 'BOB',
        availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    } : {}),
  };

  const handleCantidad = (nuevaCantidad: number) => setCantidad(Math.min(Math.max(1, nuevaCantidad), Math.max(1, stock)));
  const handleAgregarAlCarrito = () => {
    if (!varianteSeleccionada || !user || stock === 0 || !precioLinea) return;
    const ahora = Date.now();
    // Ignora únicamente dobles pulsaciones accidentales; no bloquea el botón
    // durante el RTT del backend ni impide que el usuario siga navegando.
    if (ahora - ultimoClickAgregar.current < 200) return;
    ultimoClickAgregar.current = ahora;
    setError('');
    setAgregado(true);
    agregarAlCarrito(
      {
        idVariante: varianteSeleccionada.idVariante,
        cantidad,
        optimisticItem: {
          idDetalle: `optimistic-${varianteSeleccionada.idVariante}-${ahora}`,
          idVariante: varianteSeleccionada.idVariante,
          cantidad,
          precioPorPresentacion: precioLinea.precioPorPresentacion,
          subtotal: precioLinea.subtotal,
          idListaPrecioEfectiva: precioLinea.idListaPrecioEfectiva,
          stock,
          sku: varianteSeleccionada.sku,
          producto: {
            idProducto: producto.idProducto,
            nombre: producto.nombre,
            slug: producto.slug,
            imagen: imagenes.find((imagen) => imagen.principal)?.url ?? imagenes[0]?.url ?? null,
          },
        },
      },
      {
        onError: (err: any) => {
          setAgregado(false);
          setError(err?.response?.data?.error || 'No se pudo agregar el producto');
        },
      }
    );
  };

  return (
    <main className="min-h-screen px-4 py-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:py-10 md:pb-10">
      <Seo title={`${producto.nombre} | Trinity Party & Events`} description={producto.descripcionCorta ?? producto.descripcion ?? undefined} jsonLd={jsonLdProduct} />
      <div className="mx-auto max-w-7xl">
        {error ? <Alert type="danger" className="mb-5" onDismiss={() => setError('')}>{error}</Alert> : null}
        <div className="mb-6 lg:hidden"><ResumenProducto producto={producto} variante={varianteSeleccionada} cantidad={cantidad} precioPorPresentacion={precioLinea?.precioPorPresentacion} subtotal={precioLinea?.subtotal} cantidadMinimaAplicada={precioLinea?.cantidadMinimaAplicada} reglasPrecio={listaEfectiva?.reglas} /></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.98fr)] lg:gap-x-10 lg:gap-y-10">
          <ProductoGaleria imagenes={imagenes} nombre={producto.nombre} />
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
            <BuyBox producto={producto} variante={varianteSeleccionada} stock={stock} cantidad={cantidad} precioPorPresentacion={precioLinea?.precioPorPresentacion} subtotal={precioLinea?.subtotal} cantidadMinimaAplicada={precioLinea?.cantidadMinimaAplicada} reglasPrecio={listaEfectiva?.reglas} onCantidadChange={handleCantidad} onSeleccionarVariante={seleccionarVariante} onSeleccionIncompleta={setAtributoPendiente} atributoPendiente={atributoPendiente} onSolicitarAtributo={solicitarAtributo} onAgregarAlCarrito={handleAgregarAlCarrito} agregado={agregado} usuario={user} />
          </aside>
          <div className="space-y-6 lg:col-start-1 lg:row-start-2">
            <Card variant="subtle" padding="lg">
              <h2 className="text-2xl font-bold text-ink">Descripción</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{producto.descripcion || producto.descripcionCorta || 'Sin descripción adicional.'}</p>
            </Card>
            <Card variant="subtle" padding="lg">
              <h2 className="text-2xl font-bold text-ink">Detalles del producto</h2>
              <dl className="mt-4 divide-y divide-white/45 text-sm">
                {varianteSeleccionada && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Presentación</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.cantidadContenido} {varianteSeleccionada.unidad?.nombre ?? varianteSeleccionada.unidad?.abreviatura ?? 'presentación'}</dd></div>}
                {material && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Material</dt><dd className="text-right font-semibold text-ink">{material}</dd></div>}
                {tamano && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Tamaño</dt><dd className="text-right font-semibold text-ink">{tamano}</dd></div>}
                {producto.categoria?.nombre && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Categoría</dt><dd className="text-right font-semibold text-ink">{producto.categoria.nombre}</dd></div>}
                {varianteSeleccionada?.sku && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">SKU</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.sku}</dd></div>}
              </dl>
            </Card>
          </div>
        </div>
      </div>
      <BarraCompraMovil variante={varianteSeleccionada} stock={stock} cantidad={cantidad} subtotal={precioLinea?.subtotal} precioPorPresentacion={precioLinea?.precioPorPresentacion} usuario={user} atributoPendiente={atributoPendiente} onAgregarAlCarrito={handleAgregarAlCarrito} onElegirAtributo={solicitarAtributo} agregado={agregado} />
    </main>
  );
}
