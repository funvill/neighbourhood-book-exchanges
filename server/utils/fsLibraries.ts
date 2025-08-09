import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface RawLibraryDoc {
  slug: string
  frontmatter: Record<string, any>
  body: string
}

const baseDir = path.join(process.cwd(), 'content', 'libraries')

export function listLibrarySlugs(): string[] {
  if (!fs.existsSync(baseDir)) return []
  return fs.readdirSync(baseDir).filter(dir => {
    try {
      return fs.statSync(path.join(baseDir, dir)).isDirectory() && fs.existsSync(path.join(baseDir, dir, 'index.md'))
    } catch { return false }
  })
}

export function readLibrary(slug: string): RawLibraryDoc | null {
  const file = path.join(baseDir, slug, 'index.md')
  if (!fs.existsSync(file)) return null
  try {
    const src = fs.readFileSync(file, 'utf8')
    const parsed = matter(src)
    return { slug, frontmatter: parsed.data || {}, body: parsed.content || '' }
  } catch {
    return null
  }
}

export function listLibraries(): RawLibraryDoc[] {
  return listLibrarySlugs().map(slug => readLibrary(slug)).filter(Boolean) as RawLibraryDoc[]
}

export function shortDescription(body: string): string {
  const lines = body.split(/\r?\n+/).map(l => l.trim()).filter(Boolean)
  for (const l of lines) {
    if (l.startsWith('#')) continue
    if (l.length) return (l.length > 200 ? l.slice(0, 200) + '…' : l)
  }
  return ''
}
