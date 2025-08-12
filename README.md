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

### Notes

- Convert all the images to png, and resize them
  - Max image size is 600x600 pixels in any direction
- This project is made to be built as a static webpage, then served by Cloudflare R2.
- Add a `## History` section to each little libary. the history section is formated like this `- **2025-Aug-08** - @funvill visited and took photo. Status: Active`
- `photo: logbook/20250809-190601.png` to reference a logbook entry

### Tags

- visited_funvill - This tiny libary has been visited by [@funvill](https://blog.abluestar.com)

### Directory / Files

```bash
content/
└── your-library-name/
    ├── index.md
    ├── logbook/
    │   ├── (logbook entries will go here YYY-MMM-DD-HHMMSS.md)
    ├── photos/
        └── (photos from logbook entries will go here YYY-MMM-DD-HHMMSS.png)
```

#### index.md

```markdown
---
title: 'Title of Little Libary'
location:
  lat: 48.8520587
  lng: -123.5179226
  address: '48.8521, -123.5179'
tags:
  - tag1
  - tag2
  - tag3
  - tag4
photo: /images/libraries/placeholder-library.jpg
---

This is the example description. this is markdown and can contain links [48.8520587, -123.5179226](https://www.google.com/maps?q=48.8520587,-123.5179226) and other formating options.
---
```


#### logbook/YYY-MMM-DD-HHMMSS.md

```markdown
---
title: 'Title of the logbook entry'
tags:
  - tag1
  - tag2
  - tag3
photo: /images/libraries/placeholder-library.jpg  
---

This is the text included with the logbook entry. it is markdown and can include markdown formating.
```


## ToDo

- Add this libary https://photos.google.com/photo/AF1QipOW0qDqqrltBlUJexTQkNQH6xenGhH2jGBlCgRJ
