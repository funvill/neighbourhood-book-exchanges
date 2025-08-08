<template>
  <div class="md-card hover:shadow-lg transition-shadow duration-200 flex flex-col">
    <!-- Library Image -->
    <div class="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
      <NuxtImg
        v-if="library.photo"
        :src="library.photo"
        :alt="library.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="material-symbols-outlined text-5xl text-gray-400">photo</span>
      </div>
    </div>

    <!-- Library Details -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
        {{ library.title }}
      </h3>
      
      <p class="text-sm text-gray-600 line-clamp-3">
        {{ library.description }}
      </p>

      <!-- Location -->
      <div class="flex items-center text-sm text-gray-500">
        <span class="material-symbols-outlined text-blue-500 mr-1" style="font-size:18px;">location_on</span>
        <span>{{ formatLocation(library.location) }}</span>
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
    <div class="flex justify-between items-center mt-6">
      <a :href="`/library/${library.slug}`" class="md-button flex items-center gap-1">
        <span class="material-symbols-outlined" style="font-size:18px;">visibility</span>
        View Details
      </a>
      <a :href="`/logbook/new?library=${library.slug}`" class="md-button flex items-center gap-1" style="background: var(--md-primary-container); color: var(--md-on-primary-container);">
        <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
        Add Entry
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Library {
  id: number
  slug: string
  title: string
  location: {
    lat: number
    lng: number
  }
  photo?: string
  description: string
  tags?: string[]
}

interface Props {
  library: Library
}

const props = defineProps<Props>()

const formatLocation = (location: { lat: number; lng: number }) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>