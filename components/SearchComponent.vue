<template>
  <div class="space-y-6">
    <!-- Advanced Search Filters -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Main Search Section -->
      <div class="p-6 pb-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span class="material-symbols-outlined mr-2">search</span>
          Search Libraries
        </h2>
        <p class="text-gray-600 mb-4">Search across library titles, descriptions, and tags to find what you're looking for.</p>
        
        <!-- Advanced Search Toggle -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="showAdvancedSearch = !showAdvancedSearch"
            class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
          >
            <span class="material-symbols-outlined" style="font-size:18px;">
              {{ showAdvancedSearch ? 'expand_less' : 'expand_more' }}
            </span>
            Advanced Filters
          </button>
          
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <label class="flex items-center gap-1 cursor-pointer">
              <input 
                v-model="groupMarkers" 
                type="checkbox" 
                class="rounded border-gray-300"
                @change="updateMapMarkers"
              />
              Group nearby markers
            </label>
          </div>
        </div>
      </div>

      <!-- Advanced Search Area -->
      <div v-if="showAdvancedSearch" class="px-6 pb-6 border-t border-gray-100">
        <div class="pt-4 space-y-4">
          <!-- Sort Options -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select 
              v-model="sortBy" 
              @change="performSearch"
              class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="updated">Last Updated</option>
              <option value="title">Title (A-Z)</option>
              <option value="library_id">Library ID</option>
            </select>
          </div>

          <!-- Tag Filters -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
            <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ tag }}
                <span v-if="selectedTags.includes(tag)" class="ml-1">×</span>
              </button>
            </div>
            <div v-if="selectedTags.length > 0" class="mt-2">
              <button
                @click="clearAllTags"
                class="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all tags
              </button>
            </div>
          </div>

          <!-- Search Button for Advanced Search -->
          <div class="pt-2">
            <button
              @click="performSearch"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <span class="material-symbols-outlined" style="font-size:18px;">search</span>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <span class="material-symbols-outlined mr-2">map</span>
          Interactive Map
        </h3>
        <button
          @click="toggleFullScreen"
          class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
        >
          <span class="material-symbols-outlined" style="font-size:18px;">
            {{ isFullScreen ? 'fullscreen_exit' : 'fullscreen' }}
          </span>
          {{ isFullScreen ? 'Exit' : 'Full Screen' }}
        </button>
      </div>
      <div 
        :class="[
          'transition-all duration-300',
          isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'h-96 w-full'
        ]"
      >
        <div v-if="isFullScreen" class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Library Map - Full Screen</h3>
          <button
            @click="toggleFullScreen"
            class="text-gray-600 hover:text-gray-800"
          >
            <span class="material-symbols-outlined" style="font-size:24px;">close</span>
          </button>
        </div>
        <div :id="mapId" :class="isFullScreen ? 'h-full' : 'h-full w-full'"></div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="searchResults.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ searchResults.length }} Libraries Found
        </h3>
        <div class="text-sm text-gray-600">
          {{ selectedTags.length > 0 ? `Filtered by: ${selectedTags.join(', ')}` : 'Showing all results' }}
        </div>
      </div>
      
      <!-- Library Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LibraryCard
          v-for="library in paginatedResults"
          :key="library.id"
          :library="library"
          class="hover:shadow-lg transition-shadow"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <span v-for="page in visiblePages" :key="page" class="inline-block">
          <button
            v-if="page !== '...'"
            @click="typeof page === 'number' && (currentPage = page)"
            :class="[
              'px-3 py-2 rounded-md',
              currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-2 text-gray-500">...</span>
        </span>
        
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="hasSearched" class="text-center py-12">
      <span class="material-symbols-outlined text-gray-400 mx-auto mb-4 block" style="font-size:64px;">search_off</span>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No libraries found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your search criteria or browse all libraries.</p>
      <button 
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        @click="resetSearch"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { libraryUrl } from '~/utils/libraryUrl'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useLibraries(): { data: any; pending: any }

// Define library interface
interface Library {
  slug: string
  title: string
  location: { lat: number; lng: number; address?: string }
  description: string
  photo?: string
  tags?: string[]
  id?: number
  library_id?: string | number
  updated_at?: string
}

// Props
interface Props {
  initialSearchQuery?: string
  similarTags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  initialSearchQuery: '',
  similarTags: () => []
})

// Reactive data
const route = useRoute()
const searchQuery = ref(props.initialSearchQuery || '')
const currentPage = ref(1)
const itemsPerPage = 9
const hasSearched = ref(false)
const showAdvancedSearch = ref(false)
const selectedTags = ref<string[]>([...props.similarTags])
const sortBy = ref('relevance')
const groupMarkers = ref(false)
const isFullScreen = ref(false)

// Map instance and markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let markerClusterGroup: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markers: any[] = []
const mapId = ref('search-map')

// Initialize with empty data, will be populated in onMounted
const allLibraries = ref<Library[]>([])
const searchResults = ref<Library[]>([])

const { data: libSummaries } = useLibraries()

// Watch for URL changes to update search query and tags
watch(() => route.query, (newQuery) => {
  let shouldSearch = false
  
  if (newQuery.q && String(newQuery.q) !== searchQuery.value) {
    searchQuery.value = String(newQuery.q)
    shouldSearch = true
  }
  
  if (newQuery.tags) {
    const urlTags = String(newQuery.tags).split(',').filter(Boolean)
    if (JSON.stringify(urlTags) !== JSON.stringify(selectedTags.value)) {
      selectedTags.value = urlTags
      showAdvancedSearch.value = true // Show advanced search when tags are present
      shouldSearch = true
    }
  }
  
  if (shouldSearch) {
    performSearch()
  }
}, { immediate: true })

// Initialize data from summaries if available
watch(libSummaries, (vals: any[]) => {
  if (vals && vals.length) {
    allLibraries.value = vals.map((v: any, idx: number) => ({
      id: idx + 1,
      slug: v.slug,
      title: v.title,
      location: v.location || { lat: 49.2827, lng: -123.1207 },
      description: v.description,
      photo: v.photo,
      tags: v.tags || [],
      library_id: v.library_id,
      updated_at: v.updated_at || v.date || '2024-01-01'
    }))
    
    // If no search has been performed yet, show all libraries
    if (!hasSearched.value) {
      searchResults.value = [...allLibraries.value]
    }
    
    nextTick(() => initializeMap())
  }
}, { immediate: true })

// Computed properties
const availableTags = computed(() => {
  const tagSet = new Set<string>()
  allLibraries.value.forEach(lib => {
    lib.tags?.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

const totalPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage))

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return searchResults.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

// Load library data
onMounted(async () => {
  // Initialize search query from prop or URL parameter
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }

  try {
    if (allLibraries.value.length === 0) {
      const docs = await queryContent('/libraries').where({ _extension: 'md' }).find()
      const mapped: Library[] = docs.map((d: any, idx: number) => ({
        id: idx + 1,
        slug: d._path.replace(/^\/libraries\//, ''),
        title: d.title || d._path,
        location: d.location || { lat: 49.2827, lng: -123.1207 },
        photo: d.photo || '/images/libraries/placeholder-library.jpg',
        description: (d.body?.children?.find((c: any) => c.tag === 'p')?.children || []).map((c: any) => c.value || '').join(' ').substring(0,200) + '…',
        tags: d.tags || [],
        library_id: d.library_id,
        updated_at: d.updated_at || d.date || '2024-01-01'
      }))
      allLibraries.value = mapped
      searchResults.value = [...mapped]
    }
    
    // Perform initial search if we have a query
    if (searchQuery.value || selectedTags.value.length > 0) {
      hasSearched.value = true
      performSearch()
    }
    
    nextTick(() => initializeMap())
  } catch (e) {
    console.error('Failed to load libraries from content', e)
  }
})

// Methods
const performSearch = () => {
  hasSearched.value = true
  let results = [...allLibraries.value]

  // Filter by search query (title, description, tags)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(library => 
      library.title.toLowerCase().includes(query) ||
      library.description.toLowerCase().includes(query) ||
      (library.tags || []).some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by selected tags
  if (selectedTags.value.length > 0) {
    results = results.filter(library =>
      selectedTags.value.some(tag => 
        (library.tags || []).includes(tag)
      )
    )
  }

  // Sort results
  switch (sortBy.value) {
    case 'updated':
      results.sort((a, b) => new Date(b.updated_at || '2024-01-01').getTime() - new Date(a.updated_at || '2024-01-01').getTime())
      break
    case 'title':
      results.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'library_id':
      results.sort((a, b) => String(a.library_id || '').localeCompare(String(b.library_id || '')))
      break
    // 'relevance' is default - no additional sorting needed
  }

  searchResults.value = results
  currentPage.value = 1
  updateMapMarkers()
}

const resetSearch = () => {
  searchQuery.value = ''
  selectedTags.value = []
  searchResults.value = [...allLibraries.value]
  hasSearched.value = false
  currentPage.value = 1
  showAdvancedSearch.value = false
  sortBy.value = 'relevance'
  
  // Update URL to clear all search parameters
  navigateTo('/search', { replace: true })
  
  updateMapMarkers()
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  performSearch()
}

const clearAllTags = () => {
  selectedTags.value = []
  performSearch()
}

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  nextTick(() => {
    if (map) {
      map.invalidateSize()
    }
  })
}

// Map initialization and management
let mapStarted = false
let inlineIcon: any = null
let redIcon: any = null
let greenIcon: any = null

const initializeMap = () => {
  if (mapStarted) return
  if (typeof window === 'undefined') return
  const el = document.getElementById(mapId.value)
  if (!el) return
  mapStarted = true
  
  import('leaflet').then((L) => {
    // Create different colored icons
    const createIcon = (color: string) => {
      const svgMarker = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='${encodeURIComponent(color)}' stroke='white' stroke-width='2' d='M12.5 0c-7 0-12.5 5.6-12.5 12.5 0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z'/%3E%3Ccircle cx='12.5' cy='12.5' r='5' fill='white'/%3E%3C/svg%3E`
      return L.icon({
        iconUrl: svgMarker,
        iconRetinaUrl: svgMarker,
        shadowUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P1iJ6QAAAABJRU5ErkJggg==',
        iconSize: [25,41],
        iconAnchor: [12,41],
        popupAnchor: [1,-34],
        shadowSize: [1,1]
      })
    }
    
    inlineIcon = createIcon('#3b82f6') // Blue default
    redIcon = createIcon('#ef4444')   // Red for gone/missing
    greenIcon = createIcon('#10b981') // Green for visited_funvill
    
    map = L.map(mapId.value).setView([49.2827, -123.1207], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    // Initialize marker cluster group
    try {
      // Try to use MarkerClusterGroup if available
      if ((L as any).markerClusterGroup) {
        markerClusterGroup = (L as any).markerClusterGroup()
        map.addLayer(markerClusterGroup)
      }
    } catch (e) {
      console.log('MarkerClusterGroup not available, using regular markers')
    }
    
    updateMapMarkers()
  }).catch(err => {
    console.error('[SearchComponent] Failed to init map', err)
    mapStarted = false
  })
}

const getMarkerIcon = (library: Library) => {
  const tags = library.tags || []
  
  // Priority order: gone/missing -> visited_funvill -> default
  if (tags.some(tag => tag.includes('gone') || tag.includes('missing'))) {
    return redIcon
  }
  if (tags.includes('visited_funvill')) {
    return greenIcon
  }
  return inlineIcon
}

const updateMapMarkers = () => {
  if (!map || typeof window === 'undefined') return

  // Clear existing markers
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers()
  } else {
    markers.forEach(marker => map?.removeLayer(marker))
    markers.length = 0
  }

  // Use existing Leaflet instance
  const L: any = (window as any).L
  if (!L) return

  const newMarkers: any[] = []
  
  searchResults.value.forEach((library: Library) => {
    const libUrl = library.library_id
      ? libraryUrl({ library_id: library.library_id, slug: library.slug })
      : `/library/${library.slug}/`
      
    const icon = getMarkerIcon(library)
    
    const marker = L.marker([library.location.lat, library.location.lng], icon ? { icon } : undefined)
      .bindPopup(`
        <div class="p-3 min-w-[200px]">
          <h4 class="font-semibold text-lg mb-1">${library.title}</h4>
          <p class="text-xs text-gray-500 mb-2">ID: ${library.library_id || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">${library.description}</p>
          <a href="${libUrl}" class="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
            <span class="material-symbols-outlined" style="font-size:14px;">visibility</span>
            Visit Library
          </a>
        </div>
      `)
    
    newMarkers.push(marker)
  })

  if (groupMarkers && markerClusterGroup) {
    markerClusterGroup.addLayers(newMarkers)
  } else {
    newMarkers.forEach(marker => {
      marker.addTo(map!)
      markers.push(marker)
    })
  }

  // Fit map bounds to show all markers
  if (newMarkers.length > 0) {
    const group = L.featureGroup(newMarkers)
    map?.fitBounds(group.getBounds().pad(0.1))
  }
}

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Expose method for parent components to trigger similar searches
defineExpose({
  searchSimilar: (tags: string[]) => {
    selectedTags.value = [...tags]
    showAdvancedSearch.value = true
    performSearch()
  }
})
</script>

<style>
/* Import Leaflet CSS */
@import 'leaflet/dist/leaflet.css';
</style>