// Utility to create a URL-friendly slug from a title (lowercase, alnum & hyphens only)
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD') // split accented chars
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
