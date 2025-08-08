<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">About Puzzle Pages</h3>
          <p class="text-gray-300">
            Discover tiny libraries, find zines, solve riddles, and unlock the overall puzzle. 
            A community-driven project connecting puzzle enthusiasts and library lovers.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-gray-300 hover:text-white transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/search" class="text-gray-300 hover:text-white transition-colors">
                Search Libraries
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/logbook/new" class="text-gray-300 hover:text-white transition-colors">
                Add Log Book Entry
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/library/new" class="text-gray-300 hover:text-white transition-colors">
                Add New Library
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Get Involved</h3>
          <p class="text-gray-300 mb-2">
            Help grow our community by adding new libraries and sharing your discoveries.
          </p>
          <UButton
            to="/logbook/new"
            color="white"
            variant="outline"
            size="sm"
          >
            Contribute Now
          </UButton>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} Puzzle Pages Project. Built with ❤️ for the community.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>