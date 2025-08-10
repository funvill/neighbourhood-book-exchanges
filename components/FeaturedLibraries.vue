<template>
  <div v-if="featuredLibraries && featuredLibraries.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <LibraryCard
      v-for="library in featuredLibraries"
      :key="library._path"
      :library="library"
    />
  </div>
  
  <!-- Fallback when no libraries are available -->
  <div v-else class="text-center py-12 text-gray-500">
    <span class="material-symbols-outlined text-6xl mx-auto mb-4">local_library</span>
    <h3 class="text-lg font-semibold mb-2">No Featured Libraries Yet</h3>
    <p class="mb-4">Be the first to explore our community libraries!</p>
    <a href="/search" class="md-button" style="background: var(--md-primary); color: var(--md-on-primary);">
      <span class="material-symbols-outlined align-middle mr-1">map</span>
      Explore Libraries
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any

// Define library interface to match API response
interface Library {
  slug: string
  title: string
  description: string
  tags?: string[]
  photo: string
  location: { lat: number; lng: number; address?: string }
  _path: string
  updated?: string
}

const featuredLibraries = ref<Library[]>([])

// Fetch and sort libraries by most recent updates
onMounted(async () => {
  try {
    const docs = await queryContent('/libraries').where({ _extension: 'md' }).find()
    const mapped: Library[] = docs.map((d: any) => {
      const updated = d.updated || d._file?.mtime || d._source?.mtime
      return {
        slug: d._path.replace(/^\/libraries\//, ''),
        title: d.title || d._path,
        description: (d.body?.children?.find((c: any) => c.tag === 'p')?.children || []).map((c: any) => c.value || '').join(' ').substring(0,160) + '…',
        tags: d.tags || [],
        photo: d.photo || '/images/libraries/placeholder-library.jpg',
        location: d.location || { lat: 49.2827, lng: -123.1207 },
        _path: d._path,
        updated
      }
    })
    featuredLibraries.value = mapped
      .sort((a, b) => new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime())
      .slice(0,3)
  } catch (e) {
    console.error('Error loading featured libraries:', e)
    featuredLibraries.value = []
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>