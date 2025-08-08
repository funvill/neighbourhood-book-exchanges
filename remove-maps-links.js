import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const contentDir = path.join(__dirname, 'content')

function removeGoogleMapsLinks(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    // Remove the "📍 Open in Google Maps" links
    let fixedContent = content
    
    // Remove lines that contain the Google Maps emoji link pattern
    fixedContent = fixedContent.replace(/\[📍 Open in Google Maps\]\([^)]+\)\s*/g, '')
    
    // Also remove any other variations that might exist
    fixedContent = fixedContent.replace(/\[Open in Google Maps\]\([^)]+\)\s*/g, '')
    fixedContent = fixedContent.replace(/\[📍[^]]*Google Maps[^]]*\]\([^)]+\)\s*/g, '')
    
    // Clean up any extra blank lines that might be left
    fixedContent = fixedContent.replace(/\n\n\n+/g, '\n\n')
    fixedContent = fixedContent.trim()
    
    // Write the fixed file
    const newFileContent = matter.stringify(fixedContent, data)
    fs.writeFileSync(filePath, newFileContent, 'utf-8')
    
    console.log(`Fixed: ${filePath}`)
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error)
  }
}

function processDirectory() {
  const dirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  for (const dir of dirs) {
    const indexPath = path.join(contentDir, dir, 'index.md')
    if (fs.existsSync(indexPath)) {
      removeGoogleMapsLinks(indexPath)
    }
  }
}

console.log('Starting Google Maps link removal process...')
processDirectory()
console.log('Google Maps link removal process completed!')
