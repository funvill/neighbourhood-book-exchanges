<template>
  <!-- Legacy single-param route: quickly redirecting to canonical /library/{id}/{slug} -->
  <!-- TODO: Remove this file after monitoring 404s & access logs for old links (~30 days from 2025-08-10) -->
  <div class="p-8 text-center text-sm text-gray-600">
    <p>Redirecting to the new library page…</p>
    <p class="mt-2"><NuxtLink :to="targetUrl" class="text-blue-600 underline">Click here if not redirected</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useRoute(): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useAsyncData<T>(key: string, handler: () => Promise<T>): { data: { value: T | null } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function navigateTo(path: string, opts?: any): Promise<any>

import { parseLegacySingleParam, extractLibraryId } from '~/utils/libraryUrl'

const route = useRoute()
const routeParam = route.params.id as string
const urlParts = parseLegacySingleParam(routeParam)
const initialSlug = urlParts?.slug || routeParam
const libraryId = urlParts?.library_id || extractLibraryId(routeParam) || ''
const resolvedSlug = ref(initialSlug)
const canonicalSlug = ref<string | null>(null)
const targetUrl = ref<string>('')

// Attempt to derive canonical slug if we can resolve by library_id
const { data: doc } = useAsyncData<any>(`legacy-redirect:${routeParam}`, async () => {
  if (!libraryId) return null
  const qc = (typeof queryContent === 'function') ? queryContent : null
  if (!qc) return null
  try {
    const content = await qc('/libraries').where({ library_id: Number(libraryId) }).findOne()
    if (content) {
      canonicalSlug.value = content.slug || content._path?.replace(/^\/libraries\//, '') || null
      if (canonicalSlug.value) resolvedSlug.value = canonicalSlug.value
      return content
    }
  } catch { /* ignore */ }
  return null
})

watch([doc, () => canonicalSlug.value], async () => {
  const padded = libraryId ? libraryId.padStart(5,'0') : ''
  const slug = canonicalSlug.value || resolvedSlug.value
  if (padded) {
    const dest = `/library/${padded}/${slug}`
    targetUrl.value = dest
  if (dest !== route.fullPath) await navigateTo(dest, { redirectCode: 301, replace: true })
  }
}, { immediate: true })

watch(route, () => {
  const padded = libraryId ? libraryId.padStart(5,'0') : ''
  if (padded) {
    const dest = `/library/${padded}/${canonicalSlug.value || resolvedSlug.value}`
    targetUrl.value = dest
  if (dest !== route.fullPath) navigateTo(dest, { redirectCode: 301, replace: true })
  }
})
</script>

<style>
/* Minimal legacy redirect page */
</style>