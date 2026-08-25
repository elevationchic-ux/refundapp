const fs = require('fs');
const path = require('path');

// LitigeFlow Logo SVG - Shield with checkmark
const createLogo = (size) => {
  const shieldPath = `M${size * 0.5} ${size * 0.195} L${size * 0.742} ${size * 0.273} L${size * 0.742} ${size * 0.508} C${size * 0.742} ${size * 0.664} ${size * 0.625} ${size * 0.781} ${size * 0.5} ${size * 0.82} C${size * 0.375} ${size * 0.781} ${size * 0.258} ${size * 0.664} ${size * 0.258} ${size * 0.508} L${size * 0.258} ${size * 0.273} Z`;
  const checkmark = `M${size * 0.39} ${size * 0.508} L${size * 0.469} ${size * 0.586} L${size * 0.625} ${size * 0.39}`;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.469}" fill="url(#bgGradient)"/>
  <path d="${shieldPath}" fill="url(#shieldGradient)" opacity="0.95"/>
  <path d="${checkmark}" stroke="#6366f1" stroke-width="${size * 0.059}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="${size * 0.313}" cy="${size * 0.352}" r="${size * 0.016}" fill="#ffffff" opacity="0.6"/>
  <circle cx="${size * 0.688}" cy="${size * 0.352}" r="${size * 0.016}" fill="#ffffff" opacity="0.6"/>
  <circle cx="${size * 0.313}" cy="${size * 0.664}" r="${size * 0.016}" fill="#ffffff" opacity="0.6"/>
  <circle cx="${size * 0.688}" cy="${size * 0.664}" r="${size * 0.016}" fill="#ffffff" opacity="0.6"/>
</svg>`;
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

sizes.forEach(s => {
  const svg = createLogo(s);
  fs.writeFileSync(path.join(outDir, `icon-${s}x${s}.png`), svg);
  console.log(`icon-${s}x${s}.png (SVG fallback)`);
});

// Favicon
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), createLogo(32));
// Apple touch icon
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), createLogo(180));
// Main logo
fs.writeFileSync(path.join(__dirname, '..', 'public', 'logo.svg'), createLogo(512));

console.log('All icons generated successfully!');
