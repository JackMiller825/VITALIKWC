import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

export function Community() {
  return (
    <Section id="community" kicker="Community" title="Community">
      <div className="social-row">
        <ExternalLink className="btn btn-primary" href={site.telegramUrl ?? ''} onClick={() => track('community_link_click')}>
          Telegram
        </ExternalLink>
        <ExternalLink className="btn" href={site.xUrl ?? ''} onClick={() => track('community_link_click')}>
          X
        </ExternalLink>
      </div>
    </Section>
  )
}
