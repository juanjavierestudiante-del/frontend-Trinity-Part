import type { Variante } from '../../types/catalogo.types';

interface Props {
  variantes: Variante[];
  seleccionada: Variante | null;
  onSeleccionar: (variante: Variante) => void;
}

export default function SelectorVariante({ variantes, seleccionada, onSeleccionar }: Props) {
  const variantesActivas = variantes.filter((variante) => variante.estado === 'Activo');

  if (variantesActivas.length === 0) {
    return <p className="text-sm text-muted">No hay presentaciones disponibles por el momento.</p>;
  }

  return (
    <fieldset>
      <legend className="text-sm font-bold text-ink">Elige una presentación</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {variantesActivas.map((variante) => {
          const label = variante.varianteAtributo
            .map((va) => `${va.valorAtributo.atributo.nombre}: ${va.valorAtributo.valor}`)
            .join(' · ') || `${variante.cantidadContenido} ${variante.unidad?.abreviatura ?? ''}`.trim() || variante.sku;

          const estaSeleccionada = seleccionada?.idVariante === variante.idVariante;
          const sinStock = (variante.inventario?.stockActual ?? 0) === 0;

          return (
            <button
              key={variante.idVariante}
              type="button"
              onClick={() => onSeleccionar(variante)}
              disabled={sinStock}
              aria-pressed={estaSeleccionada}
              className={`min-h-14 min-w-0 rounded-md border px-3 py-2.5 text-left text-sm leading-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                sinStock
                  ? 'cursor-not-allowed border-white/30 bg-white/15 text-muted line-through opacity-70'
                  : estaSeleccionada
                  ? 'border-primary bg-primary-light/85 text-primary-dark shadow-brand'
                  : 'border-white/45 bg-white/25 text-ink hover:border-primary/60 hover:bg-white/40'
              }`}
            >
              <span className="block break-words font-semibold">{label}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {sinStock ? 'Agotado' : `${variante.inventario?.stockActual ?? 0} disponibles`}
              </span>
            </button>
          );
      })}
      </div>
    </fieldset>
  );
}
