const fs = require('fs');
const path = require('path');

// Créer une vraie icône PNG simple (1x1 pixel transparent puis un carré coloré)
const createSimplePNG = (size) => {
  // PNG header pour une image carrée avec fond indigo
  const width = size;
  const height = size;
  
  // Créer un canvas minimum - juste un carré uni couleur indigo (#6366f1)
  // Pour un MVP, on va créer le PNG header + data minimum
  
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk (image header)
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // chunk length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // bit depth
  ihdr.writeUInt8(2, 17); // color type (RGB)
  ihdr.writeUInt8(0, 18); // compression
  ihdr.writeUInt8(0, 19); // filter
  ihdr.writeUInt8(0, 20); // interlace
  
  // CRC pour IHDR
  const crc = require('zlib').crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(crc >>> 0, 21);
  
  // IDAT chunk (image data) - un carré indigo simple
  // Pour simplifier: fond uni indigo
  const pixelData = Buffer.alloc(height * (1 + width * 3)); // +1 pour filter byte par ligne
  for (let y = 0; y < height; y++) {
    const offset = y * (1 + width * 3);
    pixelData.writeUInt8(0, offset); // filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 3;
      pixelData.writeUInt8(0x63, pixelOffset);     // R
      pixelData.writeUInt8(0x66, pixelOffset + 1); // G  
      pixelData.writeUInt8(0xf1, pixelOffset + 2); // B (indigo #6366f1)
    }
  }
  
  const compressed = require('zlib').deflateSync(pixelData);
  const idat = Buffer.alloc(12 + compressed.length);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = require('zlib').crc32(idat.slice(4, 8 + compressed.length));
  idat.writeUInt32BE(idatCrc >>> 0, 8 + compressed.length);
  
  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  
  return Buffer.concat([signature, ihdr, idat, iend]);
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

sizes.forEach(s => {
  const png = createSimplePNG(s);
  fs.writeFileSync(path.join(outDir, `icon-${s}x${s}.png`), png);
  console.log(`icon-${s}x${s}.png created (${png.length} bytes)`);
});

// Apple touch icon  
const applePng = createSimplePNG(180);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), applePng);
console.log(`apple-touch-icon.png created (${applePng.length} bytes)`);

console.log('All PNG icons generated successfully!');
