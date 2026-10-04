import { site } from '../config/site.ts'

export type AnalyticsEvent =
  | 'community_link_click'
  | 'contract_copy_success'
  | 'buy_link_click'
  | 'meme_export'
  | 'source_essay_click'

/**
 * Analytics are off unless site.analyticsEnabled is true.
 * Events never include captions, wallet addresses, or a claim that a buy completed.
 */
export function track(event: AnalyticsEvent): void {
  if (!site.analyticsEnabled) return
  window.dispatchEvent(new CustomEvent('vwc-analytics', { detail: { event } }))
}
