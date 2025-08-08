<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoNHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 mr-2" />
            <span class="text-sm font-medium">Community Puzzle Adventure</span>
          </div>
          
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to<br>Puzzle Pages
          </h1>
          
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the magic of tiny libraries scattered throughout your community. 
            Find hidden zines, solve mysterious riddles, and piece together the ultimate puzzle. 
            Each library holds secrets waiting to be unlocked by curious minds like yours.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/search"
              color="white"
              size="lg"
              icon="i-heroicons-map"
              class="shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Explore Libraries
            </UButton>
            <UButton
              to="/logbook/new"
              variant="outline"
              color="white"
              size="lg"
              icon="i-heroicons-pencil-square"
              class="border-white/30 hover:bg-white/10 backdrop-blur-sm"
            >
              Share Your Discovery
            </UButton>
          </div>
        </div>
      </div>
      
      <!-- Wave Bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UIcon name="i-heroicons-building-library" class="w-8 h-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.libraries }}</div>
            <div class="text-gray-600 font-medium">Libraries</div>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UIcon name="i-heroicons-puzzle-piece" class="w-8 h-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.riddles }}</div>
            <div class="text-gray-600 font-medium">Riddles Solved</div>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.entries }}</div>
            <div class="text-gray-600 font-medium">Log Entries</div>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UIcon name="i-heroicons-users" class="w-8 h-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.puzzlers }}</div>
            <div class="text-gray-600 font-medium">Active Puzzlers</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of puzzle enthusiasts in an adventure that spans across your entire community
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110">
                <UIcon name="i-heroicons-map" class="w-10 h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">1</div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Find Libraries</h3>
            <p class="text-gray-600 leading-relaxed">
              Use our interactive map to locate tiny libraries in your area. Each one contains unique puzzles and zines 
              waiting to be discovered.
            </p>
          </div>
          
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110">
                <UIcon name="i-heroicons-puzzle-piece" class="w-10 h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">2</div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Solve Riddles</h3>
            <p class="text-gray-600 leading-relaxed">
              Read the zines, solve the riddles within each library, and collect clues for the bigger puzzle. 
              Every solution brings you closer to the mystery.
            </p>
          </div>
          
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110">
                <UIcon name="i-heroicons-trophy" class="w-10 h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">3</div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Complete the Puzzle</h3>
            <p class="text-gray-600 leading-relaxed">
              Combine clues from multiple libraries to solve the overarching puzzle and unlock the final mystery. 
              Collaborate with others to reach the ultimate solution.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Libraries -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Featured Libraries</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our most popular puzzle destinations and discover what makes each location special
          </p>
        </div>
        
        <FeaturedLibraries />
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold mb-6">Ready to Begin Your Adventure?</h2>
        <p class="text-xl text-blue-100 mb-8 leading-relaxed">
          Join our growing community of puzzle enthusiasts and help expand the network of mystery libraries. 
          Your next great discovery is just around the corner!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/search"
            color="white"
            size="lg"
            icon="i-heroicons-map"
            class="shadow-xl hover:shadow-2xl transition-all"
          >
            Start Exploring Now
          </UButton>
          <UButton
            to="/library/new"
            variant="outline"
            color="white"
            size="lg"
            icon="i-heroicons-plus"
            class="border-white/30 hover:bg-white/10"
          >
            Add Your Library
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page meta with enhanced SEO
useHead({
  title: 'Puzzle Pages - Community Library Adventure Platform',
  meta: [
    {
      name: 'description',
      content: 'Discover tiny libraries, solve puzzles, and unlock community mysteries. Join thousands of puzzle enthusiasts in an adventure spanning your entire community.'
    },
    {
      property: 'og:title',
      content: 'Puzzle Pages - Community Library Adventure Platform'
    },
    {
      property: 'og:description',
      content: 'Discover tiny libraries, solve puzzles, and unlock community mysteries. Join thousands of puzzle enthusiasts in an adventure spanning your entire community.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Enhanced stats data
const stats = ref({
  libraries: 42,
  riddles: 127,
  entries: 89,
  puzzlers: 234
})
</script>