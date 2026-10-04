import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function readSiteUrl(): string | null {
  const source = readFileSync(new URL('./src/config/site.ts', import.meta.url), 'utf8')
  const match = source.match(/siteUrl:\s*(null|"(https:\/\/[^"]+)")/)
  if (!match) throw new Error('siteUrl is missing from src/config/site.ts')
  if (match[1] === 'null') return null
  return match[2] ?? null
}

function siteFiles(): Plugin {
  const origin = readSiteUrl()?.replace(/\/$/, '') ?? ''
  const description =
    'Meet $VITALIKWC, an Ethereum community memecoin. A tiny computer mascot, a desktop, and a meme maker.'
  return {
    name: 'site-files',
    transformIndexHtml(html) {
      const image = origin ? `${origin}/og.png` : '/og.png'
      const canonical = origin ? `<link rel="canonical" href="${origin}/" />` : ''
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vitalik-Inspired World Computer',
        alternateName: ['VITALIKWC', '$VITALIKWC'],
        ...(origin ? { url: `${origin}/` } : {}),
        description,
        inLanguage: 'en',
      })
      return html.replaceAll('__OG_IMAGE__', image).replaceAll('__CANONICAL__', canonical).replaceAll('__JSONLD__', jsonLd)
    },
    generateBundle() {
      const robots = origin
        ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n\n# Add a Sitemap line after siteUrl is set in src/config/site.ts.\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (origin) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc></url>\n</urlset>\n`
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      }
    },
  }
}

export default defineConfig({
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react(), siteFiles()],
  server: { host: '0.0.0.0', port: 4317, strictPort: true },
  preview: { host: '0.0.0.0', port: 4317, strictPort: true },
})
