<template>
  <div v-if="featuredLibraries && featuredLibraries.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
  
  <!-- Fallback when no libraries are available -->
  <div v-else class="text-center py-12 text-gray-500">
    <UIcon name="i-heroicons-building-library" class="w-16 h-16 mx-auto mb-4" />
    <h3 class="text-lg font-semibold mb-2">No Featured Libraries Yet</h3>
    <p class="mb-4">Be the first to add a library to our community!</p>
    <UButton
      to="/library/new"
      color="primary"
      icon="i-heroicons-plus"
    >
      Add First Library
    </UButton>
  </div>
</template>

<script setup lang="ts">
// Mock featured libraries data for now
const featuredLibraries = ref([
  {
    _path: '/content/downtown-central-library',
    title: 'Downtown Central Library',
    description: 'A cozy little library in the heart of downtown with mystery zines and community puzzles. This historic location has been serving puzzle enthusiasts for years.',
    location: {
      lat: 49.2827,
      lng: -123.1207,
      address: '789 Main Street, Downtown'
    },
    tags: ['Mystery', 'Community', 'Historic', 'Urban'],
    photo: '/images/libraries/downtown-central-library/2024-01-15-exterior-1.jpg',
    difficulty: 'intermediate',
    riddles_count: 8,
    established: '2019-03-15'
  },
  {
    _path: '/content/sunset-park-reading-nook',
    title: 'Sunset Park Reading Nook',
    description: 'Family-friendly library with children\'s puzzle books and adventure-themed riddles. Perfect for young puzzle solvers and families exploring together.',
    location: {
      lat: 49.2634,
      lng: -123.1456,
      address: 'Sunset Park, West Side'
    },
    tags: ['Children', 'Adventure', 'Family', 'Nature'],
    photo: '/images/libraries/sunset-park-reading-nook/2024-02-03-family-reading-1.jpg',
    difficulty: 'beginner',
    riddles_count: 12,
    established: '2020-07-20'
  },
  {
    _path: '/content/university-district-hub',
    title: 'University District Hub',
    description: 'Academic-focused library with science and philosophy zines, perfect for students and deep thinkers. Features complex logical puzzles and collaborative research challenges.',
    location: {
      lat: 49.2606,
      lng: -123.2460,
      address: 'University Boulevard, Near Campus'
    },
    tags: ['Science', 'Philosophy', 'Academic', 'Collaborative', 'Advanced'],
    photo: '/images/libraries/university-district-hub/2024-03-10-study-session-1.jpg',
    difficulty: 'advanced',
    riddles_count: 15,
    established: '2018-09-01'
  }
])

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