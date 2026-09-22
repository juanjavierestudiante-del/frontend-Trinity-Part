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
import { useAuthStore } from '../store/auth.store';

const carritoKey = (idUsuario?: number): unknown[] => ['carrito', idUsuario];
const contadorKey = (idUsuario?: number): unknown[] => ['carrito', 'count', idUsuario];

interface ItemCarrito {
  idDetalle: number | string;
  idVariante: number;
  cantidad: number;
  [clave: string]: unknown;
}

interface CarritoData {
  items?: ItemCarrito[];
  [clave: string]: unknown;
}

interface ContadorCarrito {
  items: number;
}

// ── Queries ────────────────────────────────────────────────────────

export const useCarrito = () => {
  const user = useAuthStore((state) => state.user);
  const idUsuario = user?.id_usuario;
  return useQuery({
    queryKey: carritoKey(idUsuario),
    queryFn: getCarrito,
    enabled: !!idUsuario,
    staleTime: 30_000,
  });
};

// Contador liviano para el Navbar: GET /carrito/count.
export const useContadorCarrito = () => {
  const user = useAuthStore((state) => state.user);
  const idUsuario = user?.id_usuario;
  return useQuery({
    queryKey: contadorKey(idUsuario),
    queryFn: getContadorCarrito,
    enabled: !!idUsuario,
    staleTime: 30_000,
  });
};

const invalidarCarrito = (qc: ReturnType<typeof useQueryClient>, idUsuario?: number) => {
  qc.invalidateQueries({ queryKey: carritoKey(idUsuario) });
  qc.invalidateQueries({ queryKey: contadorKey(idUsuario) });
};

const ajustarContador = (qc: ReturnType<typeof useQueryClient>, idUsuario: number | undefined, delta: number) => {
  qc.setQueryData<ContadorCarrito>(contadorKey(idUsuario), (contador) =>
    ({ items: Math.max(0, (contador?.items ?? 0) + delta) })
  );
};

// ── Mutaciones ─────────────────────────────────────────────────────

export const useAgregarAlCarrito = () => {
  const qc = useQueryClient();
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: ({ idVariante, cantidad = 1 }: { idVariante: number; cantidad?: number; optimisticItem?: ItemCarrito }) =>
      agregarAlCarrito(idVariante, cantidad),
    onMutate: async ({ idVariante, cantidad = 1, optimisticItem }) => {
      const idUsuario = user?.id_usuario;
      await qc.cancelQueries({ queryKey: carritoKey(idUsuario) });
      await qc.cancelQueries({ queryKey: contadorKey(idUsuario) });
      const carritoAnterior = qc.getQueryData<CarritoData>(carritoKey(idUsuario));
      const contadorAnterior = qc.getQueryData<ContadorCarrito>(contadorKey(idUsuario));
      const yaExistia = Boolean(carritoAnterior?.items?.some((item) => item.idVariante === idVariante));
      qc.setQueryData<CarritoData>(carritoKey(idUsuario), (carrito) => {
        // Sólo modificamos una vista que ya existe o una línea cuya información
        // mínima vino desde la PDP. Así /carrito puede abrirse de inmediato sin
        // inventar datos de catálogo ni esperar el POST.
        if (!carrito?.items && !optimisticItem) return carrito;
        const items = carrito?.items ?? [];
        const existente = items.find((item) => item.idVariante === idVariante);
        if (existente) {
          return {
            ...carrito,
            items: items.map((item) => item.idVariante === idVariante
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item),
          };
        }
        if (!optimisticItem) return carrito;
        return { ...carrito, items: [...items, { ...optimisticItem, cantidad }] };
      });
      ajustarContador(qc, idUsuario, yaExistia ? 0 : 1);
      return {
        carritoAnterior,
        contadorAnterior,
        teniaCarrito: carritoAnterior !== undefined,
        teniaContador: contadorAnterior !== undefined,
        idVariante,
        cantidad,
      };
    },
    onError: (_err, _vars, contexto) => {
      if (contexto?.teniaCarrito) {
        qc.setQueryData(carritoKey(user?.id_usuario), contexto.carritoAnterior);
      } else {
        qc.removeQueries({ queryKey: carritoKey(user?.id_usuario), exact: true });
      }
      if (contexto?.teniaContador) {
        qc.setQueryData(contadorKey(user?.id_usuario), contexto.contadorAnterior);
      } else {
        qc.removeQueries({ queryKey: contadorKey(user?.id_usuario), exact: true });
      }
    },
    onSuccess: (resultado, variables) => {
      // Una línea creada desde la PDP tiene un id temporal sólo mientras el
      // POST está pendiente. Al confirmar, se reemplaza sin refetch ni cambio
      // visual perceptible.
      qc.setQueryData<CarritoData>(carritoKey(user?.id_usuario), (carrito) => {
        if (!carrito?.items) return carrito;
        return {
          ...carrito,
          items: carrito.items.map((item) => item.idVariante === variables.idVariante && typeof item.idDetalle === 'string'
            ? { ...item, idDetalle: resultado.idDetalle }
            : item),
        };
      });
      // Un alta puede cambiar el umbral y el precio de otras variantes de la
      // misma lista. Reconciliamos toda la vista después de confirmar.
      invalidarCarrito(qc, user?.id_usuario);
    },
  });
};

export const useActualizarCantidadCarrito = () => {
  const qc = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idUsuario = user?.id_usuario;

  return useMutation({
    scope: { id: `carrito-cantidad-${idUsuario ?? 'anonimo'}` },
    mutationFn: ({ idDetalle, cantidad }: { idDetalle: number; cantidad: number }) =>
      actualizarCantidad(idDetalle, cantidad),
    onMutate: async ({ idDetalle, cantidad }) => {
      await qc.cancelQueries({ queryKey: carritoKey(idUsuario) });
      await qc.cancelQueries({ queryKey: contadorKey(idUsuario) });
      const anterior = qc.getQueryData<CarritoData>(carritoKey(idUsuario));
      const contadorAnterior = qc.getQueryData<ContadorCarrito>(contadorKey(idUsuario));
      qc.setQueryData<CarritoData>(carritoKey(idUsuario), (data) => {
        if (!data?.items) return data;
        return {
          ...data,
          items: data.items.map((item) =>
            item.idDetalle === idDetalle ? { ...item, cantidad } : item
          ),
        };
      });
      return { anterior, contadorAnterior };
    },
    onError: (_err, _vars, contexto) => {
      if (contexto?.anterior !== undefined) {
        qc.setQueryData(carritoKey(idUsuario), contexto.anterior);
      }
      if (contexto?.contadorAnterior !== undefined) {
        qc.setQueryData(contadorKey(idUsuario), contexto.contadorAnterior);
      }
    },
    onSuccess: () => invalidarCarrito(qc, idUsuario),
  });
};

export const useEliminarDelCarrito = () => {
  const qc = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idUsuario = user?.id_usuario;

  return useMutation({
    scope: { id: `carrito-cantidad-${idUsuario ?? 'anonimo'}` },
    mutationFn: ({ idDetalle }: { idDetalle: number }) => eliminarDelCarrito(idDetalle),
    onMutate: async ({ idDetalle }) => {
      await qc.cancelQueries({ queryKey: carritoKey(idUsuario) });
      await qc.cancelQueries({ queryKey: contadorKey(idUsuario) });
      const anterior = qc.getQueryData<CarritoData>(carritoKey(idUsuario));
      const contadorAnterior = qc.getQueryData<ContadorCarrito>(contadorKey(idUsuario));
      qc.setQueryData<CarritoData>(carritoKey(idUsuario), (data) => {
        if (!data?.items) return data;
        return {
          ...data,
          items: data.items.filter((item) => item.idDetalle !== idDetalle),
        };
      });
      ajustarContador(qc, idUsuario, -1);
      return { anterior, contadorAnterior };
    },
    onError: (_err, _vars, contexto) => {
      if (contexto?.anterior !== undefined) {
        qc.setQueryData(carritoKey(idUsuario), contexto.anterior);
      }
      if (contexto?.contadorAnterior !== undefined) {
        qc.setQueryData(contadorKey(idUsuario), contexto.contadorAnterior);
      }
    },
    onSuccess: () => invalidarCarrito(qc, idUsuario),
  });
};

// Vacía el carrito al crear el pedido: el backend limpia los items, así que
// solo invalidamos las queries para que todos (Navbar incluido) se refresquen.
export const useCrearPedido = () => {
  const qc = useQueryClient();
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: (body: CrearPedidoInput) => crearPedido(body),
    onSuccess: () => invalidarCarrito(qc, user?.id_usuario),
  });
};
