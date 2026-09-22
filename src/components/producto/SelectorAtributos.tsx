import { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { TipoVisualizacionAtributo, Variante } from '../../types/catalogo.types';
import { cloudinaryUrl } from '../../utils/cloudinary';

interface ValorOpcion {
  idValor: number;
  valor: string;
  visualValue: string | null;
}

interface GrupoAtributo {
  idAtributo: number;
  nombre: string;
  tipoVisualizacion: TipoVisualizacionAtributo;
  valores: ValorOpcion[];
}

interface Props {
  variantes: Variante[];
  idAtributoPrincipal: number | null;
  varianteInicial: Variante | null;
  onResolverVariante: (variante: Variante | null) => void;
  onSeleccionIncompleta?: (atributo: { idAtributo: number; nombre: string } | null) => void;
}

const contieneValor = (variante: Variante, idValor: number) =>
  variante.varianteAtributo.some(({ valorAtributo }) => valorAtributo.idValor === idValor);

const coincideConSelecciones = (variante: Variante, selecciones: Record<number, number>) =>
  Object.values(selecciones).every((idValor) => contieneValor(variante, idValor));

const obtenerSeleccionesDeVariante = (variante: Variante | null) => {
  if (!variante) return {};
  return variante.varianteAtributo.reduce<Record<number, number>>((selecciones, { valorAtributo }) => {
    selecciones[valorAtributo.atributo.idAtributo] = valorAtributo.idValor;
    return selecciones;
  }, {});
};

const tieneEstructuraAtributos = (variantes: Variante[]) => variantes.every((variante) =>
  variante.varianteAtributo.every(({ valorAtributo }) =>
    Number.isInteger(valorAtributo.idValor) && Number.isInteger(valorAtributo.atributo.idAtributo)
  )
);

export const puedeUsarSelectorAtributos = (variantes: Variante[]) => {
  const variantesActivas = variantes.filter((variante) => variante.estado === 'Activo');
  return variantesActivas.some((variante) => variante.varianteAtributo.length > 0)
    && tieneEstructuraAtributos(variantesActivas);
};

function OpcionAtributo({
  atributo,
  valor,
  seleccionada,
  disabled,
  imagen,
  onClick,
}: {
  atributo: GrupoAtributo;
  valor: ValorOpcion;
  seleccionada: boolean;
  disabled: boolean;
  imagen?: string;
  onClick: () => void;
}) {
  const base = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45';
  const estado = seleccionada
    ? 'border-primary bg-primary-light text-primary-dark shadow-brand'
    : 'border-white/50 bg-white/25 text-ink hover:border-primary/60 hover:bg-white/40';
  const esFallbackColor = atributo.tipoVisualizacion === 'color' && !valor.visualValue;

  if (atributo.tipoVisualizacion === 'color' && valor.visualValue) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} aria-pressed={seleccionada} aria-label={`${atributo.nombre}: ${valor.valor}`} title={valor.valor} className={`h-10 w-10 rounded-full border-2 p-1 ${seleccionada ? 'border-primary ring-2 ring-primary/25 ring-offset-2 ring-offset-primary-light' : 'border-white/70'} disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}>
        <span className="flex h-full w-full items-center justify-center rounded-full border border-black/15" style={{ backgroundColor: valor.visualValue }}>
          {seleccionada && <Check className="h-4 w-4 text-white drop-shadow" aria-hidden="true" />}
        </span>
      </button>
    );
  }

  if (atributo.tipoVisualizacion === 'image' && imagen) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} aria-pressed={seleccionada} aria-label={`${atributo.nombre}: ${valor.valor}`} className={`${base} h-16 min-w-16 overflow-hidden p-1 ${estado}`}>
        <img src={cloudinaryUrl(imagen, 'w_160,q_auto,f_auto')} alt={valor.valor} className="h-full w-full rounded object-cover" loading="lazy" />
      </button>
    );
  }

  return <button type="button" onClick={onClick} disabled={disabled} aria-pressed={seleccionada} className={`${base} ${estado} ${esFallbackColor ? 'px-2 text-xs' : ''}`}>{valor.valor}</button>;
}

export default function SelectorAtributos({ variantes, idAtributoPrincipal, varianteInicial, onResolverVariante, onSeleccionIncompleta }: Props) {
  const variantesActivas = useMemo(() => variantes.filter((variante) => variante.estado === 'Activo'), [variantes]);
  const claveVariantes = variantesActivas.map((variante) => `${variante.idVariante}:${variante.varianteAtributo.map(({ valorAtributo }) => valorAtributo.idValor).join(',')}`).join('|');
  const [selecciones, setSelecciones] = useState<Record<number, number>>(() => obtenerSeleccionesDeVariante(varianteInicial ?? variantesActivas[0] ?? null));
  const claveInicializada = useRef('');

  const grupos = useMemo(() => {
    const porAtributo = new Map<number, GrupoAtributo>();
    variantesActivas.forEach((variante) => variante.varianteAtributo.forEach(({ valorAtributo }) => {
      const { atributo } = valorAtributo;
      const grupo = porAtributo.get(atributo.idAtributo) ?? {
        idAtributo: atributo.idAtributo,
        nombre: atributo.nombre,
        tipoVisualizacion: atributo.tipoVisualizacion,
        valores: [],
      };
      if (!grupo.valores.some((valor) => valor.idValor === valorAtributo.idValor)) {
        grupo.valores.push({ idValor: valorAtributo.idValor, valor: valorAtributo.valor, visualValue: valorAtributo.visualValue });
      }
      porAtributo.set(atributo.idAtributo, grupo);
    }));
    return [...porAtributo.values()].sort((a, b) => {
      if (a.idAtributo === idAtributoPrincipal) return -1;
      if (b.idAtributo === idAtributoPrincipal) return 1;
      return a.nombre.localeCompare(b.nombre, 'es');
    });
  }, [variantesActivas, idAtributoPrincipal]);

  useEffect(() => {
    if (claveInicializada.current === claveVariantes) return;
    claveInicializada.current = claveVariantes;
    const inicial = varianteInicial ?? variantesActivas[0] ?? null;
    setSelecciones(obtenerSeleccionesDeVariante(inicial));
    onResolverVariante(inicial);
  }, [claveVariantes, varianteInicial, variantesActivas, onResolverVariante]);

  const candidatas = useMemo(
    () => variantesActivas.filter((variante) => coincideConSelecciones(variante, selecciones)),
    [variantesActivas, selecciones]
  );

  const atributoPendiente = useMemo(() => grupos.find((atributo) => {
    if (selecciones[atributo.idAtributo]) return false;
    const valoresDisponibles = new Set(
      variantesActivas
        .filter((variante) => coincideConSelecciones(variante, selecciones))
        .filter((variante) => variante.varianteAtributo.some(({ valorAtributo }) => valorAtributo.atributo.idAtributo === atributo.idAtributo))
        .map((variante) => variante.varianteAtributo.find(({ valorAtributo }) => valorAtributo.atributo.idAtributo === atributo.idAtributo)?.valorAtributo.idValor)
    );
    return valoresDisponibles.size > 1;
  }), [grupos, selecciones, variantesActivas]);

  useEffect(() => {
    onResolverVariante(candidatas.length === 1 ? candidatas[0] : null);
    onSeleccionIncompleta?.(candidatas.length === 1 ? null : atributoPendiente ? { idAtributo: atributoPendiente.idAtributo, nombre: atributoPendiente.nombre } : null);
  }, [atributoPendiente, candidatas, onResolverVariante, onSeleccionIncompleta]);

  if (variantesActivas.length === 0) return <p className="text-sm text-muted">No hay presentaciones disponibles por el momento.</p>;

  const seleccionar = (idAtributo: number, idValor: number) => {
    setSelecciones((actuales) => {
      const siguientes = { ...actuales, [idAtributo]: idValor };
      if (idAtributo === idAtributoPrincipal) {
        Object.keys(siguientes).forEach((id) => {
          if (Number(id) !== idAtributo) delete siguientes[Number(id)];
        });
      }
      return siguientes;
    });
  };

  return (
    <div id="selector-atributos" className="space-y-4">
      {grupos.map((atributo) => {
        const seleccionesSinAtributo = { ...selecciones };
        delete seleccionesSinAtributo[atributo.idAtributo];
        const candidatasBase = variantesActivas.filter((variante) => coincideConSelecciones(variante, seleccionesSinAtributo));
        const valoresRelevantes = atributo.idAtributo === idAtributoPrincipal
          ? atributo.valores
          : atributo.valores.filter((valor) => candidatasBase.some((variante) => contieneValor(variante, valor.idValor)));
        const unicoValor = valoresRelevantes.length === 1;
        const valorUnico = valoresRelevantes[0];

        if (unicoValor && atributo.idAtributo !== idAtributoPrincipal) {
          return <div key={atributo.idAtributo} className="flex flex-wrap items-baseline gap-x-2 gap-y-0"><p className="text-sm font-bold text-ink">{atributo.nombre}</p><p className="text-sm text-muted">{valorUnico.valor}</p></div>;
        }

        return (
          <fieldset id={`atributo-${atributo.idAtributo}`} tabIndex={-1} key={atributo.idAtributo} className="scroll-mt-28 focus:outline-none">
            <legend className={`text-sm font-bold ${atributo.idAtributo === idAtributoPrincipal ? 'text-primary-dark' : 'text-ink'}`}>{atributo.nombre}</legend>
            {atributo.tipoVisualizacion === 'color' && selecciones[atributo.idAtributo] && <p className="mt-1 text-sm text-muted">{atributo.nombre}: {atributo.valores.find((valor) => valor.idValor === selecciones[atributo.idAtributo])?.valor}</p>}
            <div className={`mt-2 flex flex-wrap gap-2 ${atributo.tipoVisualizacion === 'color' ? 'items-center' : ''}`}>
              {(atributo.tipoVisualizacion === 'color' ? valoresRelevantes.filter((valor) => valor.visualValue) : valoresRelevantes).map((valor) => {
                const siguientes = { ...seleccionesSinAtributo, [atributo.idAtributo]: valor.idValor };
                const esPosible = variantesActivas.some((variante) => coincideConSelecciones(variante, siguientes));
                const representativa = variantesActivas.find((variante) => contieneValor(variante, valor.idValor) && variante.imagenes.length > 0);
                return <OpcionAtributo key={valor.idValor} atributo={atributo} valor={valor} seleccionada={selecciones[atributo.idAtributo] === valor.idValor} disabled={!esPosible} imagen={representativa?.imagenes.find((imagen) => imagen.principal)?.url ?? representativa?.imagenes[0]?.url} onClick={() => seleccionar(atributo.idAtributo, valor.idValor)} />;
              })}
            </div>
            {atributo.tipoVisualizacion === 'color' && valoresRelevantes.some((valor) => !valor.visualValue) && <div className="mt-2 flex flex-wrap gap-2">{valoresRelevantes.filter((valor) => !valor.visualValue).map((valor) => {
              const siguientes = { ...seleccionesSinAtributo, [atributo.idAtributo]: valor.idValor };
              const esPosible = variantesActivas.some((variante) => coincideConSelecciones(variante, siguientes));
              return <OpcionAtributo key={valor.idValor} atributo={atributo} valor={valor} seleccionada={selecciones[atributo.idAtributo] === valor.idValor} disabled={!esPosible} onClick={() => seleccionar(atributo.idAtributo, valor.idValor)} />;
            })}</div>}
          </fieldset>
        );
      })}
    </div>
  );
}
