import { useEffect, useState } from 'react'
import { linkHost, marketDataEnabled } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { parseMarketQuote, type MarketQuote } from '../lib/market.ts'

interface CacheEntry {
  url: string
  fetchedAt: number
  quote: MarketQuote
}

let cache: CacheEntry | null = null
const CACHE_MS = 60_000

export function MarketData() {
  const enabled = marketDataEnabled(site)
  const sourceUrl = site.marketData.sourceUrl

  if (!enabled || !sourceUrl) {
    return (
      <div className="market-note">
        <h3>Market data</h3>
        <p>
          Market data is off. It appears only after a real trading pair and a supported data source are configured.
          This page does not show sample prices.
        </p>
      </div>
    )
  }

  return <MarketPanel sourceUrl={sourceUrl} />
}

function readFresh(sourceUrl: string): CacheEntry | null {
  if (!cache || cache.url !== sourceUrl) return null
  if (Date.now() - cache.fetchedAt >= CACHE_MS) return null
  return cache
}

function MarketPanel({ sourceUrl }: { sourceUrl: string }) {
  const fresh = readFresh(sourceUrl)
  const [quote, setQuote] = useState<MarketQuote | null>(fresh?.quote ?? null)
  const [fetchedAt, setFetchedAt] = useState<number | null>(fresh?.fetchedAt ?? null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(fresh === null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (fresh && attempt === 0) return
    let cancelled = false

    void fetch(sourceUrl, { headers: { accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error('The data source did not respond with a quote.')
        return response.json() as Promise<unknown>
      })
      .then((payload) => {
        if (cancelled) return
        const parsed = parseMarketQuote(payload)
        if (!parsed) throw new Error('The data source did not match the expected quote format.')
        const entry = { url: sourceUrl, fetchedAt: Date.now(), quote: parsed }
        cache = entry
        setQuote(parsed)
        setFetchedAt(entry.fetchedAt)
        setError(null)
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        const message = reason instanceof Error ? reason.message : 'Market data is unavailable.'
        setQuote(null)
        setError(message)
        setFetchedAt(Date.now())
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [sourceUrl, attempt, fresh])

  return (
    <div className="market-note">
      <h3>Market data</h3>
      <p>
        Source: {linkHost(sourceUrl)}. A price here is a quote from that source, not a completed trade and not a
        promise about value.
      </p>
      {loading ? <p role="status">Loading market data…</p> : null}
      {!loading && error ? (
        <div role="alert">
          <p>Market data is unavailable right now. {error}</p>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => {
              cache = null
              setQuote(null)
              setError(null)
              setLoading(true)
              setAttempt((value) => value + 1)
            }}
          >
            Try again
          </button>
        </div>
      ) : null}
      {!loading && quote && fetchedAt ? (
        <dl className="quote">
          <div>
            <dt>Pair</dt>
            <dd>{quote.pairLabel}</dd>
          </div>
          <div>
            <dt>Price, USD</dt>
            <dd>{quote.priceUsd}</dd>
          </div>
          <div>
            <dt>Quote time</dt>
            <dd>{quote.updatedAt}</dd>
          </div>
          <div>
            <dt>Fetched</dt>
            <dd>{new Date(fetchedAt).toISOString()}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  )
}
