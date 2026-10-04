import { canOfferBuyLink, isHttpsUrl, linkHost } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

const walletGuide = 'https://ethereum.org/wallets'

export function BuyGuide() {
  const ready = canOfferBuyLink(site) && isHttpsUrl(site.swapUrl)

  return (
    <Section
      id="buy"
      kicker="How to buy"
      title="How to buy"
      tone="mint"
      lede={
        ready
          ? 'Use the official swap link on this page, then match the full contract address before you decide anything.'
          : 'This section is preparatory. The token is not available to buy from this site yet.'
      }
    >
      <div className={ready ? 'callout' : 'callout callout-hold'}>
        {ready ? (
          <p>
            Launch settings are in place. Opening the swap leaves this site. That click is not a completed purchase.
          </p>
        ) : (
          <p>
            A buy link stays unavailable until the launch state, a confirmed contract address, and an official swap
            destination are all configured. No wallet connection is offered here.
          </p>
        )}
      </div>
      <ol className="steps">
        <li>
          <h3>Set up a wallet from its official source</h3>
          <p>
            Use an Ethereum-compatible wallet and download it from the publisher, not from a reply, search ad, or
            direct message.{' '}
            <ExternalLink href={walletGuide}>ethereum.org/wallets</ExternalLink> is a starting list maintained with
            Ethereum.org.
          </p>
        </li>
        <li>
          <h3>Fund it on Ethereum mainnet</h3>
          <p>Add ETH on Ethereum mainnet and leave enough ETH for network fees. This project is not on another chain.</p>
        </li>
        <li>
          <h3>Open the official swap and match the address</h3>
          {ready && site.swapUrl ? (
            <p>
              <ExternalLink className="btn btn-primary" href={site.swapUrl} onClick={() => track('buy_link_click')}>
                Open the official swap
              </ExternalLink>
            </p>
          ) : (
            <p>The official swap destination is not open yet.</p>
          )}
          <p>
            When it is listed here, open that link and compare every character of the contract address with the
            address on this website. {ready ? `The swap host is ${linkHost(site.swapUrl ?? '')}.` : 'No swap host is configured.'}
          </p>
        </li>
        <li>
          <h3>Review the trade before you confirm</h3>
          <p>
            Look at price impact, slippage tolerance, token amounts, and fees, then decide whether to confirm. Do not
            raise slippage because a website told you to. If a trade looks wrong, stop.
          </p>
        </li>
      </ol>
      <p className="seed-warning">Never share your seed phrase.</p>
    </Section>
  )
}
