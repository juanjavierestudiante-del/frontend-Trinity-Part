import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, ShoppingCart } from "lucide-react";
import Button from "../ui/Button/Button";
import Card from "../ui/Card/Card";
import SelectorAtributos, {
  puedeUsarSelectorAtributos,
} from "./SelectorAtributos";
import SelectorCantidad from "./SelectorCantidad";
import SelectorVariante from "./SelectorVariante";
import PrecioCantidadDisplay from "./PrecioCantidadDisplay";

export function ResumenProducto({
  producto,
  variante,
  cantidad,
  precioPorPresentacion,
  subtotal,
  cantidadMinimaAplicada,
  reglasPrecio,
  stock,
  mostrarDisponibilidad = false,
  className = "",
  mostrarDescripcion = true,
  modoMovil = false,
  ocultarAtributoTelefono = false,
}) {
  const mostrarResumen =
    producto.descripcionCorta &&
    producto.descripcionCorta !== producto.descripcion;
  const atributoPrincipal = variante?.varianteAtributo?.find(({ valorAtributo }) =>
    valorAtributo.atributo.idAtributo === producto.idAtributoPrincipal
  ) ?? variante?.varianteAtributo?.[0];

  return (
    <div className={`${modoMovil ? "flex flex-col gap-3" : "space-y-3"} ${className}`}>
      <div>
        <p className={`mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary-dark ${modoMovil ? "hidden" : ""}`}>
          Producto
        </p>
        <h1 className={`font-black leading-tight text-ink ${modoMovil ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl"}`}>
          {producto.nombre}
        </h1>
        {mostrarDescripcion && mostrarResumen && !modoMovil && (
          <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">
            {producto.descripcionCorta}
          </p>
        )}
        {mostrarDisponibilidad && variante && !modoMovil && (
          <p
            className={`mt-2 text-sm font-semibold ${stock > 0 ? "text-emerald-700" : "text-red-700"}`}
          >
            {stock > 0 ? `${stock} disponibles` : "Agotado"}
          </p>
        )}
      </div>
      <div className={modoMovil ? "order-1 md:order-2" : ""}>
      {variante ? (
        <PrecioCantidadDisplay
          cantidad={cantidad}
          precioPorPresentacion={precioPorPresentacion}
          subtotal={subtotal}
          cantidadMinimaAplicada={cantidadMinimaAplicada}
          reglasPrecio={reglasPrecio}
          compacto={modoMovil}
          mostrarReglas={!modoMovil}
        />
      ) : (
        <p className="text-sm text-muted">
          Elige las opciones para consultar disponibilidad y precio.
        </p>
      )}
      </div>
      {/* Cambio móvil: nombre, precio y variante elegida en ese orden de lectura. */}
      {modoMovil && atributoPrincipal && (
        <p className={`order-2 items-center gap-2 text-sm font-medium text-ink md:order-1 ${ocultarAtributoTelefono ? 'hidden md:flex' : 'flex'}`}>
          {atributoPrincipal.valorAtributo.visualValue && <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border border-black/15" style={{ backgroundColor: atributoPrincipal.valorAtributo.visualValue }} />}
          <span>{atributoPrincipal.valorAtributo.atributo.nombre}: {atributoPrincipal.valorAtributo.valor}</span>
        </p>
      )}
    </div>
  );
}

export default function BuyBox({
  producto,
  variante,
  stock,
  cantidad,
  precioPorPresentacion,
  subtotal,
  cantidadMinimaAplicada,
  reglasPrecio,
  onCantidadChange,
  onSeleccionarVariante,
  onSeleccionIncompleta,
  atributoPendiente,
  onSolicitarAtributo,
  onAgregarAlCarrito,
  agregado,
  usuario,
  ctaMovilRef,
}) {
  const puedeComprar = Boolean(variante && stock > 0);
  const incompleta = !variante && Boolean(atributoPendiente);
  const tieneSelectorAtributos = puedeUsarSelectorAtributos(producto.variantes);
  const [esTelefono, setEsTelefono] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const consulta = window.matchMedia("(max-width: 767px)");
    const actualizar = () => setEsTelefono(consulta.matches);
    consulta.addEventListener("change", actualizar);
    return () => consulta.removeEventListener("change", actualizar);
  }, []);

  // Cambio móvil: el CTA se coloca antes de las opciones plegadas solo en teléfonos.
  const botonCompraMovil = (
    <div ref={ctaMovilRef}>
      {usuario ? (
        <Button
          onClick={incompleta ? onSolicitarAtributo : onAgregarAlCarrito}
          disabled={Boolean(variante && (stock === 0 || !precioPorPresentacion))}
          variant="primary"
          size="lg"
          className="min-h-12 w-full shadow-brand-lg"
          icon={incompleta ? undefined : agregado ? CheckCircle2 : ShoppingCart}
          aria-label={agregado ? "Producto agregado al carrito" : undefined}
        >
          {incompleta
            ? `Elegir ${atributoPendiente.nombre}`
            : stock === 0 && variante
              ? "Agotado"
              : agregado
                ? "Agregado"
                : subtotal != null
                  ? esTelefono ? "Agregar al carrito" : `Agregar al carrito · Bs. ${Number(subtotal).toFixed(2)}`
                  : "Agregar al carrito"}
        </Button>
      ) : variante && stock === 0 ? (
        <Button variant="primary" size="lg" className="min-h-12 w-full" disabled>Agotado</Button>
      ) : (
        <Button as={Link} to="/login" variant="primary" size="lg" className="min-h-12 w-full">Iniciar sesión para comprar</Button>
      )}
    </div>
  );

  return (
    <Card
      variant="highlight"
      accent="brand"
      padding="md"
      className="overflow-hidden sm:p-4"
    >
      <div className="hidden space-y-3 lg:block">
        <ResumenProducto
          producto={producto}
          variante={variante}
          cantidad={cantidad}
          precioPorPresentacion={precioPorPresentacion}
          subtotal={subtotal}
          cantidadMinimaAplicada={cantidadMinimaAplicada}
          reglasPrecio={reglasPrecio}
          className=""
          mostrarDescripcion={false}
        />
        {tieneSelectorAtributos ? (
          <div className="border-t border-white/45 pt-4">
            <SelectorAtributos
              variantes={producto.variantes}
              idAtributoPrincipal={producto.idAtributoPrincipal}
              varianteInicial={variante}
              onResolverVariante={onSeleccionarVariante}
              onSeleccionIncompleta={onSeleccionIncompleta}
            />
          </div>
        ) : producto.variantes.some(
            (item) => item.varianteAtributo.length > 0,
          ) ? (
          <div className="border-t border-white/45 pt-4">
            <SelectorVariante
              variantes={producto.variantes}
              seleccionada={variante}
              onSeleccionar={onSeleccionarVariante}
            />
          </div>
        ) : null}
        <SelectorCantidad
          cantidad={cantidad}
          maximo={stock}
          onChange={onCantidadChange}
          disabled={!puedeComprar}
        />
        {usuario ? (
          <Button
            onClick={incompleta ? onSolicitarAtributo : onAgregarAlCarrito}
            disabled={Boolean(
              variante && (stock === 0 || !precioPorPresentacion),
            )}
            variant="primary"
            size="lg"
            className="w-full shadow-brand-lg"
            icon={
              incompleta ? undefined : agregado ? CheckCircle2 : ShoppingCart
            }
            aria-label={agregado ? "Producto agregado al carrito" : undefined}
          >
            {incompleta
              ? `Elegir ${atributoPendiente.nombre}`
              : stock === 0 && variante
                ? "Agotado"
                : agregado
                  ? "Agregado"
                  : subtotal != null
                    ? `Agregar ${cantidad} · Bs. ${Number(subtotal).toFixed(2)}`
                    : "Agregar al carrito"}
          </Button>
        ) : (
          <div className="space-y-2 border-t border-white/45 pt-4">
            {variante && stock === 0 ? (
              <Button variant="primary" size="lg" className="w-full" disabled>
                Agotado
              </Button>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-ink lg:hidden">
                  Para comprar, inicia sesión.
                </p>
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Iniciar sesión
                </Button>
                <p className="text-center text-sm text-muted">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/registro"
                    className="font-semibold text-primary-dark hover:underline"
                  >
                    Regístrate
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {/* Cambios móviles: opciones plegables y CTA en el flujo de la página. */}
      <div className="space-y-3 lg:hidden">
        {esTelefono && tieneSelectorAtributos ? (
          <SelectorAtributos
            variantes={producto.variantes}
            idAtributoPrincipal={producto.idAtributoPrincipal}
            varianteInicial={variante}
            onResolverVariante={onSeleccionarVariante}
            onSeleccionIncompleta={onSeleccionIncompleta}
            compactoMovil
            accion={botonCompraMovil}
          >
            <SelectorCantidad cantidad={cantidad} maximo={stock} onChange={onCantidadChange} disabled={!puedeComprar} />
          </SelectorAtributos>
        ) : (
        <>
        {esTelefono && botonCompraMovil}
        <details className="group border-y border-white/55" data-mobile-options>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
            <span>Ver más opciones{variante?.varianteAtributo?.length ? ` · ${variante.varianteAtributo.map(({ valorAtributo }) => valorAtributo.valor).join(' · ')}` : ''}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-4 pb-4">
            {tieneSelectorAtributos ? (
              <SelectorAtributos
                variantes={producto.variantes}
                idAtributoPrincipal={producto.idAtributoPrincipal}
                varianteInicial={variante}
                onResolverVariante={onSeleccionarVariante}
                onSeleccionIncompleta={onSeleccionIncompleta}
              />
            ) : producto.variantes.some((item) => item.varianteAtributo.length > 0) ? (
              <SelectorVariante variantes={producto.variantes} seleccionada={variante} onSeleccionar={onSeleccionarVariante} />
            ) : null}
            <SelectorCantidad cantidad={cantidad} maximo={stock} onChange={onCantidadChange} disabled={!puedeComprar} />
          </div>
        </details>
        {!esTelefono && botonCompraMovil}
        </>
        )}
      </div>
    </Card>
  );
}
