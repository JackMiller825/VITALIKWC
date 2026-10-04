import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  kicker: string
  title: string
  lede?: string
  tone?: 'cream' | 'mint'
  children: ReactNode
}

export function Section({ id, kicker, title, lede, tone = 'cream', children }: SectionProps) {
  return (
    <section id={id} className={tone === 'mint' ? 'section section-mint' : 'section'} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <p className="kicker">
          <span className="diamond" aria-hidden="true" />
          {kicker}
        </p>
        <h2 id={`${id}-title`}>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </div>
    </section>
  )
}
