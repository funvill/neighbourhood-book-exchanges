<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <AppHeader />
    <main class="pb-16">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout for all pages with enhanced Material Design theme
useHead({
  bodyAttrs: {
    class: 'font-sans antialiased'
  }
})
</script>