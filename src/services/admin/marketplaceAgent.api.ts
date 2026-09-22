import type { Producto } from '../../types/catalogo.types'

const agentUrl = (import.meta.env.VITE_MARKETPLACE_AGENT_URL ?? 'http://127.0.0.1:3031').replace(/\/$/, '')

export interface MarketplacePreview {
  productId: number
  title: string
  price: number
  description: string
  condition: string
  category: string
  images: string[]
  sku: string
  tags: string[]
  colors: string[]
  sizes: string[]
  materials: string[]
  company: string
  hashtags: string[]
}

export interface MarketplaceAgentStatus {
  status: 'idle' | 'preparing' | 'ready' | 'error'
  productId?: number
  productName?: string
  message?: string
}

interface MarketplaceAgentErrorBody {
  error?: string
}

export class MarketplaceAgentError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${agentUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  const body = await response.json().catch(() => ({})) as T & MarketplaceAgentErrorBody
  if (!response.ok) throw new MarketplaceAgentError(body.error ?? 'El agente Marketplace no respondió correctamente.')
  return body
}

export const getMarketplaceHealth = () => request<{ status: string; service: string }>('/health')

export const getMarketplaceStatus = () => request<MarketplaceAgentStatus>('/marketplace/status')

export const getMarketplaceCategories = () => request<{ categories: string[] }>('/marketplace/categories')

export const getMarketplacePreview = async (product: Producto, marketplaceCategory: string) => {
  const response = await request<{ product: MarketplacePreview }>('/marketplace/preview', {
    method: 'POST',
    body: JSON.stringify({ product, marketplaceCategory }),
  })
  return response.product
}

export const prepareMarketplace = (product: Producto, marketplaceCategory: string) => request<MarketplaceAgentStatus>('/marketplace/prepare', {
  method: 'POST',
  body: JSON.stringify({ product, marketplaceCategory }),
})
