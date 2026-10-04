import { useState } from 'react'
import { addressPresentation, canOfferBuyLink, isHttpsUrl, linkHost } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { copyText } from '../lib/copyText.ts'
import { ExternalLink } from './ExternalLink.tsx'

export function ContractStatus() {
  const presentation = addressPresentation(site)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const explorer = isHttpsUrl(site.explorerUrl) ? site.explorerUrl : null
  const buyReady = canOfferBuyLink(site)

  async function onCopy(address: string) {
    const ok = await copyText(address)
    if (ok) {
      setCopyState('copied')
      track('contract_copy_success')
    } else {
      setCopyState('failed')
    }
  }

  return (
    <div className="status-strip">
      <p className="status-kicker">
        <span className="pixel" aria-hidden="true">
          {buyReady ? 'LIVE' : 'PRE-LAUNCH'}
        </span>
        <span>{buyReady ? 'Launch settings are in place.' : 'Pre-launch. Trading is not open on this site.'}</span>
      </p>
      <p>
        Network: <strong>{site.chainName}</strong>
        <span className="mono-note"> chain ID {site.chainId}</span>
      </p>
      {presentation.kind === 'published' ? (
        <div className="address-block">
          <p className="address-label">Contract address</p>
          <code className="address">{presentation.address}</code>
          <div className="address-actions">
            <button type="button" className="btn btn-small" onClick={() => void onCopy(presentation.address)}>
              Copy address
            </button>
            {explorer ? (
              <ExternalLink href={explorer}>View on {linkHost(explorer)}</ExternalLink>
            ) : (
              <span className="muted">Explorer link not announced.</span>
            )}
          </div>
          <p className="fine" role="status">
            {copyState === 'copied'
              ? 'Copied the full address.'
              : copyState === 'failed'
                ? 'Could not copy automatically. Select the full address above and copy it manually.'
                : 'The full address is shown above. Copy uses that entire value.'}
          </p>
        </div>
      ) : null}
      {presentation.kind === 'not_announced' ? <p className="address-missing">Contract address not announced.</p> : null}
      {presentation.kind === 'invalid' ? (
        <p className="address-missing" role="status">
          A contract was marked confirmed, but the configured address is not a valid Ethereum address. It is withheld
          until that is fixed. Contract address not announced.
        </p>
      ) : null}
    </div>
  )
}
