import type { AllocationSlice, SiteConfig } from './site.ts'

const ADDRESS = /^0x[a-fA-F0-9]{40}$/

export function isEthAddress(value: string | null | undefined): value is string {
  return typeof value === 'string' && ADDRESS.test(value)
}

export function isHttpsUrl(value: string | null | undefined): value is string {
  if (!value || value.trim() !== value) return false
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    if (url.username || url.password) return false
    if (!url.hostname || !url.hostname.includes('.')) return false
    return true
  } catch {
    return false
  }
}

export function canOfferBuyLink(
  config: Pick<SiteConfig, 'launchStatus' | 'contractConfirmed' | 'contractAddress' | 'swapUrl'>,
): boolean {
  return (
    config.launchStatus === 'live' &&
    config.contractConfirmed === true &&
    isEthAddress(config.contractAddress) &&
    isHttpsUrl(config.swapUrl)
  )
}

export type AddressPresentation =
  | { kind: 'not_announced' }
  | { kind: 'invalid' }
  | { kind: 'published'; address: string }

/**
 * A configured address is published only after the owner sets contractConfirmed.
 * An unconfirmed value stays off the page so a draft cannot be mistaken for the token.
 */
export function addressPresentation(
  config: Pick<SiteConfig, 'contractAddress' | 'contractConfirmed'>,
): AddressPresentation {
  if (!config.contractConfirmed) return { kind: 'not_announced' }
  if (!isEthAddress(config.contractAddress)) return { kind: 'invalid' }
  return { kind: 'published', address: config.contractAddress }
}

export function allocationReady(rows: AllocationSlice[] | null): rows is AllocationSlice[] {
  if (!rows || rows.length === 0) return false
  const labels = new Set<string>()
  for (const row of rows) {
    if (row.label.trim() === '') return false
    if (!Number.isFinite(row.percent) || row.percent < 0 || row.percent > 100) return false
    const key = row.label.trim().toLowerCase()
    if (labels.has(key)) return false
    labels.add(key)
  }
  const sum = rows.reduce((total, row) => total + row.percent, 0)
  return Math.abs(sum - 100) <= 0.001
}

export function marketDataEnabled(
  config: Pick<SiteConfig, 'marketData'>,
): boolean {
  return (
    config.marketData.enabled === true &&
    isEthAddress(config.marketData.pairAddress) &&
    isHttpsUrl(config.marketData.sourceUrl)
  )
}

export function statusLabel(status: SiteConfig['chain']['status']): string {
  if (status === 'documented') return 'Documented'
  if (status === 'unverified') return 'Unverified'
  return 'Not announced'
}

export function linkHost(value: string): string {
  try {
    return new URL(value).host
  } catch {
    return value
  }
}
