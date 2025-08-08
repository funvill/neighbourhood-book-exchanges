<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Search Libraries</h1>
      <p class="text-gray-600">
        Find tiny libraries near you and discover the content they contain.
      </p>
    </div>
    
    <SearchComponent />
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: 'Search Libraries - Puzzle Pages Project',
  meta: [
    {
      name: 'description',
      content: 'Search and discover tiny libraries, their locations, and the content they contain.'
    }
  ]
})

// Handle URL search query
const route = useRoute()
const searchQuery = route.query.q as string

// You can pass this to SearchComponent if needed
// or handle initial search state here
</script>