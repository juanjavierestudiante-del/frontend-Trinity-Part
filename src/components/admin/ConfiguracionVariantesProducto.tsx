import { useEffect, useMemo, useState } from 'react'
import type { Producto } from '../../types/catalogo.types'
import { useActualizarProducto } from '../../hooks/admin/useProductosAdmin'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'
import Select from '../ui/Select/Select'
import Alert from '../ui/Alert/Alert'

interface Props {
  producto: Producto
}

interface AtributoUsado {
  idAtributo: number
  nombre: string
}

const normalizar = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ')

const mensajeError = (error: unknown) => {
  const respuesta = error as { response?: { data?: { error?: string } }; message?: string }
  return respuesta.response?.data?.error ?? respuesta.message ?? 'No se pudo guardar la configuración.'
}

export default function ConfiguracionVariantesProducto({ producto }: Props) {
  const atributosUsados = useMemo<AtributoUsado[]>(() => {
    const atributos = new Map<number, AtributoUsado>()
    producto.variantes.forEach((variante) => {
      variante.varianteAtributo.forEach(({ valorAtributo }) => {
        atributos.set(valorAtributo.atributo.idAtributo, {
          idAtributo: valorAtributo.atributo.idAtributo,
          nombre: valorAtributo.atributo.nombre,
        })
      })
    })
    return [...atributos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [producto.variantes])

  const sugerido = useMemo(
    () => atributosUsados.find((atributo) => normalizar(atributo.nombre) === 'color') ?? (atributosUsados.length === 1 ? atributosUsados[0] : null),
    [atributosUsados]
  )
  const valorInicial = producto.idAtributoPrincipal ?? sugerido?.idAtributo ?? ''
  const [seleccion, setSeleccion] = useState<number | ''>(valorInicial)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const { mutate: actualizar, isPending } = useActualizarProducto()

  useEffect(() => {
    setSeleccion(producto.idAtributoPrincipal ?? sugerido?.idAtributo ?? '')
    setError('')
    setExito('')
  }, [producto.idAtributoPrincipal, sugerido?.idAtributo])

  const sinVariantes = atributosUsados.length === 0
  const esSugerencia = producto.idAtributoPrincipal == null && sugerido?.idAtributo === seleccion

  const guardar = () => {
    setError('')
    setExito('')
    actualizar(
      { id: producto.idProducto, body: { idAtributoPrincipal: seleccion === '' ? null : seleccion } },
      {
        onSuccess: () => setExito('Configuración de variantes guardada.'),
        onError: (err) => setError(mensajeError(err)),
      }
    )
  }

  return (
    <Card variant="admin" padding="md" className="max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-gray-100">Atributo principal</h2>
          <p id="atributo-principal-ayuda" className="mt-1 text-sm text-gray-400">Se destacará primero en la tienda.</p>
        </div>
        <div className="w-full sm:max-w-xs">
          <Select
            id="atributo-principal"
            label="Atributo principal"
            value={seleccion}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSeleccion(event.target.value ? Number(event.target.value) : '')}
            disabled={sinVariantes || isPending}
            aria-describedby="atributo-principal-ayuda"
            dark
          >
            <option value="">{sinVariantes ? 'Sin atributos disponibles' : 'Sin atributo principal'}</option>
            {atributosUsados.map((atributo) => <option key={atributo.idAtributo} value={atributo.idAtributo}>{atributo.nombre}</option>)}
          </Select>
        </div>
      </div>
      {sinVariantes ? (
        <p className="mt-3 text-sm text-gray-400">Crea al menos una variante con atributos para seleccionar el atributo principal.</p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400">{esSugerencia ? `Sugerido porque este producto utiliza ${sugerido?.nombre}.` : 'La selección se guarda solo al confirmar.'}</p>
          <Button size="sm" onClick={guardar} loading={isPending}>Guardar configuración</Button>
        </div>
      )}
      {error && <Alert type="danger" className="mt-3" role="alert">{error}</Alert>}
      {exito && <p className="mt-3 text-sm text-emerald-300" role="status" aria-live="polite">{exito}</p>}
    </Card>
  )
}
