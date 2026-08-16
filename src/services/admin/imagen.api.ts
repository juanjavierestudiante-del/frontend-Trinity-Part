// Peticiones de subida y borrado de imágenes.
// Usa FormData porque son archivos, no JSON.

import adminApi from '../axios.admin';

// Sube imagen de un producto
export const subirImagenProducto = async (
  idProducto: number,
  archivo: File,
  principal = false
) => {
  const form = new FormData();
  form.append('imagen', archivo);
  form.append('principal', String(principal));

  const { data } = await adminApi.post(
    `/admin/imagenes/producto/${idProducto}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

// Sube imagen de una variante
export const subirImagenVariante = async (
  idVariante: number,
  archivo: File,
  principal = false
) => {
  const form = new FormData();
  form.append('imagen', archivo);
  form.append('principal', String(principal));

  const { data } = await adminApi.post(
    `/admin/imagenes/variante/${idVariante}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

// Borra imagen de producto por su id
export const eliminarImagenProducto = async (idImagen: number): Promise<void> => {
  await adminApi.delete(`/admin/imagenes/producto/${idImagen}`);
};

// Sube múltiples imágenes de un producto (feedback parcial)
export const subirMultiplesImagenesProducto = async (
  idProducto: number,
  archivos: File[]
): Promise<{
  imagenes: any[];
  fallidas: { archivo: string; error: string }[];
  totalExitosas: number;
  totalFallidas: number;
}> => {
  const form = new FormData();
  for (const archivo of archivos) {
    form.append('imagenes', archivo);
  }

  const { data } = await adminApi.post(
    `/admin/imagenes/producto/${idProducto}/multiples`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

// Marcar una imagen de producto como principal
export const marcarImagenPrincipalProducto = async (idImagen: number): Promise<any> => {
  const { data } = await adminApi.patch(`/admin/imagenes/producto/${idImagen}/principal`);
  return data;
};

// Borra imagen de variante por su id
export const eliminarImagenVariante = async (idImagen: number): Promise<void> => {
  await adminApi.delete(`/admin/imagenes/variante/${idImagen}`);
};

// Sube múltiples imágenes de una variante (feedback parcial)
export const subirMultiplesImagenesVariante = async (
  idVariante: number,
  archivos: File[]
): Promise<{
  imagenes: any[];
  fallidas: { archivo: string; error: string }[];
  totalExitosas: number;
  totalFallidas: number;
}> => {
  const form = new FormData();
  for (const archivo of archivos) {
    form.append('imagenes', archivo);
  }

  const { data } = await adminApi.post(
    `/admin/imagenes/variante/${idVariante}/multiples`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

// Marcar una imagen de variante como principal
export const marcarImagenPrincipal = async (idImagen: number): Promise<any> => {
  const { data } = await adminApi.patch(`/admin/imagenes/variante/${idImagen}/principal`);
  return data;
};

