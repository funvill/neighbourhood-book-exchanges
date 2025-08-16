# Neighbourhood book exchanges

Live preview: [libraries.abluestar.com](libraries.abluestar.com)

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

## Build for static site

Build the application as static files

```bash
# npm
npm run generate
npm run preview
```

## Project

### 🚀 Recent Migration (August 2025)

This project has been migrated from a complex nested folder structure to a simplified Nuxt Content-friendly organization for improved performance:

- **Libraries**: Flattened from `content/libraries/*/index.md` to `content/libraries/*.md` 
- **Logbooks**: Reorganized from `content/libraries/*/logbook/` to `content/logbooks/*/`
- **Performance**: Build time improved from ~30 seconds to <5 seconds per library page
- **Content**: 519 libraries successfully migrated with 0 errors

See [MIGRATION-DOCUMENTATION.md](./MIGRATION-DOCUMENTATION.md) for complete details.

### Content Organization

#### Libraries (content/libraries/*.md)
Each library is a single markdown file named by library_id:

```bash
content/
├── libraries/
│   ├── 00001.md              # Library metadata and content
│   ├── 00002.md
│   └── ...                   # 519 total libraries
└── logbooks/
    ├── 00001/                # Logbook entries by library_id
    │   └── 2024-08-08.md
    ├── 00002/
    │   └── 2024-08-08.md
    └── ...
```

#### Library File Format (*.md)
```markdown
---
title: 'Title of Little Library'
location:
  lat: 48.8520587
  lng: -123.5179226
  address: '48.8521, -123.5179'
tags:
  - tag1
  - tag2
photo: /images/libraries/placeholder-library.jpg
library_id: '00001'                    # Unique 5-digit identifier
---

Library description in markdown format...

## History
- **2025-Aug-08** - @funvill visited and took photo. Status: Active
```

#### Logbook Entry Format (content/logbooks/{library_id}/*.md)
```markdown
---
library_id: '00001'                    # Reference to parent library
date: 2024-08-08                       # Entry date (YYYY-MM-DD)
title: 'Title of the logbook entry'
tags:
  - tag1
  - tag2
photo: /images/libraries/placeholder-library.jpg  
---

Logbook entry content in markdown format...
```

### Development Notes

- Convert all images to PNG and resize them (max 600x600 pixels)
- Built as a static webpage, served by Cloudflare R2
- Add `## History` sections: `- **2025-Aug-08** - @funvill visited and took photo. Status: Active`
- Reference logbook photos: `photo: logbook/20250809-190601.png`

### Tags

- `visited_funvill` - Library visited by [@funvill](https://blog.abluestar.com)
- `kml-import` - Imported from KML dataset
- `outdoor` - Outdoor installation
- `book-exchange` - Traditional book exchange
- `active` - Currently active and maintained

## ToDo

- Add this libary 
  - https://photos.google.com/photo/AF1QipOW0qDqqrltBlUJexTQkNQH6xenGhH2jGBlCgRJ
  - https://photos.app.goo.gl/9K22FjMTXAzvpgcN6
  - https://photos.app.goo.gl/78szsH6EBee9fvLZ9
  - https://photos.app.goo.gl/8qKah5YwUmbTjzCs5

- Add this libary https://photos.app.goo.gl/MG67NgCtgUt6sRPGA, note it in the same place as 00406-2390-brunswick-st but not the same one

- Add this little art gallery https://photos.app.goo.gl/Uz79vqdF99KqsRJUA