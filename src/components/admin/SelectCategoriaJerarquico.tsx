// Select jerárquico para elegir categoría padre.
// Muestra el árbol indentado con sangría visual.

import { useState } from 'react';
import type { Categoria } from '../../types/catalogo.types';

interface Props {
  categorias: Categoria[];
  value: number | null;
  onChange: (value: number | null) => void;
  excludeId?: number;
  dark?: boolean;
}

function OpcionArbol({
  categoria,
  nivel,
  value,
  onChange,
  excludeId,
  expanded,
  onToggle,
}: {
  categoria: Categoria;
  nivel: number;
  value: number | null;
  onChange: (value: number | null) => void;
  excludeId?: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
}) {
  const esSeleccionada = value === categoria.idCategoria;
  const esExcluida = excludeId === categoria.idCategoria;
  const tieneHijos = categoria.subcategorias && categoria.subcategorias.length > 0;
  const estaExpandido = expanded.has(categoria.idCategoria);

  return (
    <>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${
          esSeleccionada
            ? 'bg-primary text-white'
            : esExcluida
              ? 'text-gray-500 cursor-not-allowed line-through opacity-50'
              : 'text-gray-200 hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${nivel * 1.25 + 0.5}rem` }}
      >
        {tieneHijos ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(categoria.idCategoria);
            }}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-200 shrink-0"
          >
            {estaExpandido ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-4 h-4 shrink-0" />
        )}

        <button
          type="button"
          disabled={esExcluida}
          onClick={() => {
            if (!esExcluida) {
              onChange(esSeleccionada ? null : categoria.idCategoria);
            }
          }}
          className="flex-1 text-left truncate"
        >
          {categoria.nombre}
        </button>
      </div>

      {tieneHijos && estaExpandido && (
        <div>
          {categoria.subcategorias.map((hija) => (
            <OpcionArbol
              key={hija.idCategoria}
              categoria={hija}
              nivel={nivel + 1}
              value={value}
              onChange={onChange}
              excludeId={excludeId}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function SelectCategoriaJerarquico({
  categorias,
  value,
  onChange,
  excludeId,
  dark = true,
}: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className={`w-full rounded-md border ${
        dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
      }`}
    >
      <div className="max-h-64 overflow-y-auto">
        {/* Opción "Sin categoría padre" */}
        <div
          className={`flex items-center gap-1 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${
            value === null
              ? 'bg-primary text-white'
              : dark
                ? 'text-gray-200 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="w-4 h-4 shrink-0" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex-1 text-left italic"
          >
            Sin categoría padre (raíz)
          </button>
        </div>

        {categorias.map((cat) => (
          <OpcionArbol
            key={cat.idCategoria}
            categoria={cat}
            nivel={0}
            value={value}
            onChange={onChange}
            excludeId={excludeId}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  );
}
