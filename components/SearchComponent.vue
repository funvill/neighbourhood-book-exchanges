<template>
  <div class="space-y-6">
    <!-- Search Filters -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search Input -->
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or description..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="performSearch"
          />
        </div>
        
        <!-- Search Button -->
        <div>
          <button
            @click="performSearch"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🔍 Search
          </button>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div id="map" class="h-96 w-full"></div>
    </div>

    <!-- Results -->
    <div v-if="searchResults.length > 0" class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">
        {{ searchResults.length }} Libraries Found
      </h3>
      
      <!-- Library Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LibraryCard
          v-for="library in paginatedResults"
          :key="library.id"
          :library="library"
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
      <UIcon name="i-heroicons-map" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Define library interface
interface Library {
  id: number
  slug: string
  title: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  description: string
  photo?: string
  tags?: string[]
}

// Props
interface Props {
  initialSearchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialSearchQuery: ''
})

// Reactive data
const searchQuery = ref(props.initialSearchQuery || '')
const currentPage = ref(1)
const itemsPerPage = 9
const hasSearched = ref(false)

// Map instance (using any for Leaflet types to avoid import issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markers: any[] = []

// Initialize with empty data, will be populated in onMounted
const allLibraries = ref<Library[]>([])
const searchResults = ref<Library[]>([])

// Load library data
onMounted(async () => {
  // Initialize search query from prop (URL parameter is passed from parent)
  if (props.initialSearchQuery) {
    searchQuery.value = props.initialSearchQuery
  }

  try {
    // Fetch from our custom API using fetch instead of $fetch for client-side
    const response = await fetch('/api/libraries')
    const libraries = await response.json() as Library[]
    if (libraries && Array.isArray(libraries)) {
      allLibraries.value = libraries
      searchResults.value = [...libraries]
      
      // If we have initial search query, perform initial search
      if (searchQuery.value) {
        hasSearched.value = true
        performSearch()
      }
      
      // Initialize map after data is loaded, regardless of search state
      nextTick(() => {
        initializeMap()
      })
    }
  } catch (error) {
    console.warn('Could not fetch libraries from API, using fallback data', error)
    console.warn('Could not fetch libraries from API, using fallback data')
    // Fallback to original mock data if API fails
    allLibraries.value = [
      {
        id: 1,
        slug: 'downtown-central-library',
        title: 'Downtown Central Library',
        location: { lat: 49.2827, lng: -123.1207 },
        photo: '/images/libraries/downtown-central-library/2024-01-15-exterior-1.jpg',
        description: 'A cozy little library in the heart of downtown with mystery zines.',
        tags: ['Mystery', 'Community']
      },
      {
        id: 2,
        slug: 'sunset-park-reading-nook',
        title: 'Sunset Park Reading Nook',
        location: { lat: 49.2634, lng: -123.1456 },
        photo: '/images/libraries/sunset-park-reading-nook/2024-02-03-family-reading-1.jpg',
        description: 'Family-friendly library with children\'s books and adventure stories.',
        tags: ['Children', 'Adventure']
      },
      {
        id: 3,
        slug: 'university-district-hub',
        title: 'University District Hub',
        location: { lat: 49.2606, lng: -123.2460 },
        photo: '/images/libraries/university-district-hub/2024-03-10-study-session-1.jpg',
        description: 'Academic-focused library with science and philosophy zines.',
        tags: ['Science', 'Philosophy']
      }
    ]
    searchResults.value = [...allLibraries.value]
  }
  
  // Initialize map after data is loaded
  nextTick(() => {
    initializeMap()
  })
})

// Computed
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
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    // Show pages around current page
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
    
    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const performSearch = () => {
  hasSearched.value = true
  let results = [...allLibraries.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(library => 
      library.title.toLowerCase().includes(query) ||
      library.description.toLowerCase().includes(query)
    )
  }

  searchResults.value = results
  currentPage.value = 1
  updateMapMarkers()
}

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = [...allLibraries.value]
  hasSearched.value = false
  currentPage.value = 1
  updateMapMarkers()
}

const initializeMap = () => {
  // Initialize map on client side
  if (typeof window !== 'undefined') {
    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Initialize map
      map = L.map('map').setView([49.2827, -123.1207], 11)
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Add initial markers
      updateMapMarkers()
    })
  }
}

const updateMapMarkers = () => {
  if (!map || typeof window === 'undefined') return

  // Clear existing markers
  markers.forEach(marker => map?.removeLayer(marker))
  markers.length = 0

  // Add new markers
  import('leaflet').then((L) => {
    searchResults.value.forEach(library => {
      const marker = L.marker([library.location.lat, library.location.lng])
        .addTo(map!)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold">${library.title}</h4>
            <p class="text-sm text-gray-600">${library.description}</p>
            <a href="/library/${library.slug}" class="text-blue-600 hover:underline">View Details</a>
          </div>
        `)
      markers.push(marker)
    })

    // Fit bounds if there are markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map?.fitBounds(group.getBounds().pad(0.1))
    }
  })
}

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* Import Leaflet CSS */
@import 'leaflet/dist/leaflet.css';
</style>