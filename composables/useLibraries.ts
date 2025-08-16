import { slugifyTitle } from '../utils/slugify.js'
// Runtime imports (avoid TS path alias issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useAsyncData<T>(key: string, handler: () => Promise<T> | T): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function refreshNuxtData(key?: string): Promise<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function $fetch<T=any>(url: string): Promise<T>

export interface LibraryFrontmatter {
  title?: string
  location?: { lat: number; lng: number; address?: string }
  photo?: string
  tags?: string[]
  library_id?: string | number
}

export interface LibrarySummary {
  slug: string
  title: string
  location?: { lat: number; lng: number; address?: string }
  photo: string
  tags: string[]
  description: string
  _path: string
  library_id?: string | number
}



export function buildDescription(body?: any): string {
  if (!body) return ''
  try {
    const stack: any[] = Array.isArray(body.children) ? [...body.children] : []
    while (stack.length) {
      const node = stack.shift()
      if (node.type === 'element' && node.tag === 'p') {
        const text = (node.children || []).map((c: any) => c.value || '').join(' ').trim()
        if (text) return text.substring(0, 200) + (text.length > 200 ? '…' : '')
      }
      if (node.children) stack.push(...node.children)
    }
  } catch {
    return ''
  }
  return ''
}

// Client-side image map for all images stored within content/libraries/**
// This lets us turn relative frontmatter values like "logbook/20250809-190601.png"
// into fully-qualified asset URLs that Vite/Nuxt can serve.
// Note: When running in a pure server context (e.g., Nitro node env) this block
// will be tree-shaken / ignored because import.meta.glob is a build-time feature.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite injects the typing
const __LIB_CONTENT_IMAGES__: Record<string, string> = import.meta?.glob?.(
  '~/content/libraries/**/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true, as: 'url' }
// Fallback empty object if glob unsupported
) || {}

function resolvePhoto(slug: string, raw?: string): string {
  if (!raw) return '/images/libraries/placeholder-library.jpg'
  // Already absolute or remote
  if (raw.startsWith('/') || /^https?:\/\//i.test(raw)) return raw
  // Attempt to find matching image inside the content tree
  const normalized = raw.replace(/^\.\//, '')
  // Candidate endings we will search for
  const candidates = [
    `/libraries/${slug}/${normalized}`,
    // Sometimes the slug may already appear in the raw path (defensive)
    normalized
  ]
  const entries = Object.entries(__LIB_CONTENT_IMAGES__)
  for (const [key, url] of entries) {
    if (candidates.some(c => key.endsWith(c))) return url as string
    // Also allow endsWith just the filename if unique within slug folder
    if (key.includes(`/libraries/${slug}/`) && key.endsWith(`/${normalized.split('/').pop()}`)) return url as string
  }
  // Fallback: assume server plugin copied the file to /public/library-images/<slug>/
  const filename = normalized.split('/').pop() || normalized
  return `/library-images/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`
}

export function mapContentDocToSummary(doc: any): LibrarySummary {
  const fm: LibraryFrontmatter = doc || {}
  
  // NEW: For flattened structure, extract library_id from filename
  // Files are now named like "00001.md" instead of being in folders
  const libraryId = fm.library_id || doc.library_id
  const titleSlug = fm.title ? slugifyTitle(fm.title) : ''
  
  // Use library_id as the primary slug, with title-derived slug as fallback
  const slug = titleSlug || String(libraryId)
  const rawPhoto = fm.photo || '/images/libraries/placeholder-library.jpg'
  
  return {
    slug,
    title: fm.title || `Library ${libraryId}`,
    location: fm.location,
    // NEW: Use library_id for image resolution instead of folder slug
    photo: resolvePhoto(String(libraryId), rawPhoto),
    tags: fm.tags || [],
    description: buildDescription(doc.body),
    _path: doc._path,
    library_id: libraryId
  }
}

export function useLibraries() {
  return useAsyncData<LibrarySummary[]>('libraries', async () => {
    // If queryContent not injected (undefined), force immediate fallback.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qc: any = (typeof queryContent === 'function') ? queryContent : null
    let docs = qc ? await qc('/libraries').find() : null
    if (!docs || docs.length === 0) {
      const alt = qc ? await qc('libraries').find() : null
      if (alt?.length) docs = alt
    }
    if (!docs || docs.length === 0) {
      const all = qc ? await qc().find() : []
      docs = (all || []).filter((d: any) => d._path?.startsWith('/libraries/'))
    }
    
    // Filter out logbook files - only include main library index.md files
    if (docs && Array.isArray(docs)) {
      docs = docs.filter((d: any) => {
        if (!d._path) return false
        // Include only files that end with library directory path (index.md files)
        // Exclude logbook files like /libraries/{name}/logbook/{date}.md
        return d._path.startsWith('/libraries/') && !d._path.includes('/logbook/')
      })
    }
    const count = docs?.length || 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any
    if (count === 0) {
      if (!g.__LIBRARY_QUERY_EMPTY_LOGGED__) {
        console.log('[useLibraries] Content query returned 0 docs. Scheduling retry and proceeding to fallbacks.')
        g.__LIBRARY_QUERY_EMPTY_LOGGED__ = true
      }
      // Schedule retry in case indexing is still in progress
      if (typeof window !== 'undefined' && !g.__LIBRARY_REFRESH_SCHEDULED__) {
        g.__LIBRARY_REFRESH_SCHEDULED__ = true
        setTimeout(() => { 
          console.log('[useLibraries] Attempting scheduled retry...')
          refreshNuxtData('libraries') 
        }, 1000)
      }
      // Try global cache first before API fallback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (g.__LIB_CACHE__ && g.__LIB_CACHE__.length > 0) {
        if (!g.__LIBRARY_CACHE_FALLBACK_LOGGED__) {
          console.log('[useLibraries] Using global cache as fallback (one-time notice).')
          g.__LIBRARY_CACHE_FALLBACK_LOGGED__ = true
        }
        return g.__LIB_CACHE__.map((d: any) => ({
          slug: d.slug,
          title: d.title,
          location: d.location,
          photo: d.photo,
          tags: d.tags || [],
          description: d.description,
            _path: `/libraries/${d.slug}`,
            library_id: d.library_id
        })) as LibrarySummary[]
      }
      // Final fallback: use /api/libraries (filesystem) immediately
      try {
        const apiData = await $fetch('/api/libraries')
        if (Array.isArray(apiData) && apiData.length) {
          if (!g.__LIBRARY_FS_FALLBACK_LOGGED__) {
            console.log('[useLibraries] Using /api/libraries filesystem fallback (one-time notice).')
            g.__LIBRARY_FS_FALLBACK_LOGGED__ = true
          }
          return apiData.map((d: any) => ({
            slug: d.slug,
            title: d.title,
            location: d.location,
            photo: d.photo,
            tags: d.tags || [],
            description: d.description,
            _path: `/libraries/${d.slug}`,
            library_id: d.library_id
          })) as LibrarySummary[]
        }
      } catch (e) {
        if (!g.__LIBRARY_FS_FALLBACK_ERROR_LOGGED__) {
          console.error('[useLibraries] FS fallback /api/libraries failed', e)
          g.__LIBRARY_FS_FALLBACK_ERROR_LOGGED__ = true
        }
      }
    } else if (!g.__LIBRARY_QUERY_COUNT_LOGGED__) {
      console.log(`[useLibraries] ✓ Successfully loaded ${count} library docs from content.`)
      g.__LIBRARY_QUERY_COUNT_LOGGED__ = true
    }
    return (docs || []).map(mapContentDocToSummary)
  })
}

export function useLibrary(libraryId: string) {
  return useAsyncData<any>(`library:${libraryId}`, () => 
    queryContent('/libraries').where({ library_id: libraryId }).findOne()
  )
}
