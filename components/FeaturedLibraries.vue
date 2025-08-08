<template>
  <div v-if="featuredLibraries && featuredLibraries.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <LibraryCard
      v-for="library in featuredLibraries"
      :key="library._path"
      :library="library"
    />
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
import { ref } from 'vue'

// Mock featured libraries data for now
const featuredLibraries = ref([
  {
    _path: '/content/downtown-central-library',
    title: 'Downtown Central Library',
    description: 'A cozy little library in the heart of downtown with mystery zines and community content. This historic location has been serving library enthusiasts for years.',
    location: {
      lat: 49.2827,
      lng: -123.1207,
      address: '789 Main Street, Downtown'
    },
    tags: ['Mystery', 'Community', 'Historic', 'Urban'],
    photo: '/images/libraries/downtown-central-library/2024-01-15-exterior-1.jpg',
    difficulty: 'intermediate',
    entries_count: 8,
    established: '2019-03-15'
  },
  {
    _path: '/content/sunset-park-reading-nook',
    title: 'Sunset Park Reading Nook',
    description: 'Family-friendly library with children\'s books and adventure stories. Perfect for young readers and families exploring together.',
    location: {
      lat: 49.2634,
      lng: -123.1456,
      address: 'Sunset Park, West Side'
    },
    tags: ['Children', 'Adventure', 'Family', 'Nature'],
    photo: '/images/libraries/sunset-park-reading-nook/2024-02-03-family-reading-1.jpg',
    difficulty: 'beginner',
    entries_count: 12,
    established: '2020-07-20'
  },
  {
    _path: '/content/university-district-hub',
    title: 'University District Hub',
    description: 'Academic-focused library with science and philosophy zines, perfect for students and deep thinkers. Features complex content and collaborative research materials.',
    location: {
      lat: 49.2606,
      lng: -123.2460,
      address: 'University Boulevard, Near Campus'
    },
    tags: ['Science', 'Philosophy', 'Academic', 'Collaborative', 'Advanced'],
    photo: '/images/libraries/university-district-hub/2024-03-10-study-session-1.jpg',
    difficulty: 'advanced',
    entries_count: 15,
    established: '2018-09-01'
  }
])
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>