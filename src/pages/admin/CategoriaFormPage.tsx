// Formulario de crear/editar categoría con subida de imagen.
// Usa ZonaSubidaImagenes para paste, drag&drop, validación y previews.
// La imagen se sube junto con el form (autoUpload=false).

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useCategoriaAdmin,
  useCrearCategoria,
  useActualizarCategoria,
  useCategoriasAdmin,
} from '../../hooks/admin/useCategoriasAdmin';

import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Textarea from '../../components/ui/Textarea/Textarea';
import Label from '../../components/ui/Label/Label';
import Loader from '../../components/ui/Loader/Loader';
import SelectCategoriaJerarquico from '../../components/admin/SelectCategoriaJerarquico';
import ZonaSubidaImagenes from '../../components/admin/ZonaSubidaImagenes';

export default function CategoriaFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const esEdicion = !!id;

  // ==============================
  // QUERIES
  // ==============================

  const {
    data: categoriaExistente,
    isLoading: loadingCategoria,
  } = useCategoriaAdmin(Number(id));

  const {
    data: categorias,
    isLoading: loadingCategorias,
  } = useCategoriasAdmin();

  // ==============================
  // MUTATIONS
  // ==============================

  const {
    mutate: crear,
    isPending: creando,
  } = useCrearCategoria();

  const {
    mutate: actualizar,
    isPending: actualizando,
  } = useActualizarCategoria();

  // ==============================
  // FORM
  // ==============================

  const [form, setForm] = useState({
    nombre: '',
    idCategoriaPadre: null as number | null,
    descripcion: '',
    orden: 0,
    estado: 'Activo',
  });

  // ==============================
  // IMAGEN
  // ==============================

  const [imagenNueva, setImagenNueva] = useState<File | null>(null);
  const [eliminarImagenPendiente, setEliminarImagenPendiente] = useState(false);
  const [error, setError] = useState('');

  // ==============================
  // CARGAR CATEGORÍA EN EDICIÓN
  // ==============================

  useEffect(() => {
    if (esEdicion && categoriaExistente) {
      setForm({
        nombre: categoriaExistente.nombre,
        idCategoriaPadre:
          (categoriaExistente as any).idCategoriaPadre ?? null,
        descripcion:
          (categoriaExistente as any).descripcion || '',
        orden:
          (categoriaExistente as any).orden || 0,
        estado:
          (categoriaExistente as any).estado || 'Activo',
      });
    }
  }, [categoriaExistente, esEdicion]);

  // ==============================
  // IMAGEN: callbacks para ZonaSubidaImagenes
  // ==============================

  const handleFilesSelected = (files: File[]) => {
    setImagenNueva(files[0] || null);
    setEliminarImagenPendiente(false);
  };

  const handleRemoveExistingImage = () => {
    setEliminarImagenPendiente(true);
    setImagenNueva(null);
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const body: any = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion || null,
      orden: form.orden,
      estado: form.estado,
    };

    if (form.idCategoriaPadre !== null) {
      body.idCategoriaPadre = form.idCategoriaPadre;
    }

    if (imagenNueva) {
      body.imagen = imagenNueva;
    }

    if (eliminarImagenPendiente) {
      body.eliminarImagen = true;
    }

    if (esEdicion) {
      actualizar(
        { id: Number(id), body },
        {
          onSuccess: () => navigate('/admin/categorias'),
          onError: (err: any) => {
            setError(err?.response?.data?.message || 'Error al actualizar la categoría');
          },
        }
      );
      return;
    }

    crear(body, {
      onSuccess: () => navigate('/admin/categorias'),
      onError: (err: any) => {
        setError(err?.response?.data?.message || 'Error al crear la categoría');
      },
    });
  };

  // ==============================
  // LOADING
  // ==============================

  if (esEdicion && loadingCategoria) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" showText={false} />
      </div>
    );
  }

  if (loadingCategorias) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" showText={false} />
      </div>
    );
  }

  const isPending = creando || actualizando;

  // ==============================
  // IMAGEN EXISTENTE (para ZonaSubidaImagenes)
  // ==============================

  const imagenExistente = esEdicion && categoriaExistente?.imagenUrl && !eliminarImagenPendiente
    ? [{ id: 0, url: categoriaExistente.imagenUrl, principal: true }]
    : [];

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-2xl p-4 sm:p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">

        <h1 className="mb-6 text-2xl font-bold text-white">
          {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
        </h1>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-300 border border-red-700 rounded bg-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NOMBRE */}
          <div>
            <Label htmlFor="nombre" dark required>Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, nombre: e.target.value })
              }
              required
              dark
            />
          </div>

          {/* CATEGORÍA PADRE */}
          <div>
            <Label dark>Categoría padre</Label>
            <SelectCategoriaJerarquico
              categorias={categorias || []}
              value={form.idCategoriaPadre}
              onChange={(val) => setForm({ ...form, idCategoriaPadre: val })}
              excludeId={esEdicion ? Number(id) : undefined}
              dark
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <Label htmlFor="descripcion" dark>Descripción</Label>
            <Textarea
              id="descripcion"
              rows={3}
              value={form.descripcion}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Descripción opcional de la categoría"
              dark
            />
          </div>

          {/* ORDEN */}
          <div>
            <Label htmlFor="orden" dark>Orden</Label>
            <Input
              id="orden"
              type="number"
              value={form.orden}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, orden: Number(e.target.value) })
              }
              dark
            />
          </div>

          {/* ESTADO */}
          <div>
            <Label htmlFor="estado" dark>Estado</Label>
            <select
              id="estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="block w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* IMAGEN */}
          <div>
            <Label dark>Imagen de la categoría</Label>
            <ZonaSubidaImagenes
              onUpload={() => {}}
              autoUpload={false}
              onFilesSelected={handleFilesSelected}
              multiple={false}
              existingImages={imagenExistente}
              onRemoveExisting={handleRemoveExistingImage}
              emptyMessage="Sin imagen"
              uploadLabel="Seleccionar imagen"
            />
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 mt-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Guardando...'
                : esEdicion ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
            <Button
              variant="gray"
              type="button"
              onClick={() => navigate('/admin/categorias')}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
