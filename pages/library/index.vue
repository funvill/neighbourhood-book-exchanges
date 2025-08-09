<script setup lang="ts">
import { onMounted } from 'vue'

// Automatically redirect /library/ to home page
onMounted(() => {
  window.location.replace('/')
})
</script>

<template>
  <!-- This page automatically redirects to home -->
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Redirecting to home page...</p>
    </div>
  </div>
</template>
