// Página de Inventario del admin: listado global de variantes con stock,
// edición inline, panel de alertas de stock bajo e historial de movimientos.

import { useMemo, useState } from 'react';
import { HiPencil, HiClock, HiExclamationCircle } from 'react-icons/hi';
import {
  useInventario,
  useAlertasInventario,
  useHistorialInventario,
  useActualizarStock,
  useAjustarStock,
} from '../../hooks/admin/useInventario';
import type { FilaInventario } from '../../services/admin/inventario.api';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';
import Loader from '../../components/ui/Loader/Loader';
import Modal from '../../components/ui/Modal/Modal';

interface Edicion {
  idVariante: number;
  sku: string;
  stockActual: string;
  stockMinimo: string;
  stockMaximo: string;
}

const enAlerta = (fila: FilaInventario) =>
  !fila.tieneRegistro || fila.stockActual <= fila.stockMinimo;

// ── Panel lateral de alertas ───────────────────────────────────────

function PanelAlertas({ onVer }: { onVer: (variante: { idVariante: number; sku: string }) => void }) {
  const { data: alertas, isLoading } = useAlertasInventario();

  return (
    <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <HiExclamationCircle className="w-5 h-5 text-red-400" />
        <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wide">
          Alertas de stock bajo
        </h2>
        {alertas && alertas.length > 0 && (
          <Badge variant="danger" size="sm">{alertas.length}</Badge>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : !alertas || alertas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay variantes bajo el mínimo. Todo en orden.</p>
      ) : (
        <ul className="divide-y divide-gray-700/60">
          {alertas.map((a) => (
            <li key={a.idVariante} className="flex items-center gap-3 py-2">
              <div className="flex-1 min-w-0">
                <span className="block text-sm text-gray-100 truncate">{a.producto}</span>
                <span className="text-xs text-gray-500">
                  {a.sku}
                  {!a.tieneRegistro ? ' · sin registro de inventario' : ''}
                </span>
              </div>
              <Badge variant={a.stockActual === 0 ? 'danger' : 'warning'} size="sm">
                {a.stockActual} / mín {a.stockMinimo}
              </Badge>
              <Button size="xs" variant="light" onClick={() => onVer({ idVariante: a.idVariante, sku: a.sku })}>
                <HiClock className="w-3 h-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Modal de historial ─────────────────────────────────────────────

function ModalHistorial({
  variante,
  onClose,
}: {
  variante: { idVariante: number; sku: string };
  onClose: () => void;
}) {
  const { data: movimientos, isLoading } = useHistorialInventario(variante.idVariante);

  return (
    <Modal isOpen footer={null} onClose={onClose} title={`Historial de movimientos — ${variante.sku}`}>
      {isLoading ? (
        <Loader />
      ) : !movimientos || movimientos.length === 0 ? (
        <p className="text-sm text-gray-500">Esta variante todavía no tiene movimientos.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-400 border-b border-gray-200">
                <th className="py-2 pr-3">Fecha</th>
                <th className="py-2 pr-3">Movimiento</th>
                <th className="py-2 pr-3">Stock</th>
                <th className="py-2 pr-3">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movimientos.map((m) => (
                <tr key={m.idMovimiento}>
                  <td className="py-2 pr-3 whitespace-nowrap text-gray-600">
                    {new Date(m.fecha).toLocaleString('es-AR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge variant={m.cantidad > 0 ? 'success' : 'danger'} size="sm">
                      {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                    </Badge>
                    <span className="ml-2 text-xs text-gray-400">
                      {m.tipo}{m.usuario ? ` · ${m.usuario}` : ''}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">
                    {m.stockAnterior} → <strong>{m.stockNuevo}</strong>
                  </td>
                  <td className="py-2 pr-3 text-gray-500">{m.motivo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

// ── Fila de la tabla (normal o en modo edición inline) ─────────────

function FilaInventarioRow({
  fila,
  editando,
  error,
  onCampoChange,
  onEditar,
  onCancelar,
  onGuardar,
  onAjustar,
  onHistorial,
}: {
  fila: FilaInventario;
  editando: Edicion | null;
  error: string | null;
  onCampoChange: (campo: 'stockActual' | 'stockMinimo' | 'stockMaximo', valor: string) => void;
  onEditar: () => void;
  onCancelar: () => void;
  onGuardar: () => void;
  onAjustar: (delta: number) => void;
  onHistorial: () => void;
}) {
  const esEditando = editando?.idVariante === fila.idVariante;
  const alerta = enAlerta(fila);

  return (
    <tr className={`border-b border-gray-700/50 hover:bg-gray-800/50 ${fila.estado === 'Inactivo' ? 'opacity-60' : ''}`}>
      <td className="px-2 py-2">
        <span className="block text-sm font-medium text-gray-100">{fila.producto}</span>
        <span className="text-xs text-gray-500">{fila.sku}</span>
      </td>
      <td className="px-2 py-2 text-xs text-gray-400">{fila.marca ?? '—'}</td>

      {esEditando ? (
        <>
          <td className="px-2 py-2">
            <input
              type="number"
              min={0}
              className="w-20 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100"
              value={editando.stockActual}
              onChange={(e) => onCampoChange('stockActual', e.target.value)}
            />
          </td>
          <td className="px-2 py-2">
            <input
              type="number"
              min={0}
              className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100"
              value={editando.stockMinimo}
              onChange={(e) => onCampoChange('stockMinimo', e.target.value)}
            />
          </td>
          <td className="px-2 py-2">
            <input
              type="number"
              min={0}
              placeholder="—"
              className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100"
              value={editando.stockMaximo}
              onChange={(e) => onCampoChange('stockMaximo', e.target.value)}
            />
          </td>
        </>
      ) : (
        <>
          <td className="px-2 py-2">
            <span className={`inline-flex items-center gap-1 text-sm font-semibold ${alerta ? 'text-red-400' : 'text-gray-100'}`}>
              <button
                onClick={() => onAjustar(-1)}
                title="Restar 1"
                className="w-5 h-5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                −
              </button>
              {fila.stockActual}
              <button
                onClick={() => onAjustar(1)}
                title="Sumar 1"
                className="w-5 h-5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                +
              </button>
            </span>
          </td>
          <td className="px-2 py-2 text-sm text-gray-400">{fila.stockMinimo}</td>
          <td className="px-2 py-2 text-sm text-gray-400">{fila.stockMaximo ?? '—'}</td>
        </>
      )}

      <td className="px-2 py-2">
        {alerta ? (
          <Badge variant="danger" size="sm">Bajo mínimo</Badge>
        ) : (
          <Badge variant="success" size="sm">OK</Badge>
        )}
      </td>

      <td className="px-2 py-2">
        <div className="flex gap-1 justify-end">
          {esEditando ? (
            <>
              <Button size="xs" variant="success" onClick={onGuardar}>Guardar</Button>
              <Button size="xs" variant="light" onClick={onCancelar}>Cancelar</Button>
            </>
          ) : (
            <>
              <Button size="xs" variant="light" onClick={onEditar} title="Editar stocks">
                <HiPencil className="w-3 h-3" />
              </Button>
              <Button size="xs" variant="light" onClick={onHistorial} title="Historial">
                <HiClock className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
        {esEditando && error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </td>
    </tr>
  );
}

// ── Página principal ───────────────────────────────────────────────

export default function InventarioPage() {
  const { data: filas, isLoading } = useInventario();
  const actualizarStock = useActualizarStock();
  const ajustarStock = useAjustarStock();

  const [busqueda, setBusqueda] = useState('');
  const [soloAlertas, setSoloAlertas] = useState(false);
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);
  const [historialDe, setHistorialDe] = useState<{ idVariante: number; sku: string } | null>(null);

  const filtradas = useMemo(() => {
    if (!filas) return [];
    const q = busqueda.trim().toLowerCase();
    return filas.filter((f) => {
      if (soloAlertas && !enAlerta(f)) return false;
      if (!q) return true;
      return (
        f.producto.toLowerCase().includes(q) ||
        f.sku.toLowerCase().includes(q) ||
        (f.marca ?? '').toLowerCase().includes(q)
      );
    });
  }, [filas, busqueda, soloAlertas]);

  const iniciarEdicion = (fila: FilaInventario) => {
    setErrorEdicion(null);
    setEdicion({
      idVariante: fila.idVariante,
      sku: fila.sku,
      stockActual: String(fila.stockActual),
      stockMinimo: String(fila.stockMinimo),
      stockMaximo: fila.stockMaximo == null ? '' : String(fila.stockMaximo),
    });
  };

  const guardarEdicion = () => {
    if (!edicion) return;
    const max = edicion.stockMaximo.trim() === '' ? null : Number(edicion.stockMaximo);
    const body = {
      stockActual: Number(edicion.stockActual),
      stockMinimo: Number(edicion.stockMinimo),
      ...(max !== null ? { stockMaximo: max } : {}),
      motivo: 'Edición desde panel de inventario',
    };
    actualizarStock.mutate(
      { idVariante: edicion.idVariante, body },
      {
        onSuccess: () => {
          setEdicion(null);
          setErrorEdicion(null);
        },
        onError: (err: any) => {
          const detalle = err?.response?.data?.detalles?.[0]?.mensaje;
          setErrorEdicion(detalle || err?.response?.data?.error || 'Error al guardar');
        },
      }
    );
  };

  const ajustar = (fila: FilaInventario, delta: number) => {
    ajustarStock.mutate(
      { idVariante: fila.idVariante, body: { cantidad: delta, motivo: delta > 0 ? 'Reposición rápida (+1)' : 'Ajuste rápido (−1)' } },
      {
        onError: (err: any) => window.alert(err?.response?.data?.error ?? 'Error al ajustar stock'),
      }
    );
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-100 font-display">Inventario</h1>
      <p className="mb-6 text-gray-400">Stock por variante, con alertas e historial de movimientos</p>

      <PanelAlertas onVer={(variante) => setHistorialDe(variante)} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Buscar por producto, SKU o marca..."
          className="flex-1 min-w-56 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-primary"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={soloAlertas}
            onChange={(e) => setSoloAlertas(e.target.checked)}
            className="accent-red-500"
          />
          Solo alertas
        </label>
        <span className="text-xs text-gray-500 ml-auto">
          {filtradas.length} de {filas?.length ?? 0} variantes
        </span>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-400 border-b border-gray-700">
              <th className="px-2 py-3">Producto / SKU</th>
              <th className="px-2 py-3">Marca</th>
              <th className="px-2 py-3">Stock actual</th>
              <th className="px-2 py-3">Mínimo</th>
              <th className="px-2 py-3">Máximo</th>
              <th className="px-2 py-3">Estado</th>
              <th className="px-2 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-8 text-center text-sm text-gray-500">
                  No hay variantes que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              filtradas.map((fila) => (
                <FilaInventarioRow
                  key={fila.idVariante}
                  fila={fila}
                  editando={edicion?.idVariante === fila.idVariante ? edicion : null}
                  error={errorEdicion}
                  onCampoChange={(campo, valor) =>
                    setEdicion((prev) => (prev ? { ...prev, [campo]: valor } : prev))
                  }
                  onEditar={() => iniciarEdicion(fila)}
                  onCancelar={() => {
                    setEdicion(null);
                    setErrorEdicion(null);
                  }}
                  onGuardar={guardarEdicion}
                  onAjustar={(delta) => ajustar(fila, delta)}
                  onHistorial={() =>
                    setHistorialDe({ idVariante: fila.idVariante, sku: fila.sku })
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {historialDe && (
        <ModalHistorial variante={historialDe} onClose={() => setHistorialDe(null)} />
      )}
    </div>
  );
}
