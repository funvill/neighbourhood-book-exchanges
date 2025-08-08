<template>
  <div>
    <!-- Project Introduction -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Puzzle Pages
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Discover the magic of tiny libraries scattered throughout your community. 
            Find hidden zines, solve mysterious riddles, and piece together the ultimate puzzle. 
            Each library holds secrets waiting to be unlocked by curious minds like yours.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/search"
              color="primary"
              size="lg"
              icon="i-heroicons-map"
            >
              Explore Libraries
            </UButton>
            <UButton
              to="/logbook/new"
              color="white"
              variant="solid"
              size="lg"
              icon="i-heroicons-pencil-square"
            >
              Share Your Discovery
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-map" class="w-8 h-8 text-blue-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Find Libraries</h4>
            <p class="text-gray-600">
              Use our interactive map to locate tiny libraries in your area. Each one contains unique puzzles and zines.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-puzzle-piece" class="w-8 h-8 text-green-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Solve Riddles</h4>
            <p class="text-gray-600">
              Read the zines, solve the riddles within each library, and collect clues for the bigger puzzle.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-trophy" class="w-8 h-8 text-purple-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Complete the Puzzle</h4>
            <p class="text-gray-600">
              Combine clues from multiple libraries to solve the overarching puzzle and unlock the final mystery.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Component -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Browse Libraries
        </h3>
        <SearchComponent />
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.libraries }}</div>
            <div class="text-gray-600">Libraries</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">{{ stats.riddles }}</div>
            <div class="text-gray-600">Riddles Solved</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">{{ stats.entries }}</div>
            <div class="text-gray-600">Log Entries</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">{{ stats.puzzlers }}</div>
            <div class="text-gray-600">Active Puzzlers</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: 'Puzzle Pages Project - Find Libraries, Solve Puzzles',
  meta: [
    {
      name: 'description',
      content: 'Discover tiny libraries, find zines, solve riddles, and unlock the ultimate puzzle. Join our community of puzzle enthusiasts and library lovers.'
    }
  ]
})

// Mock stats data - in real implementation this would come from an API
const stats = ref({
  libraries: 42,
  riddles: 127,
  entries: 89,
  puzzlers: 234
})
</script>