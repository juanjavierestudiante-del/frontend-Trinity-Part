import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ====================
// Páginas
// ====================

import Home from "./pages/Home/Home";
import Home2 from "./pages/Home/Home2";
import Carrito from "./pages/Carrito/Carrito";
import Contacto from "./pages/Contacto/Contacto";
import Nosotros from "./pages/Nosotros/Nosotros";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import Perfil from "./pages/Perfil/Perfil";

// ====================
// Catálogo (nuevo flujo)
// ====================

import Catalogo from "./pages/Catalogo/PaginaCatalogo";
import PaginaProducto from "./pages/Producto/PaginaProducto";

// ====================
// Administración
// ====================

import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ProductoFormPage from "./pages/admin/ProductoFormPage";
import ProductosPage from "./pages/admin/ProductosPage";
import ProductoDetallePage from "./pages/admin/ProductoDetallePage";
import CategoriasPage from "./pages/admin/CategoriasPage";
import CategoriaFormPage from "./pages/admin/CategoriaFormPage";

// ====================
// Admin (legacy - mantener temporalmente)
// ====================

import AgregarProducto from "./pages/admin/Productos/AgregarProducto";
import ListarProductos from "./pages/admin/Productos/ListarProductos";
import AdminImagenes from "./pages/admin/Productos/AdminImagenes";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<Home2 />} />

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

          {/* Admin: Login */}
          <Route path="/admin/login" element={<LoginPage />} />

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
          </Route>

          {/* Admin: Rutas legacy (temporal) */}
          <Route path="/admin/agregar-producto" element={<AgregarProducto />} />
          <Route path="/admin/mostrar-productos" element={<ListarProductos />} />
          <Route path="/admin/productos/:id/imagenes" element={<AdminImagenes />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
