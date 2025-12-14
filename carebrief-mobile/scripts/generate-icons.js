const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../assets/images');

// SVG content for the icon
const svgContent = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#5D8A72"/>

  <!-- Four-leaf clover icon (white) centered -->
  <g transform="translate(512, 512)">
    <!-- Top-left leaf -->
    <ellipse cx="-120" cy="-120" rx="160" ry="160" fill="rgba(255,255,255,0.85)" transform="rotate(45, -120, -120)"/>

    <!-- Top-right leaf -->
    <ellipse cx="120" cy="-120" rx="160" ry="160" fill="rgba(255,255,255,0.85)" transform="rotate(45, 120, -120)"/>

    <!-- Bottom-left leaf -->
    <ellipse cx="-120" cy="120" rx="160" ry="160" fill="rgba(255,255,255,0.85)" transform="rotate(45, -120, 120)"/>

    <!-- Bottom-right leaf -->
    <ellipse cx="120" cy="120" rx="160" ry="160" fill="rgba(255,255,255,0.85)" transform="rotate(45, 120, 120)"/>

    <!-- Center diamond overlay for depth -->
    <rect x="-100" y="-100" width="200" height="200" fill="rgba(255,255,255,0.95)" transform="rotate(45)"/>
  </g>
</svg>`;

// Adaptive icon SVG (just the foreground, transparent background)
const adaptiveSvgContent = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Four-leaf clover icon centered -->
  <g transform="translate(512, 512)">
    <!-- Top-left leaf -->
    <ellipse cx="-100" cy="-100" rx="130" ry="130" fill="rgba(255,255,255,0.85)" transform="rotate(45, -100, -100)"/>

    <!-- Top-right leaf -->
    <ellipse cx="100" cy="-100" rx="130" ry="130" fill="rgba(255,255,255,0.85)" transform="rotate(45, 100, -100)"/>

    <!-- Bottom-left leaf -->
    <ellipse cx="-100" cy="100" rx="130" ry="130" fill="rgba(255,255,255,0.85)" transform="rotate(45, -100, 100)"/>

    <!-- Bottom-right leaf -->
    <ellipse cx="100" cy="100" rx="130" ry="130" fill="rgba(255,255,255,0.85)" transform="rotate(45, 100, 100)"/>

    <!-- Center diamond overlay for depth -->
    <rect x="-80" y="-80" width="160" height="160" fill="rgba(255,255,255,0.95)" transform="rotate(45)"/>
  </g>
</svg>`;

async function generateIcons() {
  try {
    // Generate main icon (1024x1024)
    await sharp(Buffer.from(svgContent))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Generated icon.png (1024x1024)');

    // Generate adaptive icon (1024x1024) with transparent background
    await sharp(Buffer.from(adaptiveSvgContent))
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Generated adaptive-icon.png (1024x1024)');

    // Generate favicon (48x48)
    await sharp(Buffer.from(svgContent))
      .resize(48, 48)
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Generated favicon.png (48x48)');

    // Generate splash icon (200x200) for splash screen
    await sharp(Buffer.from(svgContent))
      .resize(200, 200)
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('Generated splash-icon.png (200x200)');

    console.log('\nAll icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
