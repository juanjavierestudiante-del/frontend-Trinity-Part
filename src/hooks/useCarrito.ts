// Hooks del carrito con React Query: centralizan el estado del carrito y del
// contador del Navbar. Las keys incluyen el id del usuario para que, si uno
// cierra sesión y otro inicia sin recargar la página, nunca se muestre el
// carrito cacheado del usuario anterior.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCarrito,
  getContadorCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  crearPedido,
  type CrearPedidoInput,
} from '../services/public/carrito.api';
import { useAuth } from '../context/AuthContext';

const carritoKey = (idUsuario?: number): unknown[] => ['carrito', idUsuario];
const contadorKey = (idUsuario?: number): unknown[] => ['carrito', 'count', idUsuario];

interface ItemCarrito {
  idDetalle: number;
  idVariante: number;
  cantidad: number;
  [clave: string]: unknown;
}

interface CarritoData {
  items?: ItemCarrito[];
  [clave: string]: unknown;
}

// ── Queries ────────────────────────────────────────────────────────

export const useCarrito = () => {
  const { user } = useAuth();
  const idUsuario = user?.id as number | undefined;
  return useQuery({
    queryKey: carritoKey(idUsuario),
    queryFn: getCarrito,
    enabled: !!idUsuario,
  });
};

// Contador liviano para el Navbar: GET /carrito/count.
export const useContadorCarrito = () => {
  const { user } = useAuth();
  const idUsuario = user?.id as number | undefined;
  return useQuery({
    queryKey: contadorKey(idUsuario),
    queryFn: getContadorCarrito,
    enabled: !!idUsuario,
  });
};

// Invalidación central: la key con el id del usuario matchea por prefijo tanto
// ['carrito', id] como ['carrito', 'count', id] de ese mismo usuario.
const invalidarCarrito = (qc: ReturnType<typeof useQueryClient>, idUsuario?: number) => {
  qc.invalidateQueries({ queryKey: carritoKey(idUsuario) });
};

// ── Mutaciones ─────────────────────────────────────────────────────

export const useAgregarAlCarrito = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ idVariante, cantidad = 1 }: { idVariante: number; cantidad?: number }) =>
      agregarAlCarrito(idVariante, cantidad),
    onSuccess: () => invalidarCarrito(qc, user?.id as number | undefined),
  });
};

export const useActualizarCantidadCarrito = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const idUsuario = user?.id as number | undefined;

  return useMutation({
    mutationFn: ({ idDetalle, cantidad }: { idDetalle: number; cantidad: number }) =>
      actualizarCantidad(idDetalle, cantidad),
    onMutate: async ({ idDetalle, cantidad }) => {
      await qc.cancelQueries({ queryKey: carritoKey(idUsuario) });
      const anterior = qc.getQueryData<CarritoData>(carritoKey(idUsuario));
      qc.setQueryData<CarritoData>(carritoKey(idUsuario), (data) => {
        if (!data?.items) return data;
        return {
          ...data,
          items: data.items.map((item) =>
            item.idDetalle === idDetalle ? { ...item, cantidad } : item
          ),
        };
      });
      return { anterior };
    },
    onError: (_err, _vars, contexto) => {
      if (contexto?.anterior !== undefined) {
        qc.setQueryData(carritoKey(idUsuario), contexto.anterior);
      }
    },
    onSettled: () => invalidarCarrito(qc, idUsuario),
  });
};

export const useEliminarDelCarrito = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const idUsuario = user?.id as number | undefined;

  return useMutation({
    mutationFn: ({ idDetalle }: { idDetalle: number }) => eliminarDelCarrito(idDetalle),
    onMutate: async ({ idDetalle }) => {
      await qc.cancelQueries({ queryKey: carritoKey(idUsuario) });
      const anterior = qc.getQueryData<CarritoData>(carritoKey(idUsuario));
      qc.setQueryData<CarritoData>(carritoKey(idUsuario), (data) => {
        if (!data?.items) return data;
        return {
          ...data,
          items: data.items.filter((item) => item.idDetalle !== idDetalle),
        };
      });
      return { anterior };
    },
    onError: (_err, _vars, contexto) => {
      if (contexto?.anterior !== undefined) {
        qc.setQueryData(carritoKey(idUsuario), contexto.anterior);
      }
    },
    onSettled: () => invalidarCarrito(qc, idUsuario),
  });
};

// Vacía el carrito al crear el pedido: el backend limpia los items, así que
// solo invalidamos las queries para que todos (Navbar incluido) se refresquen.
export const useCrearPedido = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (body: CrearPedidoInput) => crearPedido(body),
    onSuccess: () => invalidarCarrito(qc, user?.id as number | undefined),
  });
};