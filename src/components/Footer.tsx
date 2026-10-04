import { site } from '../config/site.ts'
import { track } from '../lib/analytics.ts'
import { ExternalLink } from './ExternalLink.tsx'

const links = [
  { href: '#desktop', label: 'The Desktop' },
  { href: '#token', label: 'Tokenomics' },
  { href: '#buy', label: 'How to Buy' },
  { href: '#community', label: 'Community' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-bar">
        <nav aria-label="Footer">
          <ul className="footer-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-social">
          <ExternalLink href={site.telegramUrl ?? ''} onClick={() => track('community_link_click')}>
            <TelegramIcon />
            <span className="visually-hidden">Telegram</span>
          </ExternalLink>
          <ExternalLink href={site.xUrl ?? ''} onClick={() => track('community_link_click')}>
            <XIcon />
            <span className="visually-hidden">X</span>
          </ExternalLink>
        </div>
      </div>
    </footer>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 4.3 18.4 20c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.2.3-.5.5-.9.5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.5 13.1 2 11.7c-1-.3-1-.9.2-1.4L20.2 3.2c.8-.3 1.6.2 1.4 1.1Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 10.3 22.4 2h-1.8l-6.7 7.2L8.6 2H2l8.1 11.1L2 22h1.8l7.1-7.6L15.4 22H22l-7.3-11.7Zm-2.5 2.7-.8-1.1L4.5 3.3h2.8l5.3 7.1.8 1.1 6.9 9.2h-2.8l-5.3-7.7Z" />
    </svg>
  )
}
