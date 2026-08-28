import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducto } from '../../hooks/useCatalogo';
import SelectorVariante from '../../components/producto/SelectorVariante';
import type { Variante } from '../../types/catalogo.types';
import StatusMessage from '../../components/ui/StatusMessage/StatusMessage';
import Button from '../../components/ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { agregarAlCarrito } from '../../services/public/carrito.api';

export default function PaginaProducto() {
  const { slug } = useParams<{ slug: string }>();
  const { data: producto, isLoading, isError } = useProducto(slug!);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<Variante | null>(null);
  const [agregando, setAgregando] = useState(false);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <StatusMessage status="loading" message="Cargando producto..." className="max-w-3xl mx-auto" />
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <StatusMessage status="error" message="Producto no encontrado." className="max-w-3xl mx-auto" />
      </div>
    );
  }

  const varianteActual = varianteSeleccionada
    ?? producto.variantes.find((v) => v.estado === 'Activo')
    ?? null;

  const imagen =
    varianteActual?.imagenes.find((i) => i.principal)?.url
    ?? producto.imagenes.find((i) => i.principal)?.url;

  const stock = varianteActual?.inventario?.stockActual ?? 0;

  const handleAgregarAlCarrito = async () => {
    if (!varianteActual || !user) return;
    setAgregando(true);
    try {
      await agregarAlCarrito(varianteActual.idVariante);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error al agregar al carrito');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-card bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Producto</p>
                <h1 className="text-4xl font-black text-gray-900 font-display">{producto.nombre}</h1>
                <p className="text-base text-gray-600">{producto.descripcionCorta}</p>
              </div>

              {imagen && (
                <img
                  src={imagen}
                  alt={producto.nombre}
                  className="w-full rounded-card object-cover shadow-lg"
                />
              )}

              <div className="rounded-card bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900 font-display">Elegir variante</h2>
                <SelectorVariante
                  variantes={producto.variantes}
                  seleccionada={varianteActual}
                  onSeleccionar={setVarianteSeleccionada}
                />
              </div>

              <div className="rounded-card bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-gray-900 font-display">Descripción completa</h2>
                <p className="text-gray-600 leading-relaxed">{producto.descripcion}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-card bg-white p-6 shadow-sm">
                {varianteActual ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {varianteActual.precioOferta ? (
                        <>
                          <span className="text-sm text-gray-500 line-through">Bs. {Number(varianteActual.precioVenta).toFixed(2)}</span>
                          <span className="text-3xl font-black text-primary">Bs. {Number(varianteActual.precioOferta).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-black text-primary">Bs. {Number(varianteActual.precioVenta).toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      Presentación: {varianteActual.cantidadContenido} {varianteActual.unidad?.abreviatura}
                    </p>
                    <p className="text-sm text-gray-700">
                      Stock disponible: <span className="font-semibold">{stock}</span> unidades
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">Seleccioná una variante para ver el precio.</p>
                )}
              </div>

              <Button
                onClick={handleAgregarAlCarrito}
                disabled={!varianteActual || stock === 0 || !user}
                loading={agregando}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {!user ? 'Iniciá sesión para comprar' : stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
