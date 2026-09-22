import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'
import SelectorAtributos, { puedeUsarSelectorAtributos } from './SelectorAtributos'
import SelectorCantidad from './SelectorCantidad'
import SelectorVariante from './SelectorVariante'
import PrecioCantidadDisplay from './PrecioCantidadDisplay'

export function ResumenProducto({ producto, variante, cantidad, precioPorPresentacion, subtotal, cantidadMinimaAplicada, reglasPrecio, stock, mostrarDisponibilidad = false, className = '', mostrarDescripcion = true }) {
  const mostrarResumen = producto.descripcionCorta && producto.descripcionCorta !== producto.descripcion

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Producto</p>
        <h1 className="text-2xl font-black leading-tight text-ink sm:text-4xl">{producto.nombre}</h1>
        {mostrarDescripcion && mostrarResumen && <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">{producto.descripcionCorta}</p>}
        {mostrarDisponibilidad && variante && <p className={`mt-2 text-sm font-semibold ${stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>{stock > 0 ? `${stock} disponibles` : 'Agotado'}</p>}
      </div>
      {variante ? (
        <PrecioCantidadDisplay cantidad={cantidad} precioPorPresentacion={precioPorPresentacion} subtotal={subtotal} cantidadMinimaAplicada={cantidadMinimaAplicada} reglasPrecio={reglasPrecio} />
      ) : <p className="text-sm text-muted">Elige las opciones para consultar disponibilidad y precio.</p>}
    </div>
  )
}

export default function BuyBox({ producto, variante, stock, cantidad, precioPorPresentacion, subtotal, cantidadMinimaAplicada, reglasPrecio, onCantidadChange, onSeleccionarVariante, onSeleccionIncompleta, atributoPendiente, onSolicitarAtributo, onAgregarAlCarrito, agregado, usuario }) {
  const puedeComprar = Boolean(variante && stock > 0)
  const incompleta = !variante && Boolean(atributoPendiente)
  const tieneSelectorAtributos = puedeUsarSelectorAtributos(producto.variantes)

  return (
    <Card variant="highlight" accent="brand" padding="md" className="overflow-hidden sm:p-4">
      <div className="space-y-3">
        <ResumenProducto producto={producto} variante={variante} cantidad={cantidad} precioPorPresentacion={precioPorPresentacion} subtotal={subtotal} cantidadMinimaAplicada={cantidadMinimaAplicada} reglasPrecio={reglasPrecio} className="hidden lg:block" mostrarDescripcion={false} />
        {tieneSelectorAtributos ? (
          <div className="border-t border-white/45 pt-4">
            <SelectorAtributos variantes={producto.variantes} idAtributoPrincipal={producto.idAtributoPrincipal} varianteInicial={variante} onResolverVariante={onSeleccionarVariante} onSeleccionIncompleta={onSeleccionIncompleta} />
          </div>
        ) : producto.variantes.some((item) => item.varianteAtributo.length > 0) ? (
          <div className="border-t border-white/45 pt-4">
            <SelectorVariante variantes={producto.variantes} seleccionada={variante} onSeleccionar={onSeleccionarVariante} />
          </div>
        ) : null}
        <SelectorCantidad cantidad={cantidad} maximo={stock} onChange={onCantidadChange} disabled={!puedeComprar} />
        {usuario ? (
          <Button onClick={incompleta ? onSolicitarAtributo : onAgregarAlCarrito} disabled={Boolean(variante && (stock === 0 || !precioPorPresentacion))} variant="primary" size="lg" className="w-full shadow-brand-lg" icon={incompleta ? undefined : agregado ? CheckCircle2 : ShoppingCart} aria-label={agregado ? 'Producto agregado al carrito' : undefined}>
            {incompleta ? `Elegir ${atributoPendiente.nombre}` : stock === 0 && variante ? 'Agotado' : agregado ? 'Agregado' : subtotal != null ? `Agregar ${cantidad} · Bs. ${Number(subtotal).toFixed(2)}` : 'Agregar al carrito'}
          </Button>
        ) : (
          <div className="space-y-2 border-t border-white/45 pt-4">
            {variante && stock === 0 ? <Button variant="primary" size="lg" className="w-full" disabled>Agotado</Button> : <><p className="text-sm leading-relaxed text-ink lg:hidden">Para comprar, inicia sesión.</p><Button as={Link} to="/login" variant="primary" size="lg" className="w-full">Iniciar sesión</Button><p className="text-center text-sm text-muted">¿No tienes cuenta? <Link to="/registro" className="font-semibold text-primary-dark hover:underline">Regístrate</Link></p></>}
          </div>
        )}
      </div>
    </Card>
  )
}
