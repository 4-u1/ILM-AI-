import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

/**
 * 🌟 SVG Generator for the Official ILM Brand Logo matching IMG_7566.jpeg
 * - Elegant luxury cream background (#FAF7F2)
 * - Flowing golden celestial orbit arcs
 * - Four-pointed golden stars (✦) and stardust particles
 * - Authentic connected Arabic calligraphy "عِلم" in deep midnight navy (#152238)
 * - Luxury golden diacritics and tashkeel (#C59A45)
 * - Clean subtitle "— ILM —"
 */
function buildLogoSvg({ width, height, isMaskable = false, isOgBanner = false }) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = isMaskable ? 0.78 : (isOgBanner ? 0.85 : 0.95);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="60%" stop-color="#FAF7F2" />
      <stop offset="100%" stop-color="#F3ECE0" />
    </radialGradient>

    <!-- Golden Metallic Gradient for stars & diacritics -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C378" />
      <stop offset="50%" stop-color="#C59A45" />
      <stop offset="100%" stop-color="#A67B28" />
    </linearGradient>

    <!-- Deep Midnight Navy for Calligraphy -->
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#182A45" />
      <stop offset="100%" stop-color="#101D30" />
    </linearGradient>

    <!-- Soft Golden Glow Filter -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- 4-Point Star Definition -->
    <g id="sparkleStar">
      <path d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14 Z" fill="url(#goldGrad)" />
    </g>
    <g id="smallStar">
      <path d="M 0,-8 Q 0,0 8,0 Q 0,0 0,8 Q 0,0 -8,0 Q 0,0 0,-8 Z" fill="url(#goldGrad)" />
    </g>
  </defs>

  <!-- 1. Background Fill -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- 2. Decorative Celestial Arcs & Orbits matching IMG_7566.jpeg -->
  <g opacity="0.45" stroke="#C8A265" fill="none" stroke-linecap="round">
    <!-- Outer delicate sweeping curves -->
    <path d="M ${cx - 240 * scale},${cy - 120 * scale} C ${cx - 160 * scale},${cy - 240 * scale} ${cx + 120 * scale},${cy - 260 * scale} ${cx + 250 * scale},${cy - 150 * scale}" stroke-width="${1.5 * scale}" />
    <path d="M ${cx - 260 * scale},${cy + 140 * scale} C ${cx - 180 * scale},${cy + 240 * scale} ${cx + 140 * scale},${cy + 250 * scale} ${cx + 260 * scale},${cy + 120 * scale}" stroke-width="${1.5 * scale}" />
    <path d="M ${cx - 220 * scale},${cy - 180 * scale} C ${cx - 270 * scale},${cy + 50 * scale} ${cx - 180 * scale},${cy + 200 * scale} ${cx - 60 * scale},${cy + 260 * scale}" stroke-width="${1.2 * scale}" stroke-dasharray="4 6" opacity="0.6" />
    <path d="M ${cx + 70 * scale},${cy - 260 * scale} C ${cx + 210 * scale},${cy - 200 * scale} ${cx + 270 * scale},${cy - 40 * scale} ${cx + 230 * scale},${cy + 180 * scale}" stroke-width="${1.2 * scale}" opacity="0.6" />
  </g>

  <!-- 3. Celestial Sparkles & Stardust matching IMG_7566.jpeg -->
  <g>
    <!-- Top-Left Sparkle -->
    <use href="#sparkleStar" x="${cx - 145 * scale}" y="${cy - 140 * scale}" transform="scale(${0.9 * scale})" />
    <circle cx="${cx - 120 * scale}" cy="${cy - 180 * scale}" r="${2.5 * scale}" fill="#C59A45" opacity="0.75" />

    <!-- Top-Right Sparkles -->
    <use href="#sparkleStar" x="${cx + 140 * scale}" y="${cy - 130 * scale}" transform="scale(${1.1 * scale})" />
    <use href="#smallStar" x="${cx + 165 * scale}" y="${cy - 95 * scale}" transform="scale(${0.85 * scale})" />
    <circle cx="${cx + 80 * scale}" cy="${cy - 170 * scale}" r="${3 * scale}" fill="#C59A45" opacity="0.65" />

    <!-- Middle-Right Sparkle -->
    <use href="#sparkleStar" x="${cx + 160 * scale}" y="${cy - 5 * scale}" transform="scale(${0.95 * scale})" />

    <!-- Bottom-Left Sparkles -->
    <use href="#sparkleStar" x="${cx - 150 * scale}" y="${cy + 100 * scale}" transform="scale(${1.15 * scale})" />
    <circle cx="${cx - 175 * scale}" cy="${cy + 60 * scale}" r="${2.5 * scale}" fill="#C59A45" opacity="0.7" />

    <!-- Subtle stardust dots -->
    <circle cx="${cx - 45 * scale}" cy="${cy - 150 * scale}" r="${2 * scale}" fill="#D8BA84" opacity="0.7" />
    <circle cx="${cx + 50 * scale}" cy="${cy + 155 * scale}" r="${2 * scale}" fill="#D8BA84" opacity="0.6" />
    <circle cx="${cx + 175 * scale}" cy="${cy + 120 * scale}" r="${2.2 * scale}" fill="#D8BA84" opacity="0.5" />
  </g>

  <!-- 4. Central Calligraphic Emblem "عـلـم" matching IMG_7566.jpeg -->
  <g transform="translate(${cx}, ${cy - 15 * scale}) scale(${scale})">
    <!-- Golden Tashkeel / Diacritics (Accents) -->
    <!-- Gold Stroke above 'Ain' (Fatha) -->
    <g transform="translate(68, -78)">
      <path d="M -22,12 L 20,-8 L 24,-4 L -18,16 Z" fill="url(#goldGrad)" rx="2" />
    </g>

    <!-- Gold Sukun / Small Ha above 'Lam' -->
    <g transform="translate(-42, -56)">
      <ellipse cx="0" cy="0" rx="6.5" ry="8" fill="url(#goldGrad)" />
      <ellipse cx="0" cy="0" rx="3" ry="4.5" fill="#FAF7F2" />
    </g>

    <!-- Gold Accent Stroke below 'Lam'/'Meem' -->
    <g transform="translate(64, 18)">
      <path d="M -18,12 L 22,-8 L 25,-4 L -15,16 Z" fill="url(#goldGrad)" rx="2" />
    </g>

    <!-- Authentic Handcrafted Vector Paths for "عِـلـم" in Deep Midnight Navy -->
    <!-- Main Calligraphic Body: Connecting 'Ain', 'Lam', 'Meem' with characteristic curve -->
    <g fill="url(#navyGrad)">
      <!-- Letter 'Ain' (ع): Elegant curved loop on right -->
      <path d="M 85,-4 C 82,-26 64,-44 42,-44 C 20,-44 4,-26 5,-3 C 5,16 19,30 38,30 C 50,30 62,24 69,14 C 70,22 75,32 82,34 C 85,35 88,33 88,30 C 87,22 83,10 85,-4 Z M 44,-29 C 55,-29 65,-18 66,-5 C 67,8 57,17 44,17 C 31,17 22,8 22,-5 C 22,-18 32,-29 44,-29 Z" />

      <!-- Vertical Ascender of 'Lam' (ل): Tall elegant vertical shaft extending high -->
      <path d="M 5,-105 C 5,-112 0,-115 -4,-115 C -8,-115 -12,-111 -12,-103 L -12,-6 C -12,18 -24,24 -40,24 L -50,24 C -60,24 -68,18 -72,8 L -12,8 L -12,-105 C -12,-109 -9,-112 -5,-112 C -2,-112 5,-109 5,-105 Z" />

      <!-- Connecting Bridge from 'Ain' to 'Lam' -->
      <path d="M 42,16 L -12,16 L -12,30 L 40,30 C 44,28 44,18 42,16 Z" />

      <!-- Letter 'Meem' (م): Rounded knot and flowing downward tail on left -->
      <path d="M -52,14 C -45,14 -38,7 -38,-4 C -38,-16 -47,-25 -60,-25 C -74,-25 -84,-15 -84,-2 C -84,12 -74,22 -58,22 L -84,22 L -84,32 C -84,70 -88,102 -95,112 C -96,114 -94,116 -91,116 C -88,116 -81,102 -77,75 L -76,22 C -68,22 -60,20 -52,14 Z M -60,-13 C -53,-13 -48,-8 -48,-2 C -48,5 -53,10 -60,10 C -67,10 -72,5 -72,-2 C -72,-8 -67,-13 -60,-13 Z" />

      <!-- Bottom flourish cross on Meem's tail (The distinctive horizontal bar) -->
      <path d="M -106,86 L -70,86 C -68,86 -68,82 -70,82 L -106,82 C -108,82 -108,86 -106,86 Z" />
    </g>
  </g>

  <!-- 5. Subtitle "— ILM —" matching IMG_7566.jpeg -->
  <g transform="translate(${cx}, ${cy + 85 * scale}) scale(${scale})">
    <!-- Left Horizontal Line -->
    <line x1="-115" y1="-5" x2="-65" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />

    <!-- English Letters: I L M -->
    <text x="0" y="2" fill="#152238" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'IBM Plex Sans', sans-serif" font-size="28" font-weight="800" letter-spacing="14" text-anchor="middle">
      ILM
    </text>

    <!-- Right Horizontal Line -->
    <line x1="65" y1="-5" x2="115" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />
  </g>
</svg>`;
}

/**
 * 🌟 SVG Generator for the Wide Open Graph Share Banner (1200x630)
 * Includes the logo emblem, platform title, and official AI Challenge branding
 */
function buildOgBannerSvg() {
  const width = 1200;
  const height = 630;
  const cx = 330;
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

    <g id="ogSparkle">
      <path d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z" fill="url(#ogGold)" />
    </g>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#ogBg)" />

  <!-- Background decorative geometric arabesque arches on right -->
  <g opacity="0.08" stroke="#78350F" fill="none" stroke-width="1.5">
    <circle cx="1000" cy="315" r="380" />
    <circle cx="1000" cy="315" r="300" />
    <circle cx="1000" cy="315" r="220" />
    <rect x="780" y="95" width="440" height="440" rx="40" transform="rotate(45 1000 315)" />
  </g>

  <!-- Celestial Orbit curves on Left -->
  <g opacity="0.45" stroke="#C8A265" fill="none" stroke-linecap="round">
    <path d="M ${cx - 240 * scale},${cy - 120 * scale} C ${cx - 160 * scale},${cy - 240 * scale} ${cx + 120 * scale},${cy - 260 * scale} ${cx + 250 * scale},${cy - 150 * scale}" stroke-width="${1.8 * scale}" />
    <path d="M ${cx - 260 * scale},${cy + 140 * scale} C ${cx - 180 * scale},${cy + 240 * scale} ${cx + 140 * scale},${cy + 250 * scale} ${cx + 260 * scale},${cy + 120 * scale}" stroke-width="${1.8 * scale}" />
  </g>

  <!-- Stars -->
  <use href="#ogSparkle" x="${cx - 160 * scale}" y="${cy - 140 * scale}" />
  <use href="#ogSparkle" x="${cx + 160 * scale}" y="${cy - 130 * scale}" transform="scale(1.2)" />
  <use href="#ogSparkle" x="${cx - 160 * scale}" y="${cy + 120 * scale}" transform="scale(1.1)" />
  <use href="#ogSparkle" x="${cx + 180 * scale}" y="${cy + 10 * scale}" transform="scale(0.9)" />

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

    <!-- Calligraphy -->
    <g fill="url(#ogNavy)">
      <path d="M 85,-4 C 82,-26 64,-44 42,-44 C 20,-44 4,-26 5,-3 C 5,16 19,30 38,30 C 50,30 62,24 69,14 C 70,22 75,32 82,34 C 85,35 88,33 88,30 C 87,22 83,10 85,-4 Z M 44,-29 C 55,-29 65,-18 66,-5 C 67,8 57,17 44,17 C 31,17 22,8 22,-5 C 22,-18 32,-29 44,-29 Z" />
      <path d="M 5,-105 C 5,-112 0,-115 -4,-115 C -8,-115 -12,-111 -12,-103 L -12,-6 C -12,18 -24,24 -40,24 L -50,24 C -60,24 -68,18 -72,8 L -12,8 L -12,-105 C -12,-109 -9,-112 -5,-112 C -2,-112 5,-109 5,-105 Z" />
      <path d="M 42,16 L -12,16 L -12,30 L 40,30 C 44,28 44,18 42,16 Z" />
      <path d="M -52,14 C -45,14 -38,7 -38,-4 C -38,-16 -47,-25 -60,-25 C -74,-25 -84,-15 -84,-2 C -84,12 -74,22 -58,22 L -84,22 L -84,32 C -84,70 -88,102 -95,112 C -96,114 -94,116 -91,116 C -88,116 -81,102 -77,75 L -76,22 C -68,22 -60,20 -52,14 Z M -60,-13 C -53,-13 -48,-8 -48,-2 C -48,5 -53,10 -60,10 C -67,10 -72,5 -72,-2 C -72,-8 -67,-13 -60,-13 Z" />
      <path d="M -106,86 L -70,86 C -68,86 -68,82 -70,82 L -106,82 C -108,82 -108,86 -106,86 Z" />
    </g>
  </g>

  <!-- Subtitle on Left -->
  <g transform="translate(${cx}, ${cy + 100 * scale}) scale(${scale})">
    <line x1="-120" y1="-5" x2="-65" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />
    <text x="0" y="3" fill="#152238" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="14" text-anchor="middle">
      ILM
    </text>
    <line x1="65" y1="-5" x2="120" y2="-5" stroke="#152238" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- Vertical Golden Separator Line -->
  <line x1="610" y1="120" x2="610" y2="510" stroke="#E5C378" stroke-width="2" stroke-linecap="round" opacity="0.6" />

  <!-- Right Typography & Meta Branding -->
  <g transform="translate(660, 160)" dir="rtl">
    <!-- Challenge Badge -->
    <rect x="0" y="0" width="360" height="42" rx="21" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
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
      <!-- Badge 1: PWA -->
      <rect x="0" y="0" width="165" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="82" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        📲 تطبيق PWA مستقل
      </text>

      <!-- Badge 2: Offline -->
      <rect x="180" y="0" width="165" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="262" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        ⚡ يعمل دون إنترنت
      </text>

      <!-- Badge 3: 6 Languages -->
      <rect x="360" y="0" width="140" height="38" rx="12" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="430" y="24" fill="#1E293B" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">
        🌐 6 لغات عالمية
      </text>
    </g>
  </g>
</svg>`;
}

async function generateAllAssets() {
  console.log('🚀 Generating Official ILM Brand Logo Assets from IMG_7566.jpeg...');

  const targets = [
    { name: 'pwa-512x512.png', size: 512, isMaskable: false },
    { name: 'pwa-maskable-512x512.png', size: 512, isMaskable: true },
    { name: 'pwa-192x192.png', size: 192, isMaskable: false },
    { name: 'apple-touch-icon.png', size: 180, isMaskable: false },
    { name: 'favicon.png', size: 64, isMaskable: false },
  ];

  for (const t of targets) {
    const svg = buildLogoSvg({ width: t.size, height: t.size, isMaskable: t.isMaskable });
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: t.size },
      font: { loadSystemFonts: true },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    const outPath = path.join(publicDir, t.name);
    fs.writeFileSync(outPath, pngBuffer);
    console.log(`✅ Created ${t.name} (${t.size}x${t.size}) [${pngBuffer.length} bytes]`);
  }

  // Generate Wide Open Graph Banner (1200x630) for link previews and social shares
  const ogSvg = buildOgBannerSvg();
  const resvgOg = new Resvg(ogSvg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true },
  });
  const ogBuffer = resvgOg.render().asPng();
  const ogPath = path.join(publicDir, 'og-image.png');
  fs.writeFileSync(ogPath, ogBuffer);
  console.log(`✅ Created og-image.png (1200x630) [${ogBuffer.length} bytes]`);

  console.log('🎉 All official brand assets generated successfully!');
}

generateAllAssets().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
