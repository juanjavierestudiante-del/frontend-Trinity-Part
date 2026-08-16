import adminApi from '../axios.admin';
import type { Categoria } from '../../types/catalogo.types';

export const getCategoriasAdmin = async (): Promise<Categoria[]> => {
  const { data } = await adminApi.get('/admin/categorias');
  return data;
};

export const getCategoriaAdmin = async (id: number): Promise<Categoria> => {
  const { data } = await adminApi.get(`/admin/categorias/${id}`);
  return data;
};

export const crearCategoria = async (body: {
  nombre: string;
  idCategoriaPadre?: number | null;
  descripcion?: string;
  imagen?: File;
  orden?: number;
  estado?: string;
}): Promise<Categoria> => {
  const form = new FormData();

  form.append('nombre', body.nombre);

  if (body.idCategoriaPadre !== undefined && body.idCategoriaPadre !== null) {
    form.append('idCategoriaPadre', String(body.idCategoriaPadre));
  }

  if (body.descripcion !== undefined && body.descripcion !== null) {
    form.append('descripcion', body.descripcion);
  }

  if (body.orden !== undefined) {
    form.append('orden', String(body.orden));
  }

  if (body.estado !== undefined) {
    form.append('estado', body.estado);
  }

  if (body.imagen) {
    form.append('imagen', body.imagen);
  }

  const { data } = await adminApi.post('/admin/categorias', form);

  return data;
};

export const actualizarCategoria = async (
  id: number,
  body: {
    nombre?: string;
    idCategoriaPadre?: number | null;
    descripcion?: string | null;
    imagen?: File;
    eliminarImagen?: boolean;
    orden?: number;
    estado?: string;
  }
): Promise<Categoria> => {
  const form = new FormData();

  if (body.nombre !== undefined) {
    form.append('nombre', body.nombre);
  }

  if (body.idCategoriaPadre !== undefined && body.idCategoriaPadre !== null) {
    form.append('idCategoriaPadre', String(body.idCategoriaPadre));
  }

  if (body.descripcion !== undefined && body.descripcion !== null) {
    form.append('descripcion', body.descripcion);
  }

  if (body.orden !== undefined) {
    form.append('orden', String(body.orden));
  }

  if (body.estado !== undefined) {
    form.append('estado', body.estado);
  }

  if (body.imagen) {
    form.append('imagen', body.imagen);
  }

  if (body.eliminarImagen !== undefined) {
    form.append('eliminarImagen', String(body.eliminarImagen));
  }

  const { data } = await adminApi.put(
    `/admin/categorias/${id}`,
    form
  );

  return data;
};

export const cambiarEstadoCategoria = async (
  id: number,
  estado: 'Activo' | 'Inactivo'
): Promise<{ categoria: Categoria; hijosInactivados: number }> => {
  const { data } = await adminApi.patch(`/admin/categorias/${id}/estado`, { estado });
  return data;
};

export const eliminarCategoria = async (id: number): Promise<void> => {
  await adminApi.delete(`/admin/categorias/${id}`);
};



// la imagen al estamos manejamdo cona actualización de la categoría, pero si queremos subir 
// o eliminar la imagen de manera independiente, podemos usar estos métodos:  
// alerta no usando
export const subirImagenCategoria = async (
  idCategoria: number,
  archivo: File
): Promise<Categoria> => {
  const form = new FormData();
  form.append('imagen', archivo);

  const { data } = await adminApi.post(
    `/admin/imagenes/categoria/${idCategoria}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

export const eliminarImagenCategoria = async (idCategoria: number): Promise<void> => {
  await adminApi.delete(`/admin/imagenes/categoria/${idCategoria}`);
};
