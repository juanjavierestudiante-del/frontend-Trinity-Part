import { useState } from "react"
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi"
import {
  useVariantesPorProducto,
  useCrearVariante,
  useActualizarVariante,
  useEliminarVariante,
} from "../../hooks/admin/useVariantes"
import { useAuthStore } from "../../store/auth.store"
import type { Variante } from "../../types/catalogo.types"
import VarianteForm from "./VarianteForm"
import VarianteImagenes from "./VarianteImagenes"
import AtributoSelector from "./AtributoSelector"
import Button from "../ui/Button/Button"
import Badge from "../ui/Badge/Badge"
import Loader from "../ui/Loader/Loader"
import Card from "../ui/Card/Card"

type AtributoAsignadoAdmin = {
  idValor: number
  valorAtributo: { valor: string; atributo: { nombre: string } }
}

type VarianteAdmin = Omit<Variante, 'varianteAtributo' | 'inventario'> & {
  codigoBarras?: string
  inventario?: { stockActual?: number; stockMinimo?: number } | null
  varianteAtributo: AtributoAsignadoAdmin[]
}
interface Props {
  idProducto: number
}

export default function VarianteEditor({ idProducto }: Props) {
  const usuario = useAuthStore((state) => state.user)
  const isAdmin = usuario?.rol === 'ADMIN'
  const { data: variantes, isLoading } = useVariantesPorProducto(idProducto)
  const { mutate: crear, isPending: creando } = useCrearVariante()
  const { mutate: actualizar, isPending: actualizando } =
    useActualizarVariante(idProducto)
  const { mutate: eliminar } = useEliminarVariante(idProducto)

  const [formAbierto, setFormAbierto] = useState<"nuevo" | number | null>(null)

  if (isLoading) return <Loader size="md" showText={false} />

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-300">
          Variantes ({variantes?.length || 0})
        </p>
        {isAdmin && (
          <Button
            size="sm"
            className="min-h-11 sm:min-h-0"
            onClick={() =>
              setFormAbierto(formAbierto === "nuevo" ? null : "nuevo")
            }
          >
            <HiPlus className="w-3 h-3" />
            Nueva variante
          </Button>
        )}
      </div>

      {formAbierto === "nuevo" && (
        <div className="mb-4">
          <VarianteForm
            idProducto={idProducto}
            guardando={creando}
            onCancelar={() => setFormAbierto(null)}
            onGuardar={(data) => {
              crear(data, { onSuccess: () => setFormAbierto(null) })
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {variantes?.map((variante: VarianteAdmin) => (
          <Card
            key={variante.idVariante}
            variant="admin"
            padding="sm"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="block break-all font-mono text-sm font-medium text-gray-200">
                  {variante.sku}
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <AtributoSelector
                    idVariante={variante.idVariante}
                    idProducto={idProducto}
                    atributosAsignados={variante.varianteAtributo || []}
                  />
                  <Badge
                    variant={
                      (variante.inventario?.stockActual ?? 0) >
                      (variante.inventario?.stockMinimo ?? 0)
                        ? "success"
                        : "danger"
                    }
                    size="sm"
                  >
                    Stock: {variante.inventario?.stockActual ?? 0}
                  </Badge>
                  <Badge
                    variant={variante.estado === "Activo" ? "success" : "gray"}
                    size="sm"
                  >
                    {variante.estado}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="light"
                  aria-label={`Editar variante ${variante.sku}`}
                  className="min-h-11 min-w-11 sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0"
                  onClick={() =>
                    setFormAbierto(
                      formAbierto === variante.idVariante
                        ? null
                        : variante.idVariante,
                    )
                  }
                  title="Editar"
                >
                  <HiPencil className="w-3 h-3" />
                </Button>

                {isAdmin && (
                  <Button
                    size="icon"
                    variant="danger"
                    aria-label={`Eliminar variante ${variante.sku}`}
                    className="min-h-11 min-w-11 sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0"
                    onClick={() => {
                      if (confirm(`¿Eliminar variante ${variante.sku}?`))
                        eliminar(variante.idVariante)
                    }}
                    title="Eliminar"
                  >
                    <HiTrash className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Gestión de imágenes inline */}
            <VarianteImagenes
              idVariante={variante.idVariante}
              idProducto={idProducto}
              imagenes={variante.imagenes || []}
            />

            {formAbierto === variante.idVariante && (
              <div className="mt-3">
                <VarianteForm
                  idProducto={idProducto}
                  inicial={variante}
                  guardando={actualizando}
                  onCancelar={() => setFormAbierto(null)}
                  onGuardar={(data) => {
                    actualizar(
                      { id: variante.idVariante, body: data },
                      { onSuccess: () => setFormAbierto(null) },
                    )
                  }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {variantes?.length === 0 && (
        <p className="py-4 text-sm text-center text-gray-500">
          Sin variantes todavía
        </p>
      )}
    </div>
  )
}
