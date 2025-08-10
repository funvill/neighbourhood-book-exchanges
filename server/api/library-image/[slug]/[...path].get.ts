import { defineEventHandler, createError } from 'h3'

// Legacy endpoint deprecated in favor of static /library-images/<slug>/ copies.
// Return 410 Gone so any lingering references are surfaced and can be cleaned up.
export default defineEventHandler(() => {
  throw createError({ statusCode: 410, statusMessage: 'Deprecated: use /library-images/<slug>/<file>' })
})
