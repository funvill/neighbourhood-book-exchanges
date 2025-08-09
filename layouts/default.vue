<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- App Bar -->
    <header class="bg-purple-600 text-white px-6 py-4 flex items-center justify-between w-full shadow-lg sticky top-0 z-50 border-b-4 border-purple-800">
      <div class="flex items-center">        
        <NuxtLink to="/"><img src="/logo.svg" alt="Neighbourhood book exchanges logo" class="h-12 w-12 mr-2"></NuxtLink>
        <span class="font-bold text-4xl">Neighbourhood Little Libraries</span>        
      </div>
      <form class="flex items-center gap-2" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="rounded-full px-3 py-2 text-black border-0 focus:outline-none text-sm"
          style="min-width: 200px;"
        >
        <button type="submit" class="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined" style="font-size:18px;">search</span>
          Search
        </button>
      </form>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-none">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-purple-100 text-purple-800 py-4 px-6 text-center border-t border-purple-200">
      <span class="material-symbols-outlined align-middle mr-1">local_library</span>
      <span>Made with ❤️ by <a href='https://blog.abluestar.com'>@funvill</a></span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    // Navigate to search page with query
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.value)}`
    searchQuery.value = ''
  }
}
</script>