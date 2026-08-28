import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getCarrito } from "../../services/public/carrito.api";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const logo = "https://res.cloudinary.com/dslh6rwix/image/upload/q_auto/f_auto/v1780528934/logo_eolnrp.png";
  const [cartCount, setCartCount] = useState(0);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const data = await getCarrito();
        const items = data?.items || [];
        const total = items.reduce((s, d) => s + (d.cantidad || 0), 0);
        if (mounted) setCartCount(total);
      } catch {
        if (mounted) setCartCount(0);
      }
    };
    load();

    const handler = () => {
      load();
    };
    window.addEventListener("cart-updated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("cart-updated", handler);
    };
  }, [user]);

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Tienda" },
    { to: "/nosotros", label: "Nosotros" },
    { to: "/contactos", label: "Contacto" },
  ];

  return (
    <nav className="sticky top-0 z-50 text-white border-b shadow-lg backdrop-blur-md bg-gradient-to-r from-primary/90 via-primary to-secondary/90 border-white/10">
      <div className="w-full px-4 mx-auto max-w-7xl">
        <div className="grid items-center grid-cols-2 lg:grid-cols-3 h-[5.3rem]">

          {/* Logo */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="inset-0 transition duration-300 rounded-full opacity-75 bg-gradient-to-r from-secondary/80 to-primary-light blur group-hover:opacity-100"></div>
                <img
                  src={logo}
                  className="w-44"
                  alt="Logo"
                />
              </div>
              <div className="flex-col hidden sm:flex">
                <span className="text-xl font-black text-transparent bg-gradient-to-r from-white to-secondary/60 bg-clip-text font-display">
                  Trinity
                </span>
                <span className="text-xs font-semibold tracking-wider text-primary-light/80">PARTY & EVENTS</span>
              </div>
            </Link>
          </div>

          {/* Enlaces Desktop */}
          <div className="items-center justify-center hidden gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group hover:text-primary-light"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-primary-light group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {/* Búsqueda desktop */}
            <div className="relative hidden md:block">
              <Input placeholder="Buscar..." className="w-40 xl:w-48" icon={<Search className="w-4 h-4 text-white/60" />} />
            </div>

            <Button className="p-2.5 rounded-full md:hidden" variant="ghost" size="sm">
              <Search className="w-5 h-5" />
            </Button>

            {/* Panel Admin (solo para ADMIN) */}
            {isAdmin && (
              <a
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-full bg-white/15 hover:bg-white/25 border border-white/20"
                title="Panel Administrador"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden xl:inline">Admin</span>
              </a>
            )}

            {/* Carrito */}
            {user && (
              <Link
                to="/carrito"
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-primary">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Usuario logueado */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden text-sm font-semibold text-white sm:inline">{user.name.split(" ")[0]}</span>
                </Link>
                <Button
                  onClick={logout}
                  className="p-2.5 rounded-full"
                  variant="ghost"
                  size="sm"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/40 text-p hover:bg-white/15"
                >
                  Iniciar sesión
                </Button>
                <Button
                  as={Link}
                  to="/registro"
                  variant="primary"
                  size="sm"
                  className="rounded-full first-line: text-white hover:bg-primary-light"
                >
                  Registrarse
                </Button>
              </div>
            )}

            {/* Menú móvil toggle */}
            <div className="ml-1 lg:hidden">
              <Button onClick={() => setOpen(!open)} className="p-2.5 rounded-md" variant="ghost" size="sm">
                {!open ? <Menu className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
              </Button>
            </div>
          </div>

        </div>

        {/* Menú Móvil */}
        {open && (
          <div className="pb-6 border-t lg:hidden border-white/10">
            <div className="flex flex-col gap-1 mt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-3 font-medium text-white transition-colors rounded-md hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Panel Admin en móvil */}
              {isAdmin && (
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 font-medium text-white transition-colors rounded-md hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Panel Admin
                </a>
              )}

              {/* Auth links en móvil */}
              {!user && (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    size="md"
                    className="w-full justify-start rounded-md border-white/40 text-white hover:bg-white/15"
                    onClick={() => setOpen(false)}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    as={Link}
                    to="/registro"
                    variant="primary"
                    size="md"
                    className="w-full rounded-md bg-white text-primary hover:bg-primary-light"
                    onClick={() => setOpen(false)}
                  >
                    Registrarse
                  </Button>
                </>
              )}

              {user && (
                <Button
                  onClick={() => { logout(); setOpen(false); }}
                  variant="ghost"
                  size="md"
                  className="w-full justify-start rounded-md text-left text-red-300 hover:bg-white/10"
                >
                  Cerrar sesión
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
