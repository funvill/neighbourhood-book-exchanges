<template>
  <div v-if="featuredLibraries && featuredLibraries.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div 
      v-for="library in featuredLibraries" 
      :key="library._path"
      class="group"
    >
  <div class="md-card h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col">
        <!-- Library Image -->
        <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
          <NuxtImg
            v-if="library.photo"
            :src="library.photo"
            :alt="library.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-6xl text-gray-400">local_library</span>
          </div>
          <!-- Difficulty Badge -->
          <div class="absolute top-3 right-3">
            <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold capitalize shadow-md', getDifficultyClass(library.difficulty)]">
              {{ library.difficulty }}
            </span>
          </div>
        </div>

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
            <span class="material-symbols-outlined text-blue-500 mr-2" style="font-size:18px;">location_on</span>
            <span>{{ library.location?.address || `${library.location?.lat?.toFixed(4)}, ${library.location?.lng?.toFixed(4)}` }}</span>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center text-green-600">
              <span class="material-symbols-outlined mr-1" style="font-size:18px;">extension</span>
              <span>{{ library.riddles_count }} riddles</span>
            </div>
            <div class="flex items-center text-purple-600">
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
        <div class="flex gap-2 mt-6">
          <a :href="`/library/${getLibrarySlug(library._path)}`" class="md-button flex-1 flex items-center justify-center gap-1">
            <span class="material-symbols-outlined" style="font-size:18px;">visibility</span>
            Explore
          </a>
          <a :href="`/logbook/new?library=${getLibrarySlug(library._path)}`" class="md-button flex-1 flex items-center justify-center gap-1" style="background: var(--md-primary-container); color: var(--md-on-primary-container);">
            <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
            Log Entry
          </a>
        </div>
  </div>
    </div>
  </div>
  
  <!-- Fallback when no libraries are available -->
  <div v-else class="text-center py-12 text-gray-500">
    <span class="material-symbols-outlined text-6xl mx-auto mb-4">local_library</span>
    <h3 class="text-lg font-semibold mb-2">No Featured Libraries Yet</h3>
    <p class="mb-4">Be the first to add a library to our community!</p>
    <a href="/library/new" class="md-button" style="background: var(--md-primary); color: var(--md-on-primary);">
      <span class="material-symbols-outlined align-middle mr-1">add</span>
      Add First Library
    </a>
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