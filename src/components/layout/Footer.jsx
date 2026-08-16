import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-white bg-gradient-to-r from-primary via-primary to-secondary">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold font-display">TRINITY</h3>
            <p className="text-sm text-white/80">
              Tu tienda especializada en artículos para fiestas y celebraciones.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold">Navegación</h4>
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
            <h4 className="mb-4 font-bold">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-white/80">info@trinity.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-white/80">+34 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-white/80">Madrid, España</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="flex items-center justify-center p-2 transition rounded-full bg-white/20 hover:bg-white/30">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="flex items-center justify-center p-2 transition rounded-full bg-white/20 hover:bg-white/30">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex items-center justify-center p-2 transition rounded-full bg-white/20 hover:bg-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20">
          <div className="text-sm text-center text-white/80">
            <p>
              &copy; 2026 Trinity. Todos los derechos reservados. |
              <a href="#" className="ml-2 hover:text-white">
                Política de privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
