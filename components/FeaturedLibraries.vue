<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div 
      v-for="library in featuredLibraries" 
      :key="library._path"
      class="group"
    >
      <UCard class="h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
        <!-- Library Image -->
        <template #header>
          <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
            <NuxtImg
              v-if="library.photo"
              :src="library.photo"
              :alt="library.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <UIcon name="i-heroicons-building-library" class="w-16 h-16 text-gray-400" />
            </div>
            
            <!-- Difficulty Badge -->
            <div class="absolute top-3 right-3">
              <UBadge
                :color="getDifficultyColor(library.difficulty)"
                variant="solid"
                class="capitalize shadow-md"
              >
                {{ library.difficulty }}
              </UBadge>
            </div>
          </div>
        </template>

        <!-- Library Details -->
        <div class="space-y-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ library.title }}
            </h3>
            
            <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {{ library.description }}
            </p>
          </div>

          <!-- Location -->
          <div class="flex items-center text-sm text-gray-500">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-2 text-blue-500" />
            <span>{{ library.location?.address || `${library.location?.lat?.toFixed(4)}, ${library.location?.lng?.toFixed(4)}` }}</span>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center text-green-600">
              <UIcon name="i-heroicons-puzzle-piece" class="w-4 h-4 mr-1" />
              <span>{{ library.riddles_count }} riddles</span>
            </div>
            <div class="flex items-center text-purple-600">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
              <span>Est. {{ new Date(library.established).getFullYear() }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="library.tags && library.tags.length > 0" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in library.tags.slice(0, 3)"
              :key="tag"
              variant="soft"
              size="sm"
              :ui="{ rounded: 'rounded-full' }"
              class="capitalize"
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
          <div class="flex gap-2">
            <UButton
              :to="`/library/${getLibrarySlug(library._path)}`"
              variant="outline"
              size="sm"
              icon="i-heroicons-eye"
              class="flex-1"
            >
              Explore
            </UButton>
            
            <UButton
              :to="`/logbook/new?library=${getLibrarySlug(library._path)}`"
              color="primary"
              size="sm"
              icon="i-heroicons-pencil-square"
              class="flex-1"
            >
              Log Entry
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LibraryContent {
  _path: string
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  tags: string[]
  photo?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  riddles_count: number
  established: string
}

// Fetch featured libraries from content
const { data: featuredLibraries } = await queryContent<LibraryContent>('/content')
  .where({ _path: { $contains: '/content/' } })
  .where({ _path: { $not: { $contains: '/logbook/' } } })
  .where({ _path: { $not: { $contains: '/photos/' } } })
  .sort({ established: -1 })
  .limit(3)
  .find()

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

const getLibrarySlug = (path: string) => {
  // Extract library slug from content path
  // e.g., "/content/downtown-central-library" -> "downtown-central-library"
  return path.split('/').filter(Boolean).pop() || ''
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>