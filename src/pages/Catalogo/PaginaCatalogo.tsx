import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useProductos } from "../../hooks/useCatalogo";
import ProductoCard from "../../components/catalogo/ProductoCard";
import MenuCategorias from "../../components/catalogo/MenuCategorias";
import BuscadorProductos from "../../components/catalogo/BuscadorProductos";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";
import Button from "../../components/ui/Button/Button";
import Seo from "../../components/seo/Seo";

function getSafePage(value: string | null) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export default function Catalogo() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = (searchParams.get("q") ?? "").trim();
  const page = getSafePage(searchParams.get("page"));
  const productos = useProductos({
    categoria: slug,
    q: busqueda || undefined,
    page: page > 1 ? page : undefined,
  });
  const items = productos.data?.items ?? [];
  const totalPages = productos.data?.totalPages ?? 1;

  const updateSearch = (query: string) => {
    const next = new URLSearchParams(searchParams);
    const normalized = query.trim();
    if (normalized) next.set("q", normalized);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

  const title = slug ? "Productos por categoría" : "Explora todos nuestros productos";
  const hasShortQuery = busqueda.length === 1;

  return (
    <main className="min-h-screen px-4 py-7 sm:py-10">
      <Seo
        title={"Catálogo | Trinity Party & Events"}
        description="Descubre todos nuestros productos: decoraciones, regalos, cotillones y artículos para fiestas y celebraciones."
        jsonLd={
          items.length > 0
            ? {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Catálogo de productos Trinity Party',
                itemListElement: items.slice(0, 50).map((p, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  url: 'https://www.trinitypartyevent.com/productos/' + p.slug,
                  name: p.nombre,
                })),
              }
            : undefined
        }
      />
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 space-y-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary sm:text-sm sm:tracking-[0.3em]">Catálogo</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900 font-display sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">Descubre las últimas variantes, precios y presentaciones disponibles.</p>
          </div>
          <div className="max-w-xl"><BuscadorProductos key={busqueda} initialValue={busqueda} onBuscar={updateSearch} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4">
            <p className="text-sm text-muted" aria-live="polite">
              {productos.data ? productos.data.total + " productos" : "Explorando productos"}
              {busqueda && <> para <span className="font-semibold text-ink">“{busqueda}”</span></>}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted"><span className="hidden sm:inline">Orden: relevancia</span><span className="rounded-full border border-primary/10 bg-white/35 px-3 py-2 sm:hidden">Relevancia</span></div>
          </div>
        </header>

        <div className="mb-5 lg:hidden">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-card border border-white/45 bg-white/35 px-4 py-3 text-sm font-semibold text-primary-dark shadow-sm backdrop-blur-lg [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2"><SlidersHorizontal size={17} aria-hidden="true" />Categorías</span><ChevronRight size={17} aria-hidden="true" className="transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-3"><MenuCategorias /></div>
          </details>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block"><div className="sticky top-6"><MenuCategorias /></div></aside>
          <section className="min-w-0 flex-1" aria-label="Resultados del catálogo">
            {productos.isLoading && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3" aria-label="Cargando productos">
                {Array.from({ length: 6 }, (_, index) => <div key={index} className="animate-pulse overflow-hidden rounded-card border border-white/40 bg-white/25"><div className="aspect-[4/5] bg-primary-light/35" /><div className="space-y-2 p-3 sm:p-4"><div className="h-4 rounded bg-primary-light/40" /><div className="h-4 w-2/3 rounded bg-primary-light/30" /><div className="h-5 w-1/2 rounded bg-primary-light/40" /></div></div>)}
              </div>
            )}
            {productos.isError && (
              <div className="rounded-card border border-red-200/70 bg-red-50/70 p-4"><StatusMessage status="error" message="No pudimos cargar el catálogo. Intenta nuevamente." className="py-8" /><div className="flex justify-center"><Button variant="outline" onClick={() => productos.refetch()}>Reintentar</Button></div></div>
            )}
            {!productos.isLoading && !productos.isError && hasShortQuery && <StatusMessage status="empty" message="Escribe al menos 2 caracteres para buscar productos." className="py-12" />}
            {!productos.isLoading && !productos.isError && !hasShortQuery && productos.data && items.length === 0 && (
              <div className="rounded-card border border-white/45 bg-white/25 px-4 py-8"><StatusMessage status="empty" message={busqueda ? "No encontramos productos para “" + busqueda + "”." : "No se encontraron productos con estos filtros."} className="py-6" />{(busqueda || slug) && <div className="flex justify-center"><Link to="/catalogo" className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Limpiar filtros</Link></div>}</div>
            )}
            {!productos.isLoading && !productos.isError && items.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {items.map((producto, index) => <div key={producto.idProducto} className="min-w-0 animate-fade-in-up" style={{ animationDelay: (index * 60) + "ms" }}><ProductoCard producto={producto} /></div>)}
                </div>
                {totalPages > 1 && <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginación del catálogo"><Button variant="outline" size="icon" onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Página anterior" icon={ChevronLeft} /><div className="flex items-center gap-1" aria-live="polite">{pageNumbers.map((pageNumber) => <button key={pageNumber} type="button" onClick={() => goToPage(pageNumber)} aria-current={pageNumber === page ? 'page' : undefined} className={"flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " + (pageNumber === page ? 'bg-primary text-white' : 'text-primary-dark hover:bg-primary-light/50')}>{pageNumber}</button>)}</div><Button variant="outline" size="icon" onClick={() => goToPage(page + 1)} disabled={page >= totalPages} aria-label="Página siguiente" icon={ChevronRight} /></nav>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
