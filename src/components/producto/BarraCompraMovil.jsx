import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import Button from '../ui/Button/Button'

export default function BarraCompraMovil({ variante, stock, cantidad, subtotal, precioPorPresentacion, usuario, atributoPendiente, onAgregarAlCarrito, onElegirAtributo, agregado }) {
  const agotado = Boolean(variante && stock < 1)
  const incompleta = !variante && Boolean(atributoPendiente)
  const etiqueta = agotado
    ? 'Agotado'
    : incompleta
      ? `Elegir ${atributoPendiente.nombre}`
      : usuario
        ? agregado
          ? 'Agregado'
          : subtotal != null
            ? `Agregar ${cantidad} · Bs. ${Number(subtotal).toFixed(2)}`
            : 'Agregar'
        : 'Iniciar sesión'

  return (
    <aside aria-label="Compra rápida" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-gradient-to-r from-primary-light/95 via-white/95 to-secondary/15 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_28px_-20px_rgba(46,16,101,0.55)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1" aria-live="polite">
          {precioPorPresentacion != null ? <><p className="truncate font-display text-xl font-black text-primary-dark">Bs. {Number(precioPorPresentacion).toFixed(2)}</p><p className="text-xs text-muted">por presentación</p></> : <p className="text-sm font-semibold text-ink">Elegí opciones</p>}
          {agotado && <p className="text-xs font-semibold text-red-700">Agotado</p>}
        </div>
        {incompleta ? <Button size="md" variant="primary" onClick={onElegirAtributo} className="max-w-48">{etiqueta}</Button> : usuario ? <Button size="md" variant="primary" onClick={onAgregarAlCarrito} disabled={!variante || agotado || !precioPorPresentacion} icon={agregado ? CheckCircle2 : ShoppingCart} aria-label={agregado ? 'Producto agregado al carrito' : undefined} className="whitespace-nowrap">{etiqueta}</Button> : agotado ? <Button size="md" variant="primary" disabled>{etiqueta}</Button> : <Button as={Link} to="/login" size="md" variant="primary">{etiqueta}</Button>}
      </div>
    </aside>
  )
}
