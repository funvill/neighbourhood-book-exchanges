<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Logbook Test Page</h1>
    
    <div v-if="logbookEntries && logbookEntries.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Logbook</h2>
      <div class="space-y-6">
        <div v-for="entry in logbookEntries" :key="entry._path" class="border-b border-gray-200 pb-6 last:border-b-0">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ formatLogbookDate(entry.date) }}</h3>
          <div class="prose max-w-none">
            <ContentRenderer :value="entry" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-gray-500">No logbook entries found.</div>
    
    <div class="mt-8 bg-gray-100 p-4 rounded">
      <h3 class="font-bold">Debug Info:</h3>
      <p>Found {{ logbookEntries ? logbookEntries.length : 0 }} logbook entries</p>
      <pre class="text-xs">{{ JSON.stringify(logbookEntries, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LogbookEntry {
  _path: string
  date: string
  title?: string
  body: any
}

// Test logbook fetching for library 00004-103-w-15th-ave
const { data: logbookEntries } = await useAsyncData<LogbookEntry[]>('logbook-test', async () => {
  try {
    const entries = await queryContent('/libraries/00004-103-w-15th-ave/logbook').find()
    console.log('Found entries:', entries)
    // Sort by date, newest first
    return (entries || [])
      .filter((entry: any) => entry.date) // Only entries with dates
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching logbook entries:', error)
    return []
  }
})

// Format date for logbook entries
const formatLogbookDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return dateStr // Fallback to original string if parsing fails
  }
}
</script>