import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'
import SelectorAtributos, { puedeUsarSelectorAtributos } from './SelectorAtributos'
import SelectorCantidad from './SelectorCantidad'
import SelectorVariante from './SelectorVariante'

export function ResumenProducto({ producto, variante, stock, className = '' }) {
  const precio = variante?.precioOferta ?? variante?.precioVenta
  const mostrarResumen = producto.descripcionCorta && producto.descripcionCorta !== producto.descripcion

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Producto</p>
        <h1 className="text-3xl font-black leading-tight text-ink sm:text-4xl">{producto.nombre}</h1>
        {mostrarResumen && <p className="mt-3 text-base leading-relaxed text-muted">{producto.descripcionCorta}</p>}
      </div>
      {variante ? (
        <div aria-live="polite" className="space-y-3">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            {variante.precioOferta != null && <span className="text-base text-muted line-through">Bs. {Number(variante.precioVenta).toFixed(2)}</span>}
            <p className="font-display text-4xl font-black leading-none text-primary-dark sm:text-5xl">Bs. {Number(precio).toFixed(2)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={stock > 0 ? 'success' : 'danger'} size="lg">{stock > 0 ? `En stock · ${stock} unidades` : 'Sin stock'}</Badge>
          </div>
        </div>
      ) : <p className="text-sm text-muted">Elige las opciones para consultar disponibilidad y precio.</p>}
    </div>
  )
}

export default function BuyBox({ producto, variante, stock, cantidad, onCantidadChange, onSeleccionarVariante, onAgregarAlCarrito, agregando, usuario }) {
  const puedeComprar = Boolean(variante && stock > 0)
  const tieneSelectorAtributos = puedeUsarSelectorAtributos(producto.variantes)

  return (
    <Card variant="highlight" accent="brand" padding="lg" className="overflow-hidden">
      <div className="space-y-6">
        <ResumenProducto producto={producto} variante={variante} stock={stock} className="hidden lg:block" />
        {tieneSelectorAtributos ? (
          <div className="border-t border-white/45 pt-5">
            <SelectorAtributos variantes={producto.variantes} idAtributoPrincipal={producto.idAtributoPrincipal} varianteInicial={variante} onResolverVariante={onSeleccionarVariante} />
          </div>
        ) : producto.variantes.some((item) => item.varianteAtributo.length > 0) ? (
          <div className="border-t border-white/45 pt-5">
            <SelectorVariante variantes={producto.variantes} seleccionada={variante} onSeleccionar={onSeleccionarVariante} />
          </div>
        ) : null}
        {variante && <p className="border-t border-white/45 pt-4 text-sm text-muted">SKU: <span className="font-semibold text-ink">{variante.sku}</span>{variante.marca?.nombre ? ` · ${variante.marca.nombre}` : ''}</p>}
        <SelectorCantidad cantidad={cantidad} maximo={stock} onChange={onCantidadChange} disabled={!puedeComprar || agregando} />
        {usuario ? (
          <Button onClick={onAgregarAlCarrito} disabled={!puedeComprar} loading={agregando} variant="primary" size="lg" className="w-full shadow-brand-lg" icon={ShoppingCart}>
            {stock === 0 && variante ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
        ) : (
          <div className="space-y-3 border-t border-white/45 pt-5">
            <p className="text-sm leading-relaxed text-ink">Para comprar, inicia sesión.</p>
            <Button as={Link} to="/login" variant="primary" size="lg" className="w-full">Iniciar sesión</Button>
            <p className="text-center text-sm text-muted">¿No tienes cuenta? <Link to="/registro" className="font-semibold text-primary-dark hover:underline">Regístrate</Link></p>
          </div>
        )}
      </div>
    </Card>
  )
}
