import { useState } from 'react'
import { mascotQuips, storyFileText } from '../content/story.ts'
import { publicPath } from '../lib/publicPath.ts'
import { AppWindow } from './AppWindow.tsx'
import { MemeMaker } from './MemeMaker.tsx'
import { Section } from './Section.tsx'
import { TokenDetails } from './TokenDetails.tsx'

type DesktopApp = 'story' | 'meme' | 'token' | null

const titles: Record<Exclude<DesktopApp, null>, string> = {
  story: 'story.txt',
  meme: 'meme.exe',
  token: 'token-info.exe',
}

export function Desktop() {
  const [app, setApp] = useState<DesktopApp>(null)
  const [quip, setQuip] = useState('The mascot is idle. Poke it for a status line.')
  const [boop, setBoop] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  function poke() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(reduce)
    setQuip((current) => {
      const choices = mascotQuips.filter((line) => line !== current)
      const pool = choices.length > 0 ? choices : mascotQuips
      return pool[Math.floor(Math.random() * pool.length)] ?? mascotQuips[0]
    })
    if (!reduce) setBoop((value) => value + 1)
  }

  return (
    <Section
      id="desktop"
      kicker="World Computer OS"
      title="Explore the desktop"
      tone="mint"
      lede="Three tiny apps live on this page: the story, the meme maker, and the token file. World Computer OS is a playful website feature, not software to install and not a gate in front of the rest of the site."
    >
      <div className="os-window desktop-shell">
        <div className="os-titlebar" aria-hidden="true">
          <span className="traffic">
            <i />
            <i />
            <i />
          </span>
          <span className="os-title">World Computer OS</span>
        </div>
        <div className="desk-screen" id="desktop-screen">
          <div>
            <p className="desk-help">Choose an app with a click, tap, or Enter. Escape closes it.</p>
            <div className="desk-icons">
              <button type="button" className="desk-icon" onClick={() => setApp('story')}>
                <IconFile />
                <span>story.txt</span>
                <small>Short story</small>
              </button>
              <button type="button" className="desk-icon" onClick={() => setApp('meme')}>
                <IconApp />
                <span>meme.exe</span>
                <small>Open the meme maker</small>
              </button>
              <button type="button" className="desk-icon" onClick={() => setApp('token')}>
                <IconInfo />
                <span>token-info.exe</span>
                <small>Facts and evidence</small>
              </button>
            </div>
          </div>
          <div className="desk-mascot">
            <button type="button" className="mascot-btn" onClick={poke}>
              <img
                key={reduceMotion ? 'still' : boop}
                className={!reduceMotion && boop > 0 ? 'boop' : undefined}
                src={publicPath('/media/mascot-mark.webp')}
                width={640}
                height={640}
                alt=""
              />
              Poke the mascot
            </button>
            <p className="quip" aria-live="polite">
              {quip}
            </p>
          </div>
        </div>
      </div>
      <AppWindow
        open={app !== null}
        title={app ? titles[app] : 'World Computer OS'}
        wide={app === 'meme'}
        onDismiss={() => setApp(null)}
      >
        {app === 'story' ? (
          <div className="file-view">
            <p>{storyFileText}</p>
          </div>
        ) : null}
        {app === 'meme' ? (
          <div className="file-view">
            <p>Captions stay in this browser. Nothing you type is uploaded.</p>
            <MemeMaker immediate />
          </div>
        ) : null}
        {app === 'token' ? (
          <div className="file-view">
            <TokenDetails />
            <p>
              <a href="#token" onClick={() => setApp(null)}>
                Open Tokenomics
              </a>
            </p>
          </div>
        ) : null}
      </AppWindow>
    </Section>
  )
}

function IconFile() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 6 h16 l10 10 v26 h-26 z" fill="#FFFBEA" stroke="#21103E" strokeWidth="3" />
      <path d="M28 6 v10 h10" fill="none" stroke="#21103E" strokeWidth="3" />
      <path d="M18 28 h14 M18 34 h10" stroke="#8050DF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function IconApp() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="8" width="36" height="26" rx="4" fill="#C9A8F5" stroke="#21103E" strokeWidth="3" />
      <path d="M16 40 h16" stroke="#21103E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="21" r="5" fill="#7CF5BE" stroke="#21103E" strokeWidth="3" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="6" width="32" height="36" rx="4" fill="#7CF5BE" stroke="#21103E" strokeWidth="3" />
      <path d="M16 18 h16 M16 26 h16 M16 34 h10" stroke="#21103E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
