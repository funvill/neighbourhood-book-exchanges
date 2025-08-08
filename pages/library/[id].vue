<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="library" class="space-y-8">
      <!-- Library Header -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Hero Image -->
        <div class="aspect-video bg-gray-200">
          <NuxtImg
            v-if="library.photo"
            :src="library.photo"
            :alt="library.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-heroicons-photo" class="w-24 h-24 text-gray-400" />
          </div>
        </div>

        <!-- Library Info -->
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ library.title }}</h1>
          
          <!-- Location -->
          <div class="flex items-center text-gray-600 mb-4">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2" />
            <span>{{ formatLocation(library.location) }}</span>
          </div>

          <!-- Description -->
          <p class="text-gray-700 mb-6">{{ library.description }}</p>

          <!-- Tags Cloud -->
          <div v-if="library.tags && library.tags.length > 0" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Popular Topics</h3>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="tag in library.tags"
                :key="tag"
                :to="`/search?tag=${encodeURIComponent(tag)}`"
                variant="soft"
                size="sm"
                :ui="{ rounded: 'rounded-full' }"
              >
                {{ tag }}
              </UButton>
            </div>
            <p class="text-sm text-gray-500">
              Click on a tag to find other libraries with similar content.
            </p>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Location</h2>
          <div id="library-map" class="h-64 w-full rounded-lg"></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Get Involved</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UButton
            :to="`/logbook/new?library=${library.id}`"
            color="primary"
            size="lg"
            icon="i-heroicons-pencil-square"
            block
          >
            Add Log Book Entry
          </UButton>
          <UButton
            to="/search"
            variant="outline"
            size="lg"
            icon="i-heroicons-map"
            block
          >
            Find More Libraries
          </UButton>
        </div>
      </div>

      <!-- Recent Entries (placeholder for future implementation) -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-2" />
          <p>No entries yet. Be the first to share your experience!</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="flex justify-center items-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-600" />
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-16">
      <UIcon name="i-heroicons-map" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Library Not Found</h1>
      <p class="text-gray-600 mb-4">The library you're looking for doesn't exist or has been removed.</p>
      <UButton to="/search" icon="i-heroicons-arrow-left">
        Back to Search
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Map } from 'leaflet'

const route = useRoute()
const libraryId = route.params.id

// Mock data - in real implementation this would come from an API
const { data: library, pending } = await useLazyFetch(`/api/libraries/${libraryId}`, {
  default: () => {
    // Mock library data
    if (libraryId === '1') {
      return {
        id: 1,
        title: 'Downtown Central Library',
        location: { lat: 49.2827, lng: -123.1207 },
        photo: '/images/library1.jpg',
        description: 'A cozy little library in the heart of downtown with mystery zines. This charming wooden box contains an ever-changing collection of puzzle books, mystery novels, and cryptic zines that challenge visitors to solve hidden riddles. Local puzzle enthusiasts have contributed handmade puzzles and brain teasers that make this location a favorite among the community.',
        tags: ['Mystery', 'Community', 'Puzzles', 'Downtown', 'Cryptic']
      }
    }
    return null
  }
})

// Map instance
let map: Map | null = null

const formatLocation = (location: { lat: number; lng: number }) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}

const initializeLibraryMap = () => {
  if (process.client && library.value) {
    import('leaflet').then((L) => {
      // Initialize map
      map = L.map('library-map').setView([library.value.location.lat, library.value.location.lng], 15)
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Add marker for this library
      L.marker([library.value.location.lat, library.value.location.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold">${library.value.title}</h4>
            <p class="text-sm text-gray-600">${library.value.description}</p>
          </div>
        `)
        .openPopup()
    })
  }
}

// Set page meta
useHead({
  title: computed(() => library.value ? `${library.value.title} - Puzzle Pages Project` : 'Library - Puzzle Pages Project'),
  meta: computed(() => [
    {
      name: 'description',
      content: library.value ? library.value.description : 'Library details page'
    }
  ])
})

// Lifecycle
onMounted(() => {
  if (library.value) {
    nextTick(() => {
      initializeLibraryMap()
    })
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Watch for library data changes
watch(library, (newLibrary) => {
  if (newLibrary && !map) {
    nextTick(() => {
      initializeLibraryMap()
    })
  }
})
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style>