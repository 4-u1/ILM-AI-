import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

function buildOgBannerSvg() {
  const width = 1200;
  const height = 630;
  const cx = 360;
  const cy = 315;
  const scale = 1.15;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="ogBg" cx="30%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#FFFDF9" />
      <stop offset="50%" stop-color="#FAF7F2" />
      <stop offset="100%" stop-color="#F2E8D8" />
    </radialGradient>

    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C378" />
      <stop offset="50%" stop-color="#C59A45" />
      <stop offset="100%" stop-color="#A67B28" />
    </linearGradient>

    <linearGradient id="ogNavy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#182A45" />
      <stop offset="100%" stop-color="#101D30" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#ogBg)" />

  <!-- Background decorative geometric arabesque arches on right -->
  <g opacity="0.08" stroke="#78350F" fill="none" stroke-width="1.5">
    <circle cx="1020" cy="315" r="380" />
    <circle cx="1020" cy="315" r="280" />
    <circle cx="1020" cy="315" r="180" />
  </g>

  <!-- Celestial Orbit curves on Left -->
  <g opacity="0.45" stroke="#C8A265" fill="none" stroke-linecap="round">
    <path d="M ${cx - 240 * scale},${cy - 120 * scale} C ${cx - 160 * scale},${cy - 240 * scale} ${cx + 120 * scale},${cy - 260 * scale} ${cx + 250 * scale},${cy - 150 * scale}" stroke-width="${1.8 * scale}" />
    <path d="M ${cx - 260 * scale},${cy + 140 * scale} C ${cx - 180 * scale},${cy + 240 * scale} ${cx + 140 * scale},${cy + 250 * scale} ${cx + 260 * scale},${cy + 120 * scale}" stroke-width="${1.8 * scale}" />
  </g>

  <!-- Golden 4-point Sparkle Stars -->
  <g fill="url(#ogGold)">
    <path transform="translate(${cx - 160 * scale}, ${cy - 140 * scale})" d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z" />
    <path transform="translate(${cx + 170 * scale}, ${cy - 130 * scale}) scale(1.2)" d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z" />
    <path transform="translate(${cx - 160 * scale}, ${cy + 120 * scale}) scale(1.1)" d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z" />
    <path transform="translate(${cx + 180 * scale}, ${cy + 10 * scale}) scale(0.9)" d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z" />
  </g>

  <!-- Logo Emblem on Left Side -->
  <g transform="translate(${cx}, ${cy - 15 * scale}) scale(${scale})">
    <!-- Diacritics -->
    <g transform="translate(68, -78)">
      <path d="M -22,12 L 20,-8 L 24,-4 L -18,16 Z" fill="url(#ogGold)" />
    </g>
    <g transform="translate(-42, -56)">
      <ellipse cx="0" cy="0" rx="6.5" ry="8" fill="url(#ogGold)" />
      <ellipse cx="0" cy="0" rx="3" ry="4.5" fill="#FAF7F2" />
    </g>
    <g transform="translate(64, 18)">
      <path d="M -18,12 L 22,-8 L 25,-4 L -15,16 Z" fill="url(#ogGold)" />
    </g>

    <!-- Calligraphy "عِلم" -->
    <g fill="url(#ogNavy)">
      <path d="M 85,-4 C 82,-26 64,-44 42,-44 C 20,-44 4,-26 5,-3 C 5,16 19,30 38,30 C 50,30 62,24 69,14 C 70,22 75,32 82,34 C 85,35 88,33 88,30 C 87,22 83,10 85,-4 Z M 44,-29 C 55,-29 65,-18 66,-5 C 67,8 57,17 44,17 C 31,17 22,8 22,-5 C 22,-18 32,-29 44,-29 Z" />
      <path d="M 5,-105 C 5,-112 0,-115 -4,-115 C -8,-115 -12,-111 -12,-103 L -12,-6 C -12,18 -24,24 -40,24 L -50,24 C -60,24 -68,18 -72,8 L -12,8 L -12,-105 C -12,-109 -9,-112 -5,-112 C -2,-112 5,-109 5,-105 Z" />
      <path d="M 42,16 L -12,16 L -12,30 L 40,30 C 44,28 44,18 42,16 Z" />
      <path d="M -52,14 C -45,14 -38,7 -38,-4 C -38,-16 -47,-25 -60,-25 C -74,-25 -84,-15 -84,-2 C -84,12 -74,22 -58,22 L -84,22 L -84,32 C -84,70 -88,102 -95,112 C -96,114 -94,116 -91,116 C -88,116 -81,102 -77,75 L -76,22 C -68,22 -60,20 -52,14 Z M -60,-13 C -53,-13 -48,-8 -48,-2 C -48,5 -53,10 -60,10 C -67,10 -72,5 -72,-2 C -72,-8 -67,-13 -60,-13 Z" />
      <path d="M -106,86 L -70,86 C -68,86 -68,82 -70,82 L -106,82 C -108,82 -108,86 -106,86 Z" />
    </g>
  </g>

  <!-- Subtitle on Left: — ILM — -->
  <g transform="translate(${cx}, ${cy + 100 * scale}) scale(${scale})">
    <line x1="-120" y1="-5" x2="-65" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />
    <text x="0" y="3" fill="#152238" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="14" text-anchor="middle">
      ILM
    </text>
    <line x1="65" y1="-5" x2="120" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- Vertical Golden Separator Line -->
  <line x1="650" y1="120" x2="650" y2="510" stroke="#E5C378" stroke-width="2" stroke-linecap="round" opacity="0.6" />

  <!-- Right Typography & Meta Branding -->
  <g transform="translate(690, 160)">
    <!-- Challenge Badge -->
    <rect x="0" y="0" width="460" height="42" rx="21" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
    <circle cx="24" cy="21" r="6" fill="#10B981" />
    <text x="44" y="27" fill="#92400E" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="700">
      تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي
    </text>

    <!-- Main Title -->
    <text x="0" y="115" fill="#0F172A" font-family="'Amiri', 'IBM Plex Sans Arabic', serif" font-size="52" font-weight="800">
      منصة عِلم | ILM
    </text>

    <!-- Subtitle Description -->
    <text x="0" y="175" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'IBM Plex Sans Arabic', sans-serif" font-size="23" font-weight="600">
      رحلة معرفية موثوقة للتعريف بالإسلام
    </text>

    <text x="0" y="215" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'IBM Plex Sans Arabic', sans-serif" font-size="18" font-weight="500">
      معلم تفاعلي ذكي • 4 مسارات معتمدة • استدلال موثق 100%
    </text>

    <!-- Features Badges -->
    <g transform="translate(0, 260)">
      <rect x="0" y="0" width="150" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="75" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        📲 تطبيق PWA
      </text>

      <rect x="165" y="0" width="160" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="245" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        ⚡ دون إنترنت
      </text>

      <rect x="340" y="0" width="130" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="405" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        🌐 6 لغات
      </text>
    </g>
  </g>
</svg>`;
}

const ogSvg = buildOgBannerSvg();
const resvgOg = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
});
const ogBuffer = resvgOg.render().asPng();
const ogPath = path.join(publicDir, 'og-image.png');
fs.writeFileSync(ogPath, ogBuffer);
console.log(`✅ Created og-image.png (1200x630) [${ogBuffer.length} bytes]`);
