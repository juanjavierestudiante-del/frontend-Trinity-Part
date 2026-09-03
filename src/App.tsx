import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader/Loader";

// ====================
// Páginas (carga perezosa / code-splitting por ruta)
// ====================

const Home = lazy(() => import("./pages/Home/Home"));

const Carrito = lazy(() => import("./pages/Carrito/Carrito"));
const Contacto = lazy(() => import("./pages/Contacto/Contacto"));
const Nosotros = lazy(() => import("./pages/Nosotros/Nosotros"));
const Login = lazy(() => import("./pages/Login/Login"));
const Registro = lazy(() => import("./pages/Registro/Registro"));
const Perfil = lazy(() => import("./pages/Perfil/Perfil"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Confirmacion = lazy(() => import("./pages/Checkout/Confirmacion"));

// ====================
// Catálogo (nuevo flujo)
// ====================

const Catalogo = lazy(() => import("./pages/Catalogo/PaginaCatalogo"));
const PaginaProducto = lazy(() => import("./pages/Producto/PaginaProducto"));

// ====================
// Administración
// ====================

const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const UnauthorizedPage = lazy(() => import("./pages/admin/UnauthorizedPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
const ProductoFormPage = lazy(() => import("./pages/admin/ProductoFormPage"));
const ProductosPage = lazy(() => import("./pages/admin/ProductosPage"));
const ProductoDetallePage = lazy(() => import("./pages/admin/ProductoDetallePage"));
const CategoriasPage = lazy(() => import("./pages/admin/CategoriasPage"));
const CategoriaFormPage = lazy(() => import("./pages/admin/CategoriaFormPage"));
const InventarioPage = lazy(() => import("./pages/admin/InventarioPage"));
const PedidosPage = lazy(() => import("./pages/admin/PedidosPage"));

// Fallback de carga consistente con el estilo del proyecto (spinner)
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader size="lg" text="Cargando..." />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Catálogo */}
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/categoria/:slug" element={<Catalogo />} />
            <Route path="/productos/:slug" element={<PaginaProducto />} />

            {/* Carrito, Cuenta */}
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/contactos" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/confirmacion" element={<Confirmacion />} />

            {/* Admin: Login */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />

            {/* Admin: Rutas protegidas con layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="productos/nuevo" element={<ProductoFormPage />} />
              <Route path="productos/:id" element={<ProductoDetallePage />} />
              <Route path="productos/:id/editar" element={<ProductoDetallePage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              <Route path="categorias/nueva" element={<CategoriaFormPage />} />
              <Route path="categorias/:id/editar" element={<CategoriaFormPage />} />
              <Route path="inventario" element={<InventarioPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
            </Route>
          </Routes>
        </Suspense>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
