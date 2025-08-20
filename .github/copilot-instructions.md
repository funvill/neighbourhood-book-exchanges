# Neighbourhood Book Exchanges Project

**CRITICAL**: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview

A comprehensive Nuxt.js web application for mapping and managing Little Free Libraries across Vancouver and surrounding areas. The project provides an interactive map, detailed library information, community logbooks, and search functionality for discovering neighbourhood book exchanges.

**Live Site:** [libraries.abluestar.com](https://libraries.abluestar.com)  
**Project Spec:** [Google Doc](https://docs.google.com/document/d/12LJpVHkkpRywIbbA4dffJ5qQawoV1HBOpGzlhY7aTvA/edit?tab=t.0)

## Working Effectively

### Bootstrap, Build and Test the Repository

**NEVER CANCEL long-running commands. Build processes may take 4+ minutes.**

1. **Install dependencies:**
   ```bash
   npm install
   ```
   - **Time**: ~50 seconds
   - **NEVER CANCEL**: Set timeout to 120+ seconds

2. **Run tests:**
   ```bash
   npm run test
   ```
   - **Time**: <1 second
   - **Status**: ✅ Tests pass (22 tests in 2 files)

3. **Build for production:**
   ```bash
   npm run build
   ```
   - **Time**: ~2 minutes
   - **NEVER CANCEL**: Set timeout to 180+ seconds

4. **Generate static site:**
   ```bash
   npm run generate
   ```
   - **Time**: ~4 minutes (includes maintenance scripts)
   - **NEVER CANCEL**: Set timeout to 300+ seconds
   - **Note**: Runs maintenance scripts first, then static generation

5. **Development server:**
   ```bash
   npm run dev
   ```
   - **Time**: Starts in ~3 seconds
   - **URL**: http://localhost:3000
   - **Status**: ✅ Works perfectly with live reload

6. **Preview production build:**
   ```bash
   npm run preview
   ```
   - **Time**: Starts in ~5 seconds  
   - **URL**: http://localhost:3000

## Validation

### Mandatory Manual Testing
Always manually validate any changes via browser interaction. The application is fully functional:

1. **Homepage**: Beautiful gradient design with hero section and feature overview
2. **Interactive Map**: 500+ library markers with Leaflet.js integration
3. **Search & Browse**: Real-time search, filtering, pagination (44 pages)
4. **Library Pages**: Individual pages with breadcrumbs, location, tags, logbook entries
5. **Navigation**: Header search, responsive design, Material Design icons

### Linting and Code Quality
```bash
npx eslint .
```
- **Time**: ~3 seconds
- **Status**: ⚠️ 114 issues exist (52 errors, 62 warnings) - these are existing codebase issues
- **Action**: Do not try to fix these during other tasks unless specifically required

### Maintenance Scripts
```bash
npm run maintenance
```
- **Time**: ~1 second (scripts run but find no files in current structure)
- **Components**: 
  - `maintenance:library-ids` - Assign library IDs (skips new structure)
  - `maintenance:jpg_to_png` - Convert JPG to PNG (no files found)
  - `maintenance:png_resize` - Optimize PNG sizes (no files found)
  - `maintenance:copy_image` - Copy images to public (no files found)

## Tech Stack & Architecture

### Core Technologies
- **Nuxt.js 3.18.1** - Vue 3 + TypeScript framework for static site generation
- **Leaflet.js** - Interactive mapping functionality with markers and popups  
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Google Material Design** - Design system with Material Symbols icons
- **Nuxt Content** - File-based CMS for markdown content management
- **Vitest** - Unit testing framework
- **Node.js v20+** - Required runtime

### Project Structure
```
├── .github/                    # GitHub configuration and instructions
├── components/                 # Vue components (AppHeader, SearchComponent, etc.)
├── content/                    # Markdown content (Nuxt Content)
│   ├── libraries/             # 519 library files (00001.md - 00519.md)
│   └── logbooks/              # Logbook entries by library_id
├── pages/                      # File-based routing 
├── server/                     # Server-side API routes and plugins
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
├── tests/                      # Vitest unit tests
└── scripts/                    # Maintenance and build scripts
```

### Key Files
- `nuxt.config.ts` - Main configuration with static generation rules
- `package.json` - Dependencies and validated scripts
- `types/content.ts` - TypeScript interfaces for content structure
- `vitest.config.ts` - Test configuration

## Content & Data

### Library Management  
- **519 libraries** across Vancouver and BC
- **File format**: `content/libraries/{5-digit-id}.md` (e.g., `00001.md`)
- **Unique library IDs**: 5-digit zero-padded (00001-00519)
- **URL structure**: `/library/{id}/{slug}/` (e.g., `/library/00001/1005-jervis-st-at-nelson-st-s-w/`)

### Frontmatter Schema
```yaml
---
title: 'Library Name'
library_id: '00001'
location:
  lat: 49.2849729
  lng: -123.1318965
  address: '1005 Jervis St.'
photo: /images/libraries/placeholder-library.jpg
tags: [active, outdoor, book-exchange]
status: active
---
```

### Tags System
- `kml-import` - Imported from KML dataset
- `outdoor` - Outdoor installation  
- `book-exchange` - Traditional book exchange
- `active` - Currently active and maintained
- `visited_funvill` - Library visited by @funvill

## Common Issues & Solutions

### Import Error Fix
If tests fail with "slugifyTitle is not defined":
```typescript
// In utils/libraryUrl.ts - ensure this import exists:
import { slugifyTitle } from './slugify'
```

### Build Performance
- Static generation prerenders 3464+ routes
- Build includes all 519 library pages
- **CRITICAL**: Do not cancel builds - they process hundreds of routes

### Development Notes
- Hot reload works in development mode
- Map tiles may fail to load due to network blocks (normal in sandbox)
- Some hydration warnings are expected (Vue SSR)
- Google Fonts may be blocked (cosmetic only)

## Deployment

### Static Hosting
- Builds to `.output/public` directory
- **Target**: Cloudflare R2 static hosting
- **CDN**: Global distribution for performance
- **Command**: `npm run generate` produces deployment-ready files

### CI/CD Considerations
- Build time: ~4 minutes
- Generated size: ~30MB (10.9MB gzipped)
- Route prerendering: 3464 routes
- **NEVER CANCEL**: Allow full build completion