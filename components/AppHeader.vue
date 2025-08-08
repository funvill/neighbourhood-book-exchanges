<template>
  <header class="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Tagline -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-decoration-none group">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-white" style="font-size:24px;">extension</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Neighbourhood book exchanges
                </h1>
                <p class="text-xs text-gray-500 mt-0.5">Community Library Adventures</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex items-center space-x-1">
          <a href="/search" class="md-button text-gray-600 hover:text-blue-600 flex items-center gap-1 bg-transparent shadow-none">
            <span class="material-symbols-outlined" style="font-size:20px;">map</span>
            Explore
          </a>
          <a href="/library/new" class="md-button text-gray-600 hover:text-blue-600 flex items-center gap-1 bg-transparent shadow-none">
            <span class="material-symbols-outlined" style="font-size:20px;">local_library</span>
            Add Library
          </a>
        </nav>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-4">
          <form class="relative" @submit.prevent="performSearch">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search libraries and content..."
              class="w-full rounded-full border border-gray-200 py-2 pl-10 pr-10 focus:outline-none focus:border-blue-400 text-sm shadow-sm"
              @keyup.enter="performSearch"
            />
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400" style="font-size:20px;">search</span>
            <button v-if="searchQuery" type="button" @click="clearSearch" class="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
              <span class="material-symbols-outlined" style="font-size:20px;">close</span>
            </button>
          </form>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <a href="/logbook/new" class="md-button shadow-md hover:shadow-lg transition-shadow flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:20px;">edit</span>
            <span class="hidden sm:inline">Log Entry</span>
          </a>
          <!-- Mobile menu button -->
          <button class="md-button md:hidden flex items-center justify-center bg-transparent shadow-none" @click="toggleMobileMenu" type="button">
            <span class="material-symbols-outlined" style="font-size:24px;">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-2">
          <a href="/search" class="md-button justify-start flex items-center gap-1" @click="closeMobileMenu">
            <span class="material-symbols-outlined" style="font-size:20px;">map</span>
            Explore Libraries
          </a>
          <a href="/library/new" class="md-button justify-start flex items-center gap-1" @click="closeMobileMenu">
            <span class="material-symbols-outlined" style="font-size:20px;">local_library</span>
            Add New Library
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const showMobileMenu = ref(false)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  showMobileMenu.value = false
})
</script>