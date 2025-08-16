<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="library" class="space-y-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
        <span class="material-symbols-outlined text-gray-400" style="font-size:16px;">chevron_right</span>
        <NuxtLink to="/search" class="hover:text-blue-600">Libraries</NuxtLink>
        <span class="material-symbols-outlined text-gray-400" style="font-size:16px;">chevron_right</span>
        <span class="text-gray-900">{{ library.title }}</span>
      </nav>

      <!-- Library Header -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Hero Image / Carousel -->
        <div class="aspect-video relative overflow-hidden border border-gray-200 rounded-none group select-none"
          @mouseenter="isHovered = true" @mouseleave="isHovered = false" @focusin="isFocused = true"
          @focusout="isFocused = false">
          <template v-if="activeImage">
            <img :src="activeImage" alt="" aria-hidden="true"
              class="absolute inset-0 w-full h-full object-cover blur-xl scale-110 brightness-[0.45] contrast-110"
              decoding="async" loading="lazy" draggable="false" />
            <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/40" />
          </template>
          <div class="absolute inset-0 flex items-center justify-center p-2">
            <template v-if="activeImage">
              <img :src="activeImage" :alt="library.title"
                class="relative z-10 max-w-full max-h-full w-auto h-auto object-contain drop-shadow-xl shadow-black/40 rounded-md bg-white/40 backdrop-blur-sm p-1 transition-opacity"
                decoding="async" loading="lazy" draggable="false" />
            </template>
            <div v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span class="material-symbols-outlined text-gray-300" style="font-size:128px;">local_library</span>
            </div>
          </div>
          <div v-if="(library.images?.length || 0) > 1" class="absolute top-2 right-2 z-30 flex gap-2 !opacity-100">
            <button @click="prevImage"
              class="bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
              aria-label="Previous image">
              <span class="material-symbols-outlined" style="font-size:22px;">chevron_left</span>
            </button>
            <button @click="nextImage"
              class="bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
              aria-label="Next image">
              <span class="material-symbols-outlined" style="font-size:22px;">chevron_right</span>
            </button>
          </div>
          <div v-if="(library.images?.length || 0) > 1"
            class="absolute bottom-2 left-0 right-0 z-30 flex justify-center gap-1 px-4 !opacity-100">
            <button v-for="(img, idx) in library.images" :key="img" @click="goToImage(idx)"
              :aria-label="`Go to image ${idx + 1}`" class="w-2.5 h-2.5 rounded-full transition"
              :class="idx === currentImageIndex ? 'bg-white shadow ring-2 ring-white/60' : 'bg-white/40 hover:bg-white/70'" />
          </div>
        </div>

        <!-- Library Info -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ library.title }}</h1>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div v-if="library.location?.lat && library.location?.lng" class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-blue-500" style="font-size:16px;">location_on</span>
                    <a :href="`https://www.google.com/maps?q=${library.location.lat},${library.location.lng}`"
                      target="_blank" rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 hover:underline">
                      {{ library.location.lat.toFixed(4) }}, {{ library.location.lng.toFixed(4) }}
                    </a>
                  </div>
                  <div class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-green-500" style="font-size:16px;">extension</span>
                    <span>{{ library.entries_count || 0 }} entries</span>
                  </div>
                </div>
              </div>
              <div v-if="doc" class="prose library-content max-w-none">
                <ContentRenderer :value="doc" />
              </div>
              <div v-else-if="library.description" class="prose library-content max-w-none">
                <p class="text-gray-700 leading-relaxed">{{ library.description }}</p>
              </div>

              <!-- Logbook Section -->
              <div v-if="logbookEntries && logbookEntries.length > 0" class="mt-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Logbook</h2>
                <div class="space-y-6">
                  <div v-for="entry in logbookEntries" :key="entry._path" class="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ formatLogbookDate(entry.date) }}</h3>
                    <div class="prose library-content max-w-none">
                      <ContentRenderer :value="entry" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <div v-if="library.location" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="material-symbols-outlined mr-2 text-blue-500" style="font-size:20px;">map</span>
                  Location
                </h3>
                <a :href="`https://www.google.com/maps?q=${library.location.lat},${library.location.lng}`"
                  target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                  <span class="material-symbols-outlined" style="font-size:18px;">place</span>
                  Open in Google Maps
                </a>
                <div>{{ library.location.address || 'Unknown' }}</div>
                <div id="library-map" class="h-80 w-full rounded-lg bg-gray-100 mb-4" />
              </div>
              <div v-if="library.tags && library.tags.length > 0"
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="material-symbols-outlined mr-2 text-purple-500" style="font-size:20px;">label</span>
                  Tags
                </h3>
                <div class="flex flex-wrap gap-2">
                  <NuxtLink v-for="tag in library.tags" :key="tag" :to="`/search?tags=${encodeURIComponent(tag)}`"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>
              <div class="space-y-3">
                <NuxtLink :to="`/logbook/new?library=${library.slug}`"
                  class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
                  Add Log Entry
                </NuxtLink>
                <NuxtLink to="/search"
                  class="w-full border border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined" style="font-size:18px;">map</span>
                  Find Similar Libraries
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="pending" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span class="ml-2 text-gray-600">Loading library...</span>
    </div>
    <div v-else class="text-center py-16">
      <span class="material-symbols-outlined text-gray-400 mx-auto mb-4 block" style="font-size:64px;">map</span>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Library Not Found</h1>
      <p class="text-gray-600 mb-4">The library you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/search"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <span class="material-symbols-outlined mr-1" style="font-size:18px;">arrow_back</span>
        Back to Search
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Library Detail Page
 * 
 * Displays comprehensive information about a specific library including:
 * - Library metadata (title, location, tags, photos)
 * - Rich content from markdown files (description, history)
 * - Interactive image carousel
 * - Logbook entries
 * - Interactive map
 * 
 * Route pattern: /library/{library_id}/{slug?}
 * - library_id: Zero-padded 5-digit ID (e.g., "00050")
 * - slug: Optional canonical slug for SEO (e.g., "salsbury-garden-book-house")
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// === ROUTE PARAMETERS ===
const route = useRoute()
const rawId = (route.params.library_id as string) || ''
const slugParam = (route.params.slug as string) || ''
const paddedId = rawId.padStart(5, '0')

// === SLUG RESOLUTION ===
// Internal canonical slug resolution for SEO-friendly URLs
const resolvedSlug = ref(slugParam || '')
const canonicalSlug = ref<string | null>(null)

// === LIBRARY DATA LOADING ===
// Load all libraries first to find the specific library
const { data: librariesData } = await useLibraries()

/**
 * Find the library by ID or slug
 * Priority: slug match first, then library_id match
 */
const libraryMatch = computed(() => {
  const libraries = librariesData.value
  if (!libraries) return null
  
  let match = null
  
  // First, try to find by slug if provided
  if (slugParam) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match = libraries.find((lib: any) => lib.slug === slugParam)
  }
  
  // If not found by slug, try to find by library_id
  if (!match) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match = libraries.find((lib: any) => {
      const id = lib.library_id
      if (id == null) return false
      const n = Number(id)
      if (!Number.isNaN(n) && n === Number(paddedId)) return true
      return String(id).padStart(5, '0') === paddedId
    })
  }
  
  return match
})

// === CONTENT LOADING ===
// Declare queryContent for proper typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any

/**
 * Fetch the actual library content from markdown files
 * Uses the new flattened structure: content/libraries/{library_id}.md
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data: doc, pending } = await useAsyncData<any>(`library-full:${paddedId}:${slugParam}`, async () => {
  try {
    // NEW: Use simplified query for flattened structure
    // Load library content directly by library_id
    const content = await queryContent('/libraries').where({ library_id: paddedId }).findOne()
    if (content) {
      return content
    }
    
    // Fallback: Try with numeric library_id
    const numericId = Number(paddedId)
    if (!Number.isNaN(numericId)) {
      const contentByNumber = await queryContent('/libraries').where({ library_id: numericId }).findOne()
      if (contentByNumber) {
        return contentByNumber
      }
    }
  } catch (error) {
    console.warn('Could not fetch library content:', error)
  }
  
  // Final fallback: return minimal structure with library match data
  const match = libraryMatch.value
  if (!match) return null
  
  return {
    ...match,
    _path: `/libraries/${paddedId}`,
    body: {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'p',
          children: [
            {
              type: 'text',
              value: 'This is a neighborhood book exchange where community members can take a book and leave a book.'
            }
          ]
        }
      ]
    }
  }
}, {
  watch: [libraryMatch]
})

// === LIBRARY VIEW MODEL ===
/**
 * Build the comprehensive library view model that combines metadata with content
 * Handles image resolution, description extraction, and data transformation
 */
interface LibraryLocation { 
  lat: number
  lng: number
  address?: string 
}

interface LibraryViewModel {
  slug: string
  title: string
  location: LibraryLocation | null
  photo: string
  description: string
  tags: string[]
  entries_count: number
  fullContent: unknown
  images: string[]
  library_id?: string | number
}

const library = computed<LibraryViewModel | null>(() => {
  if (!doc.value) return null
  
  const body = doc.value.body
  
  // Extract description from content body (first meaningful paragraph)
  const description = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stack: any[] = body?.children ? [...body.children] : []
      while (stack.length) {
        const n = stack.shift()
        if (n.type === 'element' && n.tag === 'p') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const t = (n.children || []).map((c: any) => c.value || '').join(' ').trim()
          if (t) return t.substring(0, 200) + (t.length > 200 ? '…' : '')
        }
        if (n.children) stack.push(...n.children)
      }
    } catch { /* ignore */ }
    return ''
  })()
  
  // === IMAGE RESOLUTION ===
  /**
   * Resolve images using Vite's glob import for content images
   * This ensures images are properly bundled and accessible
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const contentImages: Record<string, string> = import.meta?.glob?.('~/content/libraries/**/*.{png,jpg,jpeg,webp,avif,gif}', { eager: true, as: 'url' }) || {}
  
  // Use the actual folder path for image resolution, not the canonical slug
  const folderPath = doc.value._path ? doc.value._path.replace(/^\//, '') : `libraries/${resolvedSlug.value}`
  const slugPathPrefix = `/${folderPath}/`
  
  /**
   * Resolve a single photo path to a full URL
   * Handles relative paths, absolute paths, and fallbacks
   */
  const resolvePhoto = (raw?: string) => {
    if (!raw) return '/images/libraries/placeholder-library.jpg'
    if (raw.startsWith('/') || /^https?:\/\//i.test(raw)) return raw
    
    const normalized = raw.replace(/^\.\//, '')
    
    // Try to find in content images first
    for (const [key, url] of Object.entries(contentImages)) {
      if (key.endsWith(`${slugPathPrefix}${normalized}`)) return url as string
      if (key.includes(slugPathPrefix) && key.endsWith(`/${normalized.split('/').pop()}`)) return url as string
    }
    
    // Fallback: construct path to public directory
    const filename = normalized.split('/').pop() || normalized
    const folderName = folderPath.split('/').pop() || resolvedSlug.value
    return `/library-images/${encodeURIComponent(folderName)}/${encodeURIComponent(filename)}`
  }
  
  // Resolve primary photo
  const primary = resolvePhoto(doc.value.photo)
  
  // Build gallery from defined images
  const gallerySet = new Set<string>()
  if (doc.value.images && Array.isArray(doc.value.images)) {
    for (const p of doc.value.images) { 
      const rp = resolvePhoto(p)
      if (rp) gallerySet.add(rp) 
    }
  }
  
  // Add any cached images if gallery is empty
  if (gallerySet.size === 0) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = (globalThis as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cached = g.__LIB_CACHE__?.find((c: any) => c.slug === resolvedSlug.value)
      if (cached && Array.isArray(cached.images)) {
        for (const img of cached.images) if (img && typeof img === 'string') gallerySet.add(img)
      }
    } catch { /* ignore */ }
  }
  
  // Remove primary from gallery to avoid duplication
  if (primary) gallerySet.delete(primary)
  
  // Final gallery: primary first, then additional images
  const gallery = [primary, ...Array.from(gallerySet)].filter(Boolean) as string[]
  
  // Resolve location with fallback to Vancouver center
  const loc: LibraryLocation | null = doc.value.location ? { 
    lat: doc.value.location.lat, 
    lng: doc.value.location.lng, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    address: (doc.value.location as any).address 
  } : { 
    lat: 49.2827, 
    lng: -123.1207 
  }
  
  return {
    slug: (canonicalSlug.value || resolvedSlug.value),
    title: doc.value.title || (canonicalSlug.value || resolvedSlug.value),
    location: loc,
    photo: primary || '/images/libraries/placeholder-library.jpg',
    description,
    tags: doc.value.tags || [],
    entries_count: 0,
    fullContent: doc.value.body,
    images: gallery,
    library_id: doc.value.library_id
  }
})

// === LOGBOOK DATA LOADING ===
/**
 * Fetch logbook entries for this library
 * NEW STRUCTURE: Logbook entries are stored in content/logbooks/{library_id}/*.md
 * Sorted by date in descending order (newest first)
 */
interface LogbookEntry {
  _path: string
  date: string
  title?: string
  body: unknown
}

// Separate async data fetch for logbook entries using NEW structure
const { data: logbookData } = await useAsyncData<LogbookEntry[]>(`logbook-${paddedId}`, async () => {
  try {
    // NEW: Use simplified query for reorganized logbook structure
    // Load logbook entries from content/logbooks/{library_id}/
    const logbookEntries = await queryContent(`/logbooks/${paddedId}`).where({ _extension: 'md' }).sort({ date: -1 }).find()
    return logbookEntries as LogbookEntry[]
  } catch (error) {
    console.warn('No logbook entries found for library', paddedId, ':', error)
    return []
  }
}, {
  watch: [paddedId]
})

// Compute logbook entries based on actual logbook files
const logbookEntries = computed<LogbookEntry[]>(() => {
  if (!library.value?.slug) return []
  
  // Use a separate async data fetch for logbook entries
  return logbookData.value || []
})

// === UTILITY FUNCTIONS ===
/**
 * Format date for logbook entries in a user-friendly format
 * Converts ISO date strings to YYYY-MMM-DD format
 */
const formatLogbookDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return dateStr // Fallback to original string if parsing fails
  }
}

// === CANONICAL URL REDIRECTION ===
/**
 * Redirect to canonical URL if slug is missing or mismatched
 * This ensures SEO-friendly URLs and handles legacy links
 */
watch(() => library.value, async (lib: LibraryViewModel | null) => {
  if (!lib) return
  
  // Permanent redirect to canonical slug if not already correct
  if (!slugParam || slugParam !== lib.slug) {
    const target = `/library/${paddedId}/${lib.slug}/`
    if (target !== route.fullPath) {
      await navigateTo(target, { redirectCode: 301, replace: true })
    }
  }
}, { immediate: true })

// === INTERACTIVE MAP FUNCTIONALITY ===
/**
 * Initialize and manage the Leaflet map for library location
 * Uses OpenStreetMap tiles and custom SVG marker
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = ref<any>(null)
const mapInitialized = ref(false)

/**
 * Initialize the Leaflet map with library location
 * Handles dynamic loading of Leaflet library and custom styling
 */
const initializeLibraryMap = async () => {
  if (mapInitialized.value) return
  if (typeof window === 'undefined') return
  if (!library.value?.location) return
  
  const el = document.getElementById('library-map')
  if (!el) return
  
  try {
    // Inject Leaflet CSS if not already present
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.setAttribute('data-leaflet', 'true')
      document.head.appendChild(link)
    }
    
    // Dynamic import of Leaflet library
    const L = await import('leaflet')
    
    // Custom SVG marker icon (avoids Leaflet asset bundling issues)
    const svgMarker = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%233b82f6' stroke='white' stroke-width='2' d='M12.5 0c-7 0-12.5 5.6-12.5 12.5 0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z'/%3E%3Ccircle cx='12.5' cy='12.5' r='5' fill='white'/%3E%3C/svg%3E"
    const transparentPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P1iJ6QAAAABJRU5ErkJggg=='
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inlineIcon = (L as any).icon({
      iconUrl: svgMarker,
      iconRetinaUrl: svgMarker,
      shadowUrl: transparentPng,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [1, 1]
    })
    
    // Create map instance centered on library location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstance = (L as any).map('library-map').setView([library.value.location.lat, library.value.location.lng], 15)
    
    // Add OpenStreetMap tile layer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(L as any).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      attribution: '© OpenStreetMap contributors' 
    }).addTo(mapInstance)
    
    // Add marker with popup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(L as any).marker([library.value.location.lat, library.value.location.lng], { icon: inlineIcon })
      .addTo(mapInstance)
      .bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold">${library.value.title}</h4>
          <p class="text-sm text-gray-600">${library.value.description}</p>
        </div>
      `)
    
    map.value = mapInstance
    mapInitialized.value = true
  } catch (error) {
    console.error('[LibraryPage] Failed to load map:', error)
  }
}

// Initialize map when component mounts and when location changes
onMounted(async () => { await nextTick(); await initializeLibraryMap() })
watch(() => library.value?.location, async (loc: LibraryLocation | null | undefined) => { 
  if (loc) { 
    await nextTick(); 
    await initializeLibraryMap() 
  } 
})
onUnmounted(() => { 
  if (map.value) { 
    map.value.remove(); 
    map.value = null 
  } 
})

// === IMAGE CAROUSEL FUNCTIONALITY ===
/**
 * Interactive image carousel with autoplay, keyboard navigation, and manual controls
 * Handles multiple images for each library with smooth transitions
 */
const currentImageIndex = ref(0)
const isHovered = ref(false)
const isFocused = ref(false)

// Currently displayed image
const activeImage = computed(() => {
  if (!library.value) return null
  if (library.value.images && library.value.images.length)
    return library.value.images[Math.min(currentImageIndex.value, library.value.images.length - 1)]
  return library.value?.photo
})

// Navigation functions
const advance = () => { 
  if (library.value?.images && library.value.images.length > 1) 
    currentImageIndex.value = (currentImageIndex.value + 1) % library.value.images.length 
}
const nextImage = advance
const prevImage = () => { 
  if (library.value?.images && library.value.images.length > 1) 
    currentImageIndex.value = (currentImageIndex.value - 1 + library.value.images.length) % library.value.images.length 
}
const goToImage = (idx: number) => { 
  if (library.value?.images && idx >= 0 && idx < library.value.images.length) 
    currentImageIndex.value = idx 
}

// === AUTOPLAY FUNCTIONALITY ===
/**
 * Automatic image progression with pause on hover/focus
 * Respects user interaction and accessibility needs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let autoplayTimer: any = null
const AUTOPLAY_INTERVAL = 6000

const clearAutoplay = () => { 
  if (autoplayTimer) { 
    clearInterval(autoplayTimer); 
    autoplayTimer = null 
  } 
}

const startAutoplay = () => { 
  clearAutoplay(); 
  if (library.value?.images && library.value.images.length > 1) 
    autoplayTimer = setInterval(() => { 
      if (!isHovered.value && !isFocused.value) advance() 
    }, AUTOPLAY_INTERVAL) 
}

// Start autoplay when images are available
watch(() => library.value?.images?.length, () => startAutoplay())
onMounted(() => startAutoplay())
onUnmounted(() => clearAutoplay())

// === KEYBOARD NAVIGATION ===
/**
 * Add keyboard navigation support for accessibility
 * Arrow keys control image navigation
 */
if (typeof window !== 'undefined') {
  const keyHandler = (e: KeyboardEvent) => {
    if (!library.value?.images || library.value.images.length < 2) return
    if (e.key === 'ArrowRight') { nextImage(); e.preventDefault() }
    else if (e.key === 'ArrowLeft') { prevImage(); e.preventDefault() }
  }
  window.addEventListener('keydown', keyHandler)
  onUnmounted(() => window.removeEventListener('keydown', keyHandler))
}

// === SEO AND META CONFIGURATION ===
/**
 * Configure page metadata for SEO and social media sharing
 * Includes Open Graph tags and canonical URLs
 */
useHead({
  title: computed(() => library.value ? `${library.value.title} - Neighbourhood book exchanges` : 'Library - Neighbourhood book exchanges'),
  meta: [
    { name: 'description', content: library.value?.description || 'Library details page' },
    { property: 'og:url', content: `https://neighbourhood-book-exchanges.com/library/${paddedId}/${library.value?.slug || ''}/` }
  ],
  link: [
    { rel: 'canonical', href: `https://neighbourhood-book-exchanges.com/library/${paddedId}/${library.value?.slug || ''}/` }
  ]
})
</script>

<style>
/* === COMPONENT STYLES === */
/* Import Leaflet CSS for map functionality */
@import 'leaflet/dist/leaflet.css';

/* 
 * Library content styling for markdown rendering
 * Provides consistent typography and spacing for content sections
 */
.library-content :deep(h2) { font-size: 1.75rem; font-weight: 700; color: #111827; margin-top: 2.25rem; margin-bottom: 0.85rem; line-height: 1.25; }
.library-content :deep(h3) { font-size: 1.5rem; font-weight: 600; color: #111827; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
.library-content :deep(h4) { font-size: 1.25rem; font-weight: 600; color: #111827; margin-top: 1.75rem; margin-bottom: 0.6rem; line-height: 1.35; }
.library-content :deep(h5) { font-size: 1.125rem; font-weight: 600; color: #111827; margin-top: 1.5rem; margin-bottom: 0.5rem; line-height: 1.4; }
.library-content :deep(h6) { font-size: 1rem; font-weight: 600; color: #111827; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.45; }
.library-content :deep(p) { color: #374151; margin-bottom: 1rem; line-height: 1.625; }
.library-content :deep(ul) { list-style-type: disc; list-style-position: inside; margin-bottom: 1rem; }
.library-content :deep(ul li) { color: #374151; margin-bottom: 0.25rem; }
.library-content :deep(strong) { font-weight: 600; color: #111827; }
.library-content :deep(em) { font-style: italic; }
.library-content :deep(blockquote) { border-left: 4px solid #dbeafe; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 1rem 0; }

/* 
 * Enhanced prose styling for logbook entries and rich content
 * Overrides default prose margins for better visual hierarchy
 */
.prose.library-content :where(h2):not(:where(.not-prose *)) { font-size: 1.75rem !important; line-height: 1.25 !important; margin-top: 2.25rem !important; margin-bottom: 0.85rem !important; }
.prose.library-content :where(h2:first-child):not(:where(.not-prose *)) { margin-top: 2.25rem !important; }
.prose.library-content :where(h3):not(:where(.not-prose *)) { margin-top: 2rem !important; margin-bottom: 0.75rem !important; }
.prose.library-content :where(h3:first-child):not(:where(.not-prose *)) { margin-top: 2rem !important; }
.prose.library-content :where(h4):not(:where(.not-prose *)) { margin-top: 1.75rem !important; margin-bottom: 0.6rem !important; }
.prose.library-content :where(h4:first-child):not(:where(.not-prose *)) { margin-top: 1.75rem !important; }
.prose.library-content :where(h5):not(:where(.not-prose *)) { margin-top: 1.5rem !important; margin-bottom: 0.5rem !important; }
.prose.library-content :where(h5:first-child):not(:where(.not-prose *)) { margin-top: 1.5rem !important; }
.prose.library-content :where(h6):not(:where(.not-prose *)) { margin-top: 1.25rem !important; margin-bottom: 0.5rem !important; }
.prose.library-content :where(h6:first-child):not(:where(.not-prose *)) { margin-top: 1.25rem !important; }
</style>
