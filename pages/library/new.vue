<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Add New Library</h1>
      
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-900 mb-2">📚 Help Us Grow the Network!</h2>
        <p class="text-blue-800">
          Know of a tiny library that's not on our map? Help the community by adding it! 
          Your submission will be reviewed and added to help other puzzle enthusiasts discover new locations.
        </p>
      </div>

      <!-- Forward to the new logbook entry page with library=true parameter -->
      <LogbookForm :is-new-library="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
// This page uses the same form component but in "new library" mode
// The LogbookForm component handles the logic for new libraries vs new entries

// Set page meta
useHead({
  title: 'Add New Library - Neighbourhood book exchanges',
  meta: [
    {
      name: 'description',
      content: 'Add a new tiny library to the Neighbourhood book exchanges and help grow our community network.'
    }
  ]
})

// Redirect to the new logbook page with the library flag
await navigateTo('/logbook/new?type=library')
</script>