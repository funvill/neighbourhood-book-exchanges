<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Use AppHeader for consistent styling -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-none">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Layout now uses consistent AppHeader and AppFooter components
</script>