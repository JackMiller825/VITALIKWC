import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

export function BuyGuide() {
  return (
    <Section id="buy" kicker="How to buy" title="How to buy" tone="mint">
      <ol className="steps">
        <li>
          <h3>Create a Wallet</h3>
          <p>
            Download MetaMask or your wallet of choice from the App Store or Google Play Store for free. Desktop
            users, download the Google Chrome extension by going to{' '}
            <ExternalLink href="https://metamask.io">metamask.io</ExternalLink>.
          </p>
        </li>
        <li>
          <h3>Get Some ETH</h3>
          <p>
            Have ETH in your wallet to switch to $VITALIKWC. If you don’t have any ETH, you can buy directly on
            MetaMask, transfer from another wallet, or buy on another exchange and send it to your wallet.
          </p>
        </li>
        <li>
          <h3>Go to Uniswap</h3>
          <p>
            Connect to Uniswap. Go to <ExternalLink href="https://app.uniswap.org">app.uniswap.org</ExternalLink> in
            Google Chrome or on the browser inside your MetaMask app. Connect your wallet. Paste the $VITALIKWC token
            address into Uniswap, select $VITALIKWC, and confirm. When MetaMask prompts you for a wallet signature,
            review the swap and sign only if it matches.
          </p>
        </li>
        <li>
          <h3>Switch ETH for $VITALIKWC</h3>
          <p>
            Switch ETH for $VITALIKWC. We have zero taxes, so you don’t need to worry about buying with a specific
            slippage, although you may need to use slippage during times of market volatility.
          </p>
        </li>
      </ol>
    </Section>
  )
}
