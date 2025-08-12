<template>
  <div class="group">
    <div class="md-card h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col">
      <!-- Library Image - Enhanced for better thumbnail display -->
      <a :href="getLibraryUrl()" class="block aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
        <img
          :src="getImageSrc()"
          :alt="library.title"
          class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          @error="handleImageError"
        />
      </a>

      <!-- Library Details -->
      <div class="flex-1 space-y-4">
        <div>
          <a :href="getLibraryUrl()" class="block">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors hover:text-blue-600">
              {{ library.title }}
            </h3>
          </a>
          
          <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {{ library.description }}
          </p>
        </div>

        <!-- Library ID if available -->
        <div v-if="library.library_id" class="text-xs text-gray-500 font-mono">
          ID: {{ library.library_id }}
        </div>

        <!-- Location -->
        <div class="flex items-center text-sm text-gray-500">
          <span class="material-symbols-outlined text-blue-500 mr-2" style="font-size:18px;">location_on</span>
          <span>{{ formatLocation(library.location) }}</span>
        </div>

        <!-- Stats (optional) -->
        <div v-if="showStats" class="flex items-center justify-between text-sm">
          <div class="flex items-center text-green-600">
            <span class="material-symbols-outlined mr-1" style="font-size:18px;">extension</span>
            <span>{{ library.entries_count || 0 }} entries</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="library.tags && library.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span v-for="tag in library.tags.slice(0, 3)" :key="tag" class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs capitalize">
            {{ tag }}
          </span>
          <span v-if="library.tags.length > 3" class="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">+{{ library.tags.length - 3 }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 mt-auto space-y-2">
        <a :href="getLibraryUrl()" class="md-button w-full flex items-center justify-center gap-1">
          <span class="material-symbols-outlined" style="font-size:18px;">visibility</span>
          Visit Library
        </a>
        
        <!-- Find Similar Libraries Button -->
        <button 
          v-if="library.tags && library.tags.length > 0"
          @click="findSimilarLibraries"
          class="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-1 text-sm font-medium"
        >
          <span class="material-symbols-outlined" style="font-size:16px;">travel_explore</span>
          Find Similar Libraries
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { libraryUrl } from '~/utils/libraryUrl'

interface Library {
  id?: number
  library_id?: string | number
  slug?: string
  _path?: string
  title: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  photo?: string
  description: string
  tags?: string[]
  entries_count?: number
}

interface Props {
  library: Library
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStats: false,
})

const formatLocation = (location: { lat: number; lng: number; address?: string }) => {
  if (location.address) {
    return location.address
  }
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}

const getLibrarySlug = (library: Library) => {
  if (library.slug) return library.slug
  if (library._path) {
    return library._path.split('/').filter(Boolean).pop() || ''
  }
  return library.id?.toString() || ''
}

const getLibraryUrl = () => {
  const slug = getLibrarySlug(props.library)
  const libraryId = props.library.library_id ?? props.library.id
  if (libraryId) return libraryUrl({ library_id: libraryId, slug })
  return `/library/${slug}/`
}

const getImageSrc = () => {
  if (props.library.photo && props.library.photo !== '/images/libraries/placeholder-library.jpg') {
    return props.library.photo
  }
  return '/images/libraries/placeholder-library.jpg'
}

const handleImageError = (event: string | Event) => {
  if (typeof event !== 'string') {
    const img = event.target as HTMLImageElement
    if (img.src !== '/images/libraries/placeholder-library.jpg') {
      img.src = '/images/libraries/placeholder-library.jpg'
    }
  }
}

const findSimilarLibraries = () => {
  if (props.library.tags && props.library.tags.length > 0) {
    // Navigate to search page with tags pre-selected
    const tagParams = props.library.tags.slice(0, 5).join(',') // Limit to first 5 tags
    navigateTo(`/search?tags=${encodeURIComponent(tagParams)}`)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced thumbnail display - clip bottom and show top */
img {
  object-position: top center;
}
</style>