// generate-thumbnails.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const sourceFolder = 'images/originals'; // Put original high-res images here
const targetFolder = 'images'; // Where processed images will be saved

// Low-res settings
const lowResMaxWidth = 600; // Max width for low-res images
const lowResQuality = 60; // JPEG quality (lower = smaller file size)

// High-res (display quality) settings 
const highResMaxWidth = 1800; // Max width for high-res images
const highResQuality = 85; // Quality for high-res (target ~500KB)

// Create target directory if it doesn't exist
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}

// Get all files from source directory
const files = fs.readdirSync(sourceFolder);

// Process each image
async function processImages() {
  console.log(`Processing ${files.length} images...`);
  
  for (const file of files) {
    // Skip non-image files
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      console.log(`Skipping non-image file: ${file}`);
      continue;
    }
    
    const sourcePath = path.join(sourceFolder, file);
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    
    // Create optimized high-res version (target ~500KB)
    const highResPath = path.join(targetFolder, `${fileNameWithoutExt}-highres${path.extname(file)}`);
    try {
      await sharp(sourcePath)
        .resize({ width: highResMaxWidth, withoutEnlargement: true })
        .jpeg({ quality: highResQuality })
        .toFile(highResPath);
        
      // Create low-res version (without blur) for faster initial load
      const lowResPath = path.join(targetFolder, `${fileNameWithoutExt}-lowres${path.extname(file)}`);
      await sharp(sourcePath)
        .resize({ width: lowResMaxWidth, withoutEnlargement: true })
        .jpeg({ quality: lowResQuality })
        .toFile(lowResPath);
      
      // Get file sizes for logging
      const originalSize = (fs.statSync(sourcePath).size / 1024).toFixed(2);
      const highResSize = (fs.statSync(highResPath).size / 1024).toFixed(2);
      const lowResSize = (fs.statSync(lowResPath).size / 1024).toFixed(2);
      
      console.log(`Processed ${file}:`);
      console.log(`  Original: ${originalSize}KB`);
      console.log(`  High-res: ${highResSize}KB (target ~500KB)`);
      console.log(`  Low-res: ${lowResSize}KB (target ~50KB)`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('Image processing complete!');
}

processImages();