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
                    <span class="material-symbols-outlined mr-1 text-blue-500" style="font-size:16px;">location_on</span>
                    <a 
                      :href="`https://www.google.com/maps?q=${library.location.lat},${library.location.lng}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {{ library.location.lat.toFixed(4) }}, {{ library.location.lng.toFixed(4) }}
                    </a>
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
              <div v-if="libraryContent" class="prose max-w-none">
                <div v-html="formatMarkdownContent(libraryContent)" />
              </div>
              <div v-else-if="library.description" class="prose max-w-none">
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
                    <span class="text-gray-600">Entries</span>
                    <span class="font-semibold">{{ library.entries_count || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Established</span>
                    <span class="font-semibold">{{ library.established ? new Date(library.established).getFullYear() : 'Unknown' }}</span>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="library.tags && library.tags.length > 0" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="material-symbols-outlined mr-2 text-purple-500" style="font-size:20px;">label</span>
                  Tags
                </h3>
                <div class="flex flex-wrap gap-2">
                  <NuxtLink 
                    v-for="tag in library.tags" 
                    :key="tag"
                    :to="`/search?tags=${encodeURIComponent(tag)}`"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>

              <!-- Map -->
              <div v-if="library.location" class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="material-symbols-outlined mr-2 text-blue-500" style="font-size:20px;">map</span>
                  Location
                </h3>
                <div id="library-map" class="h-80 w-full rounded-lg bg-gray-100 mb-4" />
                <a 
                  :href="`https://www.google.com/maps?q=${library.location.lat},${library.location.lng}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span class="material-symbols-outlined" style="font-size:18px;">place</span>
                  Open in Google Maps
                </a>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <NuxtLink
                  :to="`#todo?/logbook/new?library=${librarySlug}`"
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
// Define types
interface LibraryLocation {
  lat: number
  lng: number
  address?: string
}

interface Library {
  id: number
  slug: string
  title: string
  description: string
  fullContent?: string // Add full content property
  location: LibraryLocation
  photo: string
  tags?: string[]
  _path?: string
}

const route = useRoute()
const librarySlug = route.params.id as string

// Create reactive data
const library = ref<Library | null>(null)
const libraryContent = ref<any>(null)
const pending = ref(true)
const map = ref<any>(null)

// Load library data from API
const loadLibraryData = async () => {
  try {
    pending.value = true
    // Fetch specific library data including full content
    const libraryData = await $fetch(`/api/libraries/${librarySlug}`) as Library
    
    if (libraryData) {
      library.value = libraryData
      // The full content is now included in the API response
      libraryContent.value = libraryData.fullContent
    } else {
      // Library not found
      library.value = null
      libraryContent.value = null
      console.warn(`Library with slug "${librarySlug}" not found`)
    }
  } catch (error) {
    console.error('Error loading library data:', error)
    library.value = null
    libraryContent.value = null
  } finally {
    pending.value = false
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
        // Remove .openPopup() to not show popup by default
        
      map.value = mapInstance
    } catch (error) {
      console.error('Failed to load map:', error)
    }
  }
}

// Load data on mount
onMounted(async () => {
  await loadLibraryData()
  
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
  title: computed(() => library.value ? `${library.value.title} - Neighbourhood book exchanges` : 'Library - Neighbourhood book exchanges'),
  meta: [
    {
      name: 'description',
      content: computed(() => library.value ? library.value.description : 'Library details page')
    }
  ]
})

// Simple markdown to HTML converter for basic formatting
function formatMarkdownContent(content: string): string {
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-6">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-8">$1</h1>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/(^|[^"])(https?:\/\/[^\s<>"]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$2</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\* (.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-6 mb-4">$1</ul>')
    .replace(/^(?!<[hul]|$)(.*$)/gm, '<p class="mb-4">$1</p>')
    .replace(/\n\n/g, '\n')
}
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