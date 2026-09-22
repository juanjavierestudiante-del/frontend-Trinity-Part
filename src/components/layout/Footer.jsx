import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function IconoWhatsApp({ size = 16 }) {
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

export default function Footer() {
  return (
    <footer className="text-white bg-gradient-to-r from-primary via-primary to-secondary">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-xl font-bold font-display">Trinity Party & Events</h2>
            <p className="text-sm text-white/80">
              Tu tienda especializada en artículos para fiestas y celebraciones.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-bold">Navegación</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="transition text-white/80 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="transition text-white/80 hover:text-white">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="transition text-white/80 hover:text-white">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="transition text-white/80 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold">Contacto</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:trinitypartyandevents@gmail.com"
                  className="text-white/80 transition hover:text-white"
                >
                  trinitypartyandevents@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:+59177231475"
                  className="text-white/80 transition hover:text-white"
                >
                  +591 77231475
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconoWhatsApp size={16} />
                <a
                  href="https://wa.me/59177231475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition hover:text-white"
                >
                  WhatsApp: +591 77231475
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-white/80">Calle Tablada, La Paz, Bolivia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20">
          <div className="text-sm text-center text-white/80">
            <p>
              &copy; 2026 Trinity Party & Events. Todos los derechos reservados. |
              <button type="button" className="ml-2 hover:text-white">
                Política de privacidad
              </button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
