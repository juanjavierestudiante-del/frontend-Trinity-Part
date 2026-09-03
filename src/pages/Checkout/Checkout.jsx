import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MapPin, Phone, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  crearPedido,
  getCarrito,
} from "../../services/public/carrito.api";
import Input from "../../components/ui/Input/Input";
import Textarea from "../../components/ui/Textarea/Textarea";
import ToggleSwitch from "../../components/ui/ToggleSwitch/ToggleSwitch";
import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";
import Alert from "../../components/ui/Alert/Alert";
import StatusMessage from "../../components/ui/StatusMessage/StatusMessage";

const PHONE_RE = /^(\+?591)?[\s-]?[67]\d{7}$/;

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCarrito, setErrorCarrito] = useState("");

  const [retiroEnTienda, setRetiroEnTienda] = useState(false);
  const [form, setForm] = useState({
    nombreContacto: "",
    telefonoContacto: "",
    direccionEntrega: "",
    notas: "",
  });
  const [errores, setErrores] = useState({});
  const [errorSubmit, setErrorSubmit] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCarrito();
        const itemsCarrito = (data.items || []).map((d) => ({
          id: d.idDetalle,
          idVariante: d.variante?.idVariante || d.idVariante,
          nombre: d.variante?.producto?.nombre || d.variante?.sku || 'Producto',
          cantidad: d.cantidad || 1,
          precio: Number(d.variante?.precioOferta || d.variante?.precioVenta) || 0,
          imagen: d.variante?.imagenes?.find(i => i.principal)?.url
                 ?? d.variante?.imagenes?.[0]?.url
                 ?? d.variante?.producto?.imagenes?.find(i => i.principal)?.url,
          sku: d.variante?.sku,
        }));
        setItems(itemsCarrito);
      } catch {
        setErrorCarrito("No se pudo cargar el carrito");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.nombreContacto.trim()) {
      nuevosErrores.nombreContacto = "El nombre de contacto es obligatorio";
    } else if (form.nombreContacto.trim().length > 150) {
      nuevosErrores.nombreContacto = "El nombre no puede superar los 150 caracteres";
    }

    const telefono = form.telefonoContacto.trim();
    if (!telefono) {
      nuevosErrores.telefonoContacto = "El celular es obligatorio";
    } else if (!PHONE_RE.test(telefono)) {
      nuevosErrores.telefonoContacto = "Ingresá un celular boliviano válido (ej: 71234567 o +591 71234567)";
    }

    if (!retiroEnTienda && form.direccionEntrega.trim().length > 255) {
      nuevosErrores.direccionEntrega = "La dirección no puede superar los 255 caracteres";
    }

    if (form.notas.trim().length > 1000) {
      nuevosErrores.notas = "Las notas no pueden superar los 1000 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).every((key) => !nuevosErrores[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorSubmit("");
    if (!validar()) return;

    const body = {
      nombreContacto: form.nombreContacto.trim(),
      telefonoContacto: form.telefonoContacto.trim(),
      direccionEntrega: retiroEnTienda ? null : form.direccionEntrega.trim() || null,
      notas: form.notas.trim() || null,
    };

    setEnviando(true);
    try {
      const pedido = await crearPedido(body);
      window.dispatchEvent(new CustomEvent('cart-updated'));
      navigate('/checkout/confirmacion', {
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
      });
    } catch (err) {
      const data = err?.response?.data;
      if (Array.isArray(data?.detalles) && data.detalles.length > 0) {
        setErrorSubmit(data.detalles.map((d) => d.mensaje).join(', '));
      } else {
        setErrorSubmit(data?.error || 'No se pudo crear el pedido');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-4xl font-black text-ink font-display">CHECKOUT</h1>
        <p className="mb-8 text-muted">Completá tus datos para confirmar el pedido</p>

        {loading ? (
          <StatusMessage status="loading" message="Cargando pedido..." />
        ) : errorCarrito ? (
          <Alert type="danger">{errorCarrito}</Alert>
        ) : items.length === 0 ? (
          <Card hover={false} className="p-12 text-center">
            <p className="mb-4 text-2xl text-ink">Tu carrito está vacío</p>
            <Link to="/catalogo" className="text-lg font-bold text-primary-dark hover:underline">
              Continuar comprando
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card hover={false} className="p-6 lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-ink font-display">
                Datos de contacto
              </h2>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Input
                  label="Nombre de contacto"
                  type="text"
                  name="nombreContacto"
                  value={form.nombreContacto}
                  onChange={handleChange}
                  placeholder="Ej: María Fernández"
                  icon={<User size={18} />}
                  error={errores.nombreContacto}
                  required
                />

                <Input
                  label="Celular (WhatsApp)"
                  type="text"
                  name="telefonoContacto"
                  value={form.telefonoContacto}
                  onChange={handleChange}
                  placeholder="Ej: 71234567"
                  icon={<Phone size={18} />}
                  error={errores.telefonoContacto}
                  required
                />

                <div className="pt-2">
                  <ToggleSwitch
                    label="Retiro en tienda"
                    checked={retiroEnTienda}
                    onChange={setRetiroEnTienda}
                  />
                </div>

                {!retiroEnTienda && (
                  <Input
                    label="Dirección de entrega"
                    type="text"
                    name="direccionEntrega"
                    value={form.direccionEntrega}
                    onChange={handleChange}
                    placeholder="Calle, zona, referencia"
                    icon={<MapPin size={18} />}
                    error={errores.direccionEntrega}
                  />
                )}

                <Textarea
                  label="Notas (opcional)"
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  placeholder="Ej: Entregar en horario de tarde"
                  rows={3}
                  error={errores.notas}
                />

                {errorSubmit && (
                  <Alert type="danger">{errorSubmit}</Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={enviando}
                >
                  Confirmar pedido
                </Button>
              </form>
            </Card>

            <Card hover={false} className="p-6 h-fit sticky top-24">
              <h3 className="mb-6 text-2xl font-bold text-ink font-display">
                RESUMEN
              </h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted">
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span className="font-medium text-ink whitespace-nowrap">
                      Bs. {(item.cantidad * item.precio).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-6 pb-6 border-b border-white/40">
                <div className="flex justify-between text-muted">
                  <span>Envío:</span>
                  <span>{retiroEnTienda ? "Retiro en tienda" : "Bs. 0.00"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-ink">
                <span className="font-display">TOTAL:</span>
                <span className="text-primary-dark">Bs. {total.toFixed(2)}</span>
              </div>

              <Link
                to="/catalogo"
                className="block w-full mt-6 text-center border-2 border-primary text-primary py-3 rounded-md font-bold hover:bg-primary-light transition-all duration-200"
              >
                Seguir comprando
              </Link>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}