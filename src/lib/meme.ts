import { publicPath } from './publicPath.ts'

export type MemeTemplate = 'retro' | 'comic' | 'badge'

export const MEME_SIZE = 1080
export const CAPTION_LIMIT = 90

const INK = '#21103E'
const CREAM = '#FFFBEA'
const MINT = '#7CF5BE'
const VIOLET = '#8050DF'
const LAVENDER = '#C9A8F5'

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return cached
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth < 1 || image.naturalHeight < 1) {
        imageCache.delete(src)
        reject(new Error('Artwork loaded without a size.'))
        return
      }
      resolve(image)
    }
    image.onerror = () => {
      imageCache.delete(src)
      reject(new Error('Artwork could not be loaded.'))
    }
    image.src = src
  })
  imageCache.set(src, pending)
  return pending
}

function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...segmenter.segment(text)].map((part) => part.segment)
  }
  return Array.from(text)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split(/\n/)) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) continue
    let current = ''
    for (const word of words) {
      const trial = current ? `${current} ${word}` : word
      if (ctx.measureText(trial).width <= maxWidth) {
        current = trial
        continue
      }
      if (current) lines.push(current)
      if (ctx.measureText(word).width <= maxWidth) {
        current = word
        continue
      }
      let chunk = ''
      for (const grapheme of segmentGraphemes(word)) {
        const next = chunk + grapheme
        if (ctx.measureText(next).width <= maxWidth) {
          chunk = next
        } else {
          if (chunk) lines.push(chunk)
          chunk = grapheme
        }
      }
      current = chunk
    }
    if (current) lines.push(current)
  }
  return lines
}

function ellipsize(ctx: CanvasRenderingContext2D, line: string, maxWidth: number): string {
  const mark = '…'
  if (ctx.measureText(line).width <= maxWidth) return line
  let next = ''
  for (const grapheme of segmentGraphemes(line)) {
    const trial = next + grapheme
    if (ctx.measureText(trial + mark).width > maxWidth) break
    next = trial
  }
  return `${next}${mark}`
}

interface Band {
  x: number
  y: number
  w: number
  h: number
}

function fitCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  band: Band,
): { lines: string[]; size: number; lineHeight: number } {
  const clean = text.trim()
  if (!clean) return { lines: [], size: 64, lineHeight: 76 }
  const font = (size: number) => `700 ${size}px Fredoka, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
  for (let size = 64; size >= 22; size -= 2) {
    ctx.font = font(size)
    const lineHeight = Math.round(size * 1.18)
    const lines = wrapText(ctx, clean, band.w)
    if (lines.length * lineHeight <= band.h) return { lines, size, lineHeight }
  }
  const size = 22
  ctx.font = font(size)
  const lineHeight = Math.round(size * 1.18)
  const maxLines = Math.max(1, Math.floor(band.h / lineHeight))
  let lines = wrapText(ctx, clean, band.w)
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
    lines[maxLines - 1] = ellipsize(ctx, lines[maxLines - 1] ?? '', band.w)
  }
  return { lines, size, lineHeight }
}

function drawCaption(ctx: CanvasRenderingContext2D, text: string, band: Band): void {
  const fitted = fitCaption(ctx, text, band)
  if (fitted.lines.length === 0) return
  ctx.save()
  ctx.beginPath()
  ctx.rect(band.x, band.y, band.w, band.h)
  ctx.clip()
  ctx.font = `700 ${fitted.size}px Fredoka, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const block = fitted.lines.length * fitted.lineHeight
  let y = band.y + Math.max(0, (band.h - block) / 2)
  const x = band.x + band.w / 2
  for (const line of fitted.lines) {
    if (y + fitted.lineHeight > band.y + band.h + 1) break
    ctx.fillText(line, x, y)
    y += fitted.lineHeight
  }
  ctx.restore()
}

function drawFooter(ctx: CanvasRenderingContext2D): void {
  const height = 84
  const y = MEME_SIZE - height
  ctx.fillStyle = INK
  ctx.fillRect(0, y, MEME_SIZE, height)
  ctx.fillStyle = MINT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const label = 'Vitalik-Inspired World Computer  ·  $VITALIKWC'
  let size = 30
  ctx.font = `700 ${size}px Fredoka, sans-serif`
  while (size > 16 && ctx.measureText(label).width > 980) {
    size -= 1
    ctx.font = `700 ${size}px Fredoka, sans-serif`
  }
  ctx.fillText(label, MEME_SIZE / 2, y + height / 2)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
): Band {
  ctx.save()
  roundRect(ctx, x, y, w, h, 22)
  ctx.fillStyle = CREAM
  ctx.fill()
  ctx.clip()
  ctx.fillStyle = LAVENDER
  ctx.fillRect(x, y, w, 48)
  ctx.fillStyle = INK
  ctx.font = '500 20px "IBM Plex Mono", ui-monospace, monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(title, x + 20, y + 24, w - 40)
  ctx.restore()
  ctx.save()
  roundRect(ctx, x, y, w, h, 22)
  ctx.strokeStyle = INK
  ctx.lineWidth = 6
  ctx.stroke()
  ctx.restore()
  return { x: x + 22, y: y + 64, w: w - 44, h: h - 84 }
}

function drawContained(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  box: Band,
): void {
  const scale = Math.min(box.w / image.naturalWidth, box.h / image.naturalHeight)
  const w = image.naturalWidth * scale
  const h = image.naturalHeight * scale
  const x = box.x + (box.w - w) / 2
  const y = box.y + (box.h - h) / 2
  ctx.drawImage(image, x, y, w, h)
}

function drawCircularImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cx: number,
  cy: number,
  diameter: number,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  const scale = Math.max(diameter / image.naturalWidth, diameter / image.naturalHeight)
  const w = image.naturalWidth * scale
  const h = image.naturalHeight * scale
  ctx.drawImage(image, cx - w / 2, cy - h / 2, w, h)
  ctx.restore()
  ctx.beginPath()
  ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2)
  ctx.strokeStyle = INK
  ctx.lineWidth = 8
  ctx.stroke()
}

function drawBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number,
  rotation: number,
): void {
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = rotation + (Math.PI * i) / spikes - Math.PI / 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

async function ensureFonts(sample: string): Promise<void> {
  const specimen = `Vitalik-Inspired World Computer $VITALIKWC ${sample}`
  await Promise.all([
    document.fonts.load('700 64px Fredoka', specimen),
    document.fonts.load('500 20px "IBM Plex Mono"', 'top-caption.txt banner.bmp'),
  ])
  await document.fonts.ready
  if (!document.fonts.check('700 64px Fredoka')) {
    throw new Error('The meme font did not load.')
  }
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('The browser did not return a PNG.'))
      else resolve(blob)
    }, 'image/png')
  })
}

export interface MemeRequest {
  template: MemeTemplate
  top: string
  bottom: string
}

export async function renderMeme({ template, top, bottom }: MemeRequest): Promise<Blob> {
  await ensureFonts(`${top} ${bottom}`)
  const canvas = document.createElement('canvas')
  canvas.width = MEME_SIZE
  canvas.height = MEME_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available in this browser.')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (template === 'retro') {
    const banner = await loadImage(publicPath('/media/banner-retro.webp'))
    ctx.fillStyle = '#E7FFF6'
    ctx.fillRect(0, 0, MEME_SIZE, MEME_SIZE)
    ctx.fillStyle = MINT
    for (let y = 14; y < 990; y += 22) {
      for (let x = 14; x < MEME_SIZE; x += 22) {
        ctx.fillRect(x, y, 3, 3)
      }
    }
    const topBox = drawWindow(ctx, 32, 28, 1016, 196, 'top-caption.txt')
    const artBox = drawWindow(ctx, 32, 240, 1016, 500, 'banner.bmp')
    const bottomBox = drawWindow(ctx, 32, 756, 1016, 196, 'bottom-caption.txt')
    drawContained(ctx, banner, artBox)
    drawCaption(ctx, top, topBox)
    drawCaption(ctx, bottom, bottomBox)
  } else if (template === 'comic') {
    const mascot = await loadImage(publicPath('/media/mascot-mark.webp'))
    ctx.fillStyle = CREAM
    ctx.fillRect(0, 0, MEME_SIZE, MEME_SIZE)
    const cx = 540
    const cy = 490
    ctx.save()
    drawBurst(ctx, cx, cy, 16, 300, 214, 0.08)
    ctx.fillStyle = MINT
    ctx.fill()
    ctx.lineWidth = 8
    ctx.strokeStyle = INK
    ctx.stroke()
    drawBurst(ctx, cx, cy, 14, 230, 168, 0.2)
    ctx.fillStyle = VIOLET
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.restore()
    drawCircularImage(ctx, mascot, cx, cy, 390)
    drawCaption(ctx, top, { x: 70, y: 36, w: 940, h: 150 })
    drawCaption(ctx, bottom, { x: 70, y: 800, w: 940, h: 170 })
  } else {
    const seal = await loadImage(publicPath('/media/logo-seal.webp'))
    ctx.fillStyle = CREAM
    ctx.fillRect(0, 0, MEME_SIZE, MEME_SIZE)
    ctx.beginPath()
    ctx.arc(540, 500, 292, 0, Math.PI * 2)
    ctx.fillStyle = '#D9FFEF'
    ctx.fill()
    drawCircularImage(ctx, seal, 540, 500, 500)
    drawCaption(ctx, top, { x: 70, y: 28, w: 940, h: 160 })
    drawCaption(ctx, bottom, { x: 70, y: 808, w: 940, h: 168 })
  }

  drawFooter(ctx)
  const blob = await canvasToPng(canvas)
  const bitmap = await createImageBitmap(blob)
  const valid = bitmap.width === MEME_SIZE && bitmap.height === MEME_SIZE
  bitmap.close()
  if (!valid) throw new Error('The meme was not 1080 by 1080 pixels.')
  return blob
}

export function memePostText(top: string, bottom: string): string {
  const lines = [top.trim(), bottom.trim()].filter(Boolean)
  lines.push('Tiny computer. World-sized personality.', '$VITALIKWC')
  return lines.join('\n')
}
