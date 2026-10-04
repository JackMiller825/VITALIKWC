import { allocationReady, isHttpsUrl, statusLabel } from '../config/guards.ts'
import { site } from '../config/site.ts'
import type { Evidence, EvidenceStatus } from '../config/site.ts'
import { MarketData } from './MarketData.tsx'
import { ExternalLink } from './ExternalLink.tsx'

interface TokenDetailsProps {
  mode?: 'page' | 'embedded'
}

export function TokenDetails({ mode = 'page' }: TokenDetailsProps) {
  const chart = allocationReady(site.allocations)
  const liquidity = site.liquidity

  return (
    <div className="token-layout">
      {mode === 'page' ? (
        <p className="prose">
          Each line is a project fact with a status. Documented means we wrote down a source or a project statement.
          It does not mean a third party audited it. Not announced means we are not guessing. Unverified means a value
          is visible but not yet tied to evidence the owner stands behind.
        </p>
      ) : (
        <p>What is confirmed, and the evidence attached to it. A blank is not a promise.</p>
      )}
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
            <FactRow label="Network" evidence={site.chain} />
            <div className="spec-row">
              <dt>Contract</dt>
              <dd>
                <StatusPill status={site.contractConfirmed ? 'documented' : 'not_announced'} />
                <p>{site.contractConfirmed ? 'Marked confirmed in configuration.' : 'Contract address not announced.'}</p>
                <p className="fine">See the address block in the introduction. Nothing is copied from a guess.</p>
              </dd>
            </div>
            <FactRow label="Total supply" evidence={site.supply} />
            <FactRow label="Buy tax" evidence={site.buyTax} />
            <FactRow label="Sell tax" evidence={site.sellTax} />
            <div className="spec-row">
              <dt>Allocation</dt>
              <dd>
                {chart ? (
                  <>
                    <StatusPill status="documented" />
                    <ul className="alloc-list">
                      {site.allocations?.map((slice) => (
                        <li key={slice.label}>
                          <span>
                            {slice.label}: {slice.percent}%
                          </span>
                          {isHttpsUrl(slice.evidenceUrl) ? (
                            <ExternalLink href={slice.evidenceUrl}>{slice.label} evidence</ExternalLink>
                          ) : (
                            <span className="fine">No evidence link</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="alloc-bar" aria-hidden="true">
                      {site.allocations?.map((slice) => (
                        <span key={slice.label} style={{ width: `${slice.percent}%` }} title={slice.label} />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <StatusPill status="not_announced" />
                    <p>Allocation details will be published before launch.</p>
                  </>
                )}
              </dd>
            </div>
            <FactRow label="Team vesting" evidence={site.vesting} />
            <div className="spec-row">
              <dt>Liquidity</dt>
              <dd>
                <StatusPill status={liquidity.status} />
                {liquidity.kind === 'locked' ? (
                  <ul className="plain-list">
                    <li>Pool: {liquidity.pool ?? 'not recorded'}</li>
                    <li>Locker: {liquidity.locker ?? 'not recorded'}</li>
                    <li>Share covered: {liquidity.shareCovered ?? 'not recorded'}</li>
                    <li>Unlock date: {liquidity.unlockDate ?? 'not recorded'}</li>
                  </ul>
                ) : null}
                {liquidity.kind === 'burned' ? (
                  <p>Burn scope: {liquidity.scope ?? 'not recorded'}. A burn is not treated as a lock, and it is not treated as renounced ownership.</p>
                ) : null}
                {liquidity.kind === null ? (
                  <p>{liquidity.note ?? 'Not announced. Liquidity is recorded separately from ownership.'}</p>
                ) : null}
                <EvidenceLine
                  url={liquidity.evidenceUrl}
                  label={liquidity.evidenceLabel}
                  checkedAt={liquidity.checkedAt}
                />
              </dd>
            </div>
            <FactRow label="Ownership" evidence={site.adminPermissions.ownership} />
            <FactRow label="Upgradeability" evidence={site.adminPermissions.upgradeability} />
            <FactRow label="Privileged roles" evidence={site.adminPermissions.privilegedRoles} />
          </dl>
          <p className="fine">
            Renouncing ownership, locking liquidity, or burning tokens would each need their own evidence. None of
            those outcomes is inferred from the others.
          </p>
        </div>
      </div>
      {mode === 'page' ? <MarketData /> : null}
    </div>
  )
}

function FactRow({ label, evidence }: { label: string; evidence: Evidence<string> }) {
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>
        <StatusPill status={evidence.status} />
        <p>{evidence.value ?? 'Not announced.'}</p>
        {evidence.note ? <p className="fine">{evidence.note}</p> : null}
        <EvidenceLine url={evidence.evidenceUrl} label={evidence.evidenceLabel} checkedAt={evidence.checkedAt} />
      </dd>
    </div>
  )
}

function EvidenceLine({
  url,
  label,
  checkedAt,
}: {
  url: string | null
  label: string | null
  checkedAt: string | null
}) {
  const href = isHttpsUrl(url) ? url : null
  return (
    <p className="fine">
      Evidence:{' '}
      {href ? <ExternalLink href={href}>{label?.trim() || 'Open evidence'}</ExternalLink> : 'No evidence link'}
      {' · '}
      Checked: {checkedAt ?? 'not recorded'}
    </p>
  )
}

function StatusPill({ status }: { status: EvidenceStatus }) {
  return <span className={`pill pill-${status}`}>{statusLabel(status)}</span>
}
