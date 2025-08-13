<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <SearchComponent :initial-search-query="searchQuery" />
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: 'Search Libraries - Neighbourhood book exchanges',
  meta: [
    {
      name: 'description',
      content: 'Search and discover tiny libraries, their locations, and the content they contain.'
    }
  ]
})

// Handle URL search query
const route = useRoute()
const searchQuery = route.query.q as string || ''
</script>