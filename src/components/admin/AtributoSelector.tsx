import { useState } from 'react'
import { HiPlus, HiX } from 'react-icons/hi'
import {
  useAtributos,
  useCrearAtributo,
  useCrearValorAtributo,
  useAsignarAtributo,
  useQuitarAtributo,
} from '../../hooks/admin/useAtributos'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import Select from '../ui/Select/Select'
import Input from '../ui/Input/Input'
import Label from '../ui/Label/Label'

interface AtributoAsignado {
  idValor: number
  valorAtributo: {
    valor: string
    atributo: { nombre: string }
  }
}

interface Props {
  idVariante: number
  idProducto: number
  atributosAsignados: AtributoAsignado[]
}

export default function AtributoSelector({ idVariante, idProducto, atributosAsignados }: Props) {
  const { data: atributos } = useAtributos()
  const { mutate: asignar } = useAsignarAtributo(idProducto)
  const { mutate: quitar } = useQuitarAtributo(idProducto)
  const { mutate: crearAtributo, isPending: creandoAtributo } = useCrearAtributo()
  const { mutate: crearValor, isPending: creandoValor } = useCrearValorAtributo()

  const [idAtributoSeleccionado, setIdAtributoSeleccionado] = useState<number | ''>('')
  const [idValorSeleccionado, setIdValorSeleccionado] = useState<number | ''>('')
  const [nuevoValor, setNuevoValor] = useState('')
  const [mostrarNuevoValor, setMostrarNuevoValor] = useState(false)
  const [nuevoAtributo, setNuevoAtributo] = useState('')
  const [mostrarNuevoAtributo, setMostrarNuevoAtributo] = useState(false)

  const idsAsignados = atributosAsignados.map((a) => a.idValor)
  const atributoActual = atributos?.find(
    (a) => a.idAtributo === Number(idAtributoSeleccionado)
  )
  const valoresDisponibles = atributoActual?.valores.filter(
    (v) => !idsAsignados.includes(v.idValor)
  )

  const handleAsignar = () => {
    if (!idValorSeleccionado) return
    asignar({ idVariante, idValor: Number(idValorSeleccionado) })
    setIdValorSeleccionado('')
    setIdAtributoSeleccionado('')
  }

  const handleCrearValor = () => {
    if (!nuevoValor.trim() || !idAtributoSeleccionado) return
    crearValor(
      { idAtributo: Number(idAtributoSeleccionado), valor: nuevoValor.trim() },
      {
        onSuccess: (valorCreado) => {
          asignar({ idVariante, idValor: valorCreado.idValor })
          setNuevoValor('')
          setMostrarNuevoValor(false)
        },
      }
    )
  }

  const handleCrearAtributo = () => {
    if (!nuevoAtributo.trim()) return
    crearAtributo(nuevoAtributo.trim(), {
      onSuccess: () => {
        setNuevoAtributo('')
        setMostrarNuevoAtributo(false)
      },
    })
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1 mb-3">
        {atributosAsignados.length === 0 && (
          <p className="text-xs text-gray-500">Sin atributos asignados</p>
        )}
        {atributosAsignados.map((a) => (
          <Badge key={a.idValor} variant="indigo" className="flex items-center gap-1 pr-1">
            <span>{a.valorAtributo.atributo.nombre}: {a.valorAtributo.valor}</span>
            <button
              onClick={() => quitar({ idVariante, idValor: a.idValor })}
              className="ml-1 hover:text-red-400"
            >
              <HiX className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-32">
          <Label className="block mb-1 text-xs" dark>Atributo</Label>
          <Select
            sizing="sm"
            value={idAtributoSeleccionado}
            onChange={(e : React.ChangeEvent<HTMLSelectElement>) => {
              setIdAtributoSeleccionado(Number(e.target.value) || '')
              setIdValorSeleccionado('')
              setMostrarNuevoValor(false)
            }}
            dark
          >
            <option value="">Seleccionar...</option>
            {atributos?.map((a) => (
              <option key={a.idAtributo} value={a.idAtributo}>{a.nombre}</option>
            ))}
          </Select>
        </div>

        {idAtributoSeleccionado && !mostrarNuevoValor && (
          <div className="flex-1 min-w-32">
            <Label className="block mb-1 text-xs" dark>Valor</Label>
            <Select
              sizing="sm"
              value={idValorSeleccionado}
              onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setIdValorSeleccionado(Number(e.target.value) || '')}
              dark
            >
              <option value="">Seleccionar...</option>
              {valoresDisponibles?.map((v) => (
                <option key={v.idValor} value={v.idValor}>{v.valor}</option>
              ))}
            </Select>
          </div>
        )}

        {idValorSeleccionado && (
          <Button size="xs" onClick={handleAsignar}>
            <HiPlus className="w-3 h-3 mr-1" />
            Asignar
          </Button>
        )}
      </div>

      {idAtributoSeleccionado && (
        <div className="flex flex-wrap gap-2 mt-2">
          {!mostrarNuevoValor ? (
            <button
              onClick={() => setMostrarNuevoValor(true)}
              className="flex items-center gap-1 text-xs text-primary-light hover:underline"
            >
              <HiPlus className="w-3 h-3" />
              Nuevo valor en "{atributoActual?.nombre}"
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                sizing="sm"
                placeholder={`Nuevo valor (ej: Turquesa)`}
                value={nuevoValor}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNuevoValor(e.target.value)}
                onKeyDown={(e : React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCrearValor()}
                dark
              />
              <Button size="xs" onClick={handleCrearValor} disabled={creandoValor}>
                {creandoValor ? '...' : 'Crear y asignar'}
              </Button>
              <button
                onClick={() => { setMostrarNuevoValor(false); setNuevoValor('') }}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="pt-3 mt-3 border-t border-gray-700">
        {!mostrarNuevoAtributo ? (
          <button
            onClick={() => setMostrarNuevoAtributo(true)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-light"
          >
            <HiPlus className="w-3 h-3" />
            Crear atributo nuevo (ej: "Acabado", "Fragancia")
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              sizing="sm"
              placeholder="Nombre del atributo (ej: Acabado)"
              value={nuevoAtributo}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNuevoAtributo(e.target.value)}
              onKeyDown={(e : React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCrearAtributo()}
              dark
            />
            <Button size="xs" onClick={handleCrearAtributo} disabled={creandoAtributo}>
              {creandoAtributo ? '...' : 'Crear atributo'}
            </Button>
            <button
              onClick={() => { setMostrarNuevoAtributo(false); setNuevoAtributo('') }}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
