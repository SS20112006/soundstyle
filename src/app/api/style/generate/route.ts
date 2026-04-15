import { NextRequest, NextResponse } from 'next/server';
import { mapMoodToStyle, generateStyleTags, STYLE_DEFINITIONS } from '@/lib/styleMapper';
import { generateProductFromStyle, STORES, getStoresForBudget, getStoresForStyle } from '@/lib/affiliateLinks';
import { MoodProfile } from '@/types';

// POST /api/style/generate — Generate outfit recommendations (LOCAL, no OpenAI)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moodProfile, topGenres, topArtists, budget, occasion, undesiredColors } = body;
    
    if (!moodProfile || !topGenres) {
      return NextResponse.json(
        { error: 'Missing required fields: moodProfile, topGenres' },
        { status: 400 }
      );
    }
    
    // 1. Map mood to style profile
    const styleProfile = mapMoodToStyle(moodProfile, topGenres);
    
    // 2. Generate style tags
    const styleTags = generateStyleTags(moodProfile, topGenres, styleProfile);
    
    // 3. Generate outfits locally using style definitions + real stores
    const budgetLevel = budget || 'mid';
    const outfits = generateOutfitsLocally(
      styleProfile,
      moodProfile,
      topGenres,
      topArtists || [],
      budgetLevel,
      occasion,
      undesiredColors || []
    );
    
    return NextResponse.json({
      styleProfile,
      styleTags,
      outfits,
      colorPalette: styleProfile.colorPalette,
    });
  } catch (error: any) {
    console.error('[STYLE-GENERATE] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate style recommendations: ' + error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// LOCAL OUTFIT GENERATOR
// ==========================================

interface OutfitItem {
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  style: string[];
  colors: string[];
  affiliateUrl: string;
  store: string;
}

interface Outfit {
  name: string;
  occasion: string;
  items: OutfitItem[];
  source?: {
    type: 'artist' | 'playlist' | 'genre' | 'mood';
    name: string;
  };
}

function generateOutfitsLocally(
  styleProfile: any,
  moodProfile: MoodProfile,
  topGenres: { genre: string; count: number }[],
  topArtists: string[],
  budget: 'low' | 'mid' | 'high',
  occasion?: string,
  undesiredColors: string[] = []
): Outfit[] {
  const outfits: Outfit[] = [];
  const { aesthetic, clothingTypes, accessories, colorPalette, keywords, fit } = styleProfile;
  
  // Filter out undesired colors
  const availableColors = [
    colorPalette.primary,
    colorPalette.secondary,
    colorPalette.accent,
    colorPalette.neutral,
  ].filter(c => !undesiredColors.includes(c));
  
  // PRICE RANGES by budget
  const prices: Record<string, Record<string, [number, number]>> = {
    low: {
      tops: [9.99, 24.99], bottoms: [14.99, 34.99], outerwear: [29.99, 59.99],
      shoes: [19.99, 44.99], accessories: [4.99, 14.99], dresses: [14.99, 34.99],
    },
    mid: {
      tops: [19.99, 49.99], bottoms: [29.99, 69.99], outerwear: [59.99, 129.99],
      shoes: [49.99, 109.99], accessories: [9.99, 39.99], dresses: [29.99, 79.99],
    },
    high: {
      tops: [49.99, 129.99], bottoms: [69.99, 179.99], outerwear: [149.99, 349.99],
      shoes: [99.99, 259.99], accessories: [29.99, 89.99], dresses: [79.99, 219.99],
    },
  };
  
  const budgetPrices = prices[budget] || prices.mid;
  
  // Helper: random price in range
  const randPrice = (cat: string) => {
    const [min, max] = budgetPrices[cat] || budgetPrices.tops;
    return Math.round((min + Math.random() * (max - min)) * 100) / 100;
  };
  
  // Helper: pick random from array
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  // Helper: create item
  const makeItem = (category: string, name: string, colors: string[]): OutfitItem => {
    const storeKey = getBestStore(category, aesthetic, budget);
    const store = STORES[storeKey];
    const searchQuery = `${name} ${fit || ''}`.trim();
    
    return {
      name,
      brand: store?.name || 'Various',
      category,
      price: randPrice(category),
      currency: 'EUR',
      style: keywords.slice(0, 2),
      colors: colors.slice(0, 2),
      affiliateUrl: store ? `${store.searchUrl}${encodeURIComponent(searchQuery)}` : '#',
      store: storeKey,
    };
  };
  
  // === OUTFIT 1: Main look (based on top genre) ===
  const mainGenre = topGenres[0]?.genre || 'pop';
  const mainArtist = topArtists[0] || 'Unknown';
  
  const outfit1Items: OutfitItem[] = [];
  
  // Add clothing items from style definition
  if (clothingTypes.length > 0) {
    // Main piece
    outfit1Items.push(makeItem(
      getCategory(clothingTypes[0]),
      clothingTypes[0],
      availableColors
    ));
    
    // Second piece (different category)
    if (clothingTypes.length > 1) {
      outfit1Items.push(makeItem(
        getCategory(clothingTypes[1]),
        clothingTypes[1],
        [availableColors[1] || availableColors[0]]
      ));
    }
    
    // Shoes
    outfit1Items.push(makeItem('shoes', getShoesForStyle(aesthetic), [availableColors[0]]));
  }
  
  // Add accessory
  if (accessories.length > 0) {
    outfit1Items.push(makeItem('accessories', pick(accessories), [availableColors[2] || availableColors[0]]));
  }
  
  outfits.push({
    name: `${aesthetic} — ${mainGenre}`,
    occasion: occasion || pick(['Daily', 'Going Out', 'Weekend', 'Casual Friday']),
    items: outfit1Items,
    source: { type: 'genre', name: mainGenre },
  });
  
  // === OUTFIT 2: Variation (different occasion) ===
  const outfit2Items: OutfitItem[] = [];
  
  if (clothingTypes.length > 2) {
    outfit2Items.push(makeItem(getCategory(clothingTypes[2 % clothingTypes.length]), clothingTypes[2 % clothingTypes.length], availableColors));
  } else if (clothingTypes.length > 0) {
    outfit2Items.push(makeItem(getCategory(clothingTypes[0]), clothingTypes[0], [availableColors[1] || availableColors[0]]));
  }
  
  if (clothingTypes.length > 3) {
    outfit2Items.push(makeItem(getCategory(clothingTypes[3 % clothingTypes.length]), clothingTypes[3 % clothingTypes.length], availableColors));
  }
  
  outfit2Items.push(makeItem('shoes', getShoesForStyle(aesthetic), [availableColors[1] || availableColors[0]]));
  
  if (accessories.length > 1) {
    outfit2Items.push(makeItem('accessories', accessories[1], [availableColors[0]]));
  }
  
  outfits.push({
    name: `${aesthetic} — Elevated`,
    occasion: pick(['Date Night', 'Dinner', 'Event', 'Night Out']),
    items: outfit2Items,
    source: { type: 'artist', name: mainArtist },
  });
  
  // === OUTFIT 3: Casual variation ===
  const outfit3Items: OutfitItem[] = [];
  const casualPieces = clothingTypes.filter(t => 
    t.toLowerCase().includes('tee') || t.toLowerCase().includes('hoodie') || 
    t.toLowerCase().includes('sweater') || t.toLowerCase().includes('jogger') ||
    t.toLowerCase().includes('jeans') || t.toLowerCase().includes('sneaker')
  );
  
  if (casualPieces.length > 0) {
    outfit3Items.push(makeItem(getCategory(casualPieces[0]), casualPieces[0], availableColors));
  } else {
    outfit3Items.push(makeItem('tops', `${fit || 'Regular'} Top`, availableColors));
  }
  
  outfit3Items.push(makeItem('bottoms', getBottomsForStyle(aesthetic), [availableColors[3] || availableColors[0]]));
  outfit3Items.push(makeItem('shoes', 'Sneakers', [availableColors[0]]));
  
  if (accessories.length > 0) {
    outfit3Items.push(makeItem('accessories', pick(accessories), [availableColors[2] || availableColors[0]]));
  }
  
  outfits.push({
    name: `${aesthetic} — Casual`,
    occasion: 'Everyday',
    items: outfit3Items,
    source: { type: 'mood', name: `${moodProfile.energy > 0.6 ? 'High' : 'Low'} Energy` },
  });
  
  return outfits;
}

function getCategory(item: string): string {
  const lower = item.toLowerCase();
  if (lower.includes('jacket') || lower.includes('coat') || lower.includes('vest') || lower.includes('hoodie') || lower.includes('bomber')) return 'outerwear';
  if (lower.includes('boot') || lower.includes('sneaker') || lower.includes('shoe') || lower.includes('heel')) return 'shoes';
  if (lower.includes('jean') || lower.includes('pant') || lower.includes('trouser') || lower.includes('skirt') || lower.includes('jogger') || lower.includes('cargo')) return 'bottoms';
  if (lower.includes('necklace') || lower.includes('ring') || lower.includes('bag') || lower.includes('watch') || lower.includes('chain') || lower.includes('cap') || lower.includes('hat') || lower.includes('sunglasses') || lower.includes('belt') || lower.includes('glove') || lower.includes('scarf') || lower.includes('bracelet') || lower.includes('earring')) return 'accessories';
  if (lower.includes('dress')) return 'dresses';
  return 'tops';
}

function getShoesForStyle(aesthetic: string): string {
  const map: Record<string, string> = {
    'Cyber-Gothic / Techwear': 'Tech Sneakers',
    'Dark Minimal / Noir': 'Chelsea Boots',
    'Y2K / Club Kid': 'Platform Shoes',
    'Street Pop / Neon': 'Chunky Sneakers',
    'Soft Scandinavian': 'White Sneakers',
    'Boho / Folk': 'Suede Boots',
    'Clean / Smart Casual': 'Derby Shoes',
    'Punk / Grunge Revival': 'Combat Boots',
    'Luxury Streetwear': 'Designer Sneakers',
    'Ethereal / Dream Pop': 'Ballet Flats',
    'Cottagecore': 'Leather Boots',
    'Retro-Futurismo': 'Metallic Sneakers',
    'Dark Academia': 'Oxford Shoes',
    'Hyperpop Maximalist': 'Platform Boots',
    'Intellectual Minimalism': 'Loafers',
  };
  return map[aesthetic] || 'Sneakers';
}

function getBottomsForStyle(aesthetic: string): string {
  const map: Record<string, string> = {
    'Cyber-Gothic / Techwear': 'Cargo Pants',
    'Dark Minimal / Noir': 'Slim Trousers',
    'Y2K / Club Kid': 'Low-Rise Jeans',
    'Street Pop / Neon': 'Wide Leg Pants',
    'Soft Scandinavian': 'Relaxed Trousers',
    'Boho / Folk': 'Bell-Bottom Jeans',
    'Clean / Smart Casual': 'Chinos',
    'Punk / Grunge Revival': 'Ripped Jeans',
    'Luxury Streetwear': 'Tailored Joggers',
    'Ethereal / Dream Pop': 'Midi Skirt',
    'Cottagecore': 'Linen Trousers',
    'Retro-Futurismo': 'Leather Pants',
    'Dark Academia': 'Pleated Trousers',
    'Intellectual Minimalism': 'Tailored Trousers',
  };
  return map[aesthetic] || 'Jeans';
}

function getBestStore(category: string, aesthetic: string, budget: 'low' | 'mid' | 'high'): string {
  const budgetStores = getStoresForBudget(budget);
  const styleStores = getStoresForStyle(aesthetic);
  const candidates = budgetStores.filter(s => styleStores.includes(s));
  const valid = candidates.filter(s => STORES[s]?.categories.includes(category));
  return valid[0] || budgetStores[0] || 'zara';
}
