import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

interface LibSummary {
  slug: string
  title: string
  location?: any
  photo: string
  tags: string[]
  established?: string | number
  description: string
  _path: string
}

function buildDescription(content: string): string {
  const first = content.split(/\n+/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))[0] || ''
  return first.length > 200 ? first.slice(0, 200) + '…' : first
}

function loadLibraries(): LibSummary[] {
  const dir = path.join(process.cwd(), 'content', 'libraries')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(d => {
    try { return fs.statSync(path.join(dir, d)).isDirectory() && fs.existsSync(path.join(dir, d, 'index.md')) } catch { return false }
  }).map(slug => {
    try {
      const raw = fs.readFileSync(path.join(dir, slug, 'index.md'), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title || slug,
        location: data.location,
        photo: data.photo || '/images/libraries/placeholder-library.jpg',
        tags: data.tags || [],
        established: data.established,
        description: buildDescription(content),
        _path: `/libraries/${slug}`
      }
    } catch { return null }
  }).filter(Boolean) as LibSummary[]
}

export default defineNitroPlugin(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = globalThis as any
  if (!g.__LIB_CACHE__) {
    g.__LIB_CACHE__ = loadLibraries()
    console.log(`[libraries-cache] Primed ${g.__LIB_CACHE__.length} libraries into global cache.`)
  }
})
