<template>
  <header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <!-- Title and Tagline -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-decoration-none">
            <h1 class="text-3xl font-bold text-gray-900">Puzzle Pages Project</h1>
            <p class="text-sm text-gray-600 mt-1">Find zines in the libraries, solve the riddles, solve the overall puzzle</p>
          </NuxtLink>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <UInput
              v-model="searchQuery"
              placeholder="Search libraries and entries..."
              icon="i-heroicons-magnifying-glass"
              class="w-full"
              @keyup.enter="performSearch"
            />
          </div>
        </div>

        <!-- Add Log Book Entry Button -->
        <div class="flex-shrink-0">
          <UButton
            to="/logbook/new"
            color="primary"
            variant="solid"
            icon="i-heroicons-plus"
          >
            Add Log Book Entry
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>