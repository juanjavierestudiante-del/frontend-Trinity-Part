import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'
import { cloudinaryUrl } from '../../utils/cloudinary'

/**
 * @param {{ imagenes: Array<{ idImagen: number; url: string; principal: boolean }>; nombre: string }} props
 */
export default function ProductoGaleria({ imagenes = [], nombre }) {
  const [imagenActiva, setImagenActiva] = useState(0)
  const imagenesValidas = imagenes.filter((imagen) => imagen?.url)
  const imageKey = imagenesValidas.map((imagen) => imagen.idImagen).join('-')

  useEffect(() => { setImagenActiva(0) }, [imageKey])

  if (imagenesValidas.length === 0) return <Card variant="subtle" padding="none" className="flex aspect-square items-center justify-center"><div className="text-center text-muted"><ImageIcon className="mx-auto mb-3 h-10 w-10" aria-hidden="true" /><p className="text-sm font-medium">Imagen no disponible</p></div></Card>

  const imagen = imagenesValidas[imagenActiva]
  const irAImagen = (indice) => setImagenActiva((indice + imagenesValidas.length) % imagenesValidas.length)
  return <section aria-label={`Galería de ${nombre}`} className="space-y-3"><Card variant="elevated" padding="none" className="relative overflow-hidden"><div className="flex h-[260px] items-center sm:h-[360px] justify-center bg-white/20 lg:h-[500px]"><img key={imagen.idImagen} src={cloudinaryUrl(imagen.url, 'w_800,q_auto,f_auto')} alt={`${nombre}${imagenesValidas.length > 1 ? ` — imagen ${imagenActiva + 1}` : ''}`} className="h-full w-full object-contain animate-fade-in-up" decoding="async" /></div>{imagenesValidas.length > 1 && <><Button variant="glass" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 text-primary-dark shadow-brand" onClick={() => irAImagen(imagenActiva - 1)} aria-label="Ver imagen anterior"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></Button><Button variant="glass" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 text-primary-dark shadow-brand" onClick={() => irAImagen(imagenActiva + 1)} aria-label="Ver imagen siguiente"><ChevronRight className="h-5 w-5" aria-hidden="true" /></Button></>}</Card>{imagenesValidas.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Miniaturas de producto">{imagenesValidas.map((miniatura, indice) => <button key={miniatura.idImagen} type="button" onClick={() => setImagenActiva(indice)} aria-label={`Ver imagen ${indice + 1}`} aria-current={indice === imagenActiva ? 'true' : undefined} className={`h-14 w-14 shrink-0 sm:h-16 sm:w-16 overflow-hidden rounded-md border-2 bg-white/30 p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${indice === imagenActiva ? 'border-primary shadow-brand' : 'border-white/50 hover:border-primary/50'}`}><img src={cloudinaryUrl(miniatura.url, 'w_160,q_auto,f_auto')} alt="" className="h-full w-full object-cover" loading="lazy" /></button>)}</div>}</section>
}
