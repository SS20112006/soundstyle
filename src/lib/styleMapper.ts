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
  fabricTextures: string[]; // Enhanced: fabric recommendations
  silhouette: 'aerodynamic' | 'voluminous' | 'structured' | 'flowing'; // Enhanced: silhouette type
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
    fabricTextures: ['nylon', 'polyester', 'neoprene', 'ripstop', 'reflective mesh'],
    silhouette: 'aerodynamic',
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
    fabricTextures: ['wool', 'cashmere', 'leather', 'silk'],
    silhouette: 'structured',
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
    genres: ['pop', 'dance pop', 'electropop', 'club', 'house'],
    fabricTextures: ['vinyl', 'pleather', 'spandex', 'metallic'],
    silhouette: 'aerodynamic',
  },
  {
    name: 'Hyperpop Maximalist',
    keywords: ['maximalista', 'provocador', 'experimental', 'digital', 'anti-regra'],
    clothingTypes: ['platform boots', 'mesh layering', 'deconstructed tee', 'cycling shorts', 'oversized graphic hoodie'],
    accessories: ['stacked rings', 'statement earrings', 'LED visor', 'neon hair clips'],
    colorPalettes: [
      { primary: '#ff00ff', secondary: '#00ffff', accent: '#ffff00', neutral: '#000000', name: 'Glitch' },
      { primary: '#ff1493', secondary: '#7fff00', accent: '#ff4500', neutral: '#1a1a1a', name: 'Overdrive' },
      { primary: '#e040fb', secondary: '#40c4ff', accent: '#eeff41', neutral: '#ffffff', name: 'Data Crash' },
    ],
    fit: 'oversized',
    genres: ['hyperpop', 'pc music', 'deconstructed club', 'experimental pop'],
    fabricTextures: ['PVC', 'holographic', 'neoprene', 'iridescent'],
    silhouette: 'voluminous',
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
    genres: ['hip hop', 'rap', 'urban', 'drill'],
    fabricTextures: ['cotton fleece', 'denim', 'nylon', 'jersey'],
    silhouette: 'voluminous',
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
    genres: ['folk', 'acoustic', 'singer-songwriter', 'americana', 'country', 'lo-fi', 'chill'],
    fabricTextures: ['wool', 'cashmere', 'cotton', 'linen', 'oversized knits'],
    silhouette: 'flowing',
  },
  {
    name: 'Cottagecore',
    keywords: ['rústico', 'orgânico', 'campestre', 'terroso', 'nostálgico'],
    clothingTypes: ['linen apron dress', 'embroidered blouse', 'corduroy pants', 'knit cardigan', 'moccasin boots'],
    accessories: ['woven basket bag', 'straw hat', 'dried flower brooch', 'leather satchel'],
    colorPalettes: [
      { primary: '#8b7355', secondary: '#c4a882', accent: '#6b8e23', neutral: '#f5f5dc', name: 'Meadow' },
      { primary: '#a0522d', secondary: '#deb887', accent: '#556b2f', neutral: '#faf0e6', name: 'Harvest Gold' },
      { primary: '#8fbc8f', secondary: '#d2b48c', accent: '#cd853f', neutral: '#fffaf0', name: 'Wildflower' },
    ],
    fit: 'relaxed',
    genres: ['indie folk', 'bon iver', 'folk', 'acoustic', 'americana'],
    fabricTextures: ['cotton', 'linen', 'wool', 'corduroy', 'organic fibers'],
    silhouette: 'flowing',
  },
  {
    name: 'Retro-Futurismo',
    keywords: ['retrofuturista', 'neon', 'metallic', '80s sci-fi', 'aerodinâmico'],
    clothingTypes: ['metallic bomber', 'high-waisted leather pants', 'pointed boots', 'wrap sunglasses', 'satin shirt'],
    accessories: ['chrome jewelry', 'chain belt', 'visor sunglasses', 'metallic clutch'],
    colorPalettes: [
      { primary: '#ff073a', secondary: '#0d0221', accent: '#ff6ec7', neutral: '#1a1a2e', name: 'Synthwave Sunset' },
      { primary: '#2b1055', secondary: '#7597de', accent: '#ff2281', neutral: '#0c0032', name: 'Miami Vice' },
      { primary: '#1a0533', secondary: '#6b2fa0', accent: '#ff5e00', neutral: '#2d1b69', name: 'Vaporwave' },
    ],
    fit: 'regular',
    genres: ['synthwave', 'retrowave', 'the weeknd', 'dark pop', 'electronic'],
    fabricTextures: ['satin', 'metallic', 'leather', 'vinyl', 'lamé'],
    silhouette: 'aerodynamic',
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
    fabricTextures: ['suede', 'fringe', 'crochet', 'embroidered cotton'],
    silhouette: 'flowing',
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
    genres: ['jazz', 'soul', 'classical', 'r&b', 'smooth jazz'],
    fabricTextures: ['cotton oxford', 'wool blend', 'silk', 'fine knit'],
    silhouette: 'structured',
  },
  {
    name: 'Tropical Elegance',
    keywords: ['tropical', 'elegante', 'praiano', 'sofisticado', 'brasiliano'],
    clothingTypes: ['linen blazer', 'tailored shorts', 'espadrilles', 'camp collar shirt', 'light chinos'],
    accessories: ['woven bracelet', 'straw fedora', 'wooden watch', 'canvas tote'],
    colorPalettes: [
      { primary: '#c4a882', secondary: '#d4a574', accent: '#2e8b57', neutral: '#faf0e6', name: 'Ipanema' },
      { primary: '#f5deb3', secondary: '#daa520', accent: '#006400', neutral: '#fffaf0', name: 'Copacabana' },
      { primary: '#deb887', secondary: '#b8860b', accent: '#556b2f', neutral: '#fff8dc', name: 'Bahia Gold' },
    ],
    fit: 'regular',
    genres: ['bossa nova', 'mpb', 'samba', 'tropicalia', 'brazilian'],
    fabricTextures: ['linen', 'light cotton', 'seersucker', 'tropical wool'],
    silhouette: 'flowing',
  },
  {
    name: 'Intellectual Minimalism',
    keywords: ['intelectual', 'limpo', 'minimalista', 'contido', 'sofisticado'],
    clothingTypes: ['tailored trousers', 'plain crew neck', 'minimal sneakers', 'unstructured blazer', 'wool overcoat'],
    accessories: ['reading glasses', 'leather notebook case', 'simple silver watch', 'canvas tote'],
    colorPalettes: [
      { primary: '#2c2c2c', secondary: '#4a4a4a', accent: '#8b8b8b', neutral: '#e8e8e8', name: 'Graphite' },
      { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460', neutral: '#e0e0e0', name: 'Library' },
      { primary: '#3d3d3d', secondary: '#5a5a5a', accent: '#c4a882', neutral: '#f0f0f0', name: 'Chiaroscuro' },
    ],
    fit: 'slim',
    genres: ['jazz', 'lyrical hip hop', 'neo-soul', 'instrumental', 'nu jazz'],
    fabricTextures: ['merino wool', 'organic cotton', 'brushed cashmere', 'matte jersey'],
    silhouette: 'structured',
  },
  {
    name: 'Anti-Consumist Aesthetic',
    keywords: ['subversivo', 'desgastado', 'autêntico', 'DIY', 'camadas'],
    clothingTypes: ['oversized flannel', 'distressed jeans', 'combat boots', 'patched jacket', 'thermal layer'],
    accessories: ['studded belt', 'safety pins', 'beanie', 'thrifted chain'],
    colorPalettes: [
      { primary: '#3d2b1f', secondary: '#5c4033', accent: '#8b0000', neutral: '#696969', name: 'Mud' },
      { primary: '#2b2b2b', secondary: '#4a3728', accent: '#6b8e23', neutral: '#555555', name: 'Thrift' },
      { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#ff6600', neutral: '#3d3d3d', name: 'Garage' },
    ],
    fit: 'oversized',
    genres: ['grunge', 'rock alternativo', 'indie rock', 'post-punk', 'lo-fi rock'],
    fabricTextures: ['flannel', 'worn denim', 'distressed leather', 'heavy cotton'],
    silhouette: 'voluminous',
  },
  {
    name: 'Dark Academia',
    keywords: ['académico', 'literário', 'sóbrio', 'clássico', 'nostálgico'],
    clothingTypes: ['tweed blazer', 'pleated trousers', 'oxford shoes', 'turtleneck', 'overcoat'],
    accessories: ['leather satchel', 'vintage watch', 'reading glasses', 'wool scarf'],
    colorPalettes: [
      { primary: '#3b2f2f', secondary: '#5c4033', accent: '#8b6914', neutral: '#d4c4a8', name: 'Vintage Library' },
      { primary: '#2c1e0f', secondary: '#4a3728', accent: '#6b4423', neutral: '#c4a882', name: 'Ivy League' },
      { primary: '#1a1a2e', secondary: '#2d2d44', accent: '#8b7355', neutral: '#d2c5a0', name: 'Scholar' },
    ],
    fit: 'regular',
    genres: ['dark academia', 'classical', 'jazz', 'baroque pop', 'chamber pop'],
    fabricTextures: ['tweed', 'wool', 'cashmere', 'velvet', 'corduroy'],
    silhouette: 'structured',
  },
  {
    name: 'Punk / Grunge Revival',
    keywords: ['rebelde', 'DIY', 'raw', 'autêntico', 'counter-culture'],
    clothingTypes: ['band tee', 'ripped jeans', 'combat boots', 'leather jacket', 'plaid shirt'],
    accessories: ['studded belt', 'safety pins', 'spiked bracelet', 'beanie'],
    colorPalettes: [
      { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#ff0000', neutral: '#4a4a4a', name: 'Anarchy' },
      { primary: '#2b2b2b', secondary: '#3d3d3d', accent: '#00ff00', neutral: '#5a5a5a', name: 'Toxic' },
      { primary: '#1e1e1e', secondary: '#333333', accent: '#ff6600', neutral: '#4d4d4d', name: 'Garage' },
    ],
    fit: 'oversized',
    genres: ['punk', 'grunge', 'rock', 'hardcore', 'emo', 'post-hardcore', 'ska'],
    fabricTextures: ['leather', 'denim', 'cotton jersey', 'plaid flannel'],
    silhouette: 'voluminous',
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
    genres: ['hip hop', 'trap', 'rap', 'melodic trap', 'afrobeats', 'afropop'],
    fabricTextures: ['premium cotton', 'technical nylon', 'cashmere', 'leather'],
    silhouette: 'aerodynamic',
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
    fabricTextures: ['sheer chiffon', 'satin', 'silk', 'organza', 'soft knit'],
    silhouette: 'flowing',
  },
  {
    name: 'Vibrant Street',
    keywords: ['vibrante', 'colorido', 'energético', 'padrões', 'global'],
    clothingTypes: ['patterned shirt', 'cargo joggers', 'bright sneakers', 'dashiki top', 'colorful bomber'],
    accessories: ['beaded necklace', 'colorful bucket hat', 'wrist cuffs', 'crossbody pouch'],
    colorPalettes: [
      { primary: '#ff6f00', secondary: '#ffd600', accent: '#00c853', neutral: '#1a1a1a', name: 'Lagos' },
      { primary: '#d50000', secondary: '#f50057', accent: '#651fff', neutral: '#ffffff', name: 'Accra' },
      { primary: '#00bfa5', secondary: '#ffab00', accent: '#f50057', neutral: '#212121', name: 'Dakar' },
    ],
    fit: 'regular',
    genres: ['afrobeats', 'afropop', 'dancehall', 'afro house'],
    fabricTextures: ['ankara print', 'light cotton', 'viscose', 'linen blend'],
    silhouette: 'flowing',
  },
  {
    name: 'Street Pop (K-Pop)',
    keywords: ['camadas', 'colorido', 'gender-fluid', 'experimental', 'jovem'],
    clothingTypes: ['oversized blazer', 'wide leg pants', 'platform shoes', 'crop top', 'layered tee'],
    accessories: ['statement earrings', 'hair clips', 'charm necklace', 'mini bag'],
    colorPalettes: [
      { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ffe66d', neutral: '#f7fff7', name: 'Idol' },
      { primary: '#a29bfe', secondary: '#fd79a8', accent: '#00cec9', neutral: '#ffffff', name: 'Stage' },
      { primary: '#fab1a0', secondary: '#81ecec', accent: '#fdcb6e', neutral: '#2d3436', name: 'Music Bank' },
    ],
    fit: 'oversized',
    genres: ['k-pop', 'korean pop', 'k-r&b', 'k-hip hop'],
    fabricTextures: ['cotton', 'nylon', 'denim', 'synthetic blends'],
    silhouette: 'voluminous',
  },
];

// ==========================================
// GENRE TO STYLE MAPPING (Enhanced)
// ==========================================

const GENRE_STYLE_MAP: Record<string, string> = {
  // Electronic
  'electronic': 'Cyber-Gothic / Techwear',
  'industrial': 'Cyber-Gothic / Techwear',
  'techno': 'Cyber-Gothic / Techwear',
  'darkwave': 'Dark Minimal / Noir',
  'synthwave': 'Retro-Futurismo',
  'retrowave': 'Retro-Futurismo',
  'cyberpunk': 'Cyber-Gothic / Techwear',
  'the weeknd': 'Retro-Futurismo',
  
  // Hip Hop / Urban
  'hip hop': 'Street Pop / Neon',
  'rap': 'Street Pop / Neon',
  'lyrical hip hop': 'Intellectual Minimalism',
  'trap': 'Luxury Streetwear',
  'melodic trap': 'Luxury Streetwear',
  'travis scott': 'Luxury Streetwear',
  'drill': 'Luxury Streetwear',
  'r&b': 'Clean / Smart Casual',
  'neo-soul': 'Intellectual Minimalism',
  'nu jazz': 'Intellectual Minimalism',
  'urban': 'Street Pop / Neon',
  
  // Pop
  'pop': 'Y2K / Club Kid',
  'dance pop': 'Y2K / Club Kid',
  'electropop': 'Y2K / Club Kid',
  'hyperpop': 'Hyperpop Maximalist',
  'pc music': 'Hyperpop Maximalist',
  'deconstructed club': 'Hyperpop Maximalist',
  'dark pop': 'Retro-Futurismo',
  'k-pop': 'Street Pop (K-Pop)',
  'korean pop': 'Street Pop (K-Pop)',
  'k-r&b': 'Street Pop (K-Pop)',
  'k-hip hop': 'Street Pop (K-Pop)',
  
  // Rock / Metal
  'rock': 'Punk / Grunge Revival',
  'punk': 'Punk / Grunge Revival',
  'grunge': 'Anti-Consumist Aesthetic',
  'rock alternativo': 'Anti-Consumist Aesthetic',
  'indie rock': 'Anti-Consumist Aesthetic',
  'lo-fi rock': 'Anti-Consumist Aesthetic',
  'metal': 'Cyber-Gothic / Techwear',
  'heavy metal': 'Cyber-Gothic / Techwear',
  'nu metal': 'Cyber-Gothic / Techwear',
  'emo': 'Punk / Grunge Revival',
  'hardcore': 'Punk / Grunge Revival',
  'post-hardcore': 'Punk / Grunge Revival',
  'alternative': 'Dark Minimal / Noir',
  'indie': 'Ethereal / Dream Pop',
  'shoegaze': 'Ethereal / Dream Pop',
  'post-punk': 'Anti-Consumist Aesthetic',
  'dark academia': 'Dark Academia',
  'baroque pop': 'Dark Academia',
  'chamber pop': 'Dark Academia',
  
  // Folk / Acoustic
  'folk': 'Cottagecore',
  'acoustic': 'Soft Scandinavian',
  'indie folk': 'Cottagecore',
  'bon iver': 'Cottagecore',
  'singer-songwriter': 'Soft Scandinavian',
  'country': 'Boho / Folk',
  'americana': 'Boho / Folk',
  
  // Classical / Jazz
  'jazz': 'Intellectual Minimalism',
  'classical': 'Dark Academia',
  'soul': 'Clean / Smart Casual',
  'smooth jazz': 'Clean / Smart Casual',
  'bossa nova': 'Tropical Elegance',
  'mpb': 'Tropical Elegance',
  'samba': 'Tropical Elegance',
  'tropicalia': 'Tropical Elegance',
  'brazilian': 'Tropical Elegance',
  'blues': 'Punk / Grunge Revival',
  'instrumental': 'Intellectual Minimalism',
  
  // World
  'afrobeats': 'Vibrant Street',
  'afropop': 'Vibrant Street',
  'afro house': 'Vibrant Street',
  'dancehall': 'Vibrant Street',
  'reggae': 'Boho / Folk',
  'world': 'Boho / Folk',
  'latin': 'Y2K / Club Kid',
  
  // Ambient / Chill
  'ambient': 'Ethereal / Dream Pop',
  'chillwave': 'Ethereal / Dream Pop',
  'lo-fi': 'Soft Scandinavian',
  'chill': 'Soft Scandinavian',
  'trip-hop': 'Dark Minimal / Noir',
};

// ==========================================
// AUDIO-TO-FASHION MAPPING ENGINE (Enhanced)
// ==========================================

interface AudioFashionMapping {
  complexity: number;    // 0-1: Energy → Complexity of the look
  colorVibrancy: number; // 0-1: Valence → Color palette vibrancy
  fabricType: 'natural' | 'synthetic' | 'mixed'; // Acousticness → Fabric texture
  silhouetteFlow: number; // 0-1: Danceability → Cut and silhouette fluidity
  silhouetteSpeed: 'aerodynamic' | 'voluminous' | 'balanced'; // Tempo → silhouette type
}

export function mapAudioToFashion(mood: MoodProfile, tempo?: number): AudioFashionMapping {
  const { energy, valence, acousticness, danceability } = mood;
  
  // Energy → Complexity (high energy = bold accessories, strong contrasts)
  const complexity = Math.min(1, energy * 1.2);
  
  // Valence → Color vibrancy (high valence = vibrant; low = monochrome)
  const colorVibrancy = valence;
  
  // Acousticness → Fabric type (high = natural fibers; low = synthetic/shiny)
  let fabricType: 'natural' | 'synthetic' | 'mixed';
  if (acousticness > 0.65) {
    fabricType = 'natural';
  } else if (acousticness < 0.35) {
    fabricType = 'synthetic';
  } else {
    fabricType = 'mixed';
  }
  
  // Danceability → Silhouette flow (high = fluid fabrics, stretch; low = structured)
  const silhouetteFlow = danceability;
  
  // Tempo → Aerodynamic vs voluminous
  let silhouetteSpeed: 'aerodynamic' | 'voluminous' | 'balanced' = 'balanced';
  if (tempo !== undefined) {
    if (tempo > 130) silhouetteSpeed = 'aerodynamic';
    else if (tempo < 90) silhouetteSpeed = 'voluminous';
  }
  
  return {
    complexity,
    colorVibrancy,
    fabricType,
    silhouetteFlow,
    silhouetteSpeed,
  };
}

// ==========================================
// COLOR PALETTE FROM AUDIO FEATURES (Enhanced)
// ==========================================

export function generateColorPalette(mood: MoodProfile): ColorPalette {
  const { energy, valence, danceability, acousticness } = mood;
  
  // Valence → Hue range (positive = warm tones, negative = cool tones)
  const hue = valence * 60; // 0 (red/warm) to 60 (yellow/bright)
  
  // Energy → Saturation (more energy = more saturated/vivid)
  const saturation = 50 + energy * 40;
  
  // Valence → Lightness (more positive = lighter)
  const lightness = 30 + valence * 40;
  
  // Acousticness → Muted tones (acoustic = more earthy/muted)
  const adjustedSaturation = acousticness > 0.5 ? saturation * 0.6 : saturation;
  
  // Danceability → Primary hue selection
  const primaryHue = danceability > 0.6 ? 340 : (energy > 0.6 ? 0 : 220);
  
  const primary = hslToHex(primaryHue, adjustedSaturation, lightness);
  const secondary = hslToHex((primaryHue + 30) % 360, adjustedSaturation * 0.8, lightness + 10);
  const accent = hslToHex((primaryHue + 180) % 360, adjustedSaturation * 1.2, lightness + 5);
  const neutral = hslToHex(0, 0, 90 + valence * 5);
  
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
// MAIN STYLE MAPPER (Enhanced)
// ==========================================

export function mapMoodToStyle(
  mood: MoodProfile,
  topGenres: { genre: string; count: number }[],
  tempo?: number
): StyleProfile {
  // 1. Find primary style based on genres
  const primaryStyle = findPrimaryStyle(topGenres);
  
  // 2. Adjust based on audio features
  const adjustedStyle = adjustStyleByMood(primaryStyle, mood);
  
  // 3. Generate dynamic color palette
  const colorPalette = generateColorPalette(mood);
  
  // 4. Get audio-to-fashion mapping for additional adjustments
  const audioFashion = mapAudioToFashion(mood, tempo);
  
  // 5. Determine fit based on audio-fashion mapping
  const fit = determineFit(mood, audioFashion);
  
  // 6. Generate mood descriptor
  const moodDescriptor = generateMoodDescriptor(mood);
  
  // 7. Refine clothing types based on audio features
  const refinedClothing = refineClothingByAudio(adjustedStyle.clothingTypes, audioFashion);
  
  // 8. Refine accessories based on energy/complexity
  const refinedAccessories = refineAccessoriesByEnergy(adjustedStyle.accessories, mood.energy);
  
  return {
    aesthetic: adjustedStyle.name,
    keywords: adjustedStyle.keywords,
    colorPalette,
    clothingTypes: refinedClothing,
    accessories: refinedAccessories,
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
  const adjustedKeywords = [...style.keywords];
  
  if (mood.energy > 0.8) {
    adjustedKeywords.push('impactante', 'dramático');
  }
  if (mood.energy < 0.3) {
    adjustedKeywords.push('subtil', 'contido');
  }
  if (mood.valence < 0.3) {
    adjustedKeywords.push('melancólico');
  }
  if (mood.valence > 0.7) {
    adjustedKeywords.push('luminoso', 'alegre');
  }
  if (mood.danceability > 0.7) {
    adjustedKeywords.push('rítmico', 'fluid');
  }
  if (mood.acousticness > 0.7) {
    adjustedKeywords.push('orgânico', 'natural');
  }
  
  return {
    ...style,
    keywords: [...new Set(adjustedKeywords)],
  };
}

function determineFit(mood: MoodProfile, audioFashion: AudioFashionMapping): StyleProfile['fit'] {
  const { danceability, energy } = mood;
  
  // Use silhouette flow from audio-fashion mapping
  if (audioFashion.silhouetteFlow > 0.7 && energy > 0.5) return 'oversized';
  if (audioFashion.silhouetteFlow > 0.6) return 'relaxed';
  if (audioFashion.silhouetteFlow < 0.3 && energy < 0.4) return 'slim';
  if (energy > 0.7) return 'regular';
  
  // Fallback to original logic
  if (danceability > 0.7 && energy > 0.5) return 'oversized';
  if (danceability > 0.6) return 'relaxed';
  if (danceability < 0.3 && energy < 0.4) return 'slim';
  
  return 'regular';
}

function refineClothingByAudio(clothingTypes: string[], audioFashion: AudioFashionMapping): string[] {
  const refined = [...clothingTypes];
  
  // High complexity → add statement pieces
  if (audioFashion.complexity > 0.7) {
    refined.push('statement jacket', 'bold pattern piece');
  }
  
  // Low complexity → suggest simpler alternatives
  if (audioFashion.complexity < 0.3) {
    // Keep base items, suggest clean versions
  }
  
  // Aerodynamic silhouette → streamline items
  if (audioFashion.silhouetteSpeed === 'aerodynamic') {
    refined.push('fitted layer', 'sleek footwear');
  }
  
  // Voluminous silhouette → add volume pieces
  if (audioFashion.silhouetteSpeed === 'voluminous') {
    refined.push('oversized layer', 'wide leg option');
  }
  
  return refined.slice(0, 8); // Cap at 8 items
}

function refineAccessoriesByEnergy(accessories: string[], energy: number): string[] {
  const refined = [...accessories];
  
  // High energy → more bold accessories
  if (energy > 0.7) {
    refined.push('statement piece', 'layered accessory');
  }
  
  // Low energy → minimal accessories
  if (energy < 0.3) {
    return refined.slice(0, 3);
  }
  
  return refined.slice(0, 6);
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
// TAG SYSTEM (Enhanced)
// ==========================================

export interface StyleTag {
  name: string;
  confidence: number; // 0-1
  category: 'aesthetic' | 'mood' | 'era' | 'cultural' | 'texture' | 'silhouette';
}

export function generateStyleTags(
  mood: MoodProfile,
  topGenres: { genre: string; count: number }[],
  style: StyleProfile,
  tempo?: number
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
  
  // Texture tags (from acousticness)
  if (mood.acousticness > 0.65) {
    tags.push({ name: 'Natural Fibers', confidence: mood.acousticness, category: 'texture' });
  } else if (mood.acousticness < 0.35) {
    tags.push({ name: 'Synthetic/Shiny', confidence: 1 - mood.acousticness, category: 'texture' });
  }
  
  // Silhouette tags (from danceability + tempo)
  if (mood.danceability > 0.6) {
    tags.push({ name: 'Fluid Silhouette', confidence: mood.danceability, category: 'silhouette' });
  } else {
    tags.push({ name: 'Structured Silhouette', confidence: 1 - mood.danceability, category: 'silhouette' });
  }
  if (tempo && tempo > 130) {
    tags.push({ name: 'Aerodynamic', confidence: 0.7, category: 'silhouette' });
  } else if (tempo && tempo < 90) {
    tags.push({ name: 'Voluminous', confidence: 0.7, category: 'silhouette' });
  }
  
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
    'bossa nova': 'Brazilian',
    'samba': 'Brazilian',
  };
  
  for (const { genre } of topGenres) {
    for (const [key, label] of Object.entries(culturalGenres)) {
      if (genre.toLowerCase().includes(key)) {
        tags.push({ name: label, confidence: 0.8, category: 'cultural' });
      }
    }
  }
  
  // Sort by confidence and return top 12
  return tags.sort((a, b) => b.confidence - a.confidence).slice(0, 12);
}

// ==========================================
// EXPORTS
// ==========================================

export { STYLE_DEFINITIONS, GENRE_STYLE_MAP };
export type { StyleDefinition, AudioFashionMapping };
