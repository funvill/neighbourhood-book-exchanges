# Neighbourhood Book Exchanges Project

## Project Overview

A comprehensive web application for mapping and managing Little Free Libraries across Vancouver and surrounding areas. The project provides an interactive map, detailed library information, community logbooks, and search functionality for discovering neighbourhood book exchanges.

**Live Site:** [libraries.abluestar.com](https://libraries.abluestar.com)  
**Project Spec:** [Google Doc](https://docs.google.com/document/d/12LJpVHkkpRywIbbA4dffJ5qQawoV1HBOpGzlhY7aTvA/edit?tab=t.0)

## Tech Stack

- **Nuxt.js 3.18.1** - Vue 3 + TypeScript framework for static site generation
- **Leaflet.js** - Interactive mapping functionality with markers and popups
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Google Material Design** - Design system with Material Symbols icons
- **Nuxt Content** - File-based CMS for markdown content management
- **Sharp** - Image processing for optimization and format conversion
- **Cloudflare R2** - Static hosting and CDN
- **Vitest** - Unit testing framework

## Project Structure

### Core Directories

```
├── .github/                    # GitHub configuration and instructions
├── assets/                     # CSS and styling assets
├── components/                 # Vue components
│   ├── AppHeader.vue          # Main navigation with search
│   ├── AppFooter.vue          # Site footer
│   ├── SearchComponent.vue    # Interactive map and search
│   ├── LibraryCard.vue        # Library display cards
│   └── FeaturedLibraries.vue  # Homepage featured content
├── content/                    # Markdown content (Nuxt Content)
│   └── libraries/             # Library data files (*.md)
├── layouts/                    # Page layout templates
├── pages/                      # File-based routing
│   ├── index.vue              # Homepage
│   ├── search.vue             # Search/browse page
│   ├── library/               # Dynamic library pages
│   └── logbook/               # Logbook functionality
├── public/                     # Static assets
│   ├── images/                # General images
│   └── library-images/        # Library-specific photos (PNG only)
├── scripts/                    # Maintenance and build scripts
├── server/                     # Server-side API routes
├── types/                      # TypeScript type definitions
└── utils/                      # Utility functions
```

### Key Files

- `nuxt.config.ts` - Main configuration with static generation rules
- `content.config.ts` - Nuxt Content configuration
- `package.json` - Dependencies and build scripts
- `types/content.ts` - TypeScript interfaces for content structure

## Features

### 1. Interactive Map
- **Leaflet.js integration** with custom markers for each library
- **Real-time search** with map updates
- **Clustering** for dense areas
- **Popup details** with library information and quick actions
- **Full-screen mode** for detailed exploration

### 2. Library Management
- **500+ libraries** across Vancouver and BC
- **Unique library IDs** (5-digit zero-padded: 00001-99999)
- **Geographic coordinates** with lat/lng precision
- **Status tracking** (active, inactive, uncertain, removed)
- **Photo galleries** with optimized PNG images
- **Tag system** for categorization

### 3. Content Structure
- **Flattened markdown files** in `content/libraries/`
- **Frontmatter schema** with standardized fields:
  ```yaml
  ---
  title: 'Library Name'
  library_id: '00001'
  location:
    lat: 49.2849729
    lng: -123.1318965
    address: '1005 Jervis St.'
  photo: /library-images/00001/main.png
  tags: [active, outdoor, book-exchange]
  status: active
  ---
  ```

### 4. Search & Discovery
- **Full-text search** across titles, descriptions, and content
- **Tag filtering** with real-time updates
- **Geographic search** by coordinates or address
- **Advanced filters** by status, region, and type
- **Pagination** for large result sets

### 5. Community Features
- **Logbook entries** for community updates
- **Photo submissions** with moderation workflow
- **Visit tracking** and statistics
- **Community contributions** and feedback

## Development Workflow

### Setup Commands
```powershell
npm install                 # Install dependencies
npm run dev                # Start development server (localhost:3000)
npm run build              # Build for production
npm run generate           # Generate static site
npm run preview            # Preview production build
```

### Maintenance Scripts
```powershell
npm run maintenance        # Run all maintenance tasks
npm run maintenance:library-ids     # Assign/update library IDs
npm run maintenance:jpg_to_png      # Convert JPG to PNG
npm run maintenance:png_resize      # Optimize PNG sizes
npm run maintenance:copy_image      # Copy images to public
```

### Testing
```powershell
npm run test               # Run Vitest unit tests
```

## Content Management

### Library Data
- **Location:** `content/libraries/*.md`
- **Format:** Markdown with YAML frontmatter
- **Naming:** `{5-digit-id}.md` (e.g., `00001.md`)
- **Images:** Stored in `public/library-images/{library_id}/`

### Image Optimization
- **Format:** PNG only (JPG automatically converted)
- **Optimization:** Automated resizing and compression
- **Structure:** `public/library-images/{library_id}/{filename}.png`
- **Main photo:** Referenced in frontmatter `photo` field

### URL Structure
- **Homepage:** `/`
- **Search:** `/search?q={query}&tags={tags}`
- **Library detail:** `/library/{slug}/`
- **Logbook:** `/logbook/new?library_id={id}`

## TypeScript Configuration

### Key Types
- `LibraryFrontmatter` - Library content structure
- `LogbookFrontmatter` - Logbook entry structure
- `Coordinates` - Geographic location interface
- `Library` - Runtime library object

### Type Safety
- **Strict TypeScript** enabled
- **Content validation** at build time
- **Runtime type checking** for API responses
- **Component prop validation**

## Build & Deployment

### Static Generation
- **Pre-rendered routes** for all libraries and pages
- **API endpoints** generated for content queries
- **Optimized assets** with automatic compression
- **SEO metadata** for all pages

### Cloudflare Integration
- **R2 storage** for static assets
- **CDN distribution** for global performance
- **Edge caching** for optimal load times

## Performance Optimizations

### Image Handling
- **PNG optimization** with Sharp
- **Lazy loading** for library images
- **Responsive images** with multiple sizes
- **WebP fallbacks** where supported

### JavaScript
- **Code splitting** by route
- **Component lazy loading**
- **Tree shaking** for minimal bundles
- **Modern ES modules**

### SEO & Accessibility
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Open Graph** metadata
- **Structured data** for search engines

## Other Copilot Instructions

- `.github/instructions/steven.instructions.md` - Steven's best practices
- `.github/instructions/typescript.instructions.md` - TypeScript best practices

## Development Environment

- **OS:** Windows (PowerShell commands)
- **Node.js:** v20+ required
- **Package Manager:** npm
- **IDE:** VS Code recommended with Vue/TypeScript extensions