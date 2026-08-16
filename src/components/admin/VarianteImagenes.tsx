// Gestión de imágenes de una variante. Usa ZonaSubidaImagenes para
// paste, drag&drop, validación y previews. Este componente solo agrega
// la lógica específica de variante: marcar principal y eliminar.

import {
  useEliminarImagenVariante,
  useMarcarImagenPrincipal,
  useSubirMultiplesImagenesVariante,
} from "../../hooks/admin/useImagenes"
import ZonaSubidaImagenes from "./ZonaSubidaImagenes"
import type { ImagenVariante } from "../../types/catalogo.types"

interface Props {
  idVariante: number
  idProducto: number
  imagenes: ImagenVariante[]
}

export default function VarianteImagenes({ idVariante, idProducto, imagenes }: Props) {
  const { mutate: subirMultiples } = useSubirMultiplesImagenesVariante(idProducto)
  const { mutate: eliminar } = useEliminarImagenVariante(idProducto)
  const { mutate: marcarPrincipal } = useMarcarImagenPrincipal(idProducto)

  return (
    <div className="mt-2">
      <ZonaSubidaImagenes
        onUpload={(files) => subirMultiples({ idVariante, archivos: files })}
        existingImages={imagenes.map((img) => ({
          id: img.idImagen,
          url: img.url,
          principal: img.principal,
        }))}
        onRemoveExisting={(id) => eliminar(id)}
        onMarkPrincipal={(id) => marcarPrincipal(id)}
        showPrincipalBadge
        emptyMessage="Sin imágenes"
        uploadLabel="Agregar imagen"
      />
    </div>
  )
}
