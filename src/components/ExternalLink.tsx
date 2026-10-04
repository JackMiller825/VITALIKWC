import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function ExternalLink({ href, children, onClick, className }: ExternalLinkProps) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer noopener" onClick={onClick}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
