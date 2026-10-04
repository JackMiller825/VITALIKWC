import { isHttpsUrl } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

export function Community() {
  const telegram = isHttpsUrl(site.telegramUrl) ? site.telegramUrl : null
  const xUrl = isHttpsUrl(site.xUrl) ? site.xUrl : null

  return (
    <Section
      id="community"
      kicker="Community"
      title="Join the desktop."
      lede="Make a meme, read the source, and come back when the contract is published. There is no member counter here, because this project is not going to invent one."
    >
      <div className="social-row">
        {telegram ? (
          <ExternalLink className="btn btn-primary" href={telegram} onClick={() => track('community_link_click')}>
            Telegram
          </ExternalLink>
        ) : (
          <p className="social-missing">Telegram: not announced.</p>
        )}
        {xUrl ? (
          <ExternalLink className="btn" href={xUrl} onClick={() => track('community_link_click')}>
            X
          </ExternalLink>
        ) : (
          <p className="social-missing">X: not announced.</p>
        )}
      </div>

      <h3 className="subhead">Brand downloads</h3>
      <p className="fine">These are the files we actually have. Original PNGs are the downloads. Previews use smaller images.</p>
      <div className="downloads">
        {site.assetManifest.map((asset) => (
          <article key={asset.id} className="os-window download-card">
            <div className="os-titlebar" aria-hidden="true">
              <span className="traffic">
                <i />
                <i />
                <i />
              </span>
              <span className="os-title">{asset.file.split('/').pop()}</span>
            </div>
            <div className="os-panel">
              <img
                src={asset.preview}
                width={asset.width}
                height={asset.height}
                alt={asset.alt}
                loading="lazy"
                decoding="async"
              />
              <h4>{asset.title}</h4>
              <p>{asset.description}</p>
              <a className="btn btn-small" href={asset.file} download>
                Download {asset.sizeLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="fine">
        Still not in the file set: a transparent mascot cutout, a comic-book banner, a purple space banner, and a
        Telegram welcome image. They are not offered as downloads until the real files exist.
      </p>

      <h3 className="subhead">Example compositions</h3>
      <p className="fine">Samples of the meme maker layouts, using local artwork. They are not posts from other people.</p>
      <div className="examples">
        <figure className="os-window">
          <figcaption>Retro desktop · example captions sit outside the banner</figcaption>
          <p className="example-caption">Top: “World computer, local sense of humor.”</p>
          <img
            src="/media/banner-retro.webp"
            width={1600}
            height={534}
            alt="Retro desktop banner used as the artwork inside the retro meme template."
            loading="lazy"
            decoding="async"
          />
          <p className="example-caption">Bottom: “Still not an operating system.”</p>
        </figure>
        <figure className="os-window example-burst">
          <figcaption>Comic burst · drawn in the maker, not a separate banner file</figcaption>
          <p className="example-caption">Top: “Processing extremely important memes.”</p>
          <img
            src="/media/mascot-mark.webp"
            width={640}
            height={640}
            alt="Computer mascot used in the center of the comic burst meme."
            loading="lazy"
            decoding="async"
          />
          <p className="example-caption">Bottom: “Verification: the joke compiles.”</p>
        </figure>
        <figure className="os-window">
          <figcaption>Mascot badge · full seal, lettering left intact</figcaption>
          <p className="example-caption">Top: “Tiny computer.”</p>
          <img
            className="example-seal"
            src="/media/logo-seal.webp"
            width={768}
            height={768}
            alt="Circular Vitalik-Inspired World Computer badge used in the mascot badge meme."
            loading="lazy"
            decoding="async"
          />
          <p className="example-caption">Bottom: “World-sized personality.”</p>
        </figure>
      </div>
    </Section>
  )
}
