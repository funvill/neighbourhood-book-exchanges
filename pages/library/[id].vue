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
        <!-- Hero Image -->
        <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
          <NuxtImg
            v-if="library.photo"
            :src="library.photo"
            :alt="library.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-gray-400" style="font-size:128px;">local_library</span>
          </div>
          
          <!-- Overlay with difficulty badge -->
          <div class="absolute top-4 right-4">
            <span
              :class="getDifficultyColorClass(library.difficulty || 'beginner')"
              class="px-3 py-1 rounded-full text-sm font-medium shadow-lg capitalize text-white"
            >
              {{ library.difficulty || 'beginner' }} Level
            </span>
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
                  <div class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-blue-500" style="font-size:16px;">location_on</span>
                    <span>{{ library.location?.address || 'Location not specified' }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-green-500" style="font-size:16px;">extension</span>
                    <span>{{ library.entries_count || 0 }} entries</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-symbols-outlined mr-1 text-purple-500" style="font-size:16px;">calendar_month</span>
                    <span>Est. {{ library.established ? new Date(library.established).getFullYear() : 'Unknown' }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-lg text-gray-700 leading-relaxed">{{ library.description || 'No description available.' }}</p>
              </div>

              <!-- Content Body -->
              <div v-if="library.description" class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed">{{ library.description }}</p>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Quick Stats -->
              <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Difficulty</span>
                    <span :class="getDifficultyColorClass(library.difficulty || 'beginner')" class="px-2 py-1 rounded text-xs font-medium text-white capitalize">
                      {{ library.difficulty || 'beginner' }}
                    </span>
                  </div>
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

              <!-- Map -->
              <div v-if="library.location" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="material-symbols-outlined mr-2 text-blue-500" style="font-size:20px;">map</span>
                  Location
                </h3>
                <div id="library-map" class="h-80 w-full rounded-lg bg-gray-100" />
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <NuxtLink
                  :to="`/logbook/new?library=${librarySlug}`"
                  class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
                  Add Log Entry
                </NuxtLink>
                <NuxtLink
                  to="/search"
                  class="w-full border border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
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
      <NuxtLink to="/search" class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <span class="material-symbols-outlined mr-1" style="font-size:18px;">arrow_back</span>
        Back to Search
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'

// Define types
interface LibraryLocation {
  lat: number
  lng: number
  address: string
}

interface Library {
  title: string
  description: string
  difficulty: string
  entries_count: number
  established: string
  location: LibraryLocation
  photo: string
}

type LibraryMap = {
  [key: string]: Library
}

const route = useRoute()
const librarySlug = route.params.id as string

// Create reactive data
const library = ref<Library | null>(null)
const pending = ref(true)
const map = ref<any>(null)

// Mock data for the three libraries we have
const loadMockData = () => {
  const mockLibraries: LibraryMap = {
    'downtown-central-library': {
      title: 'Downtown Central Library',
      description: 'Located in the heart of downtown, this library serves as a hub for community enthusiasts and story sharers. Known for its diverse content and historical significance.',
      difficulty: 'intermediate',
      entries_count: 8,
      established: '2023-01-15',
      location: {
        lat: 49.2827,
        lng: -123.1207,
        address: '789 Main Street, Downtown'
      },
      photo: '/images/libraries/downtown-central-library/2024-01-15-exterior-1.jpg'
    },
    'sunset-park-reading-nook': {
      title: 'Sunset Park Reading Nook',
      description: 'A cozy outdoor library nestled in Sunset Park, perfect for families and newcomers to the library community. Features beginner-friendly content and beautiful sunset views.',
      difficulty: 'beginner',
      entries_count: 5,
      established: '2023-02-03',
      location: {
        lat: 49.2634,
        lng: -123.1456,
        address: 'Sunset Park, West Side'
      },
      photo: '/images/libraries/sunset-park-reading-nook/2024-02-03-family-reading-1.jpg'
    },
    'university-district-hub': {
      title: 'University District Hub',
      description: 'A student-favorite library located near the university campus. Known for its academic content and collaborative reading environment. Popular among study groups.',
      difficulty: 'advanced',
      entries_count: 12,
      established: '2023-03-10',
      location: {
        lat: 49.2606,
        lng: -123.2460,
        address: 'University Boulevard, Near Campus'
      },
      photo: '/images/libraries/university-district-hub/2024-03-10-study-session-1.jpg'
    }
  }
  
  library.value = mockLibraries[librarySlug] || null
  pending.value = false
}

const getDifficultyColorClass = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500'
    case 'intermediate':
      return 'bg-yellow-500'
    case 'advanced':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
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
        .openPopup()
        
      map.value = mapInstance
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  }
}

// Load data on mount
onMounted(async () => {
  await loadMockData()
  
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
watch(library, async (newLibrary) => {
  if (newLibrary?.location && !map.value) {
    await nextTick()
    await initializeLibraryMap()
  }
}, { deep: true })

// Set page meta
useHead({
  title: computed(() => library.value ? `${library.value.title} - Puzzle Pages` : 'Library - Puzzle Pages'),
  meta: [
    {
      name: 'description',
      content: computed(() => library.value ? library.value.description : 'Library details page')
    }
  ]
})
</script>

<style>
.library-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.library-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
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

.library-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}
</style>

<style>
@import 'leaflet/dist/leaflet.css';

.library-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.library-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.library-content :deep(h4) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
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
</style>