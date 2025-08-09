<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Hero Section -->
    <section class="hero-section text-center py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Add Logbook Entry
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Share your experience discovering books at neighbourhood little libraries.
        </p>
      </div>
    </section>

    <!-- Coming Soon Section -->
    <section class="py-16 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <span class="material-symbols-outlined text-6xl text-blue-500 mb-4">edit_note</span>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
          <p class="text-gray-600 mb-6">
            We're working on a feature that will allow you to add logbook entries about your visits to neighbourhood little libraries. 
            Share the books you've discovered, borrowed, or contributed!
          </p>
          <div class="space-y-4 text-left max-w-md mx-auto">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <span class="text-gray-700">Log books you've borrowed</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <span class="text-gray-700">Share books you've contributed</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <span class="text-gray-700">Rate your library experience</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-500 mt-1">check_circle</span>
              <span class="text-gray-700">Connect with other book lovers</span>
            </div>
          </div>
          <div class="mt-8">
            <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all flex items-center gap-1 mx-auto">
              <span class="material-symbols-outlined" style="font-size:20px;">map</span>
              Explore Libraries Now
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: 'Add Logbook Entry - Neighbourhood Little Libraries',
  description: 'Add a logbook entry about your experience with neighbourhood little libraries.'
})
</script>
