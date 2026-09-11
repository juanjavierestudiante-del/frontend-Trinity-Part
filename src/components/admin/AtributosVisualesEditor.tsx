import { useEffect, useState } from 'react'
import type { Variante } from '../../types/catalogo.types'
import { useActualizarAtributo, useActualizarValorAtributo, useAtributos } from '../../hooks/admin/useAtributos'
import type { Atributo, ValorAtributo } from '../../services/admin/atributo.api'
import Alert from '../ui/Alert/Alert'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'
import Input from '../ui/Input/Input'
import Select from '../ui/Select/Select'

interface Props {
  variantes: Variante[]
}

const TIPOS = {
  text: 'Texto',
  color: 'Color',
  image: 'Imagen',
} as const

const HEX = /^#(?:[\da-fA-F]{3}|[\da-fA-F]{6})$/

const expandirHex = (valor: string) => valor.length === 4 ? `#${valor.slice(1).split('').map((digito) => digito + digito).join('')}` : valor

const mensajeError = (error: unknown) => {
  const respuesta = error as { response?: { data?: { error?: string } }; message?: string }
  return respuesta.response?.data?.error ?? respuesta.message ?? 'No se pudo guardar el cambio.'
}

function ValorColorEditor({ atributo, valor }: { atributo: Atributo; valor: ValorAtributo }) {
  const [hex, setHex] = useState(valor.visualValue ?? '')
  const [error, setError] = useState('')
  const { mutate: actualizarValor, isPending } = useActualizarValorAtributo()
  const hexValido = HEX.test(hex)
  const colorInput = hexValido ? expandirHex(hex) : '#000000'

  useEffect(() => setHex(valor.visualValue ?? ''), [valor.visualValue])

  const guardar = (visualValue: string | null) => {
    setError('')
    actualizarValor(
      { idAtributo: atributo.idAtributo, idValor: valor.idValor, body: { visualValue } },
      { onError: (err) => setError(mensajeError(err)) }
    )
  }

  return (
    <div className="rounded-md border border-gray-700 bg-gray-900/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="h-3 w-3 shrink-0 rounded-full border border-gray-500" style={{ backgroundColor: hexValido ? colorInput : 'transparent' }} aria-hidden="true" />
        <span className="min-w-24 flex-1 text-sm font-medium text-gray-200">{valor.valor}</span>
        <Badge variant={valor.visualValue ? 'success' : 'gray'} size="sm">{valor.visualValue ?? 'Sin color configurado'}</Badge>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:items-end">
        <div>
          <label htmlFor={`color-${valor.idValor}`} className="block text-xs font-medium text-gray-300">Color visual</label>
          <input id={`color-${valor.idValor}`} type="color" value={colorInput} onChange={(event) => setHex(event.target.value.toUpperCase())} className="mt-1 h-10 w-12 cursor-pointer rounded border border-gray-600 bg-gray-800 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Selector de color para ${valor.valor}`} />
        </div>
        <Input id={`hex-${valor.idValor}`} label="Hexadecimal" value={hex} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHex(event.target.value.toUpperCase())} placeholder="#00A651" dark error={hex && !hexValido ? 'Usa #RGB o #RRGGBB.' : undefined} />
        <Button size="sm" onClick={() => guardar(expandirHex(hex))} disabled={!hexValido || isPending} loading={isPending}>Guardar</Button>
        <Button size="sm" variant="gray" onClick={() => guardar(null)} disabled={!valor.visualValue || isPending}>Quitar</Button>
      </div>
      {error && <Alert type="danger" className="mt-3" role="alert">{error}</Alert>}
    </div>
  )
}

function AtributoVisual({ atributo }: { atributo: Atributo }) {
  const [error, setError] = useState('')
  const { mutate: actualizarAtributo, isPending } = useActualizarAtributo()

  return (
    <section className="border-t border-gray-700 py-5 first:border-t-0 first:pt-0" aria-labelledby={`atributo-${atributo.idAtributo}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h3 id={`atributo-${atributo.idAtributo}`} className="font-medium text-gray-100">{atributo.nombre}</h3><p className="text-xs text-gray-400">Tipo de visualización para todos sus valores.</p></div>
        <Select id={`tipo-${atributo.idAtributo}`} label={`Tipo de visualización de ${atributo.nombre}`} className="sm:w-48" value={atributo.tipoVisualizacion} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => { setError(''); actualizarAtributo({ idAtributo: atributo.idAtributo, tipoVisualizacion: event.target.value as Atributo['tipoVisualizacion'] }, { onError: (err) => setError(mensajeError(err)) }) }} disabled={isPending} dark>
          {Object.entries(TIPOS).map(([valor, etiqueta]) => <option key={valor} value={valor}>{etiqueta}</option>)}
        </Select>
      </div>
      {atributo.tipoVisualizacion === 'color' && <div className="mt-4 space-y-2"><p className="text-sm font-medium text-gray-300">Valores</p>{atributo.valores.length ? atributo.valores.map((valor) => <ValorColorEditor key={valor.idValor} atributo={atributo} valor={valor} />) : <p className="text-sm text-gray-400">Este atributo todavía no tiene valores.</p>}</div>}
      {atributo.tipoVisualizacion === 'text' && <div className="mt-4"><p className="text-sm font-medium text-gray-300">Valores</p>{atributo.valores.length ? <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Valores de ${atributo.nombre}`}>{atributo.valores.map((valor) => <li key={valor.idValor} className="rounded border border-gray-700 bg-gray-900/40 px-3 py-1.5 text-sm text-gray-200">{valor.valor}</li>)}</ul> : <p className="mt-2 text-sm text-gray-400">Este atributo todavía no tiene valores.</p>}</div>}
      {atributo.tipoVisualizacion === 'image' && <p className="mt-3 text-sm text-gray-400">Las miniaturas se obtendrán de las imágenes de las variantes.</p>}
      {error && <Alert type="danger" className="mt-3" role="alert">{error}</Alert>}
    </section>
  )
}

export default function AtributosVisualesEditor({ variantes }: Props) {
  const { data: atributos, isLoading } = useAtributos()
  const valoresUsadosPorAtributo = new Map<number, Set<number>>()
  variantes.forEach((variante) => variante.varianteAtributo.forEach(({ valorAtributo }) => {
    const valores = valoresUsadosPorAtributo.get(valorAtributo.atributo.idAtributo) ?? new Set<number>()
    valores.add(valorAtributo.idValor)
    valoresUsadosPorAtributo.set(valorAtributo.atributo.idAtributo, valores)
  }))
  const atributosUsados = atributos?.filter((atributo) => valoresUsadosPorAtributo.has(atributo.idAtributo)).map((atributo) => ({
    ...atributo,
    valores: atributo.valores.filter((valor) => valoresUsadosPorAtributo.get(atributo.idAtributo)?.has(valor.idValor)),
  })) ?? []

  if (isLoading || atributosUsados.length === 0) return null

  return <Card variant="admin" padding="md"><div className="mb-5"><h2 className="text-base font-semibold text-gray-100">Representación visual</h2><p className="mt-1 text-sm text-gray-400">Configura el tipo de selector y los valores usados por este producto.</p></div>{atributosUsados.map((atributo) => <AtributoVisual key={atributo.idAtributo} atributo={atributo} />)}</Card>
}
