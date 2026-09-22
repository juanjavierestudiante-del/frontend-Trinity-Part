import { useEffect, useRef, useState } from 'react'
import { HiCheckCircle, HiExclamationCircle, HiPhotograph } from 'react-icons/hi'
import type { Producto } from '../../types/catalogo.types'
import {
  getMarketplaceCategories,
  getMarketplaceHealth,
  getMarketplacePreview,
  getMarketplaceStatus,
  prepareMarketplace,
  type MarketplaceAgentStatus,
  type MarketplacePreview,
} from '../../services/admin/marketplaceAgent.api'
import Alert from '../ui/Alert/Alert'
import Button from '../ui/Button/Button'
import Card from '../ui/Card/Card'

interface Props {
  producto: Producto
}

const idleStatus: MarketplaceAgentStatus = { status: 'idle' }

export default function MarketplaceProductoTab({ producto }: Props) {
  const [connected, setConnected] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [marketplaceCategory, setMarketplaceCategory] = useState('')
  const [preview, setPreview] = useState<MarketplacePreview | null>(null)
  const [status, setStatus] = useState<MarketplaceAgentStatus>(idleStatus)
  const [error, setError] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingCategories(true)
      setMarketplaceCategory('')
      setPreview(null)
      setError('')
      try {
        await getMarketplaceHealth()
        const [categoryResponse, nextStatus] = await Promise.all([getMarketplaceCategories(), getMarketplaceStatus()])
        if (cancelled) return
        setConnected(true)
        setCategories(categoryResponse.categories)
        setStatus(nextStatus)
      } catch (requestError) {
        if (cancelled) return
        setConnected(false)
        setCategories([])
        setStatus(idleStatus)
        setError(messageFor(requestError))
      } finally {
        if (!cancelled) setLoadingCategories(false)
      }
    }
    void load()
    return () => {
      cancelled = true
      if (pollTimer.current) clearTimeout(pollTimer.current)
    }
  }, [producto.idProducto])

  useEffect(() => {
    let cancelled = false
    if (!connected || !marketplaceCategory) {
      setPreview(null)
      return () => { cancelled = true }
    }
    const loadPreview = async () => {
      setLoadingPreview(true)
      setError('')
      try {
        const nextPreview = await getMarketplacePreview(producto, marketplaceCategory)
        if (!cancelled) setPreview(nextPreview)
      } catch (requestError) {
        if (!cancelled) {
          setPreview(null)
          setError(messageFor(requestError))
        }
      } finally {
        if (!cancelled) setLoadingPreview(false)
      }
    }
    void loadPreview()
    return () => { cancelled = true }
  }, [connected, marketplaceCategory, producto])

  const pollStatus = async (): Promise<void> => {
    try {
      const nextStatus = await getMarketplaceStatus()
      setStatus(nextStatus)
      if (nextStatus.status === 'preparing') {
        pollTimer.current = setTimeout(() => void pollStatus(), 1_000)
        return
      }
      setPreparing(false)
      if (nextStatus.status === 'error') setError(nextStatus.message ?? 'No se pudo preparar Facebook.')
    } catch (requestError) {
      setPreparing(false)
      setConnected(false)
      setError(messageFor(requestError))
    }
  }

  const prepare = async () => {
    if (!marketplaceCategory) return
    setError('')
    setPreparing(true)
    try {
      const nextStatus = await prepareMarketplace(producto, marketplaceCategory)
      setStatus(nextStatus)
      pollTimer.current = setTimeout(() => void pollStatus(), 1_000)
    } catch (requestError) {
      setPreparing(false)
      setError(messageFor(requestError))
    }
  }

  const agentBusy = status.status === 'preparing' || status.status === 'ready'
  const hasAlternativePrices = producto.variantes.some((variante) => variante.estado === 'Activo' && variante.idListaPrecio !== null)

  return (
    <section className="mx-auto max-w-6xl space-y-6 py-1" aria-labelledby="marketplace-producto-titulo">
      <div className="flex flex-col gap-3 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">Canal local</p>
          <h2 id="marketplace-producto-titulo" className="mt-1 text-xl font-semibold text-gray-100">Marketplace</h2>
          <p className="mt-1 text-sm text-gray-400">Prepara este producto en Brave y detente antes de publicar.</p>
        </div>
        <AgentBadge connected={connected} />
      </div>

      {!connected && (
        <Alert type="warning" icon={<HiExclamationCircle />}>
          <p className="font-semibold">Agente Marketplace no disponible.</p>
          <p className="mt-1 font-mono text-xs">cd marketplace-automation && npm run server</p>
        </Alert>
      )}

      {error && <Alert type="danger" icon={<HiExclamationCircle />}>{error}</Alert>}

      {status.status === 'ready' && (
        <Alert type="success" icon={<HiCheckCircle />}>
          <p className="font-semibold">Facebook está listo.</p>
          <p className="mt-1">Revisa Brave y pulsa Publicar manualmente. Esta pantalla nunca pulsa Publicar.</p>
        </Alert>
      )}

      <Card variant="admin" padding="md" className="max-w-2xl">
        <label htmlFor="marketplace-category" className="text-sm font-semibold text-gray-100">Categoría Facebook</label>
        {loadingCategories ? (
          <p className="mt-2 text-sm text-gray-400">Cargando categorías...</p>
        ) : (
          <>
            <select
              id="marketplace-category"
              value={marketplaceCategory}
              onChange={(event) => setMarketplaceCategory(event.target.value)}
              disabled={!connected || agentBusy}
              className="mt-2 block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-gray-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {!marketplaceCategory && connected && <p className="mt-2 text-xs text-gray-400">Selecciona una categoría de Facebook.</p>}
          </>
        )}
      </Card>

      {loadingPreview && <Card variant="admin" padding="lg"><p className="text-sm text-gray-400">Actualizando vista previa...</p></Card>}

      {!loadingPreview && preview ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <Card variant="admin" padding="lg" className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Título Marketplace</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-white">{preview.title}</h3>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">Precio Marketplace</p>
              <p className="mt-1 text-xl font-bold text-primary-light">Bs. {preview.price.toFixed(2)}</p>
              {hasAlternativePrices && <p className="mt-2 text-xs text-amber-200">Algunas variantes tienen precios diferentes.</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <PreviewField label="Categoría Web6" value={producto.categoria.nombre} />
              <PreviewField label="Categoría Facebook" value={preview.category} />
              <PreviewField label="Condición" value={preview.condition} />
              <PreviewField label="SKU" value={preview.sku} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <PreviewList label="Colores" values={preview.colors} />
              <PreviewList label="Tamaños" values={preview.sizes} />
              <PreviewList label="Materiales" values={preview.materials} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Descripción final</p>
              <p className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-700 bg-gray-900/60 p-4 text-sm leading-6 text-gray-200">{preview.description}</p>
            </div>
          </Card>

          <div className="space-y-6">
            <Card variant="admin" padding="md">
              <div className="flex items-center gap-2 text-gray-100"><HiPhotograph className="h-5 w-5 text-primary-light" /><h3 className="font-semibold">Imágenes a enviar</h3></div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {preview.images.map((image, index) => (
                  <img key={image} src={image} alt={`${preview.title} ${index + 1}`} className="aspect-square w-full rounded-lg border border-gray-700 object-cover" />
                ))}
              </div>
              {!preview.images.length && <p className="mt-3 text-sm text-gray-400">Este producto no tiene imágenes para enviar.</p>}
            </Card>

            <Card variant="admin" padding="md">
              <h3 className="font-semibold text-gray-100">Etiquetas Facebook</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {preview.tags.map((tag) => <span key={tag} className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary-light">{tag}</span>)}
              </div>
            </Card>
          </div>
        </div>
      ) : !loadingPreview && connected && marketplaceCategory ? (
        <Card variant="admin" padding="lg"><p className="text-sm text-gray-400">No se pudo generar la vista previa con esa categoría.</p></Card>
      ) : null}

      <div className="max-w-md">
        <Button className="w-full" size="lg" onClick={prepare} loading={preparing} disabled={!connected || !marketplaceCategory || !preview || agentBusy}>
          {status.status === 'ready' ? 'Facebook listo para revisar' : 'Preparar en Facebook'}
        </Button>
        {!marketplaceCategory && connected && <p className="mt-2 text-center text-xs text-gray-400">Selecciona una categoría de Facebook para continuar.</p>}
        <p className="mt-3 text-center text-xs leading-5 text-gray-500">Se abrirá Brave, se completará el formulario y se llegará a “Publicar en más lugares”. Publicar seguirá siendo manual.</p>
      </div>
    </section>
  )
}

function AgentBadge({ connected }: { connected: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${connected ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-gray-600 bg-gray-800 text-gray-400'}`}>
      <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-500'}`} />
      {connected ? 'Agente Marketplace conectado' : 'Agente no conectado'}
    </span>
  )
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-gray-700 bg-gray-900/40 p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 break-words text-sm font-medium text-gray-100">{value}</p></div>
}

function PreviewList({ label, values }: { label: string; values: string[] }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p><ul className="mt-2 space-y-1 text-sm text-gray-200">{values.map((value) => <li key={value}>• {value}</li>)}</ul></div>
}

function messageFor(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo comunicar con el agente Marketplace local.'
}
