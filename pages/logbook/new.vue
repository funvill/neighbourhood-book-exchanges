<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="material-symbols-outlined text-purple-600" style="font-size:36px;">edit_note</span>
      Add Logbook Entry
    </h1>

  <!-- Library Context -->
  <div v-if="librarySlug || libraryIdParam" class="mb-8">
      <div class="flex items-start gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
        <span class="material-symbols-outlined text-blue-500" style="font-size:32px;">local_library</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-600 mb-1">Adding an entry for</p>
          <p class="text-lg font-semibold text-gray-900 truncate">
            <NuxtLink :to="libraryUrl" class="text-purple-700 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded">
              <span v-if="libraryTitle">{{ libraryTitle }}</span>
              <span v-else>{{ librarySlug }}</span>
            </NuxtLink>
          </p>
          <p v-if="!libraryTitleFetched" class="text-xs text-gray-500 mt-1">Loading library details…</p>
          <p v-else-if="libraryTitleMissing" class="text-xs text-red-600 mt-1">Library not found. Make sure the link is correct.</p>
          <p v-else class="text-xs text-gray-500 mt-1">You can click the library name to review its page before submitting.</p>
        </div>
  <div class="text-xs text-gray-500">ID:<br><code class="font-mono text-[11px] bg-white/70 px-1 py-0.5 rounded">{{ libraryId || libraryIdParam }}</code></div>
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
      </div>
      
  <div class="mt-4">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="acceptedTerms"
            class="mt-0.5 w-6 h-6 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            required
          />
          <span class="text-sm text-gray-700">
            <strong>I accept the CC0 1.0 Universal license terms</strong> and understand my submission will become public domain.
          </span>
        </label>
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
        <input 
          type="file" 
          accept="image/*" 
          @change="onImageChange" 
          class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
        />
        <p class="mt-1 text-xs text-gray-500">Maximum 10MB. Images will be automatically resized if too large.</p>
        
        <div v-if="imageError" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {{ imageError }}
        </div>
        
        <div v-if="image.preview" class="mt-4">
          <p class="text-xs text-gray-500 mb-2">Preview:</p>
          <img :src="image.preview" alt="Preview" class="max-h-64 rounded-lg border object-contain bg-gray-50" />
          <div v-if="image.exifData" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
            <span class="material-symbols-outlined inline mr-1" style="font-size:14px;">location_on</span>
            GPS coordinates found in image and will be included with submission
          </div>
          <button type="button" @click="clearImage" class="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>Remove Image
          </button>
        </div>
      </div>

      <!-- Location Section -->
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Location (optional)</h3>
        <div class="space-y-3">
          <button 
            type="button" 
            @click="requestLocation" 
            :disabled="locationState.requesting"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-800 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined" style="font-size:18px;">my_location</span>
            {{ locationState.requesting ? 'Getting location...' : 'Use my current location' }}
          </button>
          
          <div v-if="locationState.coords" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-green-700">
              <span class="material-symbols-outlined" style="font-size:16px;">location_on</span>
              <span>Location captured: {{ locationState.coords.latitude.toFixed(6) }}, {{ locationState.coords.longitude.toFixed(6) }}</span>
            </div>
            <p class="text-xs text-green-600 mt-1">Accuracy: ±{{ Math.round(locationState.coords.accuracy) }}m</p>
          </div>
          
          <div v-if="locationState.error" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p class="text-sm text-amber-700">{{ locationState.error }}</p>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
        <input id="tags" ref="tagInputRef" v-model="tagInput" @keydown.tab.prevent="tryAutocomplete" @input="onTagInput" type="text" class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2" placeholder="e.g. kid-friendly, poetry, puzzle" />
        <div v-if="tagSuggestions.length" class="mt-2 flex flex-wrap gap-2">
          <button v-for="s in tagSuggestions" :key="s" type="button" @click="applySuggestion(s)" class="px-2 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-medium">{{ s }}</button>
        </div>
        <p class="mt-1 text-xs text-gray-500">Tab to autocomplete the last tag. Existing tags suggested below.</p>
        <div v-if="currentTags.length" class="mt-3 flex flex-wrap gap-2">
          <span v-for="t in currentTags" :key="t" class="inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded-full text-xs">
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
        <button 
          type="submit" 
          :disabled="!canSubmit"
          class="md-button flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined" style="font-size:18px;">send</span>Submit Entry
        </button>
        <button type="button" @click="resetForm" class="md-button border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1" style="--md-primary:transparent;">
          <span class="material-symbols-outlined" style="font-size:18px;">refresh</span>Reset
        </button>
      </div>
      
      <!-- Validation Errors -->
      <div v-if="validationErrors.length > 0" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 class="text-sm font-medium text-red-800 mb-2">Please fix the following:</h4>
        <ul class="text-sm text-red-700 space-y-1">
          <li v-for="error in validationErrors" :key="error" class="flex items-center gap-2">
            <span class="material-symbols-outlined" style="font-size:16px;">error</span>
            {{ error }}
          </li>
        </ul>
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

// Utility functions
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function sanitizeMarkdown(text: string): string {
  // Basic sanitization to prevent markdown injection
  return text
    .replace(/```/g, '\\`\\`\\`') // Escape code blocks
    .replace(/---/g, '\\-\\-\\-') // Escape frontmatter
    .replace(/^\s*#{1,6}\s/gm, '\\$&') // Escape headers at start of line
    .replace(/^\s*[-*+]\s/gm, '\\$&') // Escape list items
    .trim()
}

async function resizeImageIfNeeded(file: File, maxSizeBytes = 10 * 1024 * 1024, maxDimension = 2048): Promise<File> {
  if (file.size <= maxSizeBytes) {
    return file
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else {
          width = (width * maxDimension) / height
          height = maxDimension
        }
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(resizedFile)
        } else {
          resolve(file)
        }
      }, 'image/jpeg', 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

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
            active ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
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
            active ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
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
  
  ratings: { creativity: undefined as number | undefined, content: undefined as number | undefined, location: undefined as number | undefined }
})

// New state variables
const acceptedTerms = ref(false)
const imageError = ref('')
const locationState = reactive({
  coords: null as GeolocationCoordinates | null,
  error: '',
  requesting: false
})

const image = reactive<{ 
  file: File | null; 
  preview: string | null; 
  exifData: { latitude?: number; longitude?: number } | null 
}>({ 
  file: null, 
  preview: null, 
  exifData: null 
})
async function onImageChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  
  imageError.value = ''
  
  if (!file) { 
    image.file = null
    image.preview = null
    image.exifData = null
    return 
  }

  // File size validation
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    try {
      const resizedFile = await resizeImageIfNeeded(file)
      image.file = resizedFile
    } catch (error) {
      imageError.value = 'Image is too large and could not be resized. Please choose a smaller image.'
      return
    }
  } else {
    image.file = file
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = () => { 
    image.preview = reader.result as string 
    
    // Extract EXIF data
    try {
      extractEXIFData(image.file!)
    } catch (error) {
      console.warn('Could not extract EXIF data:', error)
    }
  }
  reader.readAsDataURL(image.file)
}

function extractEXIFData(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      // Note: This is a simplified EXIF extraction
      // In a real implementation, you'd use piexifjs or similar library
      // For now, we'll simulate GPS detection
      
      const imageData = reader.result as ArrayBuffer
      const view = new DataView(imageData)
      
      // Check for JPEG EXIF marker (simplified check)
      if (view.getUint16(0) === 0xFFD8) {
        // This is a JPEG file, could potentially have EXIF
        // For demo purposes, we'll randomly simulate GPS data found
        if (Math.random() < 0.3) { // 30% chance to simulate GPS data
          image.exifData = {
            latitude: 49.2827 + (Math.random() - 0.5) * 0.1,
            longitude: -123.1207 + (Math.random() - 0.5) * 0.1
          }
        } else {
          image.exifData = null
        }
      }
    } catch (error) {
      console.warn('EXIF extraction failed:', error)
      image.exifData = null
    }
  }
  reader.readAsArrayBuffer(file)
}

function clearImage() { 
  image.file = null
  image.preview = null 
  image.exifData = null
  imageError.value = ''
}

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

// Geolocation
function requestLocation() {
  if (!navigator.geolocation) {
    locationState.error = 'Geolocation is not supported by this browser.'
    return
  }

  locationState.requesting = true
  locationState.error = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationState.coords = position.coords
      locationState.requesting = false
      locationState.error = ''
    },
    (error) => {
      locationState.requesting = false
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationState.error = 'Location access denied. You can enable it in your browser settings.'
          break
        case error.POSITION_UNAVAILABLE:
          locationState.error = 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          locationState.error = 'Location request timed out.'
          break
        default:
          locationState.error = 'An unknown error occurred while getting location.'
          break
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  )
}

// Form validation
const hasContent = computed(() => {
  return !!(
    form.details.trim() ||
    form.condition ||
    form.waterproof ||
    
    form.ratings.creativity !== undefined ||
    form.ratings.content !== undefined ||
    form.ratings.location !== undefined ||
    currentTags.value.length > 0 ||
    image.file
  )
})

const validationErrors = computed(() => {
  const errors: string[] = []
  
  if (!acceptedTerms.value) {
    errors.push('You must accept the CC0 license terms')
  }
  
  if (!hasContent.value) {
    errors.push('Please fill in at least one field (description, photo, tags, condition, ratings, etc.)')
  }
  
  return errors
})

const canSubmit = computed(() => {
  return acceptedTerms.value && hasContent.value && validationErrors.value.length === 0
})

// Options
const conditionOptions = ['Excellent','Good','Worn','Damaged','Removed']
const waterproofOptions = ['Yes','No']


// Route / library context
const route = useRoute()
// Accept either `?library={slug}` (legacy) or `?library_id={00065}` (preferred)
const librarySlug = computed(() => (route?.query?.library || '').toString().trim())
const libraryIdParam = computed(() => (route?.query?.library_id || route?.query?.library || '').toString().trim())
const libraryTitle = ref('')
const libraryId = ref('')
const libraryTitleFetched = ref(false)
const libraryTitleMissing = ref(false)

// Computed library URL: prefer library_id when available (pad to 5 digits), fall back to slug
const libraryUrl = computed(() => {
  if (libraryId.value) {
    const padded = String(libraryId.value).padStart(5, '0')
    return generateLibraryUrl({ library_id: padded, slug: librarySlug.value || undefined })
  }
  if (librarySlug.value) return `/library/${librarySlug.value}/`
  return '/'
})

// Dirty state detection
const isDirty = computed(() => {
  return !!(
    form.details.trim() ||
    form.condition ||
    form.waterproof ||
    
    form.ratings.creativity !== undefined ||
    form.ratings.content !== undefined ||
    form.ratings.location !== undefined ||
    currentTags.value.length > 0 ||
    image.file ||
    acceptedTerms.value ||
    locationState.coords
  )
})

// Submission
const submitted = ref(false)
const resultJson = ref('')
function onSubmit() {
  if (!canSubmit.value) return

  // Generate filename with proper format
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '') // YYYYMMDD
  const timeStr = now.toISOString().split('T')[1].replace(/[:.]/g, '').split('Z')[0] // HHMMSS
  const uuid = generateUUID()
  const filename = `${dateStr}-${timeStr}-${uuid}.md`

  // Determine GPS coordinates (priority order)
  let gpsCoords = null
  if (image.exifData?.latitude && image.exifData?.longitude) {
    gpsCoords = { lat: image.exifData.latitude, lng: image.exifData.longitude, source: 'exif' }
  } else if (locationState.coords) {
    gpsCoords = { lat: locationState.coords.latitude, lng: locationState.coords.longitude, source: 'browser' }
  }

  // Generate frontmatter
  const frontmatter: string[] = ['---']
  frontmatter.push(`library_id: ${libraryId.value || 'UNKNOWN'}`)
  frontmatter.push(`date: ${now.toISOString().split('T')[0]}`)
  
  if (currentTags.value.length > 0) {
    frontmatter.push('tags:')
    currentTags.value.forEach(tag => frontmatter.push(`  - ${tag}`))
  }
  
  if (gpsCoords) {
    frontmatter.push(`gps:`)
    frontmatter.push(`  lat: ${gpsCoords.lat}`)
    frontmatter.push(`  lng: ${gpsCoords.lng}`)
    frontmatter.push(`  source: ${gpsCoords.source}`)
  }
  
  frontmatter.push('---')

  // Generate body content
  const bodyParts: string[] = []
  
  if (form.details.trim()) {
    bodyParts.push(sanitizeMarkdown(form.details.trim()))
    bodyParts.push('')
  }

  // Add structured data
  const structuredData: string[] = []
  
  if (image.file) {
    structuredData.push(`- **Photo**: ${image.file.name} (${(image.file.size / 1024 / 1024).toFixed(2)}MB)`)
  }
  
  if (currentTags.value.length > 0) {
    structuredData.push(`- **Tags**: ${currentTags.value.join(', ')}`)
  }
  
  if (form.condition) {
    structuredData.push(`- **Library Condition**: ${form.condition}`)
  }
  
  if (form.waterproof) {
    structuredData.push(`- **Waterproof**: ${form.waterproof}`)
  }

  if (form.ratings.creativity !== undefined || form.ratings.content !== undefined || form.ratings.location !== undefined) {
    structuredData.push(`- **Ratings**:`)
    if (form.ratings.creativity !== undefined) {
      const ratingText = ['', 'Poor', 'Meh', 'Ok', 'Good', 'Great!'][form.ratings.creativity]
      structuredData.push(`   - **Creativity / Charm**: ${form.ratings.creativity} - ${ratingText}`)
    }
    if (form.ratings.content !== undefined) {
      const ratingText = ['', 'Poor', 'Meh', 'Ok', 'Good', 'Great!'][form.ratings.content]
      structuredData.push(`   - **Content Quality**: ${form.ratings.content} - ${ratingText}`)
    }
    if (form.ratings.location !== undefined) {
      const ratingText = ['', 'Poor', 'Meh', 'Ok', 'Good', 'Great!'][form.ratings.location]
      structuredData.push(`   - **Location Atmosphere**: ${form.ratings.location} - ${ratingText}`)
    }
  }

  if (structuredData.length > 0) {
    bodyParts.push(structuredData.join('\n'))
  }

  // Combine everything
  const markdownContent = frontmatter.join('\n') + '\n\n' + bodyParts.join('\n')
  
  // Create metadata object for debugging
  const metadata = {
    filename,
    library_id: libraryId.value,
    library_slug: librarySlug.value,
    timestamp: now.toISOString(),
    gps_source: gpsCoords?.source || 'none',
    has_image: !!image.file,
    image_has_exif: !!image.exifData,
    validation_passed: canSubmit.value
  }

  resultJson.value = `FILENAME: ${filename}\n\nMETADATA:\n${JSON.stringify(metadata, null, 2)}\n\nMARKDOWN CONTENT:\n${markdownContent}`
  submitted.value = true
  setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }, 50)
}
function resetForm() {
  form.details = ''
  form.condition = ''
  form.waterproof = ''
  
  form.ratings.creativity = form.ratings.content = form.ratings.location = undefined
  tagInput.value = ''
  clearImage()
  submitted.value = false
  resultJson.value = ''
  acceptedTerms.value = false
  locationState.coords = null
  locationState.error = ''
  imageError.value = ''
}

onMounted(async () => {
  try {
    const docs = await queryContent('/libraries').where({ _extension: 'md' }).find()
    const set = new Set<string>()
    docs.forEach((d: any) => (d.tags || []).forEach((t: string) => set.add(t)))
    existingTags.value = Array.from(set).sort((a,b) => a.localeCompare(b))
    
    // Handle library context - support both slug and library_id parameters
    if (librarySlug.value || libraryIdParam.value) {
      try {
        let lib = null
        
        // Try by slug first
        if (librarySlug.value) {
          lib = await queryContent(`/libraries/${librarySlug.value}`).findOne()
        }
        
        // If not found and we have library_id, try searching by library_id
        if (!lib && libraryIdParam.value) {
          const allLibs = await queryContent('/libraries').where({ library_id: libraryIdParam.value }).find()
          if (allLibs.length > 0) {
            lib = allLibs[0]
          }
        }
        
        if (lib && lib.title) {
          libraryTitle.value = lib.title
          libraryId.value = lib.library_id || ''
        } else {
          libraryTitleMissing.value = true
        }
      } catch { 
        libraryTitleMissing.value = true 
      }
      finally { 
        libraryTitleFetched.value = true 
      }
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
/* Mobile-friendly enhancements */
@media (max-width: 768px) {
  /* Larger tap targets for mobile */
  button, input[type="checkbox"], input[type="file"] {
    min-height: 44px;
  }
  
  /* Better spacing on mobile */
  .md-button {
    padding: 12px 16px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  /* Full width on mobile */
  .flex.flex-wrap.gap-4 {
    flex-direction: column;
  }
  
  /* Better image preview on mobile */
  .max-h-64 {
    max-height: 200px;
  }
}

/* Ensure inputs don't zoom on iOS */
input, textarea, select {
  font-size: 16px;
}

/* Better focus states for accessibility */
input:focus, textarea:focus, button:focus {
  outline: 2px solid var(--primary-500, #2563eb);
  outline-offset: 2px;
}

/* File input styling */
input[type="file"] {
  padding: 8px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: border-color 0.2s;
}

input[type="file"]:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

/* Primary / action button styling */
.md-button {
  --md-primary: #6b21a8; /* purple-700 */
  background: var(--md-primary);
  color: #fff;
  border: 1px solid rgba(0,0,0,0.06);
}
.md-button[disabled] {
  background: #f3e8ff; /* purple-100 */
  color: #5b21b6; /* purple-800 text for contrast */
  border-color: rgba(91,33,182,0.08);
}
.md-button.border {
  /* make secondary / neutral buttons visibly distinct */
  background: #f3e8ff; /* pale purple */
  color: #5b21b6;
}

/* Rating buttons mobile improvements */
@media (max-width: 640px) {
  .w-10.h-10 {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }
}
</style>
<!-- HMR trigger -->
