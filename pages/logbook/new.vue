<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="material-symbols-outlined text-blue-600" style="font-size:36px;">edit_note</span>
      Add Log Entry
    </h1>

    <!-- Library Context -->
    <div v-if="librarySlug" class="mb-8">
      <div class="flex items-start gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
        <span class="material-symbols-outlined text-blue-500" style="font-size:32px;">local_library</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-600 mb-1">Adding an entry for</p>
          <p class="text-lg font-semibold text-gray-900 truncate">
            <NuxtLink :to="libraryUrl" class="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">
              <span v-if="libraryTitle">{{ libraryTitle }}</span>
              <span v-else>{{ librarySlug }}</span>
            </NuxtLink>
          </p>
          <p v-if="!libraryTitleFetched" class="text-xs text-gray-500 mt-1">Loading library details…</p>
          <p v-else-if="libraryTitleMissing" class="text-xs text-red-600 mt-1">Library not found. Make sure the link is correct.</p>
          <p v-else class="text-xs text-gray-500 mt-1">You can click the library name to review its page before submitting.</p>
        </div>
        <div class="text-xs text-gray-500">Slug:<br><code class="font-mono text-[11px] bg-white/70 px-1 py-0.5 rounded">{{ librarySlug }}</code></div>
      </div>
    </div>

    <!-- Terms of Service / License -->
    <div class="mb-10">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Terms & License (CC0 1.0 Universal)</h2>
      <div class="border rounded-lg bg-white shadow-sm max-h-56 overflow-y-auto p-4 text-sm leading-relaxed space-y-3 prose prose-sm">
        <p><strong>Creative Commons Zero v1.0 Universal (CC0 1.0)</strong></p>
        <p>By submitting content, you dedicate your contribution to the public domain to the fullest extent permitted by law. If that is not possible, you grant everyone a perpetual, worldwide, non-exclusive, no-conditions license to use, modify, distribute, and build upon your submission for any purpose, even commercially.</p>
        <p>You waive all related rights and claims, including attribution, to the extent allowed. Do not submit material you do not have the right to share. Submissions may be moderated or removed.</p>
        <p>Your submission is optional and anonymous unless you include identifying information in the text. Please avoid personal data, private addresses (beyond library location context), or sensitive content.</p>
        <p>By continuing you acknowledge these terms.</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="onSubmit" class="space-y-10">
      <!-- Details -->
      <div>
        <label for="details" class="block text-sm font-medium text-gray-700 mb-1">Details (Logbook Entry)</label>
  <textarea id="details" v-model.trim="form.details" rows="5" class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-3" placeholder="Share observations, story, condition, contents…"></textarea>
        <p class="mt-1 text-xs text-gray-500">Optional. Add as much or as little detail as you’d like.</p>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Upload a Photo (optional)</label>
        <input type="file" accept="image/*" @change="onImageChange" class="block w-full text-sm text-gray-700" />
        <div v-if="image.preview" class="mt-4">
          <p class="text-xs text-gray-500 mb-2">Preview:</p>
          <img :src="image.preview" alt="Preview" class="max-h-64 rounded-lg border object-contain" />
          <button type="button" @click="clearImage" class="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>Remove Image
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
        <input id="tags" ref="tagInputRef" v-model="tagInput" @keydown.tab.prevent="tryAutocomplete" @input="onTagInput" type="text" class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2" placeholder="e.g. kid-friendly, poetry, puzzle" />
        <div v-if="tagSuggestions.length" class="mt-2 flex flex-wrap gap-2">
          <button v-for="s in tagSuggestions" :key="s" type="button" @click="applySuggestion(s)" class="px-2 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium">{{ s }}</button>
        </div>
        <p class="mt-1 text-xs text-gray-500">Tab to autocomplete the last tag. Existing tags suggested below.</p>
        <div v-if="currentTags.length" class="mt-3 flex flex-wrap gap-2">
          <span v-for="t in currentTags" :key="t" class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            <span>{{ t }}</span>
            <button type="button" class="hover:text-red-600" @click="removeTag(t)">
              <span class="material-symbols-outlined" style="font-size:14px;">close</span>
            </button>
          </span>
        </div>
      </div>

      <!-- Questions (single answer) -->
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Condition</h3>
          <SingleSelectChips :options="conditionOptions" v-model:selected="form.condition" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Waterproof?</h3>
          <SingleSelectChips :options="waterproofOptions" v-model:selected="form.waterproof" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Space Type</h3>
          <SingleSelectChips :options="spaceTypeOptions" v-model:selected="form.spaceType" />
        </div>
      </div>

      <!-- Ratings -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Ratings (optional)</h3>
          <RatingRow label="Creativity / Charm" v-model:value="form.ratings.creativity" />
          <RatingRow label="Content Quality" v-model:value="form.ratings.content" />
          <RatingRow label="Location Atmosphere" v-model:value="form.ratings.location" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4 pt-2">
        <button type="submit" class="md-button flex items-center gap-1">
          <span class="material-symbols-outlined" style="font-size:18px;">send</span>Submit Entry
        </button>
        <button type="button" @click="resetForm" class="md-button border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1" style="--md-primary:transparent;">
          <span class="material-symbols-outlined" style="font-size:18px;">refresh</span>Reset
        </button>
      </div>
    </form>

    <!-- Result Output -->
    <div v-if="submitted" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-green-600" style="font-size:28px;">check_circle</span>
        Submission Preview
      </h2>
      <textarea readonly :value="resultJson" rows="12" class="w-full font-mono text-xs p-3 rounded-lg border border-gray-300 bg-gray-50" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, defineComponent, h } from 'vue'
import { libraryUrl as generateLibraryUrl } from '~/utils/libraryUrl'
// Fallback declaration for queryContent to satisfy type checking in this isolated file.
// nuxt/content injects this at runtime; refine with proper types if desired.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function queryContent(path?: string): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function useRoute(): any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function onBeforeRouteLeave(handler: (to: any, from: any, next: (v?: any) => void) => void): void

// SingleSelectChips component (only one active)
const SingleSelectChips = defineComponent({
  name: 'SingleSelectChips',
  props: {
    options: { type: Array as () => string[], required: true },
    selected: { type: String, default: '' }
  },
  emits: ['update:selected'],
  setup(props: { options: string[]; selected: string }, { emit }: { emit: (e: 'update:selected', value: string) => void }) {
    const setVal = (opt: string) => emit('update:selected', props.selected === opt ? '' : opt)
    return () => h('div', { class: 'flex flex-wrap gap-2' },
      props.options.map((opt: string) => {
        const active = props.selected === opt
        return h('button', {
          type: 'button',
          class: [
            'px-3 py-1.5 text-xs font-medium rounded-full border transition',
            active ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ],
          onClick: () => setVal(opt)
        }, opt)
      })
    )
  }
})

// RatingRow component without JSX
const RatingRow = defineComponent({
  name: 'RatingRow',
  props: { label: { type: String, required: true }, value: { type: Number, required: false } },
  emits: ['update:value'],
  setup(props: { label: string; value?: number }, { emit }: { emit: (e: 'update:value', value: number | undefined) => void }) {
    const opts = [1,2,3,4,5]
    const titles = ['Bad','Meh','Ok','Good','Great']
    const setVal = (v: number) => emit('update:value', v === props.value ? undefined : v)
    return () => h('div', { class: 'mb-4' }, [
      h('div', { class: 'text-sm font-medium text-gray-700 mb-1' }, props.label),
      h('div', { class: 'flex gap-2' }, opts.map((n: number) => {
        const active = props.value === n
        return h('button', {
          type: 'button',
          title: `${n} - ${titles[n-1]}`,
          class: [
            'w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold border transition',
            active ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
          ],
          onClick: () => setVal(n)
        }, n.toString())
      }))
    ])
  }
})

// Form state
const form = reactive({
  details: '',
  condition: '' as string,
  waterproof: '' as string,
  spaceType: '' as string,
  ratings: { creativity: undefined as number | undefined, content: undefined as number | undefined, location: undefined as number | undefined }
})

const image = reactive<{ file: File | null; preview: string | null }>({ file: null, preview: null })
function onImageChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) { image.file = null; image.preview = null; return }
  image.file = file
  const reader = new FileReader()
  reader.onload = () => { image.preview = reader.result as string }
  reader.readAsDataURL(file)
}
function clearImage() { image.file = null; image.preview = null }

// Tags
const existingTags = ref<string[]>([])
const tagInput = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)
const currentTags = computed(() => tagInput.value.split(',').map((t: string) => t.trim()).filter(Boolean))
const lastToken = computed(() => {
  const parts = tagInput.value.split(',')
  return parts[parts.length - 1].trim().toLowerCase()
})
const tagSuggestions = computed(() => {
  if (!lastToken.value) return []
  return existingTags.value.filter((t: string) => t.toLowerCase().startsWith(lastToken.value) && !currentTags.value.includes(t)).slice(0,8)
})
function applySuggestion(s: string) {
  const parts = tagInput.value.split(',')
  parts[parts.length - 1] = ' ' + s
  tagInput.value = parts.join(',').replace(/^\s+/, '') + ', '
  tagInputRef.value?.focus()
}
function tryAutocomplete() {
  if (tagSuggestions.value.length) applySuggestion(tagSuggestions.value[0])
}
function onTagInput() { /* reactive */ }
function removeTag(t: string) {
  const filtered = currentTags.value.filter((x: string) => x !== t)
  tagInput.value = filtered.join(', ') + (filtered.length ? ', ' : '')
}

// Options
const conditionOptions = ['Excellent','Good','Worn','Damaged','Removed']
const waterproofOptions = ['Yes','No']
const spaceTypeOptions = ['Public','Private']

// Route / library context
const route = useRoute()
const librarySlug = computed(() => (route?.query?.library || '').toString().trim())
const libraryTitle = ref('')
const libraryId = ref('')
const libraryTitleFetched = ref(false)
const libraryTitleMissing = ref(false)

// Computed library URL using new format if library_id is available
const libraryUrl = computed(() => {
  if (libraryId.value && librarySlug.value) {
    return generateLibraryUrl({ library_id: libraryId.value, slug: librarySlug.value })
  }
  return `/library/${librarySlug.value}/`
})

// Dirty state detection
const isDirty = computed(() => {
  return !!(
    form.details.trim() ||
    form.condition ||
    form.waterproof ||
    form.spaceType ||
    form.ratings.creativity !== undefined ||
    form.ratings.content !== undefined ||
    form.ratings.location !== undefined ||
    currentTags.value.length > 0 ||
    image.file
  )
})

// Submission
const submitted = ref(false)
const resultJson = ref('')
function onSubmit() {
  const payload = {
    details: form.details || null,
    tags: currentTags.value,
  library: librarySlug.value || null,
  condition: form.condition || null,
  waterproof: form.waterproof || null,
  spaceType: form.spaceType || null,
    ratings: {
      creativity: form.ratings.creativity ?? null,
      content: form.ratings.content ?? null,
      location: form.ratings.location ?? null
    },
    image: image.file ? { name: image.file.name, size: image.file.size, type: image.file.type } : null,
    timestamp: new Date().toISOString()
  }
  resultJson.value = JSON.stringify(payload, null, 2)
  submitted.value = true
  setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }, 50)
}
function resetForm() {
  form.details = ''
  form.condition = ''
  form.waterproof = ''
  form.spaceType = ''
  form.ratings.creativity = form.ratings.content = form.ratings.location = undefined
  tagInput.value = ''
  clearImage()
  submitted.value = false
  resultJson.value = ''
}

onMounted(async () => {
  try {
    const docs = await queryContent('/libraries').where({ _extension: 'md' }).find()
    const set = new Set<string>()
    docs.forEach((d: any) => (d.tags || []).forEach((t: string) => set.add(t)))
    existingTags.value = Array.from(set).sort((a,b) => a.localeCompare(b))
    if (librarySlug.value) {
      try {
        const lib = await queryContent(`/libraries/${librarySlug.value}`).findOne()
        if (lib && lib.title) {
          libraryTitle.value = lib.title
          libraryId.value = lib.library_id || ''
        } else {
          libraryTitleMissing.value = true
        }
      } catch { libraryTitleMissing.value = true }
      finally { libraryTitleFetched.value = true }
    } else {
      libraryTitleFetched.value = true
      libraryTitleMissing.value = true
    }
  } catch {}

  // Warn on external navigation / refresh if dirty and not submitted
  const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (isDirty.value && !submitted.value) {
      e.preventDefault()
      e.returnValue = '' // Chrome requirement
      return ''
    }
    return undefined
  }
  window.addEventListener('beforeunload', beforeUnloadHandler)
  // Store for removal
  ;(window as any).__LOGBOOK_BEFORE_UNLOAD__ = beforeUnloadHandler

  // In-app route navigation guard
  if (typeof onBeforeRouteLeave === 'function') {
    onBeforeRouteLeave((_to: any, _from: any, next: (v?: any) => void) => {
      if (!isDirty.value || submitted.value) return next()
      const ok = window.confirm('You have unsaved log entry changes. Leave this page?')
      if (ok) next()
      else next(false)
    })
  }
})

onUnmounted(() => {
  const hnd = (window as any).__LOGBOOK_BEFORE_UNLOAD__
  if (hnd) window.removeEventListener('beforeunload', hnd)
})
</script>

<style scoped>
</style>
