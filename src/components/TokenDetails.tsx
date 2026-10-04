import type { Evidence } from '../config/site.ts'
import { site } from '../config/site.ts'
import { CaCopy } from './CaCopy.tsx'

export function TokenDetails() {
  return (
    <div className="token-layout">
      <div className="os-window">
        <div className="os-titlebar" aria-hidden="true">
          <span className="traffic">
            <i />
            <i />
            <i />
          </span>
          <span className="os-title">token-info.exe</span>
        </div>
        <div className="os-panel">
          <dl className="spec">
            <div className="spec-row">
              <dt>Contract</dt>
              <dd>
                <CaCopy />
              </dd>
            </div>
            <FactRow label="Total supply" evidence={site.supply} />
            <FactRow label="Buy tax" evidence={site.buyTax} />
            <FactRow label="Sell tax" evidence={site.sellTax} />
            <div className="spec-row">
              <dt>Ownership</dt>
              <dd>
                <p>LP tokens are burnt and contract ownership is renounced.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

function FactRow({ label, evidence }: { label: string; evidence: Evidence<string> }) {
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>
        <p>{evidence.value ?? 'Not announced.'}</p>
      </dd>
    </div>
  )
}
