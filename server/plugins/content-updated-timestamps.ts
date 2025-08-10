import { statSync } from 'node:fs'

// Simple Nitro plugin (function export) recognized by Nuxt in server/plugins
export default () => {
  // Access global nitro via globalThis (hooks available at runtime)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nitro: any = (globalThis as any).nitroApp
  if (!nitro?.hooks) return
  nitro.hooks.hook('content:file:beforeParse', (file: any) => {
    try {
      if (!file || !file._id) return
      if (!file._id.startsWith('content:libraries/') || !file._id.endsWith('/index.md')) return
      const fsPath = file.path || file.fsPath || file.filename || file._id.replace(/^content:/, '')
      if (!fsPath) return
      const s = statSync(fsPath)
      if (!file.document) file.document = {}
      if (!file.document.updated) file.document.updated = s.mtime.toISOString()
    } catch {
      /* ignore */
    }
  })
}
