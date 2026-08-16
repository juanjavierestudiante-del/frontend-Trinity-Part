// Hook reutilizable para upload de imágenes con soporte para:
// - Selección vía input file (click o botón)
// - Pegar desde portapapeles (Ctrl+V) — solo cuando el mouse está sobre la zona
// - Arrastrar y soltar (drag & drop)
// - Validación de tipo/tamaño/cantidad
// - Preview local inmediata (createObjectURL)
// - Cleanup automático de blob URLs

import { useRef, useState, useEffect, useCallback } from "react"

export interface PreviewFile {
  file: File
  previewUrl: string
  id: string
}

export interface UploadError {
  archivo: string
  error: string
}

interface UseImageUploadOptions {
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  onUpload: (archivos: File[]) => Promise<any> | void
  autoUpload?: boolean
  onFilesSelected?: (archivos: File[]) => void
}

const DEFAULT_MAX_FILES = 20
const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

let idCounter = 0
const nextId = () => `preview-${++idCounter}-${Date.now()}`

export function useImageUpload({
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  onUpload,
  autoUpload = true,
  onFilesSelected,
}: UseImageUploadOptions) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isHoveringRef = useRef(false)
  const mountedRef = useRef(true)

  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<UploadError[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // ── Validación ──────────────────────────────────────────────────

  const validateFiles = useCallback(
    (files: File[]): { validos: File[]; errores: UploadError[] } => {
      const validos: File[] = []
      const errores: UploadError[] = []

      for (const file of files) {
        if (!acceptedTypes.includes(file.type)) {
          errores.push({
            archivo: file.name,
            error: "Formato no permitido (solo JPG, PNG, WEBP)",
          })
          continue
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          errores.push({
            archivo: file.name,
            error: `Supera los ${maxSizeMB}MB`,
          })
          continue
        }
        if (previews.length + validos.length >= maxFiles) {
          errores.push({
            archivo: file.name,
            error: `Límite de ${maxFiles} imágenes alcanzado`,
          })
          continue
        }
        validos.push(file)
      }

      return { validos, errores }
    },
    [acceptedTypes, maxSizeMB, maxFiles, previews.length]
  )

  // ── Agregar archivos ────────────────────────────────────────────

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      if (files.length === 0) return

      const { validos, errores } = validateFiles(files)

      if (errores.length > 0) {
        setErrors(errores)
        setTimeout(() => {
          if (mountedRef.current) setErrors([])
        }, 5000)
      }

      if (validos.length === 0) return

      const newPreviews: PreviewFile[] = validos.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: nextId(),
      }))

      setPreviews((prev) => [...prev, ...newPreviews])

      if (autoUpload) {
        setIsUploading(true)
        try {
          await onUpload(validos)
        } finally {
          if (mountedRef.current) setIsUploading(false)
        }
      } else if (onFilesSelected) {
        onFilesSelected(validos)
      }
    },
    [validateFiles, onUpload, autoUpload, onFilesSelected]
  )

  // ── Remover preview ─────────────────────────────────────────────

  const removePreview = useCallback((index: number) => {
    setPreviews((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  // ── Limpiar todo ────────────────────────────────────────────────

  const clearPreviews = useCallback(() => {
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl))
      return []
    })
  }, [])

  // ── Cleanup al desmontar ────────────────────────────────────────

  useEffect(() => {
    return () => {
      setPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.previewUrl))
        return []
      })
    }
  }, [])

  // ── File picker ─────────────────────────────────────────────────

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        addFiles(files)
      }
      e.target.value = ""
    },
    [addFiles]
  )

  // ── Drag & Drop ─────────────────────────────────────────────────

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true)
    }
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        addFiles(files)
      }
    },
    [addFiles]
  )

  // ── Paste (Ctrl+V) — solo cuando el mouse está sobre la zona ───

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isHoveringRef.current) return

      const items = e.clipboardData?.items
      if (!items) return

      const imageFiles: File[] = []
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) imageFiles.push(file)
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault()
        addFiles(imageFiles)
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [addFiles])

  // ── Hover tracking ──────────────────────────────────────────────

  const onMouseEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const onMouseLeave = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  return {
    previews,
    isUploading,
    errors,
    isDragging,
    inputRef,
    openFilePicker,
    handleInputChange,
    addFiles,
    removePreview,
    clearPreviews,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onMouseEnter,
    onMouseLeave,
  }
}
