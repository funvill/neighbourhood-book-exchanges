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
            <span class="text-sm font-medium">Community Library Adventure</span>
          </div>
          
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to<br>Neighbourhood Little Libraries
          </h1>
          
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the magic of tiny libraries scattered throughout your community. 
            Find hidden zines, solve mysterious challenges, and piece together stories from your neighborhood. 
            Each library holds secrets waiting to be unlocked by curious minds like yours.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-1">
              <span class="material-symbols-outlined" style="font-size:20px;">map</span>
              Explore Libraries
            </a>
            <a href="#todo?/logbook/new" class="md-button border border-white/30 hover:bg-white/10 backdrop-blur-sm flex items-center gap-1" style="background:transparent;color:white;">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">local_library</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.libraries }}</div>
            <div class="text-gray-600 font-medium">Libraries</div>
          </div>
          <div class="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white" style="font-size:32px;">menu_book</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.logbookEntries }}</div>
            <div class="text-gray-600 font-medium">Log Book Entries</div>
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
            Join thousands of library enthusiasts in an adventure that spans across your entire community
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
              Use our interactive map to locate tiny libraries in your area. Each one contains unique content and zines 
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
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Explore Content</h3>
            <p class="text-gray-600 leading-relaxed">
              Read the zines, explore the content within each library, and collect insights for your journey. 
              Every discovery brings you closer to understanding your community.
            </p>
          </div>
          
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110">
                <span class="material-symbols-outlined text-white" style="font-size:40px;">emoji_events</span>
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">3</div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Share Your Journey</h3>
            <p class="text-gray-600 leading-relaxed">
              Combine insights from multiple libraries to create your own story and connect with community discoveries. 
              Collaborate with others to build a rich tapestry of local knowledge.
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

    <!-- Recently Updated Libraries -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Recently Updated Libraries</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions and updates to our community library network
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
          Join our growing community of library enthusiasts and help expand the network of community libraries. 
          Your next great discovery is just around the corner!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all flex items-center gap-1">
            <span class="material-symbols-outlined" style="font-size:20px;">map</span>
            Start Exploring Now
          </a>
          <a href="/library/log" class="md-button border border-white/30 hover:bg-white/10 flex items-center gap-1" style="background:transparent;color:white;">
            <span class="material-symbols-outlined" style="font-size:20px;">edit_note</span>
            Add Logbook Entry
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useLibraries(): { data: { value: any[] | null }; pending: any }

// Define library interface to match API response
interface Library {
  id: number
  slug: string
  title: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  description: string
  photo: string
  tags?: string[]
}

// Data
const { data: libSummaries, pending: libsPending } = useLibraries()
const allLibraries = ref<Library[]>([])
// Stats must be declared before the watcher that references it (immediate watcher runs synchronously)
const stats = ref({
  libraries: 0,
  logbookEntries: 0
})

watch(() => libSummaries.value, async (vals: any[] | null) => {
  if (!vals || !Array.isArray(vals)) return
  allLibraries.value = vals.map((v: any, idx: number) => ({
    id: idx + 1,
    slug: v.slug,
    title: v.title,
    location: v.location || { lat: 49.2827, lng: -123.1207 },
    description: v.description,
    photo: v.photo,
    tags: v.tags
  }))
  // Update stats when data arrives
  stats.value.libraries = allLibraries.value.length
  stats.value.logbookEntries = allLibraries.value.length
  await nextTick()
  ensureMap()
}, { immediate: true })

function ensureMap() {
  if (typeof window === 'undefined') return
  if (!document.getElementById('library-map')) return
  if (!(window as any).L) {
    // Load assets then init
    const leafletCss = document.createElement('link')
    leafletCss.rel = 'stylesheet'
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(leafletCss)
    const leafletScript = document.createElement('script')
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    leafletScript.onload = () => initMap()
    document.body.appendChild(leafletScript)
  } else {
    initMap()
  }
}

function initMap() {
  if (!(window as any).L) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = (window as any).L
  const mapEl = document.getElementById('library-map')
  if (!mapEl) return
  if ((mapEl as any)._initialized) return
  const map = L.map('library-map').setView([49.27, -123.13], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
  const markers: any[] = []
  allLibraries.value.forEach(library => {
    const marker = L.marker([library.location.lat, library.location.lng])
      .addTo(map)
      .bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold">${library.title}</h4>
          <p class="text-sm text-gray-600">${library.description}</p>
          <a href="/library/${library.slug}" class="text-blue-600 hover:underline">View Details</a>
        </div>
      `)
    markers.push(marker)
  })
  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.05))
  }
  ;(mapEl as any)._initialized = true
}

// Enhanced stats data with actual imported library count (already declared above)

// Populate stats from content (approximate; logbook counting could be added later)
onMounted(() => ensureMap())
</script>