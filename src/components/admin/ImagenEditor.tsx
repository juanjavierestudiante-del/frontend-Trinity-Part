// Gestión de imágenes de un producto. Usa ZonaSubidaImagenes para
// paste, drag&drop, validación y previews. Soporta múltiples imágenes,
// marcar principal y eliminar con confirmación.

import {
  useSubirMultiplesImagenesProducto,
  useEliminarImagenProducto,
  useMarcarImagenPrincipalProducto,
} from "../../hooks/admin/useImagenes"
import { useAuthStore } from "../../store/auth.store"
import ZonaSubidaImagenes from "./ZonaSubidaImagenes"

interface ImagenProducto {
  idImagen: number
  url: string
  principal: boolean
}

interface Props {
  idProducto: number
  imagenes: ImagenProducto[]
}

export default function ImagenEditor({ idProducto, imagenes }: Props) {
  const usuario = useAuthStore((state) => state.usuario)
  const isAdmin = usuario?.rol === 'ADMIN'
  const { mutate: subirMultiples } = useSubirMultiplesImagenesProducto(idProducto)
  const { mutate: eliminar } = useEliminarImagenProducto(idProducto)
  const { mutate: marcarPrincipal } = useMarcarImagenPrincipalProducto(idProducto)

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-300">
        Imágenes del producto
      </p>

      <ZonaSubidaImagenes
        onUpload={(files) => subirMultiples({ archivos: files })}
        existingImages={imagenes.map((img) => ({
          id: img.idImagen,
          url: img.url,
          principal: img.principal,
        }))}
        onRemoveExisting={isAdmin ? (id) => eliminar(id) : undefined}
        onMarkPrincipal={(id) => marcarPrincipal(id)}
        showPrincipalBadge
        emptyMessage="Sin imágenes todavía"
        uploadLabel="Agregar imagen"
      />
    </div>
  )
}
