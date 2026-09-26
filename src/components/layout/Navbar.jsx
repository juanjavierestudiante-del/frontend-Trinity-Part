import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useContadorCarrito } from "../../hooks/useCarrito";
import Button from "../ui/Button/Button";

const MOBILE_NAV_BREAKPOINT = 768;
const SCROLL_THRESHOLD = 8;
const TOP_SCROLL_OFFSET = 32;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hiddenRouteKey, setHiddenRouteKey] = useState(null);
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const navVisibleRef = useRef(true);
  const keyboardFocusRef = useRef(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const logo = "https://res.cloudinary.com/dslh6rwix/image/upload/q_auto/f_auto/v1780528934/logo_eolnrp.png";
  const { data: contador } = useContadorCarrito();
  const cartCount = contador?.items ?? 0;
  const isAdmin = user?.rol === "ADMIN";
  const navVisible = hiddenRouteKey !== location.key;

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    navVisibleRef.current = true;
  }, [location.key]);

  useEffect(() => {
    let frameId = null;

    const showNavbar = () => {
      if (!navVisibleRef.current) {
        navVisibleRef.current = true;
        setHiddenRouteKey(null);
      }
    };

    const hideNavbar = () => {
      if (navVisibleRef.current) {
        navVisibleRef.current = false;
        setHiddenRouteKey(location.key);
      }
    };

    const handleKeydown = (event) => {
      if (event.key === "Tab") keyboardFocusRef.current = true;
    };

    const handlePointerDown = () => {
      keyboardFocusRef.current = false;
    };

    const handleResize = () => {
      lastScrollY.current = window.scrollY;
      if (window.innerWidth >= MOBILE_NAV_BREAKPOINT) showNavbar();
    };

    const handleScroll = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        const currentScrollY = window.scrollY;

        if (window.innerWidth >= MOBILE_NAV_BREAKPOINT) {
          lastScrollY.current = currentScrollY;
          showNavbar();
          return;
        }

        const hasNavbarFocus = keyboardFocusRef.current && navRef.current?.contains(document.activeElement);
        if (open || hasNavbarFocus || currentScrollY <= TOP_SCROLL_OFFSET) {
          lastScrollY.current = currentScrollY;
          showNavbar();
          return;
        }

        const scrollDelta = currentScrollY - lastScrollY.current;
        if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) return;

        if (scrollDelta > 0) hideNavbar();
        else showNavbar();
        lastScrollY.current = currentScrollY;
      });
    };

    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [open, location.key]);

  const toggleMenu = () => {
    if (!open && !navVisibleRef.current) {
      navVisibleRef.current = true;
      setHiddenRouteKey(null);
    }
    setOpen(!open);
  };

  const handleNavbarFocus = () => {
    if (keyboardFocusRef.current && !navVisibleRef.current) {
      navVisibleRef.current = true;
      setHiddenRouteKey(null);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) navigate(`/catalogo?q=${encodeURIComponent(query)}`);
  };

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Tienda" },
    { to: "/nosotros", label: "Nosotros" },
    { to: "/contactos", label: "Contacto" },
  ];

  return (
    <nav
      ref={navRef}
      onFocusCapture={handleNavbarFocus}
      className={["sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-primary/90 via-primary to-secondary/90 text-white shadow-lg backdrop-blur-md transition-transform duration-200 motion-reduce:transition-none", navVisible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]", "md:translate-y-0"].join(" ")}
    >
      <div className="w-full px-4 mx-auto max-w-7xl">
        <div className="grid h-[5.3rem] grid-cols-2 items-center lg:grid-cols-3">

          {/* Logo */}
          <div className="relative z-10 flex justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="inset-0 transition duration-300 rounded-full opacity-75 bg-gradient-to-r from-secondary/80 to-primary-light blur group-hover:opacity-100"></div>
                <img
                  src={logo}
                  className="w-44 max-w-none"
                  alt="Trinity Party & Events"
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
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group hover:text-primary-light ${
                    isActive ? "text-primary-light" : ""
                  }`
                }
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-primary-light group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            ))}
          </div>

          {/* Acciones */}
          <div className="relative z-20 flex items-center justify-end gap-2 sm:gap-3">
            {/* Búsqueda desktop */}
            <form onSubmit={submitSearch} className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 transition-colors group-focus-within:text-white" />
              <input
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar productos"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-40 xl:w-48 pl-9 pr-3 py-2 text-sm text-white placeholder-white/60 rounded-full bg-white/15 border border-white/20 backdrop-blur-md transition-all duration-300 focus:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:w-56"
              />
            </form>

            <Button
              as={Link}
              to="/catalogo"
              className="text-white hover:bg-white/15 md:hidden"
              variant="ghost"
              size="icon-lg"
              pill
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Panel Admin (solo para ADMIN) */}
            {isAdmin && (
              <Link
                to="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-full bg-white/15 hover:bg-white/25 border border-white/20"
                title="Panel Administrador"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden xl:inline">Admin</span>
              </Link>
            )}

            {/* Carrito */}
            {user && (
              <Link
                to="/carrito"
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                aria-label={`Carrito de compras (${cartCount} artículos)`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-primary">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Usuario logueado */}
            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden text-sm font-semibold text-white sm:inline">{user.nombre.split(" ")[0]}</span>
                </Link>
                <Button
                  onClick={logout}
                  className="p-2.5 rounded-full"
                  variant="ghost"
                  size="sm"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  pill
                  className="border-white/25 text-white hover:bg-white/15"
                >
                  Iniciar sesión
                </Button>
                <Button
                  as={Link}
                  to="/registro"
                  variant="primary"
                  size="sm"
                  pill
                  className="border-2 border-white/30 bg-secondary text-white font-bold shadow-[0_4px_16px_rgba(255,95,163,0.5)] hover:bg-secondary/90"
                >
                  Registrarse
                </Button>
              </div>
            )}

            {/* Menú móvil toggle */}
            <div className="ml-1 lg:hidden">
              <Button
                onClick={toggleMenu}
                className="text-white hover:bg-white/15"
                variant="ghost"
                size="icon-lg"
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
              >
                {!open ? <Menu className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
              </Button>
            </div>
          </div>

        </div>

        {/* Menú Móvil */}
        {open && (
          <div id="menu-movil" className="pb-6 border-t lg:hidden border-white/10">
            <div className="flex flex-col gap-1 mt-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-4 py-3 font-medium text-white transition-colors rounded-md hover:bg-white/10 ${
                      isActive ? "bg-white/10" : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Panel Admin en móvil */}
              {isAdmin && (
                <Link
                  to="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 font-medium text-white transition-colors rounded-md hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Panel Admin
                </Link>
              )}

              {/* Auth links en móvil */}
              {!user && (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="ghost"
                    size="md"
                    className="w-full justify-start rounded-md border border-white/25 text-white hover:bg-white/15"
                    onClick={() => setOpen(false)}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    as={Link}
                    to="/registro"
                    variant="primary"
                    size="md"
                    className="w-full rounded-md bg-secondary text-white hover:bg-secondary/90 border-2 border-white/30 font-bold"
                    onClick={() => setOpen(false)}
                  >
                    Registrarse
                  </Button>
                </>
              )}

              {user && (
                <Link
                  to="/perfil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  <User className="h-4 w-4" />
                  Mi perfil
                </Link>
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
