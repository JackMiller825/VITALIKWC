import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'
import { Section } from './Section.tsx'

export function Community() {
  return (
    <Section id="community" kicker="Community" title="The desk is louder with friends.">
      <div className="community-pitch">
        <p>The mascot is flexing at an empty desk. That is embarrassing for everyone involved.</p>
        <p>Bring a meme. Leave with three worse ones. Telegram is the back room where that happens.</p>
        <p>X is the window we shout them out of. Join before this computer starts a group chat with itself.</p>
      </div>
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
