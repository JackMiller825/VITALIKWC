export interface MarketQuote {
  priceUsd: string
  updatedAt: string
  pairLabel: string
}

export function parseMarketQuote(data: unknown): MarketQuote | null {
  if (!data || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  if (typeof row.priceUsd !== 'string' || !/^\d+(\.\d+)?$/.test(row.priceUsd)) return null
  if (typeof row.updatedAt !== 'string' || Number.isNaN(Date.parse(row.updatedAt))) return null
  if (typeof row.pairLabel !== 'string' || row.pairLabel.trim() === '') return null
  return {
    priceUsd: row.priceUsd,
    updatedAt: row.updatedAt,
    pairLabel: row.pairLabel.trim(),
  }
}
