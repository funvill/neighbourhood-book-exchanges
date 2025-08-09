# Neighbourhood book exchanges

A Little Library Zine

[Project spec doc](https://docs.google.com/document/d/12LJpVHkkpRywIbbA4dffJ5qQawoV1HBOpGzlhY7aTvA/edit?tab=t.0)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

## Adding a New Library

To add a new library to the site, you'll need to create several files and update the featured libraries list. Follow these steps:

### 1. Create Library Content Directory

Create a new directory under `content/` with a kebab-case name:

```bash
content/
└── your-library-name/
    ├── index.md
    └── logbook/
        └── (logbook entries will go here)
```

### 2. Create Library Index File

Create `content/your-library-name/index.md` with the following frontmatter structure:

```markdown
---
title: Your Library Name
description: A brief description of what makes this library special and what visitors can expect to find.
location:
  lat: 49.2827  # GPS latitude
  lng: -123.1207  # GPS longitude
  address: "123 Your Street, Your City"  # Human-readable address
tags:
  - Category1  # e.g., Mystery, Family, Adventure, Academic
  - Category2
  - Category3
photo: /images/libraries/your-library-name/your-photo.jpg
established: 2024-01-15  # Date in YYYY-MM-DD format
difficulty: beginner  # beginner, intermediate, or advanced
entries_count: 0  # Number of logbook entries (start with 0)
recent_activity: 2024-01-15  # Date of last activity
contact:
  email: your-email@example.org  # Optional
  phone: "(555) 123-4567"  # Optional
---

# Your Library Name

Write a compelling description of your library here. Include:

## What You'll Find Here

- **Collection Theme**: Describe the types of books, zines, or content
- **Special Features**: Any unique aspects of this location
- **Community Elements**: How people interact with this library

## Current Content

### Featured Collections
Describe any special collections or ongoing series.

### Interactive Elements
Mention any puzzles, challenges, or community activities.

## Getting Here

Provide detailed directions, parking information, accessibility notes, and best times to visit.

**Hours**: Include any time restrictions or safety considerations.
```

### 3. Add Library Images

Create an image directory and add photos:

```bash
public/images/libraries/
└── your-library-name/
    ├── 2024-01-15-exterior-1.jpg  # Main library photo
    ├── 2024-01-15-interior-1.jpg  # Optional additional photos
    └── 2024-01-15-collection-1.jpg
```

**Image Guidelines:**

- Use descriptive filenames with dates: `YYYY-MM-DD-description-#.jpg`
- Recommended size: 800x600px or similar aspect ratio
- Formats: JPG or PNG
- Keep file sizes reasonable (< 500KB each)

### 4. Update Featured Libraries List

Add your library to the featured libraries array in `components/FeaturedLibraries.vue`:

```typescript
const featuredLibraries = ref([
  // ... existing libraries ...
  {
    _path: '/content/your-library-name',
    title: 'Your Library Name',
    description: 'Your library description (keep it concise for the card)',
    location: {
      lat: 49.2827,
      lng: -123.1207,
      address: 'Your address'
    },
    tags: ['Category1', 'Category2', 'Category3'],
    photo: '/images/libraries/your-library-name/your-photo.jpg',
    difficulty: 'beginner', // beginner, intermediate, or advanced
    entries_count: 0,
    established: '2024-01-15'
  }
])
```

### 5. Create Logbook Directory

Create the logbook directory structure:

```bash
content/your-library-name/logbook/
└── (logbook entries will be added here as people visit)
```

### Example Logbook Entry

When visitors want to add logbook entries, they should create files like `content/your-library-name/logbook/YYYY-MM-DD.md`:

```markdown
---
date: 2024-01-15
author: "Visitor Name"
library: your-library-name
puzzle: "Name of puzzle/activity completed"  # Optional
difficulty: beginner  # beginner, intermediate, advanced
solved: true  # true/false for puzzles
time_spent: "30 minutes"  # Optional
collaboration: false  # true if worked with others
tags:
  - tag1
  - tag2
---

# Visit Summary

Describe your experience visiting this library. What did you find? What did you enjoy? Any tips for future visitors?

## What I Discovered

Details about content, puzzles, or interesting finds.

## Recommendations

Tips, hints, or suggestions for other visitors.
```

### 6. Testing Your New Library

1. Start the development server: `npm run dev`
2. Check that your library appears on the homepage (if added to featured libraries)
3. Navigate to `/library/your-library-name` to view the library detail page
4. Verify all images load correctly
5. Test the search functionality to ensure your library is discoverable

### Library Naming Conventions

- **Directory names**: Use kebab-case (lowercase with hyphens): `sunset-park-reading-nook`
- **Titles**: Use proper capitalization: "Sunset Park Reading Nook"
- **URLs**: Will automatically use the directory name: `/library/sunset-park-reading-nook`

### Content Guidelines

- **Descriptions**: Keep card descriptions under 150 characters for best display
- **Tags**: Use consistent, descriptive tags that help with search and categorization
- **Difficulty**:
  - `beginner`: Easy to find, family-friendly, clear instructions
  - `intermediate`: Requires some puzzle-solving skills or exploration
  - `advanced`: Complex puzzles, requires dedication or special knowledge

### Updating Library Information

To update existing library information:

1. Edit the `content/library-name/index.md` file
2. Update the corresponding entry in `components/FeaturedLibraries.vue` if needed
3. Add new images to the library's image directory
4. The site will automatically reflect changes on next build
