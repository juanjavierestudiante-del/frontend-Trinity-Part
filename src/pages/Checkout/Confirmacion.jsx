import { Navigate, Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Card from "../../components/ui/Card/Card";

const WHATSAPP_NUMBER = '59177231475';

function IconoWhatsApp({ size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const LINEA_SEPARADORA = '--------------------------------';

function construirMensajePedido(pedido) {
  const lineas = [
    `¡Hola Trinity Party! Quiero confirmar el pedido N° ${pedido.idPedido}`,
    LINEA_SEPARADORA,
    ...(Array.isArray(pedido.items) ? pedido.items.map((item) => {
      const precio = Number(item.precioUnitario) || 0;
      return `${item.cantidad}x ${item.nombre} — Bs. ${(item.cantidad * precio).toFixed(2)}`;
    }) : []),
    LINEA_SEPARADORA,
    `Total: Bs. ${Number(pedido.total).toFixed(2)}`,
  ];
  return lineas.join('\n');
}

export default function Confirmacion() {
  const location = useLocation();
  const pedido = location.state;

  if (!pedido || !pedido.idPedido) {
    return <Navigate to="/checkout" replace />;
  }

  const mensaje = construirMensajePedido(pedido);
  const enlaceWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

  return (
    <main className="min-h-screen">
      <div className="max-w-md px-4 py-16 mx-auto">
        <Card hover={false} className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary text-white">
            <ShoppingBag size={36} />
          </div>

          <h1 className="mb-2 text-3xl font-black text-ink font-display">
            ¡Pedido recibido!
          </h1>
          <p className="mb-8 text-muted">
            Tu pedido fue registrado correctamente. Pronto nos pondremos en contacto.
          </p>

          <div className="mb-8 space-y-2 p-4 text-left rounded-card border border-white/30 bg-white/20">
            <p className="text-sm text-ink">
              <span className="font-bold">N° de pedido:</span> #{pedido.idPedido}
            </p>
            <p className="text-sm text-ink">
              <span className="font-bold">Total:</span> Bs. {Number(pedido.total).toFixed(2)}
            </p>
            <p className="text-sm text-ink">
              <span className="font-bold">Estado:</span> {pedido.estado}
            </p>
            {Array.isArray(pedido.items) && pedido.items.length > 0 && (
              <div className="pt-2 mt-2 border-t border-white/40">
                {pedido.items.map((item, index) => (
                  <p key={index} className="text-sm text-muted">
                    {item.nombre} x{item.cantidad} — Bs. {(item.cantidad * (Number(item.precioUnitario) || 0)).toFixed(2)}
                  </p>
                ))}
              </div>
            )}
          </div>

          <a
            href={enlaceWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-md bg-[#25D366] text-white py-3.5 font-bold hover:bg-[#1EBE5D] transition-all duration-200"
          >
            <IconoWhatsApp size={22} />
            Confirmar pedido por WhatsApp
          </a>

          <p className="mt-3 text-sm text-muted">
            Tu pedido quedó registrado. Envía el mensaje para confirmarlo con nosotros.
          </p>

          <Link
            to="/perfil"
            className="mt-6 block w-full rounded-md border-2 border-primary text-primary py-3 text-center font-bold hover:bg-primary-light transition-all duration-200"
          >
            Ver mis pedidos
          </Link>
        </Card>
      </div>
    </main>
  );
}