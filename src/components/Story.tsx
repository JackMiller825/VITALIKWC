import { site } from '../config/site.ts'
import { concepts, storyParagraphs } from '../content/story.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

export function Story() {
  return (
    <Section id="story" kicker="Story" title="A big idea. A very unserious little computer.">
      <div className="story-layout">
        <div>
          <div className="prose">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <ul className="concepts">
            {concepts.map((concept) => (
              <li key={concept.title}>
                <h3>{concept.title}</h3>
                <p>{concept.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <aside className="os-window source-card">
          <div className="os-titlebar" aria-hidden="true">
            <span className="traffic">
              <i />
              <i />
              <i />
            </span>
            <span className="os-title">source.txt</span>
          </div>
          <div className="os-panel">
            <p className="source-label">Source</p>
            <h3 className="source-title">{site.sourceArticle.title}</h3>
            <p>
              Essay by {site.sourceArticle.author}, published {site.sourceArticle.dateLabel}.
            </p>
            <p>
              <ExternalLink href={site.sourceArticle.url} onClick={() => track('source_essay_click')}>
                Read it on vitalik.eth.limo
              </ExternalLink>
            </p>
            <p className="fine">
              The link is a source, not an endorsement. {site.affiliation}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  )
}
