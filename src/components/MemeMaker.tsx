import { useEffect, useId, useState } from 'react'
import { track } from '../lib/analytics.ts'
import { copyText } from '../lib/copyText.ts'
import { CAPTION_LIMIT, memePostText, renderMeme, type MemeTemplate } from '../lib/meme.ts'

const templates: { id: MemeTemplate; label: string; detail: string }[] = [
  { id: 'retro', label: 'Retro desktop', detail: 'Banner inside a window' },
  { id: 'comic', label: 'Comic burst', detail: 'Mascot on a drawn burst' },
  { id: 'badge', label: 'Mascot badge', detail: 'Circular name badge' },
]

interface MemeMakerProps {
  immediate?: boolean
}

export function MemeMaker({ immediate = false }: MemeMakerProps) {
  const topId = useId()
  const bottomId = useId()
  const [template, setTemplate] = useState<MemeTemplate>('retro')
  const [top, setTop] = useState('')
  const [bottom, setBottom] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'waiting' | 'loading' | 'ready' | 'error'>('waiting')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [armed, setArmed] = useState(immediate)
  const [busy, setBusy] = useState(false)
  const postText = memePostText(top, bottom)

  useEffect(() => {
    if (immediate || armed) return
    const node = document.getElementById('meme-maker')
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setArmed(true)
      },
      { rootMargin: '240px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [armed, immediate])

  useEffect(() => {
    if (!armed) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      setStatus('loading')
      renderMeme({ template, top, bottom })
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          if (cancelled) {
            URL.revokeObjectURL(url)
            return
          }
          setPreviewUrl(url)
          setStatus('ready')
          setError(null)
        })
        .catch((reason: unknown) => {
          if (cancelled) return
          setStatus('error')
          setError(reason instanceof Error ? reason.message : 'The meme could not be drawn.')
        })
    }, 140)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [armed, template, top, bottom, attempt])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function reset() {
    setTemplate('retro')
    setTop('')
    setBottom('')
    setNotice(null)
  }

  async function exportPng() {
    setBusy(true)
    setNotice(null)
    try {
      const blob = await renderMeme({ template, top, bottom })
      downloadBlob(blob)
      track('meme_export')
      setNotice('Downloaded vitalikwc-meme.png. This site did not publish it anywhere.')
      setStatus('ready')
      setError(null)
    } catch (reason: unknown) {
      setStatus('error')
      setError(reason instanceof Error ? reason.message : 'The meme could not be drawn.')
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    setBusy(true)
    setNotice(null)
    try {
      const blob = await renderMeme({ template, top, bottom })
      const file = new File([blob], 'vitalikwc-meme.png', { type: 'image/png' })
      const data: ShareData = { files: [file], text: postText, title: 'Vitalik-Inspired World Computer' }
      if (navigator.canShare?.(data)) {
        try {
          await navigator.share(data)
          track('meme_export')
          setNotice('The share sheet opened on your device. This site did not publish a post.')
          return
        } catch (reason: unknown) {
          if (reason instanceof DOMException && reason.name === 'AbortError') return
        }
      }
      downloadBlob(blob)
      const copied = await copyText(postText)
      track('meme_export')
      setNotice(
        copied
          ? 'Downloaded the PNG and copied the post text. This site does not publish posts or attach images to X for you.'
          : 'Downloaded the PNG. Copy the post text below. This site does not publish posts for you.',
      )
    } catch (reason: unknown) {
      setStatus('error')
      setError(reason instanceof Error ? reason.message : 'The meme could not be drawn.')
    } finally {
      setBusy(false)
    }
  }

  async function copyPost() {
    const ok = await copyText(postText)
    setNotice(ok ? 'Copied the post text.' : 'Could not copy automatically. Select the post text and copy it manually.')
  }

  const previewAlt = previewAltText(template, top, bottom)

  return (
    <div className="maker" id={immediate ? undefined : 'meme-maker'}>
      <form
        className="maker-controls"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <fieldset>
          <legend>Composition</legend>
          <div className="picks">
            {templates.map((item) => (
              <label className="pick" key={item.id}>
                <input
                  type="radio"
                  name={immediate ? 'desktop-template' : 'template'}
                  value={item.id}
                  checked={template === item.id}
                  onChange={() => setTemplate(item.id)}
                />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor={topId}>Top caption</label>
          <textarea
            id={topId}
            value={top}
            maxLength={CAPTION_LIMIT}
            rows={2}
            spellCheck
            autoComplete="off"
            placeholder="A short line"
            onChange={(event) => setTop(event.target.value)}
          />
          <span className="count">
            {top.length}/{CAPTION_LIMIT}
          </span>
        </div>
        <div className="field">
          <label htmlFor={bottomId}>Bottom caption</label>
          <textarea
            id={bottomId}
            value={bottom}
            maxLength={CAPTION_LIMIT}
            rows={2}
            spellCheck
            autoComplete="off"
            placeholder="Another short line"
            onChange={(event) => setBottom(event.target.value)}
          />
          <span className="count">
            {bottom.length}/{CAPTION_LIMIT}
          </span>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => void exportPng()} disabled={busy}>
            Download PNG
          </button>
          <button type="button" className="btn" onClick={() => void share()} disabled={busy}>
            Share
          </button>
          <button type="button" className="btn" onClick={reset} disabled={busy}>
            Reset
          </button>
        </div>
        <p className="fine">Captions are drawn in your browser. They are not uploaded, and no wallet is required.</p>
      </form>
      <div className="maker-preview">
        <div className="preview-frame">
          {previewUrl && status !== 'error' ? (
            <img src={previewUrl} width={1080} height={1080} alt={previewAlt} />
          ) : (
            <p className="preview-wait">{armed ? 'Drawing the preview…' : 'Preview draws when this maker is on screen.'}</p>
          )}
        </div>
        {status === 'error' && error ? (
          <div className="error-box" role="alert">
            <p>The meme could not be drawn. {error}</p>
            <button type="button" className="btn" onClick={() => setAttempt((value) => value + 1)}>
              Try again
            </button>
          </div>
        ) : null}
        <div className="field">
          <label htmlFor={immediate ? 'desktop-post-text' : 'post-text'}>Post text</label>
          <textarea id={immediate ? 'desktop-post-text' : 'post-text'} readOnly rows={4} value={postText} />
        </div>
        <button type="button" className="btn btn-small" onClick={() => void copyPost()}>
          Copy post text
        </button>
        <p className="fine" role="status">
          {notice ?? 'Sharing downloads a PNG or opens your device share sheet. This site never posts for you.'}
        </p>
      </div>
    </div>
  )
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'vitalikwc-meme.png'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function previewAltText(template: MemeTemplate, top: string, bottom: string): string {
  const scene =
    template === 'retro'
      ? 'Retro desktop meme with the project banner inside a window'
      : template === 'comic'
        ? 'Comic burst meme with the computer mascot'
        : 'Mascot badge meme using the circular logo'
  const captions = [
    top.trim() ? `Top caption: ${top.trim()}.` : 'No top caption.',
    bottom.trim() ? `Bottom caption: ${bottom.trim()}.` : 'No bottom caption.',
  ]
  return `${scene}. ${captions.join(' ')} Footer reads Vitalik-Inspired World Computer and $VITALIKWC.`
}
