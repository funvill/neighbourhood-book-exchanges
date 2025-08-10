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

                <!-- Meta Information -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div v-if="library.location?.lat && library.location?.lng" class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-blue-500"
                      style="font-size:16px;">location_on</span>
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
                  <!--
                  <div class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-purple-500" style="font-size:16px;">calendar_month</span>
                    <span>Est. {{ library.established ? new Date(library.established).getFullYear() : 'Unknown' }}</span>
                  </div>
                  -->
                </div>

              </div>

              <!-- Content Body -->
              <div v-if="doc" class="prose library-content max-w-none">
                <ContentRenderer :value="doc" />
              </div>
              <div v-else-if="library.description" class="prose library-content max-w-none">
                <p class="text-gray-700 leading-relaxed">{{ library.description }}</p>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">

              <!-- Map -->
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




              <!-- Tags -->
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

              <!-- Quick Stats -->
              <!--
              <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Entries</span>
                    <span class="font-semibold">{{ library.entries_count || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Established</span>
                    <span class="font-semibold">{{ library.established ? new Date(library.established).getFullYear() : 'Unknown' }}</span>
                  </div>
                </div>
              </div>
              -->
              <!-- Actions -->
              <div class="space-y-3">
                <NuxtLink :to="`/logbook/new?library=${librarySlug}`"
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

    <!-- Loading State -->
    <div v-else-if="pending" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span class="ml-2 text-gray-600">Loading library...</span>
    </div>

    <!-- Not Found -->
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
// Define types
interface LibraryLocation {
  lat: number
  lng: number
  address?: string
}

interface Library {
  slug: string
  title: string
  description: string
  fullContent?: any
  location: LibraryLocation
  photo: string
  tags?: string[]
  entries_count?: number
  established?: string | number
  images?: string[]
}

// vue import (Nuxt supplies types; suppress if tsconfig module settings differ)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
// Nuxt auto-imports useRoute, useHead, queryContent, useAsyncData at runtime.
// Provide minimal TS fallbacks (ignored if types present).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useAsyncData<T>(key: string, handler: () => Promise<T>): { data: { value: T | null }; pending: any }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useHead(input: any): void
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useRoute(): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function $fetch<T = any>(url: string): Promise<T>

const route = useRoute()
const routeParam = route.params.id as string

// Parse URL parameter to handle both new ID-slug format and legacy slug-only format
const { parseLibraryUrl, isLegacyUrlFormat, extractSlug } = await import('~/utils/libraryUrl')
const urlParts = parseLibraryUrl(routeParam)

// Determine the actual slug to use for content lookup
const librarySlug = urlParts?.slug || extractSlug(routeParam)
const libraryId = urlParts?.library_id

// If this is a legacy URL (slug-only), we need to redirect to canonical form
const shouldRedirect = isLegacyUrlFormat(routeParam)

const { data: doc, pending } = useAsyncData<any>(`library:${librarySlug}`, async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qc: any = (typeof queryContent === 'function') ? queryContent : null
  let d = qc ? await qc(`/libraries/${librarySlug}`).findOne() : null
  // If we have a content document, enrich it with gallery images from server cache (SSR serialization makes them available on client)
  if (d) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = globalThis as any
      if (!d.images && g.__LIB_CACHE__) {
        const cached = g.__LIB_CACHE__.find((c: any) => c.slug === librarySlug)
        if (cached?.images?.length) {
          d.images = cached.images
        }
      }
    } catch { /* ignore enrichment errors */ }
  }
  if (!d) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any
    if (g.__LIB_CACHE__) {
      const cached = g.__LIB_CACHE__.find((c: any) => c.slug === librarySlug)
      if (cached) {
        if (!g.__LIBRARY_DETAIL_CACHE_LOGGED__) {
          console.log('[library page] Using global cache for detail page (one-time notice).')
          g.__LIBRARY_DETAIL_CACHE_LOGGED__ = true
        }
        d = {
          _path: cached._path,
          title: cached.title,
          location: cached.location,
          photo: cached.photo,
          tags: cached.tags,
          established: cached.established,
          images: cached.images,
          body: { type: 'root', children: [{ type: 'element', tag: 'p', children: [{ type: 'text', value: cached.description }] }] }
        }
      }
    }
  }
  if (!d) {
    // Final API fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any
    if (!g.__LIBRARY_DETAIL_API_FALLBACK_LOGGED__) {
      console.log('[library page] Falling back to /api/libraries/:slug (one-time notice).')
      g.__LIBRARY_DETAIL_API_FALLBACK_LOGGED__ = true
    }
    try {
      const api = await $fetch(`/api/libraries/${librarySlug}`)
      if (api && api.body) {
        d = {
          _path: `/libraries/${librarySlug}`,
          title: api.title || librarySlug,
          location: api.location,
          photo: api.photo,
          tags: api.tags,
          established: api.established,
          body: { type: 'root', children: api.body.split(/\n\n+/).map((p: string) => ({ type: 'element', tag: 'p', children: [{ type: 'text', value: p }] })) }
        }
      }
    } catch (e) {
      console.error('[library page] API fallback failed', e)
    }
  }
  if (!d) console.warn('[library page] No content found after fallbacks for', librarySlug)
  return d
})

const library = computed(() => {
  if (!doc.value) return null
  const body = doc.value.body
  const description = (() => {
    try {
      const stack: any[] = body?.children ? [...body.children] : []
      while (stack.length) {
        const n = stack.shift()
        if (n.type === 'element' && n.tag === 'p') {
          const t = (n.children || []).map((c: any) => c.value || '').join(' ').trim()
          if (t) return t.substring(0, 200) + (t.length > 200 ? '…' : '')
        }
        if (n.children) stack.push(...n.children)
      }
    } catch { /* ignore */ }
    return ''
  })()
  // Resolve photo (supports relative paths like `logbook/xyz.png`)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const contentImages: Record<string, string> = import.meta?.glob?.('~/content/libraries/**/*.{png,jpg,jpeg,webp,avif,gif}', { eager: true, as: 'url' }) || {}
  const resolvePhoto = (raw?: string) => {
    if (!raw) return '/images/libraries/placeholder-library.jpg'
    if (raw.startsWith('/') || /^https?:\/\//i.test(raw)) return raw
    const slugPathPrefix = `/libraries/${librarySlug}/`
    const normalized = raw.replace(/^\.\//, '')
    const entries = Object.entries(contentImages)
    for (const [key, url] of entries) {
      if (key.endsWith(`${slugPathPrefix}${normalized}`)) return url as string
      if (key.includes(slugPathPrefix) && key.endsWith(`/${normalized.split('/').pop()}`)) return url as string
    }
    const filename = normalized.split('/').pop() || normalized
    return `/library-images/${encodeURIComponent(librarySlug)}/${encodeURIComponent(filename)}`
  }

  const primary = resolvePhoto(doc.value.photo)
  const gallerySet = new Set<string>()
  if (doc.value.images && Array.isArray(doc.value.images)) {
    for (const p of doc.value.images) { const rp = resolvePhoto(p); if (rp) gallerySet.add(rp) }
  }
  // If no additional images came from the content document, try global cache (server side) for gallery images
  if (gallerySet.size === 0) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = (globalThis as any)
      const cached = g.__LIB_CACHE__?.find((c: any) => c.slug === librarySlug)
      if (cached && Array.isArray(cached.images)) {
        for (const img of cached.images) {
          if (img && typeof img === 'string') gallerySet.add(img)
        }
      }
    } catch { /* ignore */ }
  }
  if (primary) gallerySet.delete(primary)
  const gallery = [primary, ...Array.from(gallerySet)].filter(Boolean) as string[]
  return {
    slug: librarySlug,
    title: doc.value.title || librarySlug,
    location: doc.value.location || { lat: 49.2827, lng: -123.1207 },
    photo: primary || '/images/libraries/placeholder-library.jpg',
    description,
    tags: doc.value.tags || [],
    entries_count: 0,
    fullContent: doc.value.body,
    established: doc.value.established,
    images: gallery,
    library_id: doc.value.library_id
  }
})

// Handle redirect for legacy URLs
watch([library, doc], async ([newLibrary, newDoc]) => {
  if (newLibrary && newDoc && shouldRedirect) {
    const docLibraryId = newDoc.library_id
    if (docLibraryId) {
      const { libraryUrl } = await import('~/utils/libraryUrl')
      const canonicalUrl = libraryUrl({ 
        library_id: docLibraryId, 
        slug: librarySlug 
      })
      // Use navigateTo for client-side redirect with 301 status
      await navigateTo(canonicalUrl, { redirectCode: 301 })
    }
  }
}, { immediate: true })

const libraryContent = computed(() => doc.value?.body || null)
const map = ref<any>(null)

// Carousel state
const currentImageIndex = ref(0)
const isHovered = ref(false)
const isFocused = ref(false)
const activeImage = computed(() => {
  if (!library.value) return null
  if (library.value.images && library.value.images.length)
    return library.value.images[Math.min(currentImageIndex.value, library.value.images.length - 1)]
  return library.value?.photo
})
const advance = () => {
  if (!library.value?.images || library.value.images.length < 2) return
  currentImageIndex.value = (currentImageIndex.value + 1) % library.value.images.length
}
const nextImage = advance
const prevImage = () => {
  if (!library.value?.images || library.value.images.length < 2) return
  currentImageIndex.value = (currentImageIndex.value - 1 + library.value.images.length) % library.value.images.length
}
const goToImage = (idx: number) => {
  if (!library.value?.images) return
  if (idx >= 0 && idx < library.value.images.length) currentImageIndex.value = idx
}

// Autoplay (pause on hover or focus for accessibility)
let autoplayTimer: any = null
const AUTOPLAY_INTERVAL = 6000
const clearAutoplay = () => { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null } }
const startAutoplay = () => {
  clearAutoplay()
  if (!library.value?.images || library.value.images.length < 2) return
  autoplayTimer = setInterval(() => { if (!isHovered.value && !isFocused.value) advance() }, AUTOPLAY_INTERVAL)
}
watch(() => library.value?.images?.length, () => startAutoplay())
onMounted(() => startAutoplay())
onUnmounted(() => clearAutoplay())

// Keyboard navigation
let keyHandler: ((e: KeyboardEvent) => void) | null = null
if (typeof window !== 'undefined') {
  keyHandler = (e: KeyboardEvent) => {
    if (!library.value?.images || library.value.images.length < 2) return
    if (e.key === 'ArrowRight') { nextImage(); e.preventDefault() }
    else if (e.key === 'ArrowLeft') { prevImage(); e.preventDefault() }
  }
  window.addEventListener('keydown', keyHandler)
  onUnmounted(() => { if (keyHandler) window.removeEventListener('keydown', keyHandler) })
}

const initializeLibraryMap = async () => {
  if (typeof window !== 'undefined' && library.value?.location) {
    try {
      // Load Leaflet CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      // Dynamically import Leaflet
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore dynamic import for leaflet (bundled by Nuxt)
      const L = await import('leaflet')

      // Initialize map
      const mapInstance = L.map('library-map').setView([library.value.location.lat, library.value.location.lng], 15)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance)

      // Add marker for this library
      L.marker([library.value.location.lat, library.value.location.lng])
        .addTo(mapInstance)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold">${library.value.title}</h4>
            <p class="text-sm text-gray-600">${library.value.description}</p>
          </div>
        `)
      // Remove .openPopup() to not show popup by default

      map.value = mapInstance
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  }
}

// Load data on mount
onMounted(async () => {
  if (library.value?.location) {
    await nextTick()
    await initializeLibraryMap()
  }
})

// Cleanup map on unmount
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

// Watch for library data changes
watch(library, async (newLibrary: Library | null) => {
  if (newLibrary?.location && !map.value) {
    await nextTick()
    await initializeLibraryMap()
  }
}, { deep: true })

// Set page meta
useHead({
  title: computed(() => library.value ? `${library.value.title} - Neighbourhood book exchanges` : 'Library - Neighbourhood book exchanges'),
  meta: [
    {
      name: 'description',
      content: computed(() => library.value ? library.value.description : 'Library details page')
    },
    {
      property: 'og:url',
      content: computed(() => {
        if (library.value?.library_id) {
          const { libraryUrl } = require('~/utils/libraryUrl')
          return `https://neighbourhood-book-exchanges.com${libraryUrl(library.value)}`
        }
        return `https://neighbourhood-book-exchanges.com/library/${librarySlug}`
      })
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => {
        if (library.value?.library_id) {
          const { libraryUrl } = require('~/utils/libraryUrl')
          return `https://neighbourhood-book-exchanges.com${libraryUrl(library.value)}`
        }
        return `https://neighbourhood-book-exchanges.com/library/${librarySlug}`
      })
    }
  ]
})

// formatMarkdownContent no longer needed; ContentRenderer handles rendering
</script>

<style>
@import 'leaflet/dist/leaflet.css';

.library-content :deep(h2) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2.25rem;
  margin-bottom: 0.85rem;
  line-height: 1.25;
}

.library-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.library-content :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.75rem;
  margin-bottom: 0.6rem;
  line-height: 1.35;
}

.library-content :deep(h5) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.library-content :deep(h6) {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.45;
}

.library-content :deep(p) {
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.625;
}

.library-content :deep(ul) {
  list-style-type: disc;
  list-style-position: inside;
  margin-bottom: 1rem;
}

.library-content :deep(ul li) {
  color: #374151;
  margin-bottom: 0.25rem;
}

.library-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.library-content :deep(em) {
  font-style: italic;
}

.library-content :deep(blockquote) {
  border-left: 4px solid #dbeafe;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
  margin: 1rem 0;
}

/* Override Tailwind Typography's default .prose heading spacing & size (no @layer to avoid build error)
  Tailwind Typography zeroes the top margin for the first heading and applies its own rhythm.
  We re-assert our custom margins & sizing with higher specificity + !important where needed. */
.prose.library-content :where(h2):not(:where(.not-prose *)) {
  font-size: 1.75rem !important;
  line-height: 1.25 !important;
  margin-top: 2.25rem !important;
  margin-bottom: 0.85rem !important;
}

/* Ensure first-child h2 also receives spacing (Typography sets it to 0) */
.prose.library-content :where(h2:first-child):not(:where(.not-prose *)) {
  margin-top: 2.25rem !important;
}

/* Apply similar enforcement for h3–h6 so first-child cases retain spacing */
.prose.library-content :where(h3):not(:where(.not-prose *)) {
  margin-top: 2rem !important;
  margin-bottom: 0.75rem !important;
}

.prose.library-content :where(h3:first-child):not(:where(.not-prose *)) {
  margin-top: 2rem !important;
}

.prose.library-content :where(h4):not(:where(.not-prose *)) {
  margin-top: 1.75rem !important;
  margin-bottom: 0.6rem !important;
}

.prose.library-content :where(h4:first-child):not(:where(.not-prose *)) {
  margin-top: 1.75rem !important;
}

.prose.library-content :where(h5):not(:where(.not-prose *)) {
  margin-top: 1.5rem !important;
  margin-bottom: 0.5rem !important;
}

.prose.library-content :where(h5:first-child):not(:where(.not-prose *)) {
  margin-top: 1.5rem !important;
}

.prose.library-content :where(h6):not(:where(.not-prose *)) {
  margin-top: 1.25rem !important;
  margin-bottom: 0.5rem !important;
}

.prose.library-content :where(h6:first-child):not(:where(.not-prose *)) {
  margin-top: 1.25rem !important;
}
</style>