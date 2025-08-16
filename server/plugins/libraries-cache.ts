import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
// Optional runtime watch (dev only)
let chokidar: typeof import('chokidar') | null = null
try { chokidar = require('chokidar') } catch { /* dependency may not be installed in production build */ }

interface LibSummary {
  slug: string
  title: string
  location?: any
  photo: string
  tags: string[]
  description: string
  _path: string
  library_id?: string | number
  images?: string[]
}

function buildDescription(content: string): string {
  const first = content.split(/\n+/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))[0] || ''
  return first.length > 200 ? first.slice(0, 200) + '…' : first
}

function ensureCopiedPhoto(libraryId: string, rawPhoto?: string): string | undefined {
  if (!rawPhoto) return undefined
  if (rawPhoto.startsWith('/') || /^https?:\/\//i.test(rawPhoto)) return rawPhoto
  
  // TODO: Update for new structure when image migration is complete
  // For now, return the raw photo path or placeholder
  return rawPhoto || '/images/libraries/placeholder-library.jpg'
}

function copyAllImages(libraryId: string): string[] {
  // TODO: Implement for new structure when image migration is complete
  // For now, return empty array
  return []
}

function loadLibraries(): LibSummary[] {
  const dir = path.join(process.cwd(), 'content', 'libraries')
  if (!fs.existsSync(dir)) return []
  
  // NEW: Read flattened .md files instead of directories
  return fs.readdirSync(dir).filter(f => {
    try { 
      return f.endsWith('.md') && fs.statSync(path.join(dir, f)).isFile() 
    } catch { 
      return false 
    }
  }).map(filename => {
    try {
      const filePath = path.join(dir, filename)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      
      // Extract library_id for slug (remove .md extension as fallback)
      const libraryId = data.library_id || filename.replace('.md', '')
      const slug = data.title ? 
        data.title.toLowerCase()
          .normalize('NFKD')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/-{2,}/g, '-') 
        : String(libraryId)
      
      // NEW: For flattened structure, use library_id for image paths instead of slug
      const copied = ensureCopiedPhoto(String(libraryId), data.photo)
      // Copy all images and build gallery list
      const gallery = copyAllImages(String(libraryId)) || []
      
      // Ensure frontmatter image (copied or raw absolute) is first
      const primary = copied || data.photo
      let images: string[] = []
      if (primary) {
        // If relative, ensure we have its copied version path
        if (primary.startsWith('/library-images/')) images.push(primary)
        else if (!/^https?:\/\//i.test(primary) && !primary.startsWith('/')) {
          const relName = path.basename(primary)
          const match = gallery.find(g => g.endsWith('/' + relName))
          if (match) images.push(match)
        } else {
          images.push(primary)
        }
      }
      for (const img of gallery) if (!images.includes(img)) images.push(img)
      
      return {
        slug,
        title: data.title || `Library ${libraryId}`,
        location: data.location,
        photo: copied || data.photo || '/images/libraries/placeholder-library.jpg',
        tags: data.tags || [],
        description: buildDescription(content),
        _path: `/libraries/${filename.replace('.md', '')}`,
        library_id: libraryId,
        images
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
  // Development watch: re-copy images & refresh cache on changes
  if (process.env.NODE_ENV !== 'production' && !g.__LIB_WATCHER__ && chokidar) {
    const contentRoot = path.join(process.cwd(), 'content', 'libraries')
    const watcher = chokidar.watch(contentRoot, { ignoreInitial: true, depth: 4 })
    const scheduleReload = (() => {
      let timer: NodeJS.Timeout | null = null
      return () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          g.__LIB_CACHE__ = loadLibraries()
          console.log('[libraries-cache] Cache + copied images refreshed.')
        }, 150)
      }
    })()
    watcher.on('add', scheduleReload)
    watcher.on('change', scheduleReload)
    watcher.on('unlink', scheduleReload)
    g.__LIB_WATCHER__ = watcher
    console.log('[libraries-cache] Dev watcher active.')
  }
})
