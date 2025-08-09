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
import { ref, onMounted } from 'vue'

// Define library interface to match API response
interface Library {
  id: number
  slug: string
  title: string
  description: string
  difficulty?: string
  tags?: string[]
  photo: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  established?: string
  lastModified: string
  _path: string
}

const featuredLibraries = ref<Library[]>([])

// Fetch and sort libraries by most recent updates
onMounted(async () => {
  try {
    const libraries = await $fetch('/api/libraries') as Library[]
    
    // Sort by lastModified date (most recent first) and take top 3
    const sortedLibraries = libraries
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 3)
    
    featuredLibraries.value = sortedLibraries
  } catch (error) {
    console.error('Error loading featured libraries:', error)
    // Fallback to empty array which will show the "No Featured Libraries" message
    featuredLibraries.value = []
  }
})
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