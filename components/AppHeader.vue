<template>
  <header class="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Tagline -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-decoration-none group">
            <div class="flex items-center space-x-3">
              <NuxtImg src="/logo.svg" alt="Neighbourhood book exchanges logo" class="w-10 h-10 object-contain" />
              <div>
                <h1 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Neighbourhood Little Libraries
                </h1>
                <p class="text-xs text-gray-500 mt-0.5">Community Library Adventures</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex items-center space-x-1">
          <!-- Navigation buttons removed per feedback -->
        </nav>

        <!-- Search Bar - Main Search Input -->
        <div class="flex-1 max-w-md mx-4">
          <form class="relative" @submit.prevent="performSearch">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search libraries, content, and tags..."
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
          <!-- Mobile menu button -->
          <button class="md-button md:hidden flex items-center justify-center bg-transparent shadow-none" @click="toggleMobileMenu" type="button">
            <span class="material-symbols-outlined" style="font-size:24px;">menu</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-2">
          <!-- Mobile navigation items removed per feedback -->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const searchQuery = ref('')
const showMobileMenu = ref(false)

// Initialize search query from URL on search page
onMounted(() => {
  if (route.path === '/search' && route.query.q) {
    searchQuery.value = String(route.query.q)
  }
})

// Watch for route changes to update search query
watch(() => route.query.q, (newQuery) => {
  if (route.path === '/search' && newQuery) {
    searchQuery.value = String(newQuery)
  }
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (route.path === '/search') {
    navigateTo('/search')
  }
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