// Listado de categorías en panel admin con vista de árbol indentado.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiEyeOff, HiEye } from 'react-icons/hi';
import {
  useCategoriasAdmin,
  useCambiarEstadoCategoria,
} from '../../hooks/admin/useCategoriasAdmin';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';
import Loader from '../../components/ui/Loader/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog/ConfirmDialog';
import type { Categoria } from '../../types/catalogo.types';

// ── Fila de categoría en el árbol ──────────────────────────────────

function FilaCategoria({
  categoria,
  nivel,
  expanded,
  onToggle,
  onInactivar,
  onReactivar,
}: {
  categoria: Categoria;
  nivel: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onInactivar: (cat: Categoria, numHijos: number) => void;
  onReactivar: (cat: Categoria) => void;
}) {
  const navigate = useNavigate();
  const tieneHijos = categoria.subcategorias && categoria.subcategorias.length > 0;
  const estaExpandido = expanded.has(categoria.idCategoria);
  const esInactivo = (categoria as any).estado === 'Inactivo';

  return (
    <>
      <div
        className={`flex items-center gap-2 py-2 px-2 border-b border-gray-700/50 transition-colors hover:bg-gray-800/50 ${
          esInactivo ? 'opacity-50' : ''
        }`}
        style={{ paddingLeft: `${nivel * 1.5 + 0.5}rem` }}
      >
        {/* Toggle expand/collapse */}
        {tieneHijos ? (
          <button
            onClick={() => onToggle(categoria.idCategoria)}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-200 shrink-0"
          >
            {estaExpandido ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-5 h-5 shrink-0" />
        )}

        {/* Imagen miniatura */}
        {categoria.imagenUrl ? (
          <img
            src={categoria.imagenUrl}
            alt={categoria.nombre}
            className="w-8 h-8 rounded object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-500 text-xs shrink-0">
            —
          </div>
        )}

        {/* Nombre */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-100 truncate block">
            {categoria.nombre}
          </span>
          <span className="hidden sm:inline text-xs text-gray-500">{categoria.slug}</span>
        </div>

        {/* Badge de estado */}
        <Badge variant={esInactivo ? 'gray' : 'success'} size="sm">
          {esInactivo ? 'Inactivo' : 'Activo'}
        </Badge>

        {/* Subcategorías count */}
        {tieneHijos && (
          <span className="hidden sm:inline text-xs text-gray-500 whitespace-nowrap">
            {categoria.subcategorias.length} sub
          </span>
        )}

        {/* Acciones */}
        <div className="flex gap-1 shrink-0">
          <Button
            size="xs"
            variant="light"
            onClick={() => navigate(`/admin/categorias/${categoria.idCategoria}/editar`)}
            title="Editar"
          >
            <HiPencil className="w-3 h-3" />
          </Button>

          {esInactivo ? (
            <Button
              size="xs"
              variant="success"
              onClick={() => onReactivar(categoria)}
              title="Reactivar"
            >
              <HiEye className="w-3 h-3" />
            </Button>
          ) : (
            <Button
              size="xs"
              variant="danger"
              onClick={() => onInactivar(categoria, categoria.subcategorias?.length || 0)}
              title="Inactivar"
            >
              <HiEyeOff className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Hijos expandibles */}
      {tieneHijos && estaExpandido && (
        <div>
          {categoria.subcategorias.map((hija) => (
            <FilaCategoria
              key={hija.idCategoria}
              categoria={hija}
              nivel={nivel + 1}
              expanded={expanded}
              onToggle={onToggle}
              onInactivar={onInactivar}
              onReactivar={onReactivar}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ── Página principal ───────────────────────────────────────────────

export default function CategoriasPage() {
  const navigate = useNavigate();
  const { data: categorias, isLoading, isError } = useCategoriasAdmin();
  const { mutate: cambiarEstado, isPending } = useCambiarEstadoCategoria();

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [dialog, setDialog] = useState<{
    open: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, titulo: '', mensaje: '', onConfirm: () => {} });

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Expandir todo
  const expandirTodo = () => {
    if (!categorias) return;
    const ids = new Set<number>();
    const collect = (cats: Categoria[]) => {
      cats.forEach((c) => {
        if (c.subcategorias?.length) {
          ids.add(c.idCategoria);
          collect(c.subcategorias);
        }
      });
    };
    collect(categorias);
    setExpanded(ids);
  };

  const handleInactivar = (cat: Categoria, numHijos: number) => {
    const mensajeHijos = numHijos > 0
      ? `\n\nEsto también inactivará ${numHijos} subcategoría(s) hija(s) en cascada.`
      : '';

    setDialog({
      open: true,
      titulo: 'Inactivar categoría',
      mensaje: `¿Inactivar "${cat.nombre}"?${mensajeHijos}`,
      onConfirm: () => {
        cambiarEstado(
          { id: cat.idCategoria, estado: 'Inactivo' },
          {
            onSuccess: (data) => {
              setDialog((d) => ({ ...d, open: false }));
              if (data.hijosInactivados > 0) {
                alert(`Se inactivaron ${data.hijosInactivados} subcategorías en cascada.`);
              }
            },
          }
        );
      },
    });
  };

  const handleReactivar = (cat: Categoria) => {
    setDialog({
      open: true,
      titulo: 'Reactivar categoría',
      mensaje: `¿Reactivar "${cat.nombre}"?\n\nLas subcategorías hijas NO se reactivarán automáticamente.`,
      onConfirm: () => {
        cambiarEstado(
          { id: cat.idCategoria, estado: 'Activo' },
          { onSuccess: () => setDialog((d) => ({ ...d, open: false })) }
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="xl" showText={false} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error al cargar categorías</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Categorías</h1>
        <div className="flex gap-2">
          <Button variant="gray" size="sm" onClick={expandirTodo}>
            <span className="hidden sm:inline">Expandir todo</span>
            <span className="sm:hidden">Expandir</span>
          </Button>
          <Button onClick={() => navigate('/admin/categorias/nueva')}>
            <HiPlus className="w-4 h-4 mr-2" />
            Nueva categoría
          </Button>
        </div>
      </div>

      {/* Árbol de categorías */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {categorias?.map((cat) => (
          <FilaCategoria
            key={cat.idCategoria}
            categoria={cat}
            nivel={0}
            expanded={expanded}
            onToggle={toggleExpand}
            onInactivar={handleInactivar}
            onReactivar={handleReactivar}
          />
        ))}
      </div>

      {categorias?.length === 0 && (
        <p className="py-12 text-center text-gray-500">No hay categorías todavía.</p>
      )}

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={dialog.open}
        title={dialog.titulo}
        message={dialog.mensaje}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </div>
  );
}
