<template>
  <header class="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Tagline -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-decoration-none group">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-puzzle-piece" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Puzzle Pages
                </h1>
                <p class="text-xs text-gray-500 mt-0.5">Community Library Adventures</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex items-center space-x-1">
          <UButton
            to="/search"
            variant="ghost"
            icon="i-heroicons-map"
            class="text-gray-600 hover:text-blue-600"
          >
            Explore
          </UButton>
          <UButton
            to="/library/new"
            variant="ghost"
            icon="i-heroicons-building-library"
            class="text-gray-600 hover:text-blue-600"
          >
            Add Library
          </UButton>
        </nav>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-4">
          <div class="relative">
            <UInput
              v-model="searchQuery"
              placeholder="Search libraries and puzzles..."
              icon="i-heroicons-magnifying-glass"
              class="w-full"
              size="md"
              :ui="{ 
                rounded: 'rounded-full',
                icon: { trailing: { pointer: '' } }
              }"
              @keyup.enter="performSearch"
            >
              <template #trailing>
                <UButton
                  v-if="searchQuery"
                  @click="clearSearch"
                  icon="i-heroicons-x-mark"
                  variant="link"
                  size="xs"
                  class="text-gray-400 hover:text-gray-600"
                />
              </template>
            </UInput>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <UButton
            to="/logbook/new"
            color="primary"
            variant="solid"
            icon="i-heroicons-pencil-square"
            size="md"
            class="shadow-md hover:shadow-lg transition-shadow"
          >
            <span class="hidden sm:inline">Log Entry</span>
          </UButton>
          
          <!-- Mobile menu button -->
          <UButton
            variant="ghost"
            icon="i-heroicons-bars-3"
            class="md:hidden"
            @click="toggleMobileMenu"
          />
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-2">
          <UButton
            to="/search"
            variant="ghost"
            icon="i-heroicons-map"
            class="justify-start"
            @click="closeMobileMenu"
          >
            Explore Libraries
          </UButton>
          <UButton
            to="/library/new"
            variant="ghost"
            icon="i-heroicons-building-library"
            class="justify-start"
            @click="closeMobileMenu"
          >
            Add New Library
          </UButton>
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