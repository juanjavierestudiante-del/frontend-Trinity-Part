import { CheckCircle2, ChevronDown } from 'lucide-react'

const dinero = (valor) => `Bs. ${Number(valor).toFixed(2)}`

export default function PrecioCantidadDisplay({ cantidad, precioPorPresentacion, subtotal, cantidadMinimaAplicada, reglasPrecio = [], compacto = false, mostrarReglas = true }) {
  if (precioPorPresentacion == null) {
    return <p className="text-lg font-semibold text-muted">Calculando precio…</p>
  }

  const reglas = [...reglasPrecio].sort((a, b) => a.cantidadMinima - b.cantidadMinima || a.orden - b.orden)
  const normal = reglas.find((regla) => regla.cantidadMinima === 1)
  const aplicaPrecioCantidad = cantidadMinimaAplicada > 1
  const siguiente = reglas.find((regla) => regla.cantidadMinima > cantidad)

  // Cambios móviles: el precio queda directo y sin subtítulos extra.
  if (compacto) {
    return (
      <section aria-label="Precio del producto">
        <p aria-live="polite" className={`font-display text-3xl font-black leading-none ${aplicaPrecioCantidad ? 'text-rose-600' : 'text-primary-dark'}`}>
          {dinero(precioPorPresentacion)}
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Precio por cantidad" className="space-y-3">
      <div aria-live="polite" className="space-y-2">
        {aplicaPrecioCantidad ? (
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            {normal ? (
              <div>
                <p className="text-xs font-semibold text-muted">Precio normal</p>
                <p className="text-lg font-bold text-primary-dark/65 line-through decoration-primary-dark/50">{dinero(normal.precioPorPresentacion)}</p>
              </div>
            ) : null}
            <div>
              <p className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-rose-700">Precio por cantidad · desde {cantidadMinimaAplicada}</p>
              <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="font-display text-3xl font-black leading-none text-rose-600 sm:text-5xl">{dinero(precioPorPresentacion)}</p>
                <span className="pb-0.5 text-sm font-medium text-muted">por presentación</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <div>
              <p className="text-sm font-semibold text-muted">Precio normal</p>
              <p className="font-display text-3xl font-black leading-none text-primary-dark sm:text-5xl">{dinero(precioPorPresentacion)}</p>
            </div>
            <span className="pb-0.5 text-sm font-medium text-muted">por presentación</span>
          </div>
        )}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ink">
          <span>{cantidad} {cantidad === 1 ? 'presentación' : 'presentaciones'}</span>
          {subtotal != null ? <strong>Total: {dinero(subtotal)}</strong> : null}
        </div>
      </div>

      {mostrarReglas && reglas.length > 1 ? (
        <details className="group rounded-xl border border-primary/15 bg-white/45">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
            <span>Ver precios por cantidad</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-primary/10 px-3 pb-3 pt-2.5">
            {aplicaPrecioCantidad ? <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-rose-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Precio por cantidad aplicado</p> : null}
            <div className="flex flex-wrap gap-2">
              {reglas.map((regla) => {
                const activa = regla.cantidadMinima === cantidadMinimaAplicada
                return (
                  <span key={regla.idReglaPrecio} className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold ${activa ? 'border-rose-300 bg-rose-50 text-rose-700 shadow-sm' : 'border-white/60 bg-white/55 text-primary-dark'}`}>
                    {regla.cantidadMinima}+ · {dinero(regla.precioPorPresentacion)}
                  </span>
                )
              })}
            </div>
            {siguiente ? <p className="mt-2 text-xs font-medium text-muted">Siguiente: {siguiente.cantidadMinima}+ · {dinero(siguiente.precioPorPresentacion)}</p> : null}
          </div>
        </details>
      ) : null}
    </section>
  )
}
