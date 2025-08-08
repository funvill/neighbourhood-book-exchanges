<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="library" class="space-y-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/search" class="hover:text-blue-600">Libraries</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
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
            <UIcon name="i-heroicons-building-library" class="w-32 h-32 text-gray-400" />
          </div>
          
          <!-- Overlay with difficulty badge -->
          <div class="absolute top-4 right-4">
            <UBadge
              :color="getDifficultyColor(library.difficulty)"
              variant="solid"
              size="lg"
              class="capitalize shadow-lg"
            >
              {{ library.difficulty }} Level
            </UBadge>
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
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ library.location?.address || formatLocation(library.location) }}</span>
                  </div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-puzzle-piece" class="w-4 h-4 mr-1 text-green-500" />
                    <span>{{ library.riddles_count }} riddles</span>
                  </div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1 text-purple-500" />
                    <span>Est. {{ new Date(library.established).getFullYear() }}</span>
                  </div>
                  <div v-if="library.recent_activity" class="flex items-center">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1 text-orange-500" />
                    <span>Last active {{ formatDate(library.recent_activity) }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-lg text-gray-700 leading-relaxed">{{ library.description }}</p>
              </div>

              <!-- Content Body -->
              <div class="prose max-w-none">
                <ContentRenderer :value="library" class="library-content" />
              </div>

              <!-- Tags Cloud -->
              <div v-if="library.tags && library.tags.length > 0" class="space-y-4">
                <h3 class="text-xl font-semibold text-gray-900 flex items-center">
                  <UIcon name="i-heroicons-tag" class="w-5 h-5 mr-2 text-blue-500" />
                  Popular Topics
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="tag in library.tags"
                    :key="tag"
                    :to="`/search?tag=${encodeURIComponent(tag)}`"
                    variant="soft"
                    size="sm"
                    :ui="{ rounded: 'rounded-full' }"
                    class="hover:scale-105 transition-transform"
                  >
                    {{ tag }}
                  </UButton>
                </div>
                <p class="text-sm text-gray-500">
                  Click on a tag to find other libraries with similar themes and puzzles.
                </p>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Quick Stats -->
              <UCard>
                <template #header>
                  <h3 class="font-semibold text-gray-900">Quick Stats</h3>
                </template>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Difficulty</span>
                    <UBadge :color="getDifficultyColor(library.difficulty)" variant="soft" class="capitalize">
                      {{ library.difficulty }}
                    </UBadge>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Riddles</span>
                    <span class="font-semibold">{{ library.riddles_count }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Established</span>
                    <span class="font-semibold">{{ new Date(library.established).getFullYear() }}</span>
                  </div>
                </div>
              </UCard>

              <!-- Contact Info -->
              <UCard v-if="library.contact">
                <template #header>
                  <h3 class="font-semibold text-gray-900">Contact</h3>
                </template>
                <div class="space-y-3 text-sm">
                  <div v-if="library.contact.email" class="flex items-center">
                    <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2 text-blue-500" />
                    <a :href="`mailto:${library.contact.email}`" class="text-blue-600 hover:underline">
                      {{ library.contact.email }}
                    </a>
                  </div>
                  <div v-if="library.contact.phone" class="flex items-center">
                    <UIcon name="i-heroicons-phone" class="w-4 h-4 mr-2 text-green-500" />
                    <a :href="`tel:${library.contact.phone}`" class="text-green-600 hover:underline">
                      {{ library.contact.phone }}
                    </a>
                  </div>
                  <div v-if="library.contact.coordinator" class="flex items-center">
                    <UIcon name="i-heroicons-user" class="w-4 h-4 mr-2 text-purple-500" />
                    <span>{{ library.contact.coordinator }}</span>
                  </div>
                  <div v-if="library.contact.hours" class="flex items-start">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-2 mt-0.5 text-orange-500" />
                    <span>{{ library.contact.hours }}</span>
                  </div>
                </div>
              </UCard>

              <!-- Actions -->
              <UCard>
                <template #header>
                  <h3 class="font-semibold text-gray-900">Get Involved</h3>
                </template>
                <div class="space-y-3">
                  <UButton
                    :to="`/logbook/new?library=${librarySlug}`"
                    color="primary"
                    size="lg"
                    icon="i-heroicons-pencil-square"
                    block
                    class="shadow-md hover:shadow-lg transition-shadow"
                  >
                    Add Log Entry
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
              </UCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 flex items-center">
            <UIcon name="i-heroicons-map" class="w-5 h-5 mr-2 text-blue-500" />
            Location
          </h2>
        </template>
        <div id="library-map" class="h-80 w-full rounded-lg"></div>
      </UCard>

      <!-- Recent Entries -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 flex items-center">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-2 text-green-500" />
            Recent Log Entries
          </h2>
        </template>
        <div v-if="logEntries && logEntries.length > 0" class="space-y-4">
          <div 
            v-for="entry in logEntries" 
            :key="entry._path"
            class="border-l-4 border-blue-200 pl-4 py-2"
          >
            <h4 class="font-semibold text-gray-900">{{ entry.title }}</h4>
            <p class="text-sm text-gray-600 mb-2">
              by {{ entry.author }} on {{ formatDate(entry.date) }}
            </p>
            <p class="text-gray-700 text-sm">{{ truncate(entry.description || '', 150) }}</p>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-2" />
          <p>No entries yet. Be the first to share your experience!</p>
          <UButton
            :to="`/logbook/new?library=${librarySlug}`"
            color="primary"
            size="sm"
            class="mt-4"
          >
            Add First Entry
          </UButton>
        </div>
      </UCard>
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
const librarySlug = route.params.id as string

// Fetch library content
const { data: library, pending } = await useLazyAsyncData(`library-${librarySlug}`, async () => {
  try {
    const content = await queryContent(`/content/${librarySlug}`).findOne()
    return content
  } catch {
    return null
  }
})

// Fetch log entries for this library
const { data: logEntries } = await useLazyAsyncData(`logbook-${librarySlug}`, async () => {
  try {
    const entries = await queryContent(`/content/${librarySlug}/logbook`).find()
    return entries.slice(0, 5) // Show latest 5 entries
  } catch {
    return []
  }
})

// Map instance
let map: Map | null = null

const formatLocation = (location: { lat: number; lng: number }) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'green'
    case 'intermediate':
      return 'yellow'
    case 'advanced':
      return 'red'
    default:
      return 'gray'
  }
}

const initializeLibraryMap = () => {
  if (process.client && library.value?.location) {
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
  title: computed(() => library.value ? `${library.value.title} - Puzzle Pages` : 'Library - Puzzle Pages'),
  meta: computed(() => [
    {
      name: 'description',
      content: library.value ? library.value.description : 'Library details page'
    }
  ])
})

// Lifecycle
onMounted(() => {
  if (library.value?.location) {
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
  if (newLibrary?.location && !map) {
    nextTick(() => {
      initializeLibraryMap()
    })
  }
})
</script>

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