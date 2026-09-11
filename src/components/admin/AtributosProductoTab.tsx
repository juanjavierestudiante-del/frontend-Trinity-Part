import type { Producto } from '../../types/catalogo.types'
import AtributosVisualesEditor from './AtributosVisualesEditor'
import ConfiguracionVariantesProducto from './ConfiguracionVariantesProducto'

interface Props {
  producto: Producto
}

export default function AtributosProductoTab({ producto }: Props) {
  return (
    <section className="mx-auto max-w-4xl space-y-6 py-1" aria-labelledby="atributos-producto-titulo">
      <div>
        <h2 id="atributos-producto-titulo" className="text-lg font-semibold text-gray-100">Atributos del producto</h2>
        <p className="mt-1 text-sm text-gray-400">Define qué atributo destaca la compra y cómo se representan sus valores en la tienda.</p>
      </div>
      <ConfiguracionVariantesProducto producto={producto} />
      <AtributosVisualesEditor variantes={producto.variantes} />
    </section>
  )
}
