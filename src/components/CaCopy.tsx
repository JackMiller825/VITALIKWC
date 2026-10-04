import { useState } from 'react'
import { addressPresentation } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { copyText } from '../lib/copyText.ts'

interface CaCopyProps {
  /** Hero reads “CA: …”. The token file already labels the row Contract. */
  withPrefix?: boolean
}

export function CaCopy({ withPrefix = false }: CaCopyProps) {
  const presentation = addressPresentation(site)
  // const value = presentation.kind === 'published' ? presentation.address : 'Coming Soon...'
  const value = 'Coming Soon'
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function onCopy() {
    const ok = await copyText(value)
    setCopyState(ok ? 'copied' : 'failed')
    if (ok) track('contract_copy_success')
  }

  return (
    <div className="ca-copy">
      <p className="ca-value">
        {withPrefix ? <span className="address-label">CA: </span> : null}
        {presentation.kind === 'published' ? <code className="address">{value}</code> : <strong>{value}</strong>}
      </p>
      <button type="button" className="btn btn-small" onClick={() => void onCopy()}>
        {copyState === 'copied' ? 'Copied' : 'Copy CA'}
      </button>
      <p className="visually-hidden" role="status">
        {copyState === 'copied'
          ? 'Copied.'
          : copyState === 'failed'
            ? 'Could not copy automatically. Select the contract line and copy it manually.'
            : ''}
      </p>
    </div>
  )
}
