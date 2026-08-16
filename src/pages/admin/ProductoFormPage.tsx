import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useProductoAdmin,
  useCrearProducto,
  useActualizarProducto,
} from "../../hooks/admin/useProductosAdmin"
import { useCategoriasAdmin } from "../../hooks/admin/useCategoriasAdmin"
import Button from "../../components/ui/Button/Button"
import Input from "../../components/ui/Input/Input"
import Textarea from "../../components/ui/Textarea/Textarea"
import Select from "../../components/ui/Select/Select"
import Label from "../../components/ui/Label/Label"
import ToggleSwitch from "../../components/ui/ToggleSwitch/ToggleSwitch"
import Loader from "../../components/ui/Loader/Loader"

export default function ProductoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const esEdicion = !!id

  const { data: productoExistente, isLoading: loadingProducto } =
    useProductoAdmin(Number(id))
  const { data: categorias, isLoading: loadingCategorias } =
    useCategoriasAdmin()
  const { mutate: crear, isPending: creando } = useCrearProducto()
  const { mutate: actualizar, isPending: actualizando } =
    useActualizarProducto()

  const [form, setForm] = useState({
    nombre: "",
    idCategoria: 0,
    descripcionCorta: "",
    descripcion: "",
    destacado: false,
    estado: "Borrador",
    rating: 0,
  })

  useEffect(() => {
    if (esEdicion && productoExistente) {
      setForm({
        nombre: productoExistente.nombre,
        idCategoria: productoExistente.categoria.idCategoria,
        descripcionCorta: productoExistente.descripcionCorta || "",
        descripcion: productoExistente.descripcion || "",
        destacado: productoExistente.destacado,
        estado: productoExistente.estado,
        rating: productoExistente.rating,
      })
    }
  }, [productoExistente, esEdicion])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (esEdicion) {
      actualizar(
        { id: Number(id), body: form },
        { onSuccess: () => navigate("/admin/productos") },
      )
    } else {
      crear(form, { onSuccess: () => navigate("/admin/productos") })
    }
  }

  if (esEdicion && loadingProducto)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader size="xl" showText={false} />
      </div>
    )
  if (loadingCategorias)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader size="xl" showText={false} />
      </div>
    )

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-2xl p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {esEdicion ? "Editar producto" : "Nuevo producto"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre" dark>Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nombre: e.target.value })}
              required
              dark
            />
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria" dark>Categoría</Label>
            <Select
              id="categoria"
              value={form.idCategoria}
              onChange={(e : React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, idCategoria: Number(e.target.value) })
              }
              required
              dark
            >
              <option value={0} disabled>Seleccioná una categoría</option>
              {categorias?.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </Select>
          </div>

          {/* Descripción corta */}
          <div>
            <Label htmlFor="descCorta" dark>Descripción corta</Label>
            <Input
              id="descCorta"
              value={form.descripcionCorta}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, descripcionCorta: e.target.value })
              }
              placeholder="Texto breve para listados"
              dark
            />
          </div>

          {/* Descripción larga */}
          <div>
            <Label htmlFor="desc" dark>Descripción</Label>
            <Textarea
              id="desc"
              rows={4}
              value={form.descripcion}
              onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Descripción completa del producto"
              dark
            />
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="estado" dark>Estado</Label>
            <Select
              id="estado"
              value={form.estado}
              onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, estado: e.target.value })}
              dark
            >
              <option value="Borrador">Borrador</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Descontinuado">Descontinuado</option>
            </Select>
          </div>

          {/* Destacado */}
          <ToggleSwitch
            label="Producto destacado (aparece en home)"
            checked={form.destacado}
            onChange={(val : boolean) => setForm({ ...form, destacado: val })}
            dark
          />

          {/* Rating */}
          <div>
            <Label htmlFor="rating" dark>Rating</Label>
            <select
              id="rating"
              value={form.rating}
              onChange={(e : React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className="rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-primary focus:ring-primary"
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-2">
            <Button type="submit" disabled={creando || actualizando}>
              {creando || actualizando
                ? "Guardando..."
                : esEdicion
                  ? "Guardar cambios"
                  : "Crear producto"}
            </Button>
            <Button
              variant="gray"
              type="button"
              onClick={() => navigate("/admin/productos")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
