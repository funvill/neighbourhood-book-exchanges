<template>
  <UCard class="hover:shadow-lg transition-shadow duration-200">
    <!-- Library Image -->
    <template #header>
      <div class="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        <NuxtImg
          v-if="library.photo"
          :src="library.photo"
          :alt="library.title"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
        </div>
      </div>
    </template>

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
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
        <span>{{ formatLocation(library.location) }}</span>
      </div>

      <!-- Tags -->
      <div v-if="library.tags && library.tags.length > 0" class="flex flex-wrap gap-1">
        <UBadge
          v-for="tag in library.tags.slice(0, 3)"
          :key="tag"
          variant="soft"
          size="sm"
          :ui="{ rounded: 'rounded-full' }"
        >
          {{ tag }}
        </UBadge>
        <UBadge
          v-if="library.tags.length > 3"
          variant="soft"
          size="sm"
          color="gray"
          :ui="{ rounded: 'rounded-full' }"
        >
          +{{ library.tags.length - 3 }}
        </UBadge>
      </div>
    </div>

    <!-- Actions -->
    <template #footer>
      <div class="flex justify-between items-center">
        <UButton
          :to="`/library/${library.id}`"
          variant="outline"
          size="sm"
          icon="i-heroicons-eye"
        >
          View Details
        </UButton>
        
        <UButton
          :to="`/logbook/new?library=${library.id}`"
          color="primary"
          size="sm"
          icon="i-heroicons-pencil-square"
        >
          Add Entry
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Library {
  id: number
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