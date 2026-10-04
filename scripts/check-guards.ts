import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { storyParagraphs } from '../src/content/story.ts'
import {
  addressPresentation,
  allocationReady,
  canOfferBuyLink,
  isEthAddress,
  isHttpsUrl,
  marketDataEnabled,
} from '../src/config/guards.ts'
import { site } from '../src/config/site.ts'
import { parseMarketQuote } from '../src/lib/market.ts'

const words = storyParagraphs.join(' ').split(/\s+/).filter(Boolean)
assert.ok(words.length >= 100 && words.length <= 140, `story is ${words.length} words`)

assert.equal(site.launchStatus, 'prelaunch')
assert.equal(site.contractAddress, null)
assert.equal(site.contractConfirmed, false)
assert.equal(site.analyticsEnabled, false)
assert.equal(site.allocations, null)
assert.equal(site.supply.value, '1,000,000,000')
assert.equal(site.buyTax.value, '0%')
assert.equal(site.sellTax.value, '0%')
assert.equal(canOfferBuyLink(site), false)
assert.equal(addressPresentation(site).kind, 'not_announced')
assert.equal(marketDataEnabled(site), false)
assert.equal(isHttpsUrl(site.sourceArticle.url), true)
assert.equal(site.telegramUrl, 'https://t.me/vitalikwc')
assert.equal(site.xUrl, 'https://x.com/')
assert.equal(isHttpsUrl(site.telegramUrl), true)
assert.equal(isHttpsUrl(site.xUrl), true)
assert.equal(site.chainId, 1)

for (const asset of site.assetManifest) {
  assert.ok(existsSync(`public${asset.file}`), asset.file)
  assert.ok(existsSync(`public${asset.preview}`), asset.preview)
}

const valid = `0x${'ab'.repeat(20)}`
assert.equal(isEthAddress(valid), true)
assert.equal(isEthAddress('0x1234'), false)
assert.equal(isEthAddress(null), false)
assert.equal(isHttpsUrl('https://example.com/swap'), true)
assert.equal(isHttpsUrl('http://example.com/swap'), false)
assert.equal(isHttpsUrl('https://user:pass@example.com'), false)
assert.equal(isHttpsUrl('javascript:alert(1)'), false)

const live = {
  launchStatus: 'live' as const,
  contractConfirmed: true,
  contractAddress: valid,
  swapUrl: 'https://swap.example/token',
}
assert.equal(canOfferBuyLink(live), true)
assert.equal(canOfferBuyLink({ ...live, contractConfirmed: false }), false)
assert.equal(canOfferBuyLink({ ...live, launchStatus: 'prelaunch' }), false)
assert.equal(canOfferBuyLink({ ...live, swapUrl: 'http://swap.example/token' }), false)
assert.equal(canOfferBuyLink({ ...live, contractAddress: '0xnope' }), false)
assert.deepEqual(addressPresentation({ contractConfirmed: false, contractAddress: valid }), {
  kind: 'not_announced',
})
assert.equal(addressPresentation({ contractConfirmed: true, contractAddress: valid }).kind, 'published')
assert.equal(addressPresentation({ contractConfirmed: true, contractAddress: '0x12' }).kind, 'invalid')

assert.equal(
  allocationReady([
    { label: 'Liquidity', percent: 90, evidenceUrl: null },
    { label: 'Community', percent: 10, evidenceUrl: null },
  ]),
  true,
)
assert.equal(allocationReady([{ label: 'Liquidity', percent: 90, evidenceUrl: null }]), false)
assert.equal(allocationReady(null), false)

assert.equal(
  marketDataEnabled({
    marketData: { enabled: true, pairAddress: valid, sourceUrl: 'https://data.example/quote' },
  }),
  true,
)
assert.equal(
  marketDataEnabled({
    marketData: { enabled: false, pairAddress: valid, sourceUrl: 'https://data.example/quote' },
  }),
  false,
)

assert.deepEqual(parseMarketQuote({ priceUsd: '0.01', updatedAt: '2026-10-04T00:00:00Z', pairLabel: 'VITALIKWC / WETH' })?.priceUsd, '0.01')
assert.equal(parseMarketQuote({ priceUsd: 'free', updatedAt: '2026-10-04T00:00:00Z', pairLabel: 'X' }), null)
assert.equal(parseMarketQuote(null), null)

console.log('config checks passed')
