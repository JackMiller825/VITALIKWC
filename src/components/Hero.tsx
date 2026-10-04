import { canOfferBuyLink, isHttpsUrl } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { publicPath } from '../lib/publicPath.ts'
import { CaCopy } from './CaCopy.tsx'
import { ExternalLink } from './ExternalLink.tsx'

export function Hero() {
  const buy = canOfferBuyLink(site) && isHttpsUrl(site.swapUrl)
  const telegram = isHttpsUrl(site.telegramUrl)

  return (
    <div className="hero-band" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker">
            <span className="diamond" aria-hidden="true" />
            An independent Ethereum community memecoin.
          </p>
          <p className="project-name">{site.name}</p>
          <h1>Tiny computer. World-sized personality.</h1>
          <p className="lede">
            Meet $VITALIKWC: a mischievous little computer inspired by Ethereum&apos;s world-computer vision. Explore
            the story, make a meme, and meet the community.
          </p>
          <div className="actions">
            {buy ? (
              <a className="btn btn-primary" href={site.swapUrl ?? undefined} onClick={() => track('buy_link_click')}>
                Buy $VITALIKWC
              </a>
            ) : (
              <a className="btn btn-primary" href="#community">
                Join the Community
              </a>
            )}
            {buy && telegram ? (
              <ExternalLink className="btn" href={site.telegramUrl ?? ''} onClick={() => track('community_link_click')}>
                Join Telegram
              </ExternalLink>
            ) : (
              <a className="btn" href="#desktop">
                Explore the Desktop
              </a>
            )}
          </div>
          <CaCopy withPrefix />
        </div>
        <div className="os-window hero-art">
          <div className="os-titlebar" aria-hidden="true">
            <span className="traffic">
              <i />
              <i />
              <i />
            </span>
            <span className="os-title">mascot.png</span>
          </div>
          <div className="hero-art-body">
            <img
              src={publicPath('/media/mascot-mark.webp')}
              width={640}
              height={640}
              alt="Mascot of Vitalik-Inspired World Computer: a smiling purple desktop computer with a globe on its screen, flexing both arms and wearing sneakers."
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
