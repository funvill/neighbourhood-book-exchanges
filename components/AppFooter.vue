<template>
  <footer class="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-white" style="font-size:24px;">extension</span>
            </div>
            <h3 class="text-xl font-bold">Neighbourhood book exchanges</h3>
          </div>
          <p class="text-blue-100 leading-relaxed mb-6 max-w-md">
            Discover tiny libraries, find zines, solve riddles, and unlock the overall puzzle. 
            A community-driven project connecting puzzle enthusiasts and library lovers worldwide.
          </p>
          <div class="flex space-x-4">
            <a href="#todo" class="md-button flex items-center gap-1" style="background: var(--md-primary); color: var(--md-on-primary);">
              <span class="material-symbols-outlined" style="font-size:18px;">add</span>
              Add Library
            </a>
            <a href="#todo" class="md-button flex items-center gap-1" style="background: var(--md-primary-container); color: var(--md-on-primary-container);">
              <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
              Share Discovery
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-blue-200">Explore</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink 
                to="/" 
                class="text-blue-100 hover:text-white transition-colors flex items-center group"
              >
                <span class="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform" style="font-size:16px;">home</span>
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/search" 
                class="text-blue-100 hover:text-white transition-colors flex items-center group"
              >
                <span class="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform" style="font-size:16px;">map</span>
                Search Libraries
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="#todo?/logbook/new" 
                class="text-blue-100 hover:text-white transition-colors flex items-center group"
              >
                <span class="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform" style="font-size:16px;">edit</span>
                Add Log Entry
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Community Stats -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-blue-200">Community</h4>
          <div class="space-y-3">
            <div class="flex items-center text-blue-100">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                <span class="material-symbols-outlined" style="font-size:18px;">local_library</span>
              </div>
              <div>
                <div class="font-semibold text-white">{{ stats.libraries }}</div>
                <div class="text-xs">Libraries</div>
              </div>
            </div>
            <div class="flex items-center text-blue-100">
              <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                <span class="material-symbols-outlined" style="font-size:18px;">extension</span>
              </div>
              <div>
                <div class="font-semibold text-white">{{ stats.riddles }}</div>
                <div class="text-xs">Riddles Solved</div>
              </div>
            </div>
            <div class="flex items-center text-blue-100">
              <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                <span class="material-symbols-outlined" style="font-size:18px;">groups</span>
              </div>
              <div>
                <div class="font-semibold text-white">{{ stats.puzzlers }}</div>
                <div class="text-xs">Active Puzzlers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-blue-800/50 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-blue-200 text-sm">
            © {{ new Date().getFullYear() }} Neighbourhood book exchanges Project. Built with 
            <span class="material-symbols-outlined inline mx-1 text-red-400" style="font-size:16px;">favorite</span>
            for the community.
          </p>
          <div class="flex items-center mt-4 md:mt-0 text-blue-200 text-sm">
            <span class="mr-2">Powered by</span>
            <span class="material-symbols-outlined mr-1" style="font-size:16px;">rocket_launch</span>
            <span class="mr-3">Nuxt</span>
            <span class="material-symbols-outlined mr-1" style="font-size:16px;">waves</span>
            <span>Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Mock stats data - in real implementation this would come from an API
const stats = ref({
  libraries: 42,
  riddles: 127,
  puzzlers: 234
})
</script>