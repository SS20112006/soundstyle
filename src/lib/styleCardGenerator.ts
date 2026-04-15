import { StyleProfile, MoodProfile } from '@/types';

// Generate a shareable style card as SVG/image
export function generateStyleCardSVG(
  styleProfile: StyleProfile,
  moodProfile: MoodProfile,
  topArtists: string[],
  userName?: string
): string {
  const width = 1080;
  const height = 1920; // Instagram Story ratio 9:16
  
  const { colorPalette, aesthetic, mood, keywords, fit } = styleProfile;
  const { energy, valence, danceability } = moodProfile;
  
  // Background gradient
  const bgGradient = `
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colorPalette.primary};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colorPalette.secondary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colorPalette.accent};stop-opacity:1" />
      </linearGradient>
      <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#000000;stop-opacity:0.7" />
        <stop offset="50%" style="stop-color:#000000;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
  
  // Generate stat bars
  const statBars = [
    { label: 'ENERGIA', value: energy, color: '#c4a882' },
    { label: 'VIBE', value: valence, color: '#9333ea' },
    { label: 'FLOW', value: danceability, color: '#ec4899' },
  ];
  
  const statBarsSVG = statBars.map((stat, i) => {
    const y = 900 + i * 100;
    const barWidth = stat.value * 400;
    return `
      <g transform="translate(100, ${y})">
        <text x="0" y="0" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="2">${stat.label}</text>
        <rect x="0" y="10" width="400" height="8" rx="4" fill="#ffffff20"/>
        <rect x="0" y="10" width="${barWidth}" height="8" rx="4" fill="${stat.color}"/>
        <text x="420" y="20" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${Math.round(stat.value * 100)}%</text>
      </g>
    `;
  }).join('');
  
  // Keywords tags
  const keywordsSVG = keywords.slice(0, 4).map((kw, i) => {
    const x = 100 + i * 220;
    return `
      <rect x="${x}" y="1220" width="200" height="40" rx="20" fill="#ffffff15" stroke="${colorPalette.accent}40" stroke-width="1"/>
      <text x="${x + 100}" y="1246" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">${kw}</text>
    `;
  }).join('');
  
  // Color palette circles
  const colorsSVG = [colorPalette.primary, colorPalette.secondary, colorPalette.accent, colorPalette.neutral].map((color, i) => {
    const cx = 180 + i * 100;
    return `
      <circle cx="${cx}" cy="1400" r="35" fill="${color}" stroke="#ffffff30" stroke-width="2"/>
    `;
  }).join('');
  
  // Top artists
  const artistsText = topArtists.slice(0, 3).map((artist, i) => {
    const y = 1520 + i * 35;
    return `<text x="100" y="${y}" fill="#ffffff90" font-family="Arial, sans-serif" font-size="18">${i + 1}. ${artist}</text>`;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${bgGradient}
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#overlay)"/>
      
      <!-- Logo -->
      <text x="100" y="80" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="bold">
        Sound<tspan fill="#c4a882">Style</tspan>
      </text>
      
      <!-- User name -->
      ${userName ? `<text x="${width - 100}" y="80" fill="#ffffff80" font-family="Arial, sans-serif" font-size="18" text-anchor="end">@${userName}</text>` : ''}
      
      <!-- Main Title -->
      <text x="${width/2}" y="250" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" letter-spacing="4" opacity="0.7">O MEU ESTILO SPOTIFY</text>
      
      <!-- Aesthetic Name -->
      <text x="${width/2}" y="350" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="bold" text-anchor="middle" filter="url(#glow)">${aesthetic}</text>
      
      <!-- Mood -->
      <text x="${width/2}" y="420" fill="${colorPalette.accent}" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">${mood}</text>
      
      <!-- Decorative line -->
      <line x1="200" y1="480" x2="${width - 200}" y2="480" stroke="#ffffff20" stroke-width="1"/>
      
      <!-- Color Palette Name -->
      <text x="100" y="560" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" opacity="0.6">PALETA: ${colorPalette.name.toUpperCase()}</text>
      
      <!-- Color Circles (large) -->
      <circle cx="180" cy="680" r="60" fill="${colorPalette.primary}"/>
      <circle cx="340" cy="680" r="60" fill="${colorPalette.secondary}"/>
      <circle cx="500" cy="680" r="60" fill="${colorPalette.accent}"/>
      <circle cx="660" cy="680" r="60" fill="${colorPalette.neutral}"/>
      
      <!-- Fit Badge -->
      <rect x="${width - 250}" y="620" width="150" height="50" rx="25" fill="#c4a882"/>
      <text x="${width - 175}" y="652" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">${fit.toUpperCase()} FIT</text>
      
      <!-- Stats Section -->
      <text x="100" y="850" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" opacity="0.6">PERFIL SONORO</text>
      ${statBarsSVG}
      
      <!-- Keywords Section -->
      <text x="100" y="1180" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" opacity="0.6">PALAVRAS-CHAVE</text>
      ${keywordsSVG}
      
      <!-- Small Color Palette -->
      <text x="100" y="1370" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" opacity="0.6">CORES</text>
      ${colorsSVG}
      
      <!-- Top Artists -->
      <text x="100" y="1490" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" opacity="0.6">TOP ARTISTAS</text>
      ${artistsText}
      
      <!-- CTA -->
      <rect x="${width/2 - 150}" y="${height - 180}" width="300" height="60" rx="30" fill="#c4a882"/>
      <text x="${width/2}" y="${height - 145}" fill="#000000" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">DESCOBRIR O MEU ESTILO</text>
      
      <!-- URL -->
      <text x="${width/2}" y="${height - 80}" fill="#ffffff60" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">soundstyle.app</text>
    </svg>
  `;
}

// Convert SVG to data URL for download
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Generate share text
export function generateShareText(
  aesthetic: string,
  mood: string,
  topArtists: string[]
): string {
  return `🎵 O meu estilo Spotify é: ${aesthetic}

✨ ${mood}

🎤 Top artistas: ${topArtists.slice(0, 3).join(', ')}

Descobre o teu estilo em soundstyle.app

#SoundStyle #SpotifyFashion #MeuEstilo #FashionAndMusic`;
}
