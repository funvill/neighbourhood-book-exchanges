<template>
  <div class="space-y-6">
    <!-- Search Filters -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div>
          <UInput
            v-model="searchQuery"
            placeholder="Search by name or description..."
            icon="i-heroicons-magnifying-glass"
          />
        </div>
        
        <!-- Tag Filter -->
        <div>
          <USelectMenu
            v-model="selectedTags"
            :options="availableTags"
            placeholder="Filter by tags"
            multiple
          />
        </div>
        
        <!-- Search Button -->
        <div>
          <UButton
            @click="performSearch"
            color="primary"
            block
            icon="i-heroicons-magnifying-glass"
          >
            Search
          </UButton>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LibraryCard
          v-for="library in paginatedResults"
          :key="library.id"
          :library="library"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <UPagination
          v-model="currentPage"
          :page-count="itemsPerPage"
          :total="searchResults.length"
          :max="5"
        />
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="hasSearched" class="text-center py-12">
      <UIcon name="i-heroicons-map" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No libraries found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your search criteria or browse all libraries.</p>
      <UButton @click="resetSearch" variant="outline">
        Clear Filters
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Map, Marker } from 'leaflet'

// Reactive data
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = 12
const hasSearched = ref(false)

// Map instance
let map: Map | null = null
const markers: Marker[] = []

// Mock data - in real implementation this would come from an API
const availableTags = [
  'Poetry', 'Fiction', 'Science', 'Art', 'History', 'Mystery', 
  'Adventure', 'Philosophy', 'Children', 'Community'
]

const allLibraries = ref([
  {
    id: 1,
    title: 'Downtown Central Library',
    location: { lat: 49.2827, lng: -123.1207 },
    photo: '/images/library1.jpg',
    description: 'A cozy little library in the heart of downtown with mystery zines.',
    tags: ['Mystery', 'Community']
  },
  {
    id: 2,
    title: 'Sunset Park Reading Nook',
    location: { lat: 49.2634, lng: -123.1456 },
    photo: '/images/library2.jpg',
    description: 'Family-friendly library with children\'s puzzle books.',
    tags: ['Children', 'Adventure']
  },
  {
    id: 3,
    title: 'University District Hub',
    location: { lat: 49.2606, lng: -123.2460 },
    photo: '/images/library3.jpg',
    description: 'Academic-focused library with science and philosophy zines.',
    tags: ['Science', 'Philosophy']
  }
])

const searchResults = ref([...allLibraries.value])

// Computed
const totalPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage))
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return searchResults.value.slice(start, end)
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

  // Filter by tags
  if (selectedTags.value.length > 0) {
    results = results.filter(library =>
      selectedTags.value.some(tag => library.tags.includes(tag))
    )
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
  updateMapMarkers()
}

const initializeMap = () => {
  if (process.client) {
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
  if (!map || !process.client) return

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
            <a href="/library/${library.id}" class="text-blue-600 hover:underline">View Details</a>
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

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initializeMap()
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Initialize search on mount
performSearch()
</script>

<style>
/* Import Leaflet CSS */
@import 'leaflet/dist/leaflet.css';
</style>