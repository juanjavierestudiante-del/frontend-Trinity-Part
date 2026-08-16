import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtProductos, eliminarProducto } from "../../../services/api";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import StatusMessage from "../../../components/ui/StatusMessage/StatusMessage";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [eliminando, setEliminando] = useState(null);
  const navigate = useNavigate();

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await obtProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargarProductos(); }, []);

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    setEliminando(id);
    try {
      await eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    } finally {
      setEliminando(null);
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderEstrellas = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xs ${i < rating ? 'text-primary' : 'text-primary/20'}`}>★</span>
    ));

  const stockBadge = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock < 15) return 'bg-yellow-100 text-yellow-700';
    return 'bg-primary-light text-primary-dark';
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-background font-body">

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Productos
          </h1>
          <p className="text-xs text-primary mt-1">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2.5 items-center">
          <Input
            placeholder="Buscar producto, descripción o categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-56"
          />
          <Button onClick={() => navigate("/admin/agregar-producto")} className="!px-4 !py-2">
            Nuevo producto
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-ink rounded-card border border-primary/20 shadow-lg overflow-hidden">

        {/* Encabezado */}
        <div className="grid grid-cols-[60px_1fr_2fr_120px_80px_70px_70px_90px_120px] gap-x-2 px-5 py-3 bg-primary-dark/30 border-b border-primary/20">
          {["Img", "Nombre", "Descripción", "Categoría", "Precio", "Stock", "Rating", "Creado", "Acciones"].map((h, i) => (
            <span key={i} className={`text-[11px] font-bold uppercase tracking-wider text-primary-light/70 ${i >= 6 ? 'text-center' : 'text-left'}`}>
              {h}
            </span>
          ))}
        </div>

        {/* Filas */}
        {cargando ? (
          <StatusMessage status="loading" message="Cargando productos..." />
        ) : productosFiltrados.length === 0 ? (
          <StatusMessage status="empty" message="No se encontraron productos" />
        ) : (
          productosFiltrados.map((producto, idx) => {
            const img = producto.ImagenProductos?.[0]?.url;
            const fecha = new Date(producto.fecha_creacion).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "2-digit" });

            return (
              <div
                key={producto.id}
                className={`grid grid-cols-[60px_1fr_2fr_120px_80px_70px_70px_90px_120px] gap-x-2 items-center px-5 py-3 border-b border-primary/10 transition-colors hover:bg-primary/10 ${idx % 2 !== 0 ? 'bg-primary/5' : ''}`}
              >
                {/* Imagen */}
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/25 shrink-0">
                  {img ? (
                    <img src={img} alt={producto.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/15 flex items-center justify-center text-lg">🎈</div>
                  )}
                </div>

                {/* Nombre */}
                <div className="pr-2.5 min-w-0">
                  <div className="font-bold text-sm text-primary-light truncate" title={producto.nombre}>
                    {producto.nombre}
                  </div>
                </div>

                {/* Descripción */}
                <div className="pr-3 min-w-0">
                  <div className="text-[11px] text-primary/60 truncate max-w-[130px]" title={producto.descripcion}>
                    {producto.descripcion || "—"}
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-light text-[11px] font-semibold whitespace-nowrap">
                    {producto.categoria?.nombre || "—"}
                  </span>
                </div>

                {/* Precio */}
                <div className="font-bold text-[15px] text-primary-light">
                  ${parseFloat(producto.precio).toFixed(2)}
                </div>

                {/* Stock */}
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${stockBadge(producto.stock)}`}>
                    {producto.stock}
                  </span>
                </div>

                {/* Rating */}
                <div className="text-center">
                  {renderEstrellas(producto.rating)}
                </div>

                {/* Fecha */}
                <div className="text-xs text-primary/60 text-center">
                  {fecha}
                </div>

                {/* Acciones */}
                <div className="flex gap-1 justify-center">
                  <Button
                    onClick={() => navigate(`/admin/productos/editar/${producto.id}`)}
                    variant="ghost" size="sm" title="Editar"
                  >✏️</Button>

                  <Button
                    onClick={() => navigate(`/admin/productos/${producto.id}/imagenes`)}
                    variant="ghost" size="sm" title="Administrar imágenes"
                  >🖼️</Button>

                  <Button
                    onClick={() => handleEliminar(producto.id)}
                    variant="ghost" size="sm"
                    disabled={eliminando === producto.id}
                    className={eliminando === producto.id ? "opacity-50 cursor-not-allowed" : ""}
                    title="Eliminar"
                  >🗑️</Button>
                </div>

              </div>
            );
          })
        )}

        {/* Footer */}
        {!cargando && productosFiltrados.length > 0 && (
          <div className="px-5 py-3 bg-primary-dark/25 border-t border-primary/20 flex justify-between items-center">
            <span className="text-xs text-primary-light/70">
              Total: <strong className="text-primary-light">{productosFiltrados.length}</strong> productos
            </span>
            <span className="text-xs text-primary-light/70">
              Stock total: <strong className="text-primary-light">{productosFiltrados.reduce((a, p) => a + p.stock, 0)}</strong> unidades
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
