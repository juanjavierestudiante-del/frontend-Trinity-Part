import { Minus, Plus } from 'lucide-react'
import Button from '../ui/Button/Button'

export default function SelectorCantidad({ cantidad, maximo, onChange, disabled = false }) {
  const sinStock = maximo < 1
  return <div><p id="cantidad-label" className="text-sm font-bold text-ink">Cantidad</p><div className="mt-2 inline-flex items-center rounded-md border border-white/50 bg-white/30 p-1 shadow-sm"><Button variant="ghost" size="icon" className="text-primary-dark hover:bg-primary-light" onClick={() => onChange(cantidad - 1)} disabled={disabled || sinStock || cantidad <= 1} aria-label="Disminuir cantidad"><Minus className="h-4 w-4" aria-hidden="true" /></Button><output aria-live="polite" aria-labelledby="cantidad-label" className="min-w-11 px-2 text-center text-base font-bold text-ink">{cantidad}</output><Button variant="ghost" size="icon" className="text-primary-dark hover:bg-primary-light" onClick={() => onChange(cantidad + 1)} disabled={disabled || sinStock || cantidad >= maximo} aria-label="Aumentar cantidad"><Plus className="h-4 w-4" aria-hidden="true" /></Button></div></div>
}
