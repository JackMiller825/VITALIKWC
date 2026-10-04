import { canOfferBuyLink } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { publicPath } from '../lib/publicPath.ts'

const links = [
  { href: '#desktop', label: 'The Desktop' },
  { href: '#token', label: 'Tokenomics' },
  { href: '#buy', label: 'How to Buy' },
  { href: '#community', label: 'Community' },
]

export function Navigation() {
  const buy = canOfferBuyLink(site)

  return (
    <header className="site-header">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="wrap nav-wrap">
        <div className="nav-top">
          <a className="brand" href="#top">
            <img
              src={publicPath('/media/mascot-mark.webp')}
              width={640}
              height={640}
              alt=""
            />
            <span>VITALIKWC</span>
          </a>
          {buy && site.swapUrl ? (
            <a className="btn btn-primary" href={site.swapUrl} onClick={() => track('buy_link_click')}>
              Buy $VITALIKWC
            </a>
          ) : (
            <a className="btn btn-primary" href="#community">
              Join the Community
            </a>
          )}
        </div>
        <nav className="nav-links" aria-label="Page">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
