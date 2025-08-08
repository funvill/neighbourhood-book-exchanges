<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoNHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span class="material-symbols-outlined mr-2" style="font-size:20px;">auto_awesome</span>
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
            <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-1">
              <span class="material-symbols-outlined" style="font-size:20px;">map</span>
              Explore Libraries
            </a>
            <a href="/logbook/new" class="md-button border border-white/30 hover:bg-white/10 backdrop-blur-sm flex items-center gap-1" style="background:transparent;color:white;">
              <span class="material-symbols-outlined" style="font-size:20px;">edit</span>
              Share Your Discovery
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">local_library</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.libraries }}</div>
            <div class="text-gray-600 font-medium">Libraries</div>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">extension</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.riddles }}</div>
            <div class="text-gray-600 font-medium">Riddles Solved</div>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">menu_book</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.entries }}</div>
            <div class="text-gray-600 font-medium">Log Entries</div>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">groups</span>
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
                <span class="material-symbols-outlined text-white" style="font-size:40px;">map</span>
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
                <span class="material-symbols-outlined text-white" style="font-size:40px;">extension</span>
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
                <span class="material-symbols-outlined text-white" style="font-size:40px;">emoji_events</span>
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

    <!-- Interactive Map Section -->
    <section class="py-12 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <span class="material-symbols-outlined mr-2">map</span>
          Library Map
        </h2>
        <div class="w-full h-96 rounded-xl overflow-hidden shadow md-elevated">
          <div id="library-map" style="width: 100%; height: 100%;"></div>
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
          <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:20px;">map</span>
            Start Exploring Now
          </a>
          <a href="/library/new" class="md-button border border-white/30 hover:bg-white/10 flex items-center gap-1" style="background:transparent;color:white;">
            <span class="material-symbols-outlined" style="font-size:20px;">add</span>
            Add Your Library
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Library locations for the map (sync with featured libraries)
const libraryLocations = [
  {
    name: 'Downtown Central Library',
    lat: 49.2827,
    lng: -123.1207,
    address: '789 Main Street, Downtown'
  },
  {
    name: 'Sunset Park Reading Nook',
    lat: 49.2634,
    lng: -123.1456,
    address: 'Sunset Park, West Side'
  },
  {
    name: 'University District Hub',
    lat: 49.2606,
    lng: -123.2460,
    address: 'University Boulevard, Near Campus'
  }
]

onMounted(() => {
  // Load Leaflet CSS/JS from CDN if not already loaded
  if (!window.L) {
    const leafletCss = document.createElement('link')
    leafletCss.rel = 'stylesheet'
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(leafletCss)

    const leafletScript = document.createElement('script')
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    leafletScript.onload = initMap
    document.body.appendChild(leafletScript)
  } else {
    initMap()
  }

  function initMap() {
    const map = window.L.map('library-map').setView([49.27, -123.13], 12)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    libraryLocations.forEach(lib => {
      window.L.marker([lib.lat, lib.lng])
        .addTo(map)
        .bindPopup(`<b>${lib.name}</b><br>${lib.address}`)
    })
  }
})

// Enhanced stats data
const stats = ref({
  libraries: 42,
  riddles: 127,
  entries: 89,
  puzzlers: 234
})
</script>