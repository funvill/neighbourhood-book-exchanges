<template>
  <div class="group">
    <div class="md-card h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col">
      <!-- Library Image -->
      <a :href="getLibraryUrl()" class="block aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
        <NuxtImg
          :src="getImageSrc()"
          :alt="library.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          @error="handleImageError"
        />
        
        <!-- Difficulty Badge (optional) -->
        <div v-if="showDifficultyBadge && library.difficulty" class="absolute top-3 right-3">
          <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold capitalize shadow-md', getDifficultyClass(library.difficulty)]">
            {{ library.difficulty }}
          </span>
        </div>
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
          <div v-if="library.established" class="flex items-center text-purple-600">
            <span class="material-symbols-outlined mr-1" style="font-size:18px;">calendar_month</span>
            <span>Est. {{ new Date(library.established).getFullYear() }}</span>
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
      <div class="mt-6 mt-auto">
        <a :href="getLibraryUrl()" class="md-button w-full flex items-center justify-center gap-1">
          <span class="material-symbols-outlined" style="font-size:18px;">visibility</span>
          Visit Library
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Library {
  id?: number
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
  difficulty?: string
  entries_count?: number
  established?: string
}

interface Props {
  library: Library
  showDifficultyBadge?: boolean
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDifficultyBadge: false,
  showStats: false
})

const formatLocation = (location: { lat: number; lng: number; address?: string }) => {
  if (location.address) {
    return location.address
  }
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700'
    case 'advanced':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}

const getLibrarySlug = (library: Library) => {
  if (library.slug) return library.slug
  if (library._path) {
    // Extract library slug from content path
    // e.g., "/content/downtown-central-library" -> "downtown-central-library"
    return library._path.split('/').filter(Boolean).pop() || ''
  }
  return library.id?.toString() || ''
}

const getLibraryUrl = () => {
  return `/library/${getLibrarySlug(props.library)}`
}

const getImageSrc = () => {
  // If library has a photo, use it, otherwise use placeholder
  if (props.library.photo && props.library.photo !== '/images/libraries/placeholder-library.jpg') {
    return props.library.photo
  }
  return '/images/libraries/placeholder-library.jpg'
}

const handleImageError = (event: string | Event) => {
  // If image fails to load, fallback to placeholder
  if (typeof event !== 'string') {
    const img = event.target as HTMLImageElement
    if (img.src !== '/images/libraries/placeholder-library.jpg') {
      img.src = '/images/libraries/placeholder-library.jpg'
    }
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
</style>