import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

function drawCircle(png, cx, cy, r, color) {
  const r2 = r * r;
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(png.width - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(png.height - 1, Math.ceil(cy + r));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= r2) {
        const idx = (png.width * y + x) << 2;
        // Smooth antialias near edge
        const dist = Math.sqrt(d2);
        const alpha = Math.max(0, Math.min(1, r - dist + 0.5));
        
        png.data[idx] = Math.round(color.r * alpha + png.data[idx] * (1 - alpha));
        png.data[idx + 1] = Math.round(color.g * alpha + png.data[idx + 1] * (1 - alpha));
        png.data[idx + 2] = Math.round(color.b * alpha + png.data[idx + 2] * (1 - alpha));
        png.data[idx + 3] = 255;
      }
    }
  }
}

function drawStar(png, cx, cy, outerR, innerR, points, color) {
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const step = Math.PI / points;
      const a = ((angle % (2 * step)) + 2 * step) % (2 * step);
      const r = innerR + (outerR - innerR) * (0.5 + 0.5 * Math.cos(points * angle));
      
      if (dist <= r) {
        const idx = (png.width * y + x) << 2;
        const edgeAlpha = Math.max(0, Math.min(1, r - dist + 0.5));
        png.data[idx] = Math.round(color.r * edgeAlpha + png.data[idx] * (1 - edgeAlpha));
        png.data[idx + 1] = Math.round(color.g * edgeAlpha + png.data[idx + 1] * (1 - edgeAlpha));
        png.data[idx + 2] = Math.round(color.b * edgeAlpha + png.data[idx + 2] * (1 - edgeAlpha));
        png.data[idx + 3] = 255;
      }
    }
  }
}

function generatePwaIcon(size, filename, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;

  // Background Fill: Royal Cream (#FAF7F2) or Emerald-Gold (#064E3B)
  const bg = isMaskable ? { r: 6, g: 78, b: 59 } : { r: 250, g: 247, b: 242 };
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      // Subtle gradient
      const factor = 1 - (y / size) * 0.15;
      png.data[idx] = Math.round(bg.r * factor);
      png.data[idx + 1] = Math.round(bg.g * factor);
      png.data[idx + 2] = Math.round(bg.b * factor);
      png.data[idx + 3] = 255;
    }
  }

  // Outer Golden Ring
  const ringR = size * (isMaskable ? 0.38 : 0.44);
  drawCircle(png, cx, cy, ringR, { r: 212, g: 175, b: 55 }); // #D4AF37 Gold
  drawCircle(png, cx, cy, ringR - (size * 0.02), isMaskable ? { r: 6, g: 78, b: 59 } : { r: 255, g: 255, b: 255 });

  // Center 8-point Islamic Star
  const starOuterR = ringR * 0.72;
  const starInnerR = ringR * 0.45;
  drawStar(png, cx, cy, starOuterR, starInnerR, 8, { r: 5, g: 150, b: 105 }); // Emerald

  // Inner Golden Core
  drawCircle(png, cx, cy, starInnerR * 0.6, { r: 245, g: 158, b: 11 }); // Amber
  drawCircle(png, cx, cy, starInnerR * 0.45, { r: 255, g: 255, b: 255 });
  drawCircle(png, cx, cy, starInnerR * 0.25, { r: 15, g: 43, b: 92 }); // Navy Accent under 'ع'

  const buffer = PNG.sync.write(png);
  const targetPath = path.join(publicDir, filename);
  fs.writeFileSync(targetPath, buffer);
  console.log(`✅ Generated ${filename} (${size}x${size}) at ${targetPath}`);
}

generatePwaIcon(192, 'pwa-192x192.png', false);
generatePwaIcon(512, 'pwa-512x512.png', false);
generatePwaIcon(512, 'pwa-maskable-512x512.png', true);
generatePwaIcon(180, 'apple-touch-icon.png', false);
generatePwaIcon(64, 'favicon.png', false);
