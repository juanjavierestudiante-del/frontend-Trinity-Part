import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Store, Truck, User } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useCarrito, useCrearPedido } from "../../hooks/useCarrito";
import {
  obtenerConfiguracionEntrega,
  obtenerPuntosEntrega,
} from "../../services/public/entrega.api";
import Input from "../../components/ui/Input/Input";
import Textarea from "../../components/ui/Textarea/Textarea";
import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";
import Alert from "../../components/ui/Alert/Alert";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";

const PHONE_RE = /^(\+?591)?[\s-]?[67]\d{7}$/;
const nombreCompleto = (user) =>
  [user?.nombre, user?.apellido].filter(Boolean).join(" ").trim();
const dinero = (monto) => `Bs. ${Number(monto || 0).toFixed(2)}`;

function MetodoEntrega({
  value,
  title,
  description,
  icon: Icon,
  checked,
  disabled,
  detail,
  onChange,
}) {
  return (
    <label
      className={`relative block rounded-xl border p-3 transition sm:p-4 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${disabled ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60" : "cursor-pointer border-primary/20 bg-white/45 hover:border-primary/50"} ${checked ? "border-primary bg-primary-light/35 ring-2 ring-primary/20" : ""}`}
    >
      <input
        type="radio"
        name="metodoEntrega"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-11 w-11 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg ${checked ? "bg-primary text-white" : "bg-white text-primary-dark"}`}
          aria-hidden="true"
        >
          <Icon size={20} />
        </span>
        <span className="min-w-0">
          <span className="block font-bold text-ink">{title}</span>
          <span className="mt-0.5 block text-sm text-muted">{description}</span>
          {detail ? (
            <span className="mt-2 block text-xs font-medium text-primary-dark">
              {detail}
            </span>
          ) : null}
        </span>
      </span>
    </label>
  );
}

function SelectorPunto({ puntos, value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? "punto-error" : undefined}>
      <legend className="mb-2 text-sm font-semibold text-ink">
        Seleccioná un punto
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {puntos.map((punto) => (
          <label
            key={punto.idPuntoEntrega}
            className={`cursor-pointer rounded-lg border p-3 transition sm:p-4 hover:border-primary/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${value === punto.idPuntoEntrega ? "border-primary bg-primary-light/30 ring-1 ring-primary" : "border-gray-200 bg-white/60"}`}
          >
            <input
              type="radio"
              name="idPuntoEntrega"
              value={punto.idPuntoEntrega}
              checked={value === punto.idPuntoEntrega}
              onChange={() => onChange(punto.idPuntoEntrega)}
              className="sr-only"
            />
            <span className="block font-semibold text-ink">{punto.nombre}</span>
            {punto.descripcion ? (
              <span className="mt-1 block text-sm text-muted">
                {punto.descripcion}
              </span>
            ) : null}
            {punto.referencia ? (
              <span className="mt-2 block text-xs text-primary-dark">
                {punto.referencia}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      {error ? (
        <p id="punto-error" role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export default function Checkout() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCarrito();
  const crearPedidoMutation = useCrearPedido();
  const puntosQuery = useQuery({
    queryKey: ["entrega", "puntos"],
    queryFn: obtenerPuntosEntrega,
    enabled: !!user,
    staleTime: 5 * 60_000,
  });
  const configuracionQuery = useQuery({
    queryKey: ["entrega", "configuracion"],
    queryFn: obtenerConfiguracionEntrega,
    enabled: !!user,
    staleTime: 5 * 60_000,
  });
  const items = (data?.items || []).map((detalle) => ({
    id: detalle.idDetalle,
    idVariante: detalle.idVariante,
    nombre: detalle.producto?.nombre || detalle.sku || "Producto",
    cantidad: detalle.cantidad || 1,
    precio: Number(detalle.precioPorPresentacion) || 0,
    subtotal: Number(detalle.subtotal) || 0,
  }));
  const carritoSincronizando = (data?.items || []).some(
    (detalle) => typeof detalle.idDetalle !== "number",
  );
  const total = Number(data?.total) || 0;
  const puntosEntrega = useMemo(
    () =>
      (puntosQuery.data || []).filter(
        (punto) => punto.tipo === "PUNTO_ENTREGA",
      ),
    [puntosQuery.data],
  );
  const puntosRecojo = useMemo(
    () =>
      (puntosQuery.data || []).filter(
        (punto) => punto.tipo === "RECOJO_TIENDA",
      ),
    [puntosQuery.data],
  );
  const minimoDelivery = Number(
    configuracionQuery.data?.montoMinimoDelivery ?? 0,
  );
  const deliveryHabilitado = Boolean(
    configuracionQuery.data?.deliveryHabilitado,
  );
  const deliveryDisponible =
    deliveryHabilitado &&
    Number.isFinite(minimoDelivery) &&
    total >= minimoDelivery;
  const faltanteDelivery = Math.max(0, minimoDelivery - total);
  const [metodoEntrega, setMetodoEntrega] = useState("");
  const [idPuntoEntrega, setIdPuntoEntrega] = useState(null);
  const [form, setForm] = useState(() => ({
    nombreContacto: nombreCompleto(user),
    telefonoContacto: user?.telefono || "",
    deliveryZona: "",
    deliveryDireccion: "",
    deliveryReferencia: "",
    notas: "",
  }));
  const [errores, setErrores] = useState({});
  const [errorSubmit, setErrorSubmit] = useState("");
  const metodoActivo =
    metodoEntrega ||
    (puntosEntrega.length
      ? "PUNTO_ENTREGA"
      : puntosRecojo.length
        ? "RECOJO_TIENDA"
        : "");
  const idPuntoActivo =
    idPuntoEntrega ??
    (metodoActivo === "PUNTO_ENTREGA"
      ? puntosEntrega[0]?.idPuntoEntrega
      : metodoActivo === "RECOJO_TIENDA"
        ? puntosRecojo[0]?.idPuntoEntrega
        : null);

  if (!user) return <Navigate to="/login" replace />;

  const cambiarMetodo = (metodo) => {
    setMetodoEntrega(metodo);
    setErrores((prev) => ({
      ...prev,
      metodoEntrega: "",
      idPuntoEntrega: "",
      deliveryZona: "",
      deliveryDireccion: "",
    }));
    if (metodo === "PUNTO_ENTREGA")
      setIdPuntoEntrega(puntosEntrega[0]?.idPuntoEntrega ?? null);
    if (metodo === "RECOJO_TIENDA")
      setIdPuntoEntrega(puntosRecojo[0]?.idPuntoEntrega ?? null);
    if (metodo === "DELIVERY") setIdPuntoEntrega(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };
  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombreContacto.trim())
      nuevosErrores.nombreContacto = "El nombre de contacto es obligatorio";
    else if (form.nombreContacto.trim().length > 150)
      nuevosErrores.nombreContacto =
        "El nombre no puede superar los 150 caracteres";
    const telefono = form.telefonoContacto.trim();
    if (!telefono) nuevosErrores.telefonoContacto = "El celular es obligatorio";
    else if (!PHONE_RE.test(telefono))
      nuevosErrores.telefonoContacto =
        "Ingresá un celular boliviano válido (ej: 71234567 o +59171234567)";
    if (!metodoActivo)
      nuevosErrores.metodoEntrega = "Seleccioná un método de entrega";
    if (
      (metodoActivo === "PUNTO_ENTREGA" || metodoActivo === "RECOJO_TIENDA") &&
      !idPuntoActivo
    )
      nuevosErrores.idPuntoEntrega = "Seleccioná un punto disponible";
    if (metodoActivo === "DELIVERY") {
      if (!deliveryDisponible)
        nuevosErrores.metodoEntrega =
          "Delivery no está disponible para este pedido";
      if (!form.deliveryZona.trim())
        nuevosErrores.deliveryZona = "La zona es obligatoria";
      else if (form.deliveryZona.trim().length > 150)
        nuevosErrores.deliveryZona = "La zona no puede superar 150 caracteres";
      if (!form.deliveryDireccion.trim())
        nuevosErrores.deliveryDireccion = "La dirección es obligatoria";
      else if (form.deliveryDireccion.trim().length > 255)
        nuevosErrores.deliveryDireccion =
          "La dirección no puede superar 255 caracteres";
      if (form.deliveryReferencia.trim().length > 255)
        nuevosErrores.deliveryReferencia =
          "La referencia no puede superar 255 caracteres";
    }
    if (form.notas.trim().length > 1000)
      nuevosErrores.notas = "Las notas no pueden superar 1000 caracteres";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  const mensajeErrorPedido = (error) => {
    const respuesta = error?.response?.data;
    const mensaje = respuesta?.error || "";
    if (Array.isArray(respuesta?.detalles) && respuesta.detalles.length)
      return respuesta.detalles.map((detalle) => detalle.mensaje).join(", ");
    if (/delivery disponible desde/i.test(mensaje))
      return `El monto mínimo para delivery es ${mensaje.replace(/^.*desde\s*/i, "")}.`;
    if (/delivery no está habilitado/i.test(mensaje))
      return (
        configuracionQuery.data?.mensajeDelivery ||
        "Delivery no disponible temporalmente."
      );
    if (/punto/i.test(mensaje))
      return "Este punto ya no está disponible. Seleccioná otro.";
    return mensaje || "No se pudo crear el pedido";
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorSubmit("");
    if (
      carritoSincronizando ||
      !validar() ||
      puntosQuery.isLoading ||
      configuracionQuery.isLoading ||
      puntosQuery.isError ||
      configuracionQuery.isError
    )
      return;
    const contacto = {
      nombreContacto: form.nombreContacto.trim(),
      telefonoContacto: form.telefonoContacto.trim(),
      notas: form.notas.trim() || null,
    };
    const body =
      metodoActivo === "DELIVERY"
        ? {
            ...contacto,
            metodoEntrega: "DELIVERY",
            deliveryZona: form.deliveryZona.trim(),
            deliveryDireccion: form.deliveryDireccion.trim(),
            deliveryReferencia: form.deliveryReferencia.trim() || null,
          }
        : {
            ...contacto,
            metodoEntrega: metodoActivo,
            idPuntoEntrega: idPuntoActivo,
          };
    crearPedidoMutation.mutate(body, {
      onSuccess: (pedido) =>
        navigate("/checkout/confirmacion", {
          state: {
            idPedido: pedido.idPedido,
            total: Number(pedido.total) || total,
            estado: pedido.estado,
            items: items.map((item) => ({
              idVariante: item.idVariante,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precio,
            })),
          },
        }),
      onError: (error) => {
        setErrorSubmit(mensajeErrorPedido(error));
        void puntosQuery.refetch();
        void configuracionQuery.refetch();
      },
    });
  };
  const logisticaCargando =
    puntosQuery.isLoading || configuracionQuery.isLoading;
  const logisticaError = puntosQuery.isError || configuracionQuery.isError;
  const hayMetodoDisponible =
    puntosEntrega.length > 0 || puntosRecojo.length > 0 || deliveryDisponible;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl px-4 py-6 sm:py-10 mx-auto">
        <h1 className="mb-2 text-3xl font-black text-ink font-display sm:text-4xl">
          CHECKOUT
        </h1>
        <p className="mb-6 text-sm text-muted sm:mb-8 sm:text-base">
          Elegí cómo recibir tu pedido y confirmá tus datos de contacto.
        </p>
        {isLoading ? (
          <StatusMessage status="loading" message="Cargando pedido..." />
        ) : null}
        {isError ? (
          <Alert type="danger">No se pudo cargar el carrito</Alert>
        ) : null}
        {!isLoading && !isError && items.length === 0 ? (
          <Card
            variant="default"
            padding={false}
            className="p-6 text-center sm:p-12"
          >
            <p className="mb-4 text-2xl text-ink">Tu carrito está vacío</p>
            <Link
              to="/catalogo"
              className="text-lg font-bold text-primary-dark hover:underline"
            >
              Continuar comprando
            </Link>
          </Card>
        ) : null}
        {!isLoading && !isError && items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            <Card
              variant="default"
              padding="lg"
              className="min-w-0 p-4 sm:p-6 lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6 sm:space-y-8"
              >
                <section aria-labelledby="contacto-title">
                  <h2
                    id="contacto-title"
                    className="mb-5 text-xl font-bold text-ink font-display sm:text-2xl"
                  >
                    Datos de contacto
                  </h2>
                  <div className="space-y-5">
                    <Input
                      label="Nombre de contacto"
                      type="text"
                      sizing="lg"
                      name="nombreContacto"
                      value={form.nombreContacto}
                      onChange={handleChange}
                      placeholder="Ej: María Fernández"
                      icon={<User size={18} />}
                      error={errores.nombreContacto}
                      autoComplete="name"
                      required
                    />
                    <Input
                      label="Celular (WhatsApp)"
                      type="tel"
                      sizing="lg"
                      inputMode="tel"
                      name="telefonoContacto"
                      value={form.telefonoContacto}
                      onChange={handleChange}
                      placeholder="Ej: 71234567"
                      icon={<Phone size={18} />}
                      error={errores.telefonoContacto}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </section>
                <section aria-labelledby="entrega-title">
                  <h2
                    id="entrega-title"
                    className="mb-2 text-xl font-bold text-ink font-display sm:text-2xl"
                  >
                    ¿Cómo querés recibir tu pedido?
                  </h2>
                  <p className="mb-5 text-sm text-muted">
                    El método y los datos de entrega se guardarán con este
                    pedido.
                  </p>
                  {logisticaCargando ? (
                    <StatusMessage
                      status="loading"
                      message="Cargando opciones de entrega..."
                      className="py-6"
                    />
                  ) : null}
                  {logisticaError ? (
                    <Alert type="danger">
                      No se pudieron cargar las opciones de entrega.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          void puntosQuery.refetch();
                          void configuracionQuery.refetch();
                        }}
                        className="font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                      >
                        Reintentar
                      </button>
                    </Alert>
                  ) : null}
                  {!logisticaCargando && !logisticaError ? (
                    <>
                      <>
                        {!hayMetodoDisponible ? (
                          <Alert type="warning" className="mb-4">
                            No hay métodos de entrega disponibles por el
                            momento.
                          </Alert>
                        ) : null}
                      </>
                      <fieldset
                        disabled={!hayMetodoDisponible}
                        aria-describedby={
                          errores.metodoEntrega
                            ? "metodo-entrega-error"
                            : undefined
                        }
                      >
                        <legend className="sr-only">Método de entrega</legend>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <MetodoEntrega
                            value="PUNTO_ENTREGA"
                            title="Punto de entrega"
                            description="Recogé tu pedido en un punto acordado."
                            icon={MapPin}
                            checked={metodoActivo === "PUNTO_ENTREGA"}
                            disabled={!puntosEntrega.length}
                            onChange={cambiarMetodo}
                          />
                          <MetodoEntrega
                            value="RECOJO_TIENDA"
                            title="Recojo en tienda"
                            description="Recogé directamente con nosotros."
                            icon={Store}
                            checked={metodoActivo === "RECOJO_TIENDA"}
                            disabled={!puntosRecojo.length}
                            onChange={cambiarMetodo}
                          />
                          <MetodoEntrega
                            value="DELIVERY"
                            title="Delivery"
                            description="Entrega a domicilio a coordinar."
                            icon={Truck}
                            checked={metodoActivo === "DELIVERY"}
                            disabled={!deliveryDisponible}
                            detail={
                              !deliveryHabilitado
                                ? configuracionQuery.data?.mensajeDelivery ||
                                  "Delivery no disponible temporalmente."
                                : !deliveryDisponible
                                  ? `Disponible desde ${dinero(minimoDelivery)}. Te faltan ${dinero(faltanteDelivery)}.`
                                  : `Disponible desde ${dinero(minimoDelivery)}.`
                            }
                            onChange={cambiarMetodo}
                          />
                        </div>
                      </fieldset>
                      {errores.metodoEntrega ? (
                        <p
                          id="metodo-entrega-error"
                          role="alert"
                          className="mt-2 text-sm text-red-700"
                        >
                          {errores.metodoEntrega}
                        </p>
                      ) : null}
                      <div className="mt-6">
                        {metodoActivo === "PUNTO_ENTREGA" ? (
                          <SelectorPunto
                            puntos={puntosEntrega}
                            value={idPuntoActivo}
                            onChange={setIdPuntoEntrega}
                            error={errores.idPuntoEntrega}
                          />
                        ) : null}
                        {metodoActivo === "RECOJO_TIENDA" ? (
                          <SelectorPunto
                            puntos={puntosRecojo}
                            value={idPuntoActivo}
                            onChange={setIdPuntoEntrega}
                            error={errores.idPuntoEntrega}
                          />
                        ) : null}
                        {metodoActivo === "DELIVERY" ? (
                          <div className="space-y-5 rounded-xl border border-primary/20 bg-primary-light/20 p-3 sm:p-5">
                            <Input
                              label="Zona"
                              type="text"
                              sizing="lg"
                              name="deliveryZona"
                              value={form.deliveryZona}
                              onChange={handleChange}
                              placeholder="Ej: Sopocachi"
                              icon={<MapPin size={18} />}
                              error={errores.deliveryZona}
                              maxLength={150}
                              required
                            />
                            <Input
                              label="Dirección"
                              type="text"
                              sizing="lg"
                              name="deliveryDireccion"
                              value={form.deliveryDireccion}
                              onChange={handleChange}
                              placeholder="Calle, número y edificio"
                              icon={<MapPin size={18} />}
                              error={errores.deliveryDireccion}
                              maxLength={255}
                              required
                            />
                            <Input
                              label="Referencia (opcional)"
                              type="text"
                              sizing="lg"
                              name="deliveryReferencia"
                              value={form.deliveryReferencia}
                              onChange={handleChange}
                              placeholder="Ej: Puerta azul"
                              error={errores.deliveryReferencia}
                              maxLength={255}
                            />
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </section>
                <Textarea
                  label="Notas (opcional)"
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  placeholder="Indicaciones adicionales para tu pedido (opcional)"
                  rows={3}
                  error={errores.notas}
                  maxLength={1000}
                />
                {errorSubmit ? (
                  <Alert type="danger">{errorSubmit}</Alert>
                ) : null}
                {carritoSincronizando ? (
                  <p role="status" className="text-sm text-muted">
                    Actualizando carrito…
                  </p>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={crearPedidoMutation.isPending}
                  disabled={
                    carritoSincronizando ||
                    logisticaCargando ||
                    logisticaError ||
                    !hayMetodoDisponible
                  }
                >
                  Confirmar pedido
                </Button>
              </form>
            </Card>
            <Card
              variant="highlight"
              padding="lg"
              className="h-fit min-w-0 p-4 sm:p-6 lg:sticky lg:top-24"
            >
              <h3 className="mb-4 text-xl font-bold text-ink font-display sm:mb-6 sm:text-2xl">
                RESUMEN
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-start justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 break-words text-muted">
                      {item.nombre}{" "}
                      <span className="whitespace-nowrap">
                        x{item.cantidad}
                      </span>
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-medium text-ink">
                      {dinero(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="my-5 border-b border-white/40 pb-5 sm:my-6 sm:pb-6">
                <div className="flex justify-between gap-4 text-muted">
                  <span>Entrega:</span>
                  <span className="text-right">
                    {metodoActivo === "DELIVERY"
                      ? "A coordinar"
                      : metodoActivo === "RECOJO_TIENDA"
                        ? "Recojo en tienda"
                        : metodoActivo === "PUNTO_ENTREGA"
                          ? "Punto de entrega"
                          : "Elegí un método"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xl font-black text-ink sm:text-2xl">
                <span className="font-display">TOTAL:</span>
                <span className="text-primary-dark">{dinero(total)}</span>
              </div>
              <Button
                as={Link}
                to="/catalogo"
                variant="outline"
                size="lg"
                className="mt-6 w-full border-2 border-primary text-primary hover:bg-primary-light"
              >
                Seguir comprando
              </Button>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
