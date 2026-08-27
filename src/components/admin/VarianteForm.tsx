import { useState, useEffect } from 'react'
import { useMarcas, useUnidades } from '../../hooks/admin/useAuxiliares'
import type { VarianteBody } from '../../services/admin/variante.api'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'
import Select from '../ui/Select/Select'
import Label from '../ui/Label/Label'

interface Props {
  idProducto: number
  inicial?: Partial<VarianteBody> & { idVariante?: number }
  onGuardar: (data: VarianteBody) => void
  onCancelar: () => void
  guardando: boolean
}

const formVacio = (idProducto: number): VarianteBody => ({
  idProducto,
  sku: '',
  precioVenta: 0,
  cantidadContenido: 1,
  estado: 'Activo',
})

export default function VarianteForm({
  idProducto, inicial, onGuardar, onCancelar, guardando
}: Props) {
  const { data: marcas } = useMarcas()
  const { data: unidades } = useUnidades()

  const [form, setForm] = useState<VarianteBody>(
    inicial ? { ...formVacio(idProducto), ...inicial } : formVacio(idProducto)
  )

  useEffect(() => {
    if (inicial) setForm({ ...formVacio(idProducto), ...inicial })
  }, [inicial])

  const set = (campo: keyof VarianteBody, valor: any) =>
    setForm((prev) => ({ ...prev, [campo]: valor }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGuardar(form)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>SKU</Label>
        <Input
          sizing="sm"
          value={form.sku}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('sku', e.target.value )}
          placeholder="GLB-LAT-ROJ-50"
          required
          dark
        />
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Código de barras</Label>
        <Input
          sizing="sm"
          value={form.codigoBarras || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('codigoBarras', e.target.value)}
          placeholder="Opcional"
          dark
        />
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Precio de venta</Label>
        <Input
          sizing="sm"
          type="number"
          step="0.01"
          value={form.precioVenta}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('precioVenta', Number(e.target.value))}
          required
          dark
        />
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Precio oferta</Label>
        <Input
          sizing="sm"
          type="number"
          step="0.01"
          value={form.precioOferta || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('precioOferta', e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Opcional"
          dark
        />
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Marca</Label>
        <Select
          sizing="sm"
          value={form.idMarca || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('idMarca', e.target.value ? Number(e.target.value) : undefined)}
          dark
        >
          <option value="">Sin marca</option>
          {marcas?.map((m) => (
            <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Unidad</Label>
        <Select
          sizing="sm"
          value={form.idUnidad || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('idUnidad', e.target.value ? Number(e.target.value) : undefined)}
          dark
        >
          <option value="">Sin unidad</option>
          {unidades?.map((u) => (
            <option key={u.idUnidad} value={u.idUnidad}>
              {u.nombre} ({u.abreviatura})
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Cantidad contenido</Label>
        <Input
          sizing="sm"
          type="number"
          value={form.cantidadContenido}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('cantidadContenido', Number(e.target.value))}
          placeholder="ej: 50"
          dark
        />
      </div>

      <div>
        <Label className="block mb-1 text-base !text-primary-light" dark>Estado</Label>
        <Select
          sizing="sm"
          value={form.estado}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('estado', e.target.value as 'Activo' | 'Inactivo')}
          dark
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </Select>
      </div>

      <div className="flex justify-end col-span-2 gap-2">
        <Button size="sm" variant="light" type="button" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button size="sm" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar variante'}
        </Button>
      </div>
    </form>
  )
}
