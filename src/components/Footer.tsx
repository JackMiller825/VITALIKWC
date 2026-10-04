import { isHttpsUrl } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'

export function Footer() {
  const telegram = isHttpsUrl(site.telegramUrl) ? site.telegramUrl : null
  const xUrl = isHttpsUrl(site.xUrl) ? site.xUrl : null

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <img
          src="/media/logo-seal.webp"
          width={768}
          height={768}
          alt="Circular badge reading Vitalik-Inspired World Computer around the flexing computer mascot."
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="footer-name">{site.name}</p>
          <p>{site.ticker} on Ethereum mainnet. World Computer OS is a theme for this website, not an operating system and not an Ethereum client.</p>
          <ul className="footer-links">
            <li>
              <a href="#story">Story</a>
            </li>
            <li>
              <a href="#desktop">The Desktop</a>
            </li>
            <li>
              <a href="#meme">Meme maker</a>
            </li>
            <li>
              <a href="#token">Token Details</a>
            </li>
            <li>
              <a href="#buy">How to Buy</a>
            </li>
            <li>
              <a href="#community">Community</a>
            </li>
            {telegram ? (
              <li>
                <ExternalLink href={telegram} onClick={() => track('community_link_click')}>
                  Telegram
                </ExternalLink>
              </li>
            ) : null}
            {xUrl ? (
              <li>
                <ExternalLink href={xUrl} onClick={() => track('community_link_click')}>
                  X
                </ExternalLink>
              </li>
            ) : null}
            <li>
              <ExternalLink href={site.sourceArticle.url} onClick={() => track('source_essay_click')}>
                {site.sourceArticle.title}
              </ExternalLink>
            </li>
          </ul>
          <p>{site.affiliation}</p>
          <p className="risk">{site.risk}</p>
        </div>
      </div>
    </footer>
  )
}
