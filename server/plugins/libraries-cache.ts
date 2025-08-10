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
  established?: string | number
  description: string
  _path: string
  images?: string[]
}

function buildDescription(content: string): string {
  const first = content.split(/\n+/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))[0] || ''
  return first.length > 200 ? first.slice(0, 200) + '…' : first
}

function ensureCopiedPhoto(slug: string, rawPhoto?: string): string | undefined {
  if (!rawPhoto) return undefined
  if (rawPhoto.startsWith('/') || /^https?:\/\//i.test(rawPhoto)) return rawPhoto
  // Treat as relative inside the library folder (e.g. logbook/20250809-190601.png)
  const contentDir = path.join(process.cwd(), 'content', 'libraries', slug)
  const sourcePath = path.join(contentDir, rawPhoto)
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) return undefined
  const targetDir = path.join(process.cwd(), 'public', 'library-images', slug)
  const fileName = path.basename(sourcePath)
  const targetPath = path.join(targetDir, fileName)
  try {
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    let shouldCopy = true
    if (fs.existsSync(targetPath)) {
      const srcStat = fs.statSync(sourcePath)
      const dstStat = fs.statSync(targetPath)
      if (srcStat.size === dstStat.size && srcStat.mtimeMs <= dstStat.mtimeMs) shouldCopy = false
    }
    if (shouldCopy) fs.copyFileSync(sourcePath, targetPath)
    return `/library-images/${slug}/${fileName}`
  } catch {
    return undefined
  }
}

function copyAllImages(slug: string): string[] {
  const libRoot = path.join(process.cwd(), 'content', 'libraries', slug)
  if (!fs.existsSync(libRoot)) return []
  const targetDir = path.join(process.cwd(), 'public', 'library-images', slug)
  const exts = new Set(['.png','.jpg','.jpeg','.webp','.gif','.avif'])
  const collected: string[] = []
  const recurse = (dir: string) => {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        recurse(full)
      } else {
        const ext = path.extname(entry).toLowerCase()
        if (exts.has(ext)) {
          const filename = entry
          if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
            const target = path.join(targetDir, filename)
            let shouldCopy = true
            if (fs.existsSync(target)) {
              const dst = fs.statSync(target)
              if (dst.size === stat.size && dst.mtimeMs >= stat.mtimeMs) shouldCopy = false
            }
            if (shouldCopy) {
              fs.copyFileSync(full, target)
            }
            const publicPath = `/library-images/${slug}/${filename}`
            if (!collected.includes(publicPath)) collected.push(publicPath)
        }
      }
    }
  }
  recurse(libRoot)
  return collected
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
      const copied = ensureCopiedPhoto(slug, data.photo)
      // Copy all images and build gallery list
      const gallery = copyAllImages(slug) || []
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
        title: data.title || slug,
        location: data.location,
        photo: copied || data.photo || '/images/libraries/placeholder-library.jpg',
        tags: data.tags || [],
        established: data.established,
        description: buildDescription(content),
        _path: `/libraries/${slug}`,
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
