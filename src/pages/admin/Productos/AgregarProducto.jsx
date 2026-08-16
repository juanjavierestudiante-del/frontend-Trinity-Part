import { useEffect, useState } from "react";
import { crearProducto, obtCategorias } from "../../../services/api";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import Select from "../../../components/ui/Select/Select";
import Textarea from "../../../components/ui/Textarea/Textarea";

export default function AgregarProducto() {
  const [categorias, setCategorias] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const [Form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    rating: "",
    id_categoria: "",
  });

  const cargarCategorias = async () => {
    try {
      const data = await obtCategorias();
      setCategorias(data);
    } catch (error) { console.error(error); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargarCategorias(); }, []);

  const handleChange = (e) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarProducto = async () => {
    setGuardando(true);
    try {
      const datos = {
        nombre: Form.nombre,
        descripcion: Form.descripcion,
        precio: parseFloat(Form.precio),
        stock: parseInt(Form.stock),
        rating: parseFloat(Form.rating),
        id_categoria: parseInt(Form.id_categoria),
      }

      await crearProducto(datos);
      alert("Producto creado correctamente");
      setForm({ nombre: "", descripcion: "", precio: "", stock: "", rating: "", id_categoria: "" });
    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 lg:p-10 bg-background font-body">
      <div className="w-full max-w-[820px] bg-white/90 backdrop-blur-sm rounded-card border border-primary/15 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary/80 to-secondary/80 backdrop-blur-sm px-8 lg:px-9 py-7 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-card bg-white/20 border border-white/30 flex items-center justify-center text-2xl shrink-0">🎉</div>
            <div>
              <h1 className="m-0 text-xl font-bold text-white tracking-tight">Nuevo Producto</h1>
              <p className="mt-0.5 text-[13px] text-white/75">Completá los datos para agregar al catálogo</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-9">

          {/* Sección 1 */}
          <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-4 mt-0 flex items-center gap-2">
            Información del producto
            <span className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">🏷️ Nombre</label>
              <Input name="nombre" value={Form.nombre} onChange={handleChange} placeholder="Ej: Globos metalizados x10" />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">🗂️ Categoría</label>
              <Select name="id_categoria" value={Form.id_categoria} onChange={handleChange} options={[{ value: '', label: 'Seleccionar categoría' }, ...categorias.map(c => ({ value: c.id_categoria, label: c.nombre }))]} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">📝 Descripción</label>
            <Textarea
              name="descripcion"
              placeholder="Describí el producto, materiales, colores disponibles, etc."
              value={Form.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-6" />

          {/* Sección 2 */}
          <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-4 mt-0 flex items-center gap-2">
            Precio, stock y valoración
            <span className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">💲 Precio</label>
              <Input name="precio" type="number" placeholder="0.00" value={Form.precio} onChange={handleChange} icon={<span className="font-bold text-primary">$</span>} />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">📦 Stock disponible</label>
              <Input type="number" name="stock" placeholder="Ej: 100" value={Form.stock} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-0">
            <label className="text-xs font-semibold text-primary-dark flex items-center gap-1 mb-1.5">⭐ Rating (0 – 5)</label>
            <div className="flex items-center gap-3">
              <input
                type="range" name="rating" min="0" max="5" step="0.5"
                value={Form.rating || 0}
                onChange={handleChange}
                className="flex-1 accent-primary h-1"
              />
              <span className="min-w-[42px] text-center bg-gradient-to-br from-primary to-secondary text-white rounded-md px-2.5 py-1 text-[13px] font-bold">
                {parseFloat(Form.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Botón */}
          <Button onClick={guardarProducto} disabled={guardando} className="w-full mt-7" variant="primary" size="lg">
            {guardando ? <>⏳ Guardando...</> : <>✨ Guardar producto</>}
          </Button>

        </div>
      </div>
    </div>
  );
}
