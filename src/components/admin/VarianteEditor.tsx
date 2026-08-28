import { useState } from "react"
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi"
import {
  useVariantesPorProducto,
  useCrearVariante,
  useActualizarVariante,
  useEliminarVariante,
} from "../../hooks/admin/useVariantes"
import { useAuthStore } from "../../store/auth.store"
import VarianteForm from "./VarianteForm"
import VarianteImagenes from "./VarianteImagenes"
import AtributoSelector from "./AtributoSelector"
import Button from "../ui/Button/Button"
import Badge from "../ui/Badge/Badge"
import Loader from "../ui/Loader/Loader"

interface Props {
  idProducto: number
}

export default function VarianteEditor({ idProducto }: Props) {
  const usuario = useAuthStore((state) => state.usuario)
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
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-300">
          Variantes ({variantes?.length || 0})
        </p>
        {isAdmin && (
          <Button
            size="xs"
            onClick={() =>
              setFormAbierto(formAbierto === "nuevo" ? null : "nuevo")
            }
          >
            <HiPlus className="w-3 h-3 mr-1" />
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
        {variantes?.map((variante: any) => (
          <div
            key={variante.idVariante}
            className="p-3 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-mono text-sm font-medium text-gray-200">
                  {variante.sku}
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <AtributoSelector
                    idVariante={variante.idVariante}
                    idProducto={idProducto}
                    atributosAsignados={variante.varianteAtributo || []}
                  />
                  <Badge variant="success" size="sm">
                    Bs. {Number(variante.precioVenta).toFixed(2)}
                    {variante.precioOferta && (
                      <span className="ml-1 text-gray-400 line-through">
                        → Bs. {Number(variante.precioOferta).toFixed(2)}
                      </span>
                    )}
                  </Badge>
                  <Badge
                    variant={
                      variante.inventario?.stockActual >
                      variante.inventario?.stockMinimo
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
                  size="xs"
                  variant="light"
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
                    size="xs"
                    variant="danger"
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
          </div>
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
