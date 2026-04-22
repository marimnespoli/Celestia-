// Run with: node generate-icons.js
// Generates icons/icon-192.png and icons/icon-512.png (no npm install needed)

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function createPNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

  const cx = size / 2, cy = size / 2;
  const rows = [];

  for (let y = 0; y < size; y++) {
    const row = [0]; // filter byte
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const outerR = size * 0.48;
      const innerR = size * 0.30;

      if (dist < innerR) {
        // Lavender center: #9B85E0
        row.push(155, 133, 224);
      } else if (dist < outerR) {
        // Blend to deep purple: #3D1A5E
        const t = (dist - innerR) / (outerR - innerR);
        row.push(
          Math.round(155 + (61 - 155) * t),
          Math.round(133 + (26 - 133) * t),
          Math.round(224 + (94 - 224) * t)
        );
      } else {
        // Background: #0D0D2B
        row.push(13, 13, 43);
      }
    }
    rows.push(Buffer.from(row));
  }

  const compressed = zlib.deflateSync(Buffer.concat(rows));

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPNG(512));
console.log('✓ icons/icon-192.png created');
console.log('✓ icons/icon-512.png created');
