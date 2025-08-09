import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Style URL to tag mapping
const styleMapping = {
  'icon-503-FF8277-labelson': ['outdoor', 'book-exchange', 'red-marker', 'active'],
  'icon-503-F8971B-labelson': ['indoor', 'book-exchange', 'orange-marker', 'active'],
  'icon-503-62AF44-labelson': ['seasonal', 'temporary', 'green-marker', 'active'],
  'icon-503-F4EB37-labelson': ['closed', 'uncertain', 'yellow-marker', 'inactive'],
  'icon-503-4186F0-labelson': ['free-store', 'multi-purpose', 'dark-blue-marker', 'active'],
  'icon-503-93D7E8-labelson': ['outside-vancouver', 'pale-blue-marker', 'active'],
  'icon-503-C6A4CF-labelson': ['removed', 'defunct', 'violet-marker', 'inactive'],
  'icon-960-FF8277-labelson': ['fibre-library', 'outdoor', 'star-shape', 'active'],
  'icon-960-F4EB37-labelson': ['fibre-library', 'closed', 'star-shape', 'inactive'],
  'icon-960-C6A4CF-labelson': ['fibre-library', 'removed', 'star-shape', 'inactive'],
  'icon-960-93D7E8-labelson': ['fibre-library', 'outside-vancouver', 'star-shape', 'active'],
  'icon-960-F4B400-labelson': ['fibre-library', 'dark-blue', 'star-shape', 'active']
};

function generateSlug(name) {
  if (name && name.trim()) {
    return name
      .replace(/<!\[CDATA\[|\]\]>/g, '') // Remove CDATA brackets
      .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .slice(0, 60); // Limit length
  } else {
    return `unknown-address-${Date.now()}`;
  }
}

function cleanDescription(description) {
  if (!description) return '';
  
  // Remove CDATA wrapper
  let cleaned = description.replace(/<!\[CDATA\[|\]\]>/g, '');
  
  // Remove HTML img tags and other HTML
  cleaned = cleaned.replace(/<img[^>]*>/g, '');
  cleaned = cleaned.replace(/<br\s*\/?>/g, '\n');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

function extractCoordinates(coordString) {
  if (!coordString) return { lat: 0, lng: 0, address: 'Unknown location' };
  
  const parts = coordString.trim().split(',');
  if (parts.length >= 2) {
    return {
      lng: parseFloat(parts[0]),
      lat: parseFloat(parts[1]),
      address: `${parseFloat(parts[1]).toFixed(4)}, ${parseFloat(parts[0]).toFixed(4)}`
    };
  }
  return { lat: 0, lng: 0, address: 'Unknown location' };
}

function extractPhotos(description) {
  if (!description) return [];
  
  const photoUrls = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = imgRegex.exec(description)) !== null) {
    photoUrls.push(match[1]);
  }
  
  return photoUrls;
}

function parseKML(kmlContent) {
  const placemarks = [];
  
  // Simple regex-based parsing for this specific KML structure
  const placemarkRegex = /<Placemark>([\s\S]*?)<\/Placemark>/g;
  let match;
  
  while ((match = placemarkRegex.exec(kmlContent)) !== null) {
    const placemarkContent = match[1];
    
    // Extract name
    const nameMatch = placemarkContent.match(/<name>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/name>/s);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract description
    const descMatch = placemarkContent.match(/<description>([\s\S]*?)<\/description>/);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract styleUrl
    const styleMatch = placemarkContent.match(/<styleUrl>#([^<]+)<\/styleUrl>/);
    const styleUrl = styleMatch ? styleMatch[1] : '';
    
    // Extract coordinates
    const coordMatch = placemarkContent.match(/<coordinates>\s*([\d\.-]+,[\d\.-]+,[\d\.-]*)\s*<\/coordinates>/);
    const coordinates = coordMatch ? coordMatch[1] : '';
    
    if (name || coordinates) {
      placemarks.push({
        name,
        description,
        styleUrl,
        coordinates
      });
    }
  }
  
  return placemarks;
}

function createLibraryMarkdown(library) {
  const tags = ['kml-import', ...(styleMapping[library.styleUrl] || ['imported'])];
  
  // Properly escape YAML strings
  const cleanTitle = library.title.replace(/"/g, '\\"');
  const cleanDescription = library.description
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n+$/, '')      // Remove trailing newlines
    .trim();
  
  // Create Google Maps URL
  const mapsUrl = `https://www.google.com/maps?q=${library.coordinates.lat},${library.coordinates.lng}`;
  
  return `---
title: "${cleanTitle}"
location:
  lat: ${library.coordinates.lat}
  lng: ${library.coordinates.lng}
  address: "${library.coordinates.address}"
tags:
${tags.map(tag => `  - "${tag}"`).join('\n')}
photo: "/images/libraries/placeholder-library.jpg"
entries_count: 1
import_source: "vancouver-little-libraries-kml"
import_date: "2024-08-08"
---

# ${library.title}

${cleanDescription}

## Location Details

This library is located at [${library.coordinates.lat}, ${library.coordinates.lng}](${mapsUrl}).

GPS Coordinates: ${library.coordinates.lat}, ${library.coordinates.lng}

[📍 Open in Google Maps](${mapsUrl})

## Photos

External photos available in original dataset.

## Import Information

This library was imported from the Vancouver Little Libraries KML dataset on 2024-08-08.

Original data source: Neighbourhood book exchanges 2025.8.6.revision; Vancouver, BC, Canada

## Location Details

This library is located at ${library.coordinates.address}.

GPS Coordinates: ${library.coordinates.lat}, ${library.coordinates.lng}

## Photos

${library.photos.length > 0 ? 'External photos available in original dataset.' : 'No photos available in original dataset.'}

## Import Information

This library was imported from the Vancouver Little Libraries KML dataset on 2024-08-08.

Original data source: Neighbourhood book exchanges 2025.8.6.revision; Vancouver, BC, Canada

${library.statusNotes || ''}
`;
}

function createLogbookEntry(library) {
  const statusNotes = library.styleUrl.includes('C6A4CF') ? 'Note: This library was marked as removed/defunct in the original dataset.' :
                     library.styleUrl.includes('F4EB37') ? 'Note: This library was marked as closed/uncertain in the original dataset.' :
                     'This library was marked as active in the original dataset.';

  return `---
date: 2024-08-08
import: true
source: "Neighbourhood book exchanges 2025.8.6"
tags:
  - import
  - kml-data
  - vancouver-libraries
---

# Library Import Entry

This library was created by importing data from "Neighbourhood book exchanges 2025.8.6" - a comprehensive map of little free libraries and book exchanges in Vancouver, BC, Canada.

## Original Data

- **Source**: Vancouver Little Libraries KML dataset
- **Style**: ${library.styleUrl}
- **Status**: ${library.styleUrl.includes('active') ? 'Active' : 'Inactive/Uncertain'}
- **Import Date**: August 8, 2025

## Description from Original Source

${library.description}

## Next Steps

This entry serves as a baseline record. Future visitors are encouraged to:
- Verify the current status of this library
- Add photos if visiting in person
- Update the description with current conditions
- Log any changes or improvements observed

## Notes

${statusNotes}
`;
}

async function importKML() {
  console.log('Starting KML import...');
  
  try {
    // Read the KML file
    const kmlPath = path.join(__dirname, '..', 'tinyLibaries.kml');
    const kmlContent = fs.readFileSync(kmlPath, 'utf-8');
    
    console.log('Parsing KML file...');
    const placemarks = parseKML(kmlContent);
    console.log(`Found ${placemarks.length} placemarks`);
    
    const contentDir = path.join(__dirname, '..', 'content', 'libraries');
    let imported = 0;
    const stats = {
      active: 0,
      inactive: 0,
      total: 0
    };
    
    for (const placemark of placemarks) {
      try {
        const coordinates = extractCoordinates(placemark.coordinates);
        const cleanDesc = cleanDescription(placemark.description);
        const photos = extractPhotos(placemark.description);
        
        // Generate slug from name/address
        const slug = generateSlug(placemark.name || coordinates.address);
        if (!slug) continue;
        
        const library = {
          slug,
          title: placemark.name || `Library at ${coordinates.address}`,
          description: cleanDesc,
          coordinates,
          photos,
          styleUrl: placemark.styleUrl,
          originalCoordinates: placemark.coordinates
        };
        
        // Create library directory
        const libraryDir = path.join(contentDir, slug);
        if (!fs.existsSync(libraryDir)) {
          fs.mkdirSync(libraryDir, { recursive: true });
        }
        
        // Create logbook directory
        const logbookDir = path.join(libraryDir, 'logbook');
        if (!fs.existsSync(logbookDir)) {
          fs.mkdirSync(logbookDir, { recursive: true });
        }
        
        // Write index.md
        const indexPath = path.join(libraryDir, 'index.md');
        fs.writeFileSync(indexPath, createLibraryMarkdown(library));
        
        // Write initial logbook entry
        const logbookPath = path.join(logbookDir, '2024-08-08.md');
        fs.writeFileSync(logbookPath, createLogbookEntry(library));
        
        // Update stats
        if (styleMapping[library.styleUrl]?.includes('active')) {
          stats.active++;
        } else {
          stats.inactive++;
        }
        stats.total++;
        imported++;
        
        if (imported % 50 === 0) {
          console.log(`Imported ${imported} libraries...`);
        }
        
      } catch (error) {
        console.error(`Error processing placemark: ${error.message}`);
      }
    }
    
    console.log('\n=== Import Complete ===');
    console.log(`Total libraries imported: ${stats.total}`);
    console.log(`Active libraries: ${stats.active}`);
    console.log(`Inactive/uncertain libraries: ${stats.inactive}`);
    
    // Write summary file
    const summaryPath = path.join(__dirname, '..', 'kml-import-summary.md');
    const summary = `# KML Import Summary

Date: ${new Date().toISOString()}
Source: Neighbourhood book exchanges 2025.8.6.revision

## Statistics
- **Total libraries imported**: ${stats.total}
- **Active libraries**: ${stats.active}
- **Inactive/uncertain libraries**: ${stats.inactive}

## Tag Distribution
${Object.entries(styleMapping).map(([style, tags]) => 
  `- **${style}**: ${tags.join(', ')}`
).join('\n')}

## Next Steps
1. Review imported libraries in the content/ directory
2. Update featured libraries list with high-quality active locations
3. Create placeholder-library.jpg image
4. Test the site with new content
`;
    
    fs.writeFileSync(summaryPath, summary);
    console.log(`Summary written to: ${summaryPath}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import
importKML();
