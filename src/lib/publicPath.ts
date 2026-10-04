/** Prefix a public-folder path with the Vite base, so GitHub Pages project URLs resolve. */
export function publicPath(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
