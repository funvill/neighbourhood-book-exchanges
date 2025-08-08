<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ isNewLibrary ? 'Add New Library' : 'Add Log Book Entry' }}
      </h1>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Library Selection (for new entries) -->
        <div v-if="!isNewLibrary && !preselectedLibrary">
          <UFormGroup label="Library" required>
            <USelectMenu
              v-model="form.libraryId"
              :options="libraryOptions"
              placeholder="Select a library"
              value-attribute="id"
              option-attribute="title"
            />
          </UFormGroup>
        </div>

        <!-- New Library Fields -->
        <div v-if="isNewLibrary" class="space-y-4">
          <UFormGroup label="Library Name" required>
            <UInput
              v-model="form.libraryName"
              placeholder="Enter library name"
              required
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Latitude" required>
              <UInput
                v-model="form.latitude"
                type="number"
                step="any"
                placeholder="e.g., 49.2827"
                required
              />
            </UFormGroup>
            <UFormGroup label="Longitude" required>
              <UInput
                v-model="form.longitude"
                type="number"
                step="any"
                placeholder="e.g., -123.1207"
                required
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Library Photo" required>
            <input
              ref="libraryPhotoInput"
              type="file"
              accept="image/*"
              @change="handleLibraryPhotoUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </UFormGroup>
        </div>

        <!-- Visit Details -->
        <UFormGroup label="Visit Details" required>
          <UTextarea
            v-model="form.visitDetails"
            placeholder="Describe your visit, what you found, any puzzles you solved..."
            rows="5"
            required
          />
        </UFormGroup>

        <!-- Photo Upload -->
        <UFormGroup label="Photo (optional)">
          <input
            ref="photoInput"
            type="file"
            accept="image/*"
            @change="handlePhotoUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </UFormGroup>

        <!-- Survey Questions -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Optional Survey Questions</h3>
          <p class="text-sm text-gray-600 mb-4">
            Answer any questions that interest you. Popular answers from other visitors are highlighted.
          </p>

          <div
            v-for="question in surveyQuestions"
            :key="question.id"
            class="space-y-3"
          >
            <h4 class="font-medium text-gray-900">{{ question.title }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                v-for="option in question.options"
                :key="option.value"
                type="button"
                @click="toggleAnswer(question.id, option.value)"
                :class="[
                  'p-3 text-sm rounded-lg border-2 transition-all duration-200',
                  form.answers[question.id] === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                  option.popular ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''
                ]"
              >
                {{ option.label }}
                <span v-if="option.popular" class="block text-xs text-yellow-600">
                  Popular choice
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <UButton
            type="submit"
            color="primary"
            size="lg"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            icon="i-heroicons-paper-airplane"
          >
            {{ isNewLibrary ? 'Submit New Library' : 'Submit Entry' }}
          </UButton>
          
          <UButton
            to="/"
            variant="outline"
            size="lg"
            icon="i-heroicons-arrow-left"
          >
            Cancel
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// Determine if this is a new library or new entry
const isNewLibrary = computed(() => 
  route.path.includes('/library/new') || route.query.type === 'library'
)
const preselectedLibrary = computed(() => route.query.library as string)

// Form state
const form = ref({
  libraryId: preselectedLibrary.value || '',
  libraryName: '',
  latitude: '',
  longitude: '',
  visitDetails: '',
  answers: {} as Record<string, string>
})

const isSubmitting = ref(false)
const libraryPhotoInput = ref<HTMLInputElement>()
const photoInput = ref<HTMLInputElement>()

// Mock data for libraries and survey questions
const libraryOptions = ref([
  { id: '1', title: 'Downtown Central Library' },
  { id: '2', title: 'Sunset Park Reading Nook' },
  { id: '3', title: 'University District Hub' }
])

const surveyQuestions = ref([
  {
    id: 'difficulty',
    title: 'How would you rate the puzzle difficulty?',
    options: [
      { value: 'easy', label: 'Easy', popular: false },
      { value: 'medium', label: 'Medium', popular: true },
      { value: 'hard', label: 'Hard', popular: false },
      { value: 'expert', label: 'Expert', popular: false }
    ]
  },
  {
    id: 'type',
    title: 'What type of puzzles did you find?',
    options: [
      { value: 'riddles', label: 'Riddles', popular: true },
      { value: 'math', label: 'Math Puzzles', popular: false },
      { value: 'wordplay', label: 'Word Play', popular: true },
      { value: 'visual', label: 'Visual Puzzles', popular: false },
      { value: 'logic', label: 'Logic Puzzles', popular: false },
      { value: 'trivia', label: 'Trivia', popular: false }
    ]
  },
  {
    id: 'atmosphere',
    title: 'How would you describe the atmosphere?',
    options: [
      { value: 'peaceful', label: 'Peaceful', popular: true },
      { value: 'mysterious', label: 'Mysterious', popular: true },
      { value: 'welcoming', label: 'Welcoming', popular: false },
      { value: 'challenging', label: 'Challenging', popular: false },
      { value: 'inspiring', label: 'Inspiring', popular: false },
      { value: 'playful', label: 'Playful', popular: false }
    ]
  },
  {
    id: 'time',
    title: 'How long did you spend here?',
    options: [
      { value: '5min', label: '5 minutes', popular: false },
      { value: '15min', label: '15 minutes', popular: true },
      { value: '30min', label: '30 minutes', popular: true },
      { value: '1hour', label: '1 hour', popular: false },
      { value: 'longer', label: 'Longer', popular: false }
    ]
  }
])

// Computed properties
const isFormValid = computed(() => {
  if (isNewLibrary.value) {
    return form.value.libraryName && 
           form.value.latitude && 
           form.value.longitude && 
           form.value.visitDetails
  }
  return (form.value.libraryId || preselectedLibrary.value) && form.value.visitDetails
})

// Methods
const toggleAnswer = (questionId: string, value: string) => {
  if (form.value.answers[questionId] === value) {
    delete form.value.answers[questionId]
  } else {
    form.value.answers[questionId] = value
  }
}

const handleLibraryPhotoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // In real implementation, this would upload to Cloudflare R2
    console.log('Library photo uploaded:', file.name)
  }
}

const handlePhotoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // In real implementation, this would upload to Cloudflare R2
    console.log('Photo uploaded:', file.name)
  }
}

const submitForm = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Simulate API call to Cloudflare R2
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real implementation, this would:
    // 1. Upload photos to Cloudflare R2
    // 2. Submit form data to API
    // 3. Handle response
    
    console.log('Form submitted:', form.value)
    
    // Show success message and redirect
    const toast = useToast()
    toast.add({
      title: 'Success!',
      description: isNewLibrary.value 
        ? 'Your new library has been submitted for review.' 
        : 'Your log book entry has been submitted!',
      color: 'green'
    })
    
    // Redirect to appropriate page
    await router.push(preselectedLibrary.value ? `/library/${preselectedLibrary.value}` : '/search')
    
  } catch (error) {
    console.error('Submission error:', error)
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'There was an error submitting your entry. Please try again.',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Set page meta
useHead({
  title: computed(() => isNewLibrary.value ? 'Add New Library - Puzzle Pages Project' : 'Add Log Book Entry - Puzzle Pages Project'),
  meta: computed(() => [
    {
      name: 'description',
      content: isNewLibrary.value 
        ? 'Add a new library to the Puzzle Pages project.' 
        : 'Share your library visit and puzzle-solving experience.'
    }
  ])
})

// Pre-select library if provided in query
if (preselectedLibrary.value) {
  form.value.libraryId = preselectedLibrary.value
}
</script>