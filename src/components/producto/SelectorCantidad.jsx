import { useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Button from '../ui/Button/Button'

export default function SelectorCantidad({ cantidad, maximo, onChange, disabled = false }) {
  const [edicion, setEdicion] = useState(null)
  const inputId = useId()
  const bloqueado = disabled || maximo < 1
  const valorVisible = edicion ?? String(cantidad)

  const cambiarTexto = (texto) => {
    if (!/^\d*$/.test(texto)) return
    setEdicion(texto)
    const numero = Number(texto)
    if (texto !== '' && numero >= 1 && numero <= maximo) onChange(numero)
  }

  const confirmar = () => {
    if (edicion === null) return
    const numero = Number(edicion)
    const cantidadValida = edicion === '' || !Number.isFinite(numero)
      ? cantidad
      : Math.min(Math.max(1, numero), Math.max(1, maximo))
    if (cantidadValida !== cantidad) onChange(cantidadValida)
    setEdicion(null)
  }

  const ajustar = (paso) => {
    const numeroEditado = Number(edicion)
    const base = edicion !== null && edicion !== '' && numeroEditado >= 1 && numeroEditado <= maximo
      ? numeroEditado
      : cantidad
    setEdicion(null)
    onChange(Math.min(Math.max(1, base + paso), maximo))
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-bold text-ink">Cantidad</label>
      <div className="mt-2 inline-flex max-w-full items-center rounded-md border border-white/50 bg-white/30 p-1 shadow-sm">
        <Button variant="ghost" size="icon" className="min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 text-primary-dark hover:bg-primary-light" onClick={() => ajustar(-1)} disabled={bloqueado || cantidad <= 1} aria-label="Disminuir cantidad"><Minus className="h-4 w-4" aria-hidden="true" /></Button>
        {/* Cambio global: se puede escribir una cantidad exacta sin pulsar + varias veces. */}
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          aria-label="Cantidad de presentaciones"
          value={valorVisible}
          onFocus={(event) => { setEdicion(String(cantidad)); event.target.select() }}
          onChange={(event) => cambiarTexto(event.target.value)}
          onBlur={confirmar}
          onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }}
          disabled={bloqueado}
          className="h-11 w-16 min-w-0 rounded-md bg-transparent px-1 text-center text-base font-bold tabular-nums text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 sm:h-10"
        />
        <Button variant="ghost" size="icon" className="min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 text-primary-dark hover:bg-primary-light" onClick={() => ajustar(1)} disabled={bloqueado || cantidad >= maximo} aria-label="Aumentar cantidad"><Plus className="h-4 w-4" aria-hidden="true" /></Button>
      </div>
      {!bloqueado && <p className="mt-1 text-xs text-muted">Disponible: {maximo}</p>}
    </div>
  )
}
