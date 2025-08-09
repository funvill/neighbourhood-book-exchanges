export default defineEventHandler(() => {
  throw createError({ statusCode: 410, statusMessage: 'Deprecated: use content-driven pages instead.' })
})
