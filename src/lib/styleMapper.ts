import { MoodProfile, StyleProfile, ColorPalette } from '@/types';

// ==========================================
// STYLE DEFINITIONS DATABASE
// ==========================================

interface StyleDefinition {
  name: string;
  keywords: string[];
  clothingTypes: string[];
  accessories: string[];
  colorPalettes: ColorPalette[];
  fit: StyleProfile['fit'];
  genres: string[];
}

const STYLE_DEFINITIONS: StyleDefinition[] = [
  {
    name: 'Cyber-Gothic / Techwear',
    keywords: ['futurista', 'técnico', 'escuro', 'industrial', 'funcional'],
    clothingTypes: ['bomber jacket', 'cargo pants', 'tech sneakers', 'mesh top', 'utility vest'],
    accessories: ['chain necklace', 'fingerless gloves', 'tactical bag', 'LED accessories'],
    colorPalettes: [
      { primary: '#0a0a0a', secondary: '#1a1a2e', accent: '#e94560', neutral: '#16213e', name: 'Neon Noir' },
      { primary: '#0d1117', secondary: '#21262d', accent: '#58a6ff', neutral: '#30363d', name: 'Terminal Blue' },
      { primary: '#000000', secondary: '#0f0f0f', accent: '#00ff41', neutral: '#1a1a1a', name: 'Matrix' },
    ],
    fit: 'oversized',
    genres: ['industrial', 'electronic', 'darkwave', 'cyberpunk', 'metal', 'heavy metal', 'nu metal'],
  },
  {
    name: 'Dark Minimal / Noir',
    keywords: ['elegante', 'sóbrio', 'misterioso', 'refinado', 'noturno'],
    clothingTypes: ['trench coat', 'slim trousers', 'Chelsea boots', 'turtleneck', 'blazer'],
    accessories: ['minimal watch', 'silver ring', 'leather belt', 'dark sunglasses'],
    colorPalettes: [
      { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#8b0000', neutral: '#4a4a4a', name: 'Dark Red' },
      { primary: '#0a0a0a', secondary: '#1f1f1f', accent: '#c0c0c0', neutral: '#333333', name: 'Silver Shadow' },
      { primary: '#1c1c1c', secondary: '#2e2e2e', accent: '#daa520', neutral: '#484848', name: 'Midnight Gold' },
    ],
    fit: 'slim',
    genres: ['alternative', 'gothic', 'dark pop', 'trip-hop', 'ambient', 'post-punk'],
  },
  {
    name: 'Y2K / Club Kid',
    keywords: ['ousado', 'colorido', 'retrô', 'divertido', 'provocador'],
    clothingTypes: ['low-rise jeans', 'baby tee', 'platform shoes', 'mini skirt', 'halter top'],
    accessories: ['butterfly clips', 'choker', 'bedazzled phone case', 'tiny bag'],
    colorPalettes: [
      { primary: '#ff69b4', secondary: '#00ced1', accent: '#ffd700', neutral: '#f0f0f0', name: 'Barbie Cyber' },
      { primary: '#ff1493', secondary: '#7b68ee', accent: '#00ff7f', neutral: '#ffffff', name: 'Pop Star' },
      { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ffe66d', neutral: '#f7fff7', name: 'Candy Crush' },
    ],
    fit: 'regular',
    genres: ['pop', 'dance pop', 'electropop', 'hyperpop', 'club', 'house'],
  },
  {
    name: 'Street Pop / Neon',
    keywords: ['urbano', 'vibrante', 'statement', 'jovem', 'expressivo'],
    clothingTypes: ['oversized hoodie', 'wide leg pants', 'chunky sneakers', 'graphic tee', 'varsity jacket'],
    accessories: ['cap', 'crossbody bag', 'layered chains', 'chunky rings'],
    colorPalettes: [
      { primary: '#ff4500', secondary: '#1e90ff', accent: '#ffd700', neutral: '#ffffff', name: 'City Lights' },
      { primary: '#ff00ff', secondary: '#00ffff', accent: '#ffff00', neutral: '#000000', name: 'Neon Tokyo' },
      { primary: '#ff6347', secondary: '#4169e1', accent: '#32cd32', neutral: '#f5f5f5', name: 'Urban Jungle' },
    ],
    fit: 'oversized',
    genres: ['hip hop', 'rap', 'trap', 'r&b', 'urban', 'drill'],
  },
  {
    name: 'Soft Scandinavian',
    keywords: ['limpo', 'natural', 'confortável', 'minimalista', 'sustentável'],
    clothingTypes: ['cashmere sweater', 'relaxed trousers', 'white sneakers', 'linen shirt', 'wool coat'],
    accessories: ['leather tote', 'simple earrings', 'wool scarf', 'canvas belt'],
    colorPalettes: [
      { primary: '#f5f5dc', secondary: '#d2b48c', accent: '#8fbc8f', neutral: '#ffffff', name: 'Nordic Light' },
      { primary: '#faf0e6', secondary: '#c4a77d', accent: '#90b77d', neutral: '#fff8dc', name: 'Hygge' },
      { primary: '#e8dcc4', secondary: '#a0826d', accent: '#6b8e6b', neutral: '#f5f0e6', name: 'Fjord' },
    ],
    fit: 'relaxed',
    genres: ['folk', 'indie folk', 'acoustic', 'singer-songwriter', 'americana', 'country'],
  },
  {
    name: 'Boho / Folk',
    keywords: ['artístico', 'livre', 'orgânico', 'vintage', 'terroso'],
    clothingTypes: ['flowy maxi dress', 'embroidered blouse', 'bell-bottom jeans', 'suede jacket', 'peasant top'],
    accessories: ['layered necklaces', 'fringe bag', 'wide-brim hat', 'beaded bracelets'],
    colorPalettes: [
      { primary: '#8b4513', secondary: '#daa520', accent: '#cd853f', neutral: '#f5deb3', name: 'Desert Sunset' },
      { primary: '#556b2f', secondary: '#8fbc8f', accent: '#d2691e', neutral: '#f5f5dc', name: 'Forest Spirit' },
      { primary: '#704214', secondary: '#b8860b', accent: '#a0522d', neutral: '#faebd7', name: 'Autumn Harvest' },
    ],
    fit: 'oversized',
    genres: ['folk', 'world', 'reggae', 'psychedelic', 'classic rock', 'progressive rock'],
  },
  {
    name: 'Clean / Smart Casual',
    keywords: ['profissional', 'polido', 'versátil', 'clássico', 'refinado'],
    clothingTypes: ['Oxford shirt', 'chinos', 'derby shoes', 'blazer', 'polo shirt'],
    accessories: ['leather watch', 'briefcase', 'tie clip', 'pocket square'],
    colorPalettes: [
      { primary: '#1e3a5f', secondary: '#4a6fa5', accent: '#c41e3a', neutral: '#f5f5f5', name: 'Navy Classic' },
      { primary: '#2f4f4f', secondary: '#5f9ea0', accent: '#b8860b', neutral: '#f0f0f0', name: 'Business Casual' },
      { primary: '#3c3c3c', secondary: '#696969', accent: '#800020', neutral: '#e8e8e8', name: 'Boardroom' },
    ],
    fit: 'regular',
    genres: ['jazz', 'soul', 'classical', 'r&b', 'bossa nova', 'smooth jazz'],
  },
  {
    name: 'Punk / Grunge Revival',
    keywords: ['rebelde', 'DIY', 'raw', 'autêntico', 'counter-culture'],
    clothingTypes: ['band tee', 'ripped jeans', 'combat boots', 'leather jacket', 'flannel shirt'],
    accessories: ['studded belt', 'safety pins', 'spiked bracelet', 'beanie'],
    colorPalettes: [
      { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#ff0000', neutral: '#4a4a4a', name: 'Anarchy' },
      { primary: '#2b2b2b', secondary: '#3d3d3d', accent: '#00ff00', neutral: '#5a5a5a', name: 'Toxic' },
      { primary: '#1e1e1e', secondary: '#333333', accent: '#ff6600', neutral: '#4d4d4d', name: 'Garage' },
    ],
    fit: 'oversized',
    genres: ['punk', 'grunge', 'rock', 'hardcore', 'emo', 'post-hardcore', 'ska'],
  },
  {
    name: 'Luxury Streetwear',
    keywords: ['premium', 'statement', 'icónico', 'high-low', 'cultura'],
    clothingTypes: ['designer hoodie', 'tailored joggers', 'limited sneakers', 'logo tee', 'bomber'],
    accessories: ['designer shades', 'gold chain', 'luxury watch', 'leather backpack'],
    colorPalettes: [
      { primary: '#000000', secondary: '#1a1a1a', accent: '#ffd700', neutral: '#333333', name: 'Gold Standard' },
      { primary: '#0a0a0a', secondary: '#1c1c1c', accent: '#c0c0c0', neutral: '#2e2e2e', name: 'Platinum' },
      { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#e74c3c', neutral: '#404040', name: 'Drip' },
    ],
    fit: 'regular',
    genres: ['hip hop', 'trap', 'rap', 'afrobeats', 'afropop'],
  },
  {
    name: 'Ethereal / Dream Pop',
    keywords: ['etéreo', 'romântico', 'flutuante', 'onírico', 'suave'],
    clothingTypes: ['sheer blouse', 'midi skirt', 'satin cami', 'knit cardigan', 'pleated pants'],
    accessories: ['pearl earrings', 'silk scarf', 'delicate necklace', 'woven bag'],
    colorPalettes: [
      { primary: '#e6e6fa', secondary: '#dda0dd', accent: '#ff69b4', neutral: '#fff0f5', name: 'Lavender Dream' },
      { primary: '#f0f8ff', secondary: '#b0e0e6', accent: '#9370db', neutral: '#faf0e6', name: 'Cloud Nine' },
      { primary: '#fff5ee', secondary: '#ffdab9', accent: '#db7093', neutral: '#fffaf0', name: 'Peach Blossom' },
    ],
    fit: 'relaxed',
    genres: ['dream pop', 'shoegaze', 'indie', 'ethereal', 'synth-pop', 'chillwave'],
  },
];

// ==========================================
// GENRE TO STYLE MAPPING
// ==========================================

const GENRE_STYLE_MAP: Record<string, string> = {
  // Electronic
  'electronic': 'Cyber-Gothic / Techwear',
  'industrial': 'Cyber-Gothic / Techwear',
  'techno': 'Cyber-Gothic / Techwear',
  'darkwave': 'Dark Minimal / Noir',
  'synthwave': 'Cyber-Gothic / Techwear',
  'cyberpunk': 'Cyber-Gothic / Techwear',
  
  // Hip Hop / Urban
  'hip hop': 'Street Pop / Neon',
  'rap': 'Street Pop / Neon',
  'trap': 'Luxury Streetwear',
  'drill': 'Luxury Streetwear',
  'r&b': 'Clean / Smart Casual',
  'urban': 'Street Pop / Neon',
  
  // Pop
  'pop': 'Y2K / Club Kid',
  'dance pop': 'Y2K / Club Kid',
  'electropop': 'Y2K / Club Kid',
  'hyperpop': 'Y2K / Club Kid',
  'k-pop': 'Street Pop / Neon',
  
  // Rock / Metal
  'rock': 'Punk / Grunge Revival',
  'punk': 'Punk / Grunge Revival',
  'grunge': 'Punk / Grunge Revival',
  'metal': 'Cyber-Gothic / Techwear',
  'heavy metal': 'Cyber-Gothic / Techwear',
  'nu metal': 'Cyber-Gothic / Techwear',
  'emo': 'Punk / Grunge Revival',
  'hardcore': 'Punk / Grunge Revival',
  'alternative': 'Dark Minimal / Noir',
  'indie': 'Ethereal / Dream Pop',
  'shoegaze': 'Ethereal / Dream Pop',
  
  // Folk / Acoustic
  'folk': 'Boho / Folk',
  'acoustic': 'Soft Scandinavian',
  'indie folk': 'Soft Scandinavian',
  'singer-songwriter': 'Soft Scandinavian',
  'country': 'Boho / Folk',
  'americana': 'Boho / Folk',
  
  // Classical / Jazz
  'jazz': 'Clean / Smart Casual',
  'classical': 'Clean / Smart Casual',
  'soul': 'Clean / Smart Casual',
  'bossa nova': 'Clean / Smart Casual',
  'blues': 'Punk / Grunge Revival',
  
  // World
  'afrobeats': 'Luxury Streetwear',
  'afropop': 'Luxury Streetwear',
  'reggae': 'Boho / Folk',
  'world': 'Boho / Folk',
  'latin': 'Y2K / Club Kid',
  
  // Ambient / Chill
  'ambient': 'Ethereal / Dream Pop',
  'chillwave': 'Ethereal / Dream Pop',
  'lo-fi': 'Soft Scandinavian',
  'chill': 'Soft Scandinavian',
};

// ==========================================
// COLOR PALETTE FROM AUDIO FEATURES
// ==========================================

export function generateColorPalette(mood: MoodProfile): ColorPalette {
  const { energy, valence, danceability, acousticness } = mood;
  
  // Hue based on valence (positive = warm, negative = cool)
  const hue = valence * 60; // 0 (red/warm) to 60 (yellow/bright)
  const saturation = 50 + energy * 40; // More energy = more saturated
  const lightness = 30 + valence * 40; // More positive = lighter
  
  // Adjust for acousticness (acoustic = more earthy/muted)
  const adjustedSaturation = acousticness > 0.5 ? saturation * 0.6 : saturation;
  
  // Generate primary colors
  const primaryHue = danceability > 0.6 ? 340 : (energy > 0.6 ? 0 : 220); // Pink/Red/Blue
  const primary = hslToHex(primaryHue, adjustedSaturation, lightness);
  const secondary = hslToHex((primaryHue + 30) % 360, adjustedSaturation * 0.8, lightness + 10);
  const accent = hslToHex((primaryHue + 180) % 360, adjustedSaturation * 1.2, lightness + 5);
  const neutral = hslToHex(0, 0, 90 + valence * 5); // Grayscale
  
  // Name based on mood
  let name = 'Classic';
  if (energy > 0.7 && valence < 0.4) name = 'Neon Noir';
  else if (energy > 0.7 && valence > 0.6) name = 'Electric Day';
  else if (energy < 0.3 && valence < 0.4) name = 'Midnight Shadow';
  else if (energy < 0.3 && valence > 0.6) name = 'Morning Light';
  else if (danceability > 0.7) name = 'Sunset Haze';
  else if (acousticness > 0.6) name = 'Forest Mist';
  
  return { primary, secondary, accent, neutral, name };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ==========================================
// MAIN STYLE MAPPER
// ==========================================

export function mapMoodToStyle(
  mood: MoodProfile,
  topGenres: { genre: string; count: number }[]
): StyleProfile {
  // 1. Find primary style based on genres
  const primaryStyle = findPrimaryStyle(topGenres);
  
  // 2. Adjust based on audio features
  const adjustedStyle = adjustStyleByMood(primaryStyle, mood);
  
  // 3. Generate dynamic color palette
  const colorPalette = generateColorPalette(mood);
  
  // 4. Determine fit based on danceability
  const fit = determineFit(mood);
  
  // 5. Generate mood descriptor
  const moodDescriptor = generateMoodDescriptor(mood);
  
  return {
    aesthetic: adjustedStyle.name,
    keywords: adjustedStyle.keywords,
    colorPalette,
    clothingTypes: adjustedStyle.clothingTypes,
    accessories: adjustedStyle.accessories,
    fit,
    mood: moodDescriptor,
    genre: topGenres[0]?.genre,
  };
}

function findPrimaryStyle(topGenres: { genre: string; count: number }[]): StyleDefinition {
  // Score each style based on genre matches
  const styleScores = new Map<string, number>();
  
  for (const { genre, count } of topGenres) {
    const genreLower = genre.toLowerCase();
    for (const [mappedGenre, styleName] of Object.entries(GENRE_STYLE_MAP)) {
      if (genreLower.includes(mappedGenre) || mappedGenre.includes(genreLower)) {
        const current = styleScores.get(styleName) || 0;
        styleScores.set(styleName, current + count);
      }
    }
  }
  
  // Find highest scoring style
  let bestStyle = STYLE_DEFINITIONS[0]; // Default
  let bestScore = 0;
  
  for (const [styleName, score] of styleScores) {
    if (score > bestScore) {
      bestScore = score;
      const found = STYLE_DEFINITIONS.find(s => s.name === styleName);
      if (found) bestStyle = found;
    }
  }
  
  return bestStyle;
}

function adjustStyleByMood(style: StyleDefinition, mood: MoodProfile): StyleDefinition {
  // If energy is very high, add more aggressive keywords
  const adjustedKeywords = [...style.keywords];
  if (mood.energy > 0.8) {
    adjustedKeywords.push('impactante', 'dramático');
  }
  if (mood.energy < 0.3) {
    adjustedKeywords.push('subtil', 'contido');
  }
  
  // If valence is low, add darker descriptors
  if (mood.valence < 0.3) {
    adjustedKeywords.push('melancólico');
  }
  if (mood.valence > 0.7) {
    adjustedKeywords.push('luminoso', 'alegre');
  }
  
  return {
    ...style,
    keywords: [...new Set(adjustedKeywords)], // Remove duplicates
  };
}

function determineFit(mood: MoodProfile): StyleProfile['fit'] {
  const { danceability, energy } = mood;
  
  if (danceability > 0.7 && energy > 0.5) return 'oversized';
  if (danceability > 0.6) return 'relaxed';
  if (danceability < 0.3 && energy < 0.4) return 'slim';
  if (energy > 0.7) return 'regular'; // Technical fit
  return 'regular';
}

function generateMoodDescriptor(mood: MoodProfile): string {
  const { energy, valence, danceability } = mood;
  
  if (energy > 0.7 && valence < 0.4) return 'intenso e sombrio';
  if (energy > 0.7 && valence > 0.6) return 'explosivo e vibrante';
  if (energy < 0.3 && valence < 0.4) return 'introspectivo e noturno';
  if (energy < 0.3 && valence > 0.6) return 'sereno e luminoso';
  if (danceability > 0.7) return 'ritmado e sensual';
  if (valence > 0.6) return 'optimista e fresco';
  if (valence < 0.4) return 'contemplativo';
  
  return 'equilibrado e versátil';
}

// ==========================================
// TAG SYSTEM
// ==========================================

export interface StyleTag {
  name: string;
  confidence: number; // 0-1
  category: 'aesthetic' | 'mood' | 'era' | 'cultural';
}

export function generateStyleTags(
  mood: MoodProfile,
  topGenres: { genre: string; count: number }[],
  style: StyleProfile
): StyleTag[] {
  const tags: StyleTag[] = [];
  
  // Aesthetic tags from style
  tags.push({
    name: style.aesthetic,
    confidence: 0.9,
    category: 'aesthetic',
  });
  
  // Mood tags from audio features
  if (mood.energy > 0.7) tags.push({ name: 'High Energy', confidence: mood.energy, category: 'mood' });
  if (mood.valence > 0.7) tags.push({ name: 'Uplifting', confidence: mood.valence, category: 'mood' });
  if (mood.valence < 0.3) tags.push({ name: 'Melancholic', confidence: 1 - mood.valence, category: 'mood' });
  if (mood.danceability > 0.7) tags.push({ name: 'Dance Floor', confidence: mood.danceability, category: 'mood' });
  if (mood.acousticness > 0.6) tags.push({ name: 'Organic', confidence: mood.acousticness, category: 'mood' });
  
  // Era tags
  const eraGenres = ['retro', '80s', '90s', 'y2k', 'vintage', 'classic'];
  for (const { genre } of topGenres) {
    for (const era of eraGenres) {
      if (genre.toLowerCase().includes(era)) {
        tags.push({ name: era.toUpperCase(), confidence: 0.7, category: 'era' });
      }
    }
  }
  
  // Cultural tags
  const culturalGenres: Record<string, string> = {
    'k-pop': 'K-Pop',
    'j-pop': 'J-Pop',
    'afrobeats': 'Afrobeats',
    'latin': 'Latin',
    'reggaeton': 'Reggaeton',
    'brazilian': 'Brazilian',
  };
  
  for (const { genre } of topGenres) {
    for (const [key, label] of Object.entries(culturalGenres)) {
      if (genre.toLowerCase().includes(key)) {
        tags.push({ name: label, confidence: 0.8, category: 'cultural' });
      }
    }
  }
  
  // Sort by confidence and return top 10
  return tags.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

// ==========================================
// EXPORTS
// ==========================================

export { STYLE_DEFINITIONS, GENRE_STYLE_MAP };
export type { StyleDefinition };
