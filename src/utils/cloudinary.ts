// Aplica transformaciones de Cloudinary a una URL cruda (secure_url) de forma segura.
// La URL cruda tiene la forma .../image/upload/<version>/<public_id>.
// Insertamos las transformaciones (p.ej. w_500,q_auto,f_auto) entre "upload/" y el versionado.
export function cloudinaryUrl(url: string, transform: string): string {
  if (!url) return url;
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}${transform}/${url.slice(insertAt)}`;
}
