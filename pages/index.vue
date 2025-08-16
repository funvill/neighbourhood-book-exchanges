<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoNHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to<br>Neighbourhood Little Libraries
          </h1>
          
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the magic of tiny libraries scattered throughout your community. 
            Find hidden books, solve mysterious challenges, and piece together stories from your neighborhood. 
            Each library holds secrets waiting to be unlocked by curious minds like yours.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" class="md-button shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-1">
              <span class="material-symbols-outlined" style="font-size:20px;">map</span>
              Explore Libraries
            </a>            
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
              Use our interactive map to locate tiny libraries in your area. Each one contains unique content and books 
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
              Read the books, explore the content within each library, and collect insights for your journey. 
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

  <!-- Recently Updated Libraries section removed -->

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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
  library_id?: string | number
}

// Define the raw library data interface from the API
interface RawLibraryData {
  slug: string
  title: string
  location?: {
    lat: number
    lng: number
    address?: string
  }
  description: string
  photo: string
  tags?: string[]
  library_id?: string | number
}

// Data
const { data: libSummaries } = useLibraries()
const allLibraries = ref<Library[]>([])

// Stats must be declared before the watcher that references it (immediate watcher runs synchronously)
const stats = ref({
  libraries: 0,
  logbookEntries: 0
})

watch(() => libSummaries.value, async (vals: RawLibraryData[] | null) => {
  if (!vals || !Array.isArray(vals)) return
  allLibraries.value = vals.map((v: RawLibraryData, idx: number) => ({
    id: idx + 1,
    slug: v.slug,
    title: v.title,
    location: v.location || { lat: 49.2827, lng: -123.1207 },
    description: v.description,
    photo: v.photo,
    tags: v.tags,
    library_id: v.library_id
  }))
  stats.value.libraries = allLibraries.value.length
  stats.value.logbookEntries = allLibraries.value.length
}, { immediate: true })
</script>