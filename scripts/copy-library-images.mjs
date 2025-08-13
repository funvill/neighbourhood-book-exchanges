// scripts/copy-library-images.mjs
// ES module version: Copies all images from content/libraries/**/logbook/*.{png,jpg,jpeg} to public/images/libraries/[library-folder]/[image]

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_ROOT = path.join(__dirname, '../content/libraries');
const PUBLIC_ROOT = path.join(__dirname, '../public/images/libraries');

// Find all images in logbook subfolders
const imageFiles = glob.sync(path.join(CONTENT_ROOT, '*/logbook/*.{png,jpg,jpeg,JPG,JPEG,PNG}'));

imageFiles.forEach(srcPath => {
  // srcPath: .../content/libraries/00052-1803-e-1st-ave/logbook/PXL_20250810_212420322.png
  const parts = srcPath.split(path.sep);
  const libraryFolder = parts[parts.length - 3]; // e.g. 00052-1803-e-1st-ave
  const imageName = parts[parts.length - 1];
  const destDir = path.join(PUBLIC_ROOT, libraryFolder);
  const destPath = path.join(destDir, imageName);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${srcPath} -> ${destPath}`);
});

console.log('Library images copied.');
