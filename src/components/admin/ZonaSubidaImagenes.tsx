// Componente reutilizable de zona de subida de imágenes.
// Soporta: click para seleccionar, Ctrl+V para pegar, drag & drop.
// Muestra previews locales, errores, y maneja upload automático o diferido.

import { HiPlus, HiTrash, HiCheck, HiPhotograph } from "react-icons/hi"
import { useImageUpload, type PreviewFile } from "../../hooks/admin/useImageUpload"
import Button from "../ui/Button/Button"
import ConfirmDialog from "../ui/ConfirmDialog/ConfirmDialog"
import { useState } from "react"

interface ExistingImage {
  id: number
  url: string
  principal?: boolean
}

interface Props {
  onUpload: (archivos: File[]) => Promise<any> | void
  maxFiles?: number
  maxSizeMB?: number
  multiple?: boolean
  emptyMessage?: string
  uploadLabel?: string
  existingImages?: ExistingImage[]
  onRemoveExisting?: (id: number) => void
  onMarkPrincipal?: (id: number) => void
  showPrincipalBadge?: boolean
  autoUpload?: boolean
  onFilesSelected?: (archivos: File[]) => void
}

export default function ZonaSubidaImagenes({
  onUpload,
  maxFiles = 20,
  maxSizeMB = 5,
  multiple = true,
  emptyMessage = "Sin imágenes",
  uploadLabel = "Agregar imagen",
  existingImages = [],
  onRemoveExisting,
  onMarkPrincipal,
  showPrincipalBadge = false,
  autoUpload = true,
  onFilesSelected,
}: Props) {
  const {
    previews,
    isUploading,
    errors,
    isDragging,
    inputRef,
    openFilePicker,
    handleInputChange,
    removePreview,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onMouseEnter,
    onMouseLeave,
  } = useImageUpload({
    maxFiles,
    maxSizeMB,
    onUpload,
    autoUpload,
    onFilesSelected,
  })

  const [eliminarId, setEliminarId] = useState<number | null>(null)

  const handleEliminarExistente = () => {
    if (eliminarId === null || !onRemoveExisting) return
    onRemoveExisting(eliminarId)
    setEliminarId(null)
  }

  const totalVisible = existingImages.length + previews.length
  const canAdd = multiple ? totalVisible < maxFiles : totalVisible === 0

  return (
    <div>
      {/* Imágenes existentes */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img) => (
            <div
              key={img.id}
              className="relative w-24 h-24 group rounded-lg overflow-hidden border border-gray-600"
            >
              <img
                src={img.url}
                alt="imagen"
                className="object-cover w-full h-full"
              />

              {showPrincipalBadge && img.principal && (
                <span className="absolute top-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-white bg-primary rounded">
                  <HiCheck className="w-2.5 h-2.5" />
                  Principal
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {showPrincipalBadge && onMarkPrincipal && !img.principal && (
                  <button
                    onClick={() => onMarkPrincipal(img.id)}
                    className="p-1 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                    title="Hacer principal"
                  >
                    <HiCheck className="w-3 h-3" />
                  </button>
                )}

                {onRemoveExisting && (
                  <button
                    onClick={() => setEliminarId(img.id)}
                    className="p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                    title="Eliminar"
                  >
                    <HiTrash className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          relative rounded-lg border-2 border-dashed transition-colors
          ${isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-600 hover:border-gray-500"
          }
          ${!canAdd ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {/* Overlay de drag */}
        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/10 border-2 border-primary border-dashed">
            <p className="text-sm font-medium text-primary">
              Soltá las imágenes aquí
            </p>
          </div>
        )}

        {/* Contenido normal */}
        <div className="p-3">
          {/* Empty state */}
          {existingImages.length === 0 && previews.length === 0 && (
            <p className="flex items-center gap-1 mb-2 text-xs text-gray-500">
              <HiPhotograph className="w-3 h-3" />
              {emptyMessage}
            </p>
          )}

          {/* Previews de uploads nuevos */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {previews.map((p, i) => (
                <PreviewThumb key={p.id} preview={p} onRemove={() => removePreview(i)} />
              ))}
            </div>
          )}

          {/* Errores */}
          {errors.length > 0 && (
            <div className="mb-2 p-2 text-xs rounded bg-red-900/50 border border-red-700">
              {errors.map((err, i) => (
                <p key={i} className="text-red-300">
                  <span className="font-medium">{err.archivo}:</span> {err.error}
                </p>
              ))}
            </div>
          )}

          {/* Input + botón */}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={multiple}
              className="hidden"
              onChange={handleInputChange}
            />

            <Button
              size="xs"
              variant="light"
              onClick={openFilePicker}
              disabled={isUploading || !canAdd}
            >
              {isUploading ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Subiendo...
                </span>
              ) : (
                <>
                  <HiPlus className="w-3 h-3 mr-1" />
                  {uploadLabel}
                </>
              )}
            </Button>

            <p className="text-[11px] text-gray-500">
              JPG, PNG o WEBP. Máx {maxSizeMB}MB.
              {multiple && ` Hasta ${maxFiles} imágenes.`}
              {" "}Podés pegar con Ctrl+V.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm dialog para eliminar existentes */}
      <ConfirmDialog
        isOpen={eliminarId !== null}
        title="Eliminar imagen"
        message="¿Eliminar esta imagen? Se borrará permanentemente de Cloudinary."
        onConfirm={handleEliminarExistente}
        onCancel={() => setEliminarId(null)}
      />
    </div>
  )
}

// ── Thumbnail de preview con estado ────────────────────────────────

function PreviewThumb({ preview, onRemove }: { preview: PreviewFile; onRemove: () => void }) {
  return (
    <div className="relative w-24 h-24 group rounded-lg overflow-hidden border border-gray-600">
      <img
        src={preview.previewUrl}
        alt={preview.file.name}
        className="object-cover w-full h-full"
      />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-0.5 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Quitar"
      >
        <HiTrash className="w-2.5 h-2.5" />
      </button>
    </div>
  )
}
