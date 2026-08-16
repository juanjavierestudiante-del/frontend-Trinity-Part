import type { Variante } from '../../types/catalogo.types';

interface Props {
  variantes: Variante[];
  seleccionada: Variante | null;
  onSeleccionar: (variante: Variante) => void;
}

export default function SelectorVariante({ variantes, seleccionada, onSeleccionar }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {variantes
        .filter((v) => v.estado === 'Activo')
        .map((variante) => {
          const label = variante.varianteAtributo
            .map((va) => `${va.valorAtributo.atributo.nombre}: ${va.valorAtributo.valor}`)
            .join(' | ') || variante.sku;

          const estaSeleccionada = seleccionada?.idVariante === variante.idVariante;
          const sinStock = (variante.inventario?.stockActual ?? 0) === 0;

          return (
            <button
              key={variante.idVariante}
              onClick={() => onSeleccionar(variante)}
              disabled={sinStock}
              className={`rounded-md border px-4 py-3 text-left text-sm transition duration-200 ${
                sinStock
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500'
                  : estaSeleccionada
                  ? 'border-primary bg-primary-light text-primary-dark shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary-light/50'
              }`}
            >
              <span className="block font-semibold">{label}</span>
              <span className="mt-1 block text-xs text-gray-500">
                {sinStock ? 'Agotado' : 'Disponible'}
              </span>
            </button>
          );
        })}
    </div>
  );
}
