import fs from 'fs';
import path from 'path';

const outDir = path.resolve('images/cards');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Card 1: Countdown begins (Navy & Stars)
const card1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10172a"/>
      <stop offset="50%" stop-color="#161f38"/>
      <stop offset="100%" stop-color="#0b1020"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#10172a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg1)"/>
  <rect width="400" height="580" rx="24" fill="url(#glow1)"/>
  <rect x="16" y="16" width="368" height="548" rx="16" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
  <circle cx="80" cy="90" r="1.5" fill="#fff" opacity="0.6"/>
  <circle cx="320" cy="110" r="2" fill="#ffd700" opacity="0.8"/>
  <circle cx="150" cy="180" r="1.5" fill="#fff" opacity="0.5"/>
  <circle cx="280" cy="240" r="1.5" fill="#fff" opacity="0.7"/>
  <circle cx="90" cy="380" r="2" fill="#fff" opacity="0.6"/>
  <text x="200" y="130" text-anchor="middle" fill="#93c5fd" font-family="'Cinzel', serif" font-size="12" letter-spacing="4">THE CELEBRATION AWAITS</text>
  <text x="200" y="175" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="28" font-weight="600" letter-spacing="1">The Countdown</text>
  <text x="200" y="210" text-anchor="middle" fill="#cbd5e1" font-family="'Luxurious Script', cursive" font-size="34">begins</text>
  <rect x="45" y="240" width="310" height="75" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="200" y="286" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="32" font-weight="700" letter-spacing="4">92D 14H 57M</text>
  <line x1="80" y1="340" x2="320" y2="340" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="100" y="380" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1">THE INVITE</text>
  <text x="300" y="380" text-anchor="end" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1">VENUE LOCATION</text>
  <text x="100" y="415" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1">BRIDE &amp; GROOM</text>
  <text x="300" y="415" text-anchor="end" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1">RSVP ON WHATSAPP</text>
  <text x="200" y="475" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-size="11" opacity="0.8">Our families are excited that you are able to join us</text>
  <text x="200" y="495" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-size="11" opacity="0.8">for the happiest day of our lives.</text>
  <text x="200" y="535" text-anchor="middle" fill="#cbd5e1" font-family="'Inter', sans-serif" font-size="10" font-weight="600" letter-spacing="2">MISSINGPIECE®</text>
</svg>`;

// Card 2: Sky Lanterns Night (Magenta & Amber)
const card2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f0a24"/>
      <stop offset="45%" stop-color="#6b1d42"/>
      <stop offset="85%" stop-color="#d95d39"/>
      <stop offset="100%" stop-color="#e88941"/>
    </linearGradient>
    <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff4b8"/>
      <stop offset="40%" stop-color="#ffa834"/>
      <stop offset="100%" stop-color="#ffa834" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg2)"/>
  <!-- Lanterns floating -->
  <g opacity="0.9">
    <circle cx="90" cy="120" r="45" fill="url(#lanternGlow)"/>
    <rect x="75" y="100" width="30" height="42" rx="6" fill="#ffb84d"/>
    <circle cx="290" cy="160" r="50" fill="url(#lanternGlow)"/>
    <rect x="274" y="138" width="32" height="46" rx="6" fill="#ffb84d"/>
    <circle cx="190" cy="80" r="35" fill="url(#lanternGlow)"/>
    <rect x="178" y="65" width="24" height="34" rx="5" fill="#ffca66"/>
    <circle cx="140" cy="220" r="28" fill="url(#lanternGlow)"/>
    <rect x="130" y="208" width="20" height="28" rx="4" fill="#ffd280"/>
    <circle cx="260" cy="270" r="26" fill="url(#lanternGlow)"/>
    <rect x="251" y="259" width="18" height="24" rx="4" fill="#ffd280"/>
  </g>
  <!-- Mandap Aisle Silhouette -->
  <path d="M120 580 L185 360 L215 360 L280 580 Z" fill="rgba(30,10,25,0.7)"/>
  <!-- Couple walking -->
  <circle cx="196" cy="380" r="7" fill="#fff" opacity="0.9"/>
  <path d="M190 388 Q196 385 202 388 L206 430 L186 430 Z" fill="#ffffff" opacity="0.9"/>
  <circle cx="208" cy="384" r="6" fill="#fcd34d"/>
  <path d="M204 392 L214 432 L206 432 Z" fill="#fcd34d"/>
  <!-- Overlay text -->
  <rect x="0" y="440" width="400" height="140" fill="linear-gradient(to bottom, transparent, rgba(15,5,15,0.85))"/>
  <text x="200" y="495" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="22" font-weight="600" letter-spacing="2">Sacred Union</text>
  <text x="200" y="522" text-anchor="middle" fill="#fde68a" font-family="'Cinzel', serif" font-size="12" letter-spacing="3">UNDER A THOUSAND STARS</text>
  <text x="200" y="550" text-anchor="middle" fill="#ffffff" font-family="'Inter', sans-serif" font-size="11" opacity="0.8">19 · 11 · 2026</text>
</svg>`;

// Card 3: Emerald Ring Card (Looking forward to see you)
const card3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#14342b"/>
      <stop offset="100%" stop-color="#0a1f19"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg3)"/>
  <!-- Islamic/Vedic Arch -->
  <path d="M40 580 L40 220 Q40 80 200 40 Q360 80 360 220 L360 580 Z" fill="#1b4539" stroke="#d4af37" stroke-width="2"/>
  <path d="M55 580 L55 225 Q55 95 200 60 Q345 95 345 225 L345 580 Z" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1" stroke-dasharray="4,4"/>
  <!-- Big Solitaire Ring Medallion -->
  <circle cx="200" cy="220" r="65" fill="#fdfcf7" stroke="#d4af37" stroke-width="4"/>
  <circle cx="200" cy="220" r="55" fill="#f8fafc"/>
  <!-- Couple inside ring -->
  <circle cx="188" cy="205" r="10" fill="#c2410c"/>
  <circle cx="212" cy="210" r="9" fill="#1e293b"/>
  <path d="M178 220 C182 235 198 238 200 248 C202 238 218 235 222 220 Z" fill="#d97706"/>
  <!-- Diamond gem on top -->
  <polygon points="200,140 216,155 184,155" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
  <polygon points="184,155 216,155 200,165" fill="#bae6fd" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Text -->
  <text x="200" y="340" text-anchor="middle" fill="#ffffff" font-family="'Luxurious Script', cursive" font-size="44">Looking</text>
  <text x="200" y="380" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="20" font-weight="600" letter-spacing="2">FORWARD TO</text>
  <text x="200" y="420" text-anchor="middle" fill="#fde047" font-family="'Cinzel', serif" font-size="24" font-weight="700" letter-spacing="3">SEE YOU</text>
  <line x1="120" y1="450" x2="280" y2="450" stroke="#d4af37" stroke-width="1.5"/>
  <text x="200" y="485" text-anchor="middle" fill="#cbd5e1" font-family="'Inter', sans-serif" font-size="12" letter-spacing="2">WEDDING INVITATION</text>
  <text x="200" y="515" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="13">BANGALORE · 2026</text>
</svg>`;

// Card 4: Palace Stepped Pool (We Invite)
const card4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="50%" stop-color="#14b8a6"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="#e2a85c"/>
  <!-- Stepped stone edges -->
  <polygon points="20,20 380,20 350,80 50,80" fill="#c68a45"/>
  <polygon points="20,20 50,80 50,560 20,560" fill="#b87b38"/>
  <polygon points="380,20 350,80 350,560 380,560" fill="#d99b53"/>
  <!-- Pool water -->
  <rect x="50" y="80" width="300" height="480" fill="url(#pool)"/>
  <!-- Stepped fountain at top -->
  <polygon points="150,110 250,110 230,150 170,150" fill="#e2a85c" stroke="#92400e" stroke-width="2"/>
  <circle cx="200" cy="100" r="12" fill="#f59e0b"/>
  <!-- Gold Text overlay -->
  <text x="200" y="240" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="11" letter-spacing="4">THE AUSPICIOUS UNION</text>
  <text x="200" y="290" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="34" font-weight="700" letter-spacing="3">WE</text>
  <text x="200" y="335" text-anchor="middle" fill="#fef08a" font-family="'Cinzel', serif" font-size="32" font-weight="700" letter-spacing="4">INVITE</text>
  <line x1="130" y1="365" x2="270" y2="365" stroke="#fef08a" stroke-width="1.5"/>
  <text x="200" y="415" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="20" font-weight="600" letter-spacing="2">DEEPTHI</text>
  <text x="200" y="445" text-anchor="middle" fill="#fef08a" font-family="'Luxurious Script', cursive" font-size="26">&amp;</text>
  <text x="200" y="480" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="20" font-weight="600" letter-spacing="2">MURALI</text>
  <text x="200" y="525" text-anchor="middle" fill="#ccfbf1" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2">19 · 11 · 2026</text>
</svg>`;

// Card 5: Royal Saree with Feathers (Shaadi)
const card5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#311042"/>
      <stop offset="100%" stop-color="#190624"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg5)"/>
  <!-- Gold Brocade Saree Circle -->
  <circle cx="200" cy="230" r="110" fill="#4a154b" stroke="#f59e0b" stroke-width="6" stroke-dasharray="10,6"/>
  <circle cx="200" cy="230" r="95" fill="#b91c1c" stroke="#fef08a" stroke-width="2"/>
  <!-- Golden Palms -->
  <path d="M90 290 Q60 170 120 120 Q110 210 140 250 Z" fill="#fbbf24" opacity="0.9"/>
  <path d="M310 290 Q340 170 280 120 Q290 210 260 250 Z" fill="#fbbf24" opacity="0.9"/>
  <!-- Couple Illustration -->
  <circle cx="185" cy="200" r="14" fill="#fbbf24"/>
  <circle cx="215" cy="205" r="13" fill="#f87171"/>
  <path d="M170 220 Q185 210 200 220 L205 280 L165 280 Z" fill="#d97706"/>
  <path d="M200 220 Q215 210 230 220 L235 280 L195 280 Z" fill="#dc2626"/>
  <!-- Garland -->
  <path d="M175 225 Q200 270 225 225" fill="none" stroke="#fef08a" stroke-width="5" stroke-dasharray="4,2"/>
  <!-- Title text -->
  <text x="200" y="395" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="34" font-weight="700" letter-spacing="2">Shaadi</text>
  <text x="200" y="435" text-anchor="middle" fill="#fde047" font-family="'Luxurious Script', cursive" font-size="28">Sacred Vedic Rituals</text>
  <text x="200" y="475" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1.5">THE GRAND BALLROOM & PALACE GROUNDS</text>
  <text x="200" y="500" text-anchor="middle" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11">Malleswaram, Bangalore</text>
  <text x="200" y="535" text-anchor="middle" fill="#f59e0b" font-family="'Cinzel', serif" font-size="13" font-weight="600" letter-spacing="3">19 · 11 · 2026</text>
</svg>`;

// Card 6: Aurora Mountains Temple (Abhishek weds Kanika)
const card6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="aurora" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#041f2a"/>
      <stop offset="35%" stop-color="#0f5953"/>
      <stop offset="65%" stop-color="#4d276b"/>
      <stop offset="100%" stop-color="#1e102d"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#aurora)"/>
  <!-- Aurora wave -->
  <path d="M0 80 Q100 20 200 90 T400 40 L400 180 L0 180 Z" fill="#2dd4bf" opacity="0.35"/>
  <path d="M0 120 Q150 50 250 140 T400 100 L400 220 L0 220 Z" fill="#a855f7" opacity="0.25"/>
  <!-- Mountain Silhouette -->
  <polygon points="0,320 80,210 170,320" fill="#132337"/>
  <polygon points="120,320 220,180 320,320" fill="#0c1726"/>
  <polygon points="260,320 340,220 400,320" fill="#132337"/>
  <!-- Temple spire -->
  <polygon points="190,260 210,260 200,210" fill="#d97706"/>
  <rect x="185" y="260" width="30" height="60" fill="#b45309"/>
  <!-- Couple hand in hand -->
  <circle cx="193" cy="400" r="7" fill="#fff"/>
  <path d="M188 408 L198 440 L188 440 Z" fill="#fff"/>
  <circle cx="207" cy="402" r="6" fill="#fde047"/>
  <path d="M203 409 L211 440 L203 440 Z" fill="#fde047"/>
  <!-- Title text -->
  <text x="200" y="110" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="22" font-weight="700" letter-spacing="3">DEEPTHI</text>
  <text x="200" y="135" text-anchor="middle" fill="#2dd4bf" font-family="'Luxurious Script', cursive" font-size="26">weds</text>
  <text x="200" y="170" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="22" font-weight="700" letter-spacing="3">MURALI</text>
  <text x="200" y="495" text-anchor="middle" fill="#e2e8f0" font-family="'Cinzel', serif" font-size="15" letter-spacing="2">NOVEMBER 2026</text>
  <text x="200" y="525" text-anchor="middle" fill="#2dd4bf" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2">HIMALAYAN SOUL UNION</text>
</svg>`;

// Card 7: Ornate Pink Palace Mirror (Jharokha)
const card7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#df94a7"/>
      <stop offset="100%" stop-color="#c46a83"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg7)"/>
  <!-- Ornate White Marble Jharokha frame -->
  <path d="M70 120 Q200 40 330 120 L330 450 Q200 490 70 450 Z" fill="#ffffff" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.2))"/>
  <!-- Mirror Inner Opening -->
  <path d="M100 150 Q200 85 300 150 L300 420 Q200 450 100 420 Z" fill="#fdf2f4" stroke="#d4af37" stroke-width="2"/>
  <!-- Couple inside frame -->
  <circle cx="185" cy="250" r="22" fill="#d97706"/>
  <circle cx="215" cy="255" r="20" fill="#dc2626"/>
  <path d="M160 280 Q185 270 210 280 L215 360 L155 360 Z" fill="#d97706"/>
  <path d="M195 280 Q215 270 240 280 L245 360 L190 360 Z" fill="#dc2626"/>
  <!-- Royal safa and veil -->
  <ellipse cx="185" cy="235" rx="14" ry="8" fill="#fef08a"/>
  <!-- Text -->
  <text x="200" y="495" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="20" font-weight="700" letter-spacing="2">ROYAL HERITAGE</text>
  <text x="200" y="525" text-anchor="middle" fill="#fde047" font-family="'Luxurious Script', cursive" font-size="28">A Lifetime of Love</text>
</svg>`;

// Card 8: Classic Vintage Car (See The Route)
const card8 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
  <defs>
    <linearGradient id="bg8" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f4b43"/>
      <stop offset="100%" stop-color="#0f2924"/>
    </linearGradient>
  </defs>
  <rect width="400" height="580" rx="24" fill="url(#bg8)"/>
  <!-- Damask Lines -->
  <circle cx="200" cy="220" r="130" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
  <circle cx="200" cy="220" r="100" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
  <!-- Text -->
  <text x="200" y="100" text-anchor="middle" fill="#a7f3d0" font-family="'Cinzel', serif" font-size="30" font-weight="700" letter-spacing="3">SEE THE</text>
  <text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="34" font-weight="700" letter-spacing="4">ROUTE</text>
  <text x="200" y="180" text-anchor="middle" fill="#6ee7b7" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2">CLICK TO OPEN THE MAP</text>
  <!-- Golden Pin Compass -->
  <circle cx="200" cy="250" r="32" fill="#0f2924" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="200" cy="250" r="16" fill="#f59e0b"/>
  <!-- Vintage Car Front -->
  <rect x="90" y="380" width="220" height="90" rx="24" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
  <!-- Windshield -->
  <path d="M120 380 L140 330 L260 330 L280 380 Z" fill="#bae6fd" stroke="#ffffff" stroke-width="2"/>
  <!-- Headlights -->
  <circle cx="125" cy="420" r="16" fill="#fef08a" stroke="#fff" stroke-width="2"/>
  <circle cx="275" cy="420" r="16" fill="#fef08a" stroke="#fff" stroke-width="2"/>
  <!-- Grille -->
  <rect x="165" y="405" width="70" height="45" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
  <text x="200" y="530" text-anchor="middle" fill="#ffffff" font-family="'Cinzel', serif" font-size="13" letter-spacing="2">GOOGLE MAPS DIRECTIONS</text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'card-1-countdown.svg'), card1);
fs.writeFileSync(path.join(outDir, 'card-2-lanterns.svg'), card2);
fs.writeFileSync(path.join(outDir, 'card-3-emerald-ring.svg'), card3);
fs.writeFileSync(path.join(outDir, 'card-4-palace-pool.svg'), card4);
fs.writeFileSync(path.join(outDir, 'card-5-shaadi.svg'), card5);
fs.writeFileSync(path.join(outDir, 'card-6-aurora.svg'), card6);
fs.writeFileSync(path.join(outDir, 'card-7-jharokha.svg'), card7);
fs.writeFileSync(path.join(outDir, 'card-8-see-route.svg'), card8);

console.log('Successfully generated all 8 wedding cards in images/cards/');
