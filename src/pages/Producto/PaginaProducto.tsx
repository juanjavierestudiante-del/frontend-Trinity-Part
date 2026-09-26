import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useProducto, usePrecioProducto } from '../../hooks/useCatalogo';
import type { ImagenProducto, ImagenVariante, Producto, Variante } from '../../types/catalogo.types';
import StatusMessage from '../../components/ui/StatusMessage/StatusMessage';
import Card from '../../components/ui/Card/Card';
import Seo from '../../components/seo/Seo';
import ProductoGaleria from '../../components/producto/ProductoGaleria';
import BuyBox, { ResumenProducto } from '../../components/producto/BuyBox';
import { useAuthStore } from '../../store/auth.store';
import { useAgregarAlCarrito } from '../../hooks/useCarrito';
import Alert from '../../components/ui/Alert/Alert';

const normalizarAtributo = (nombre: string) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const normalizarProducto = (producto: Producto): Producto => ({
  ...producto,
  imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [],
  variantes: Array.isArray(producto.variantes)
    ? producto.variantes.map((variante) => ({
        ...variante,
        imagenes: Array.isArray(variante.imagenes) ? variante.imagenes : [],
        varianteAtributo: Array.isArray(variante.varianteAtributo) ? variante.varianteAtributo : [],
        inventario: variante.inventario ?? null,
      }))
    : [],
  listaPrecios: Array.isArray(producto.listaPrecios)
    ? producto.listaPrecios.map((lista) => ({
        ...lista,
        reglas: Array.isArray(lista.reglas) ? lista.reglas : [],
      }))
    : [],
});

const obtenerValorAtributo = (variante: Variante | null, nombres: string[]) => (variante?.varianteAtributo ?? []).find(({ valorAtributo }) =>
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
  const productoSeguro = useMemo(() => producto ? normalizarProducto(producto) : null, [producto]);

  const seleccionarVariante = useCallback((variante: Variante | null) => {
    setVarianteSeleccionada(variante);
  }, []);

  const solicitarAtributo = useCallback(() => {
    const destino = atributoPendiente ? document.getElementById(`atributo-${atributoPendiente.idAtributo}`) : document.getElementById('selector-atributos');
    destino?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => destino?.focus(), 350);
  }, [atributoPendiente]);

  useEffect(() => {
    const inicial = productoSeguro?.variantes.find((variante) => variante.estado === 'Activo') ?? null;
    setVarianteSeleccionada(inicial);
    setCantidad(1);
  }, [productoSeguro?.idProducto]);

  const stock = varianteSeleccionada?.inventario?.stockActual ?? 0;
  const precioQuery = usePrecioProducto(productoSeguro?.idProducto, varianteSeleccionada?.idVariante, cantidad);
  const precioLinea = precioQuery.data?.lineas[0];
  const listaEfectiva = varianteSeleccionada
    ? productoSeguro?.listaPrecios.find((lista) => lista.idListaPrecio === varianteSeleccionada.idListaPrecio)
      ?? productoSeguro?.listaPrecios.find((lista) => lista.principal)
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
    if (!productoSeguro) return [];
    const vistas: Array<ImagenProducto | ImagenVariante> = [
      ...(varianteSeleccionada?.imagenes ?? []),
      ...productoSeguro.imagenes,
    ];
    return vistas.filter((imagen, indice, lista) =>
      lista.findIndex((otra) => otra.idImagen === imagen.idImagen || otra.url === imagen.url) === indice
    );
  }, [productoSeguro, varianteSeleccionada]);

  if (isLoading) {
    return <div className="min-h-screen px-4 py-16"><StatusMessage status="loading" message="Cargando producto..." className="mx-auto max-w-3xl" /></div>;
  }

  if (isError || !productoSeguro) {
    return <div className="min-h-screen px-4 py-16"><StatusMessage status="error" message="Producto no encontrado." className="mx-auto max-w-3xl" /></div>;
  }

  const imagenPrincipal = imagenes.find((imagen) => imagen.principal)?.url ?? imagenes[0]?.url;
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productoSeguro.nombre,
    description: productoSeguro.descripcion ?? productoSeguro.descripcionCorta ?? undefined,
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
            idProducto: productoSeguro.idProducto,
            nombre: productoSeguro.nombre,
            slug: productoSeguro.slug,
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
    <div className="min-h-screen px-4 py-4 sm:py-10">
      <Seo title={`${productoSeguro.nombre} | Trinity Party & Events`} description={productoSeguro.descripcionCorta ?? productoSeguro.descripcion ?? undefined} jsonLd={jsonLdProduct} />
      <div className="mx-auto max-w-7xl">
        {error ? <Alert type="danger" className="mb-5" onDismiss={() => setError('')}>{error}</Alert> : null}
        {/* Cambios móviles: imagen, resumen, compra y contenido progresivo en una columna. */}
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.98fr)] lg:gap-x-10 lg:gap-y-10">
          <ProductoGaleria key={imagenes.map((imagen) => `${imagen.idImagen}:${imagen.url}`).join('|')} imagenes={imagenes} nombre={productoSeguro.nombre} />
          <div className="lg:hidden">
            <ResumenProducto producto={productoSeguro} variante={varianteSeleccionada} cantidad={cantidad} precioPorPresentacion={precioLinea?.precioPorPresentacion} subtotal={precioLinea?.subtotal} cantidadMinimaAplicada={precioLinea?.cantidadMinimaAplicada} reglasPrecio={listaEfectiva?.reglas} stock={stock} modoMovil />
          </div>
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
            <BuyBox producto={productoSeguro} variante={varianteSeleccionada} stock={stock} cantidad={cantidad} precioPorPresentacion={precioLinea?.precioPorPresentacion} subtotal={precioLinea?.subtotal} cantidadMinimaAplicada={precioLinea?.cantidadMinimaAplicada} reglasPrecio={listaEfectiva?.reglas} onCantidadChange={handleCantidad} onSeleccionarVariante={seleccionarVariante} onSeleccionIncompleta={setAtributoPendiente} atributoPendiente={atributoPendiente} onSolicitarAtributo={solicitarAtributo} onAgregarAlCarrito={handleAgregarAlCarrito} agregado={agregado} usuario={user} />
          </aside>
          <div className="hidden space-y-6 lg:col-start-1 lg:row-start-2 lg:block">
            <Card variant="subtle" padding="lg">
              <h2 className="text-2xl font-bold text-ink">Descripción</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{productoSeguro.descripcion || productoSeguro.descripcionCorta || 'Sin descripción adicional.'}</p>
            </Card>
            <Card variant="subtle" padding="lg">
              <h2 className="text-2xl font-bold text-ink">Detalles del producto</h2>
              <dl className="mt-4 divide-y divide-white/45 text-sm">
                {varianteSeleccionada && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Presentación</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.cantidadContenido} {varianteSeleccionada.unidad?.nombre ?? varianteSeleccionada.unidad?.abreviatura ?? 'presentación'}</dd></div>}
                {material && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Material</dt><dd className="text-right font-semibold text-ink">{material}</dd></div>}
                {tamano && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Tamaño</dt><dd className="text-right font-semibold text-ink">{tamano}</dd></div>}
                {productoSeguro.categoria?.nombre && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Categoría</dt><dd className="text-right font-semibold text-ink">{productoSeguro.categoria.nombre}</dd></div>}
                {varianteSeleccionada?.sku && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">SKU</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.sku}</dd></div>}
              </dl>
            </Card>
          </div>
          <div className="divide-y divide-white/55 lg:hidden">
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
                <span>Descripción</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="whitespace-pre-line pb-4 text-sm leading-relaxed text-muted">{productoSeguro.descripcion || productoSeguro.descripcionCorta || 'Sin descripción adicional.'}</p>
            </details>
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
                <span>Detalles del producto</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <dl className="divide-y divide-white/45 pb-3 text-sm">
                {varianteSeleccionada && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Presentación</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.cantidadContenido} {varianteSeleccionada.unidad?.nombre ?? varianteSeleccionada.unidad?.abreviatura ?? 'presentación'}</dd></div>}
                {material && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Material</dt><dd className="text-right font-semibold text-ink">{material}</dd></div>}
                {tamano && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Tamaño</dt><dd className="text-right font-semibold text-ink">{tamano}</dd></div>}
                {productoSeguro.categoria?.nombre && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Categoría</dt><dd className="text-right font-semibold text-ink">{productoSeguro.categoria.nombre}</dd></div>}
                {varianteSeleccionada?.sku && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">SKU</dt><dd className="text-right font-semibold text-ink">{varianteSeleccionada.sku}</dd></div>}
              </dl>
            </details>
            {listaEfectiva?.reglas && listaEfectiva.reglas.length > 1 && (
              <details className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
                  <span>Ver precios por cantidad</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="flex flex-wrap gap-2 pb-4">
                  {[...listaEfectiva.reglas].sort((a, b) => a.cantidadMinima - b.cantidadMinima || a.orden - b.orden).map((regla) => (
                    <span key={regla.idReglaPrecio} className="rounded-lg border border-white/60 bg-white/55 px-2.5 py-1.5 text-xs font-bold text-primary-dark">
                      {regla.cantidadMinima}+ · Bs. {Number(regla.precioPorPresentacion).toFixed(2)}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
