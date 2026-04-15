import { NextRequest, NextResponse } from 'next/server';
import { mapMoodToStyle, generateStyleTags, STYLE_DEFINITIONS } from '@/lib/styleMapper';
import { STORES, getStoresForBudget, getStoresForStyle } from '@/lib/affiliateLinks';
import { MoodProfile } from '@/types';
import { Gender } from '@/stores/appStore';

// POST /api/style/auto-generate — Generate outfits for a specific artist/track/playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, // 'artist' | 'track' | 'playlist'
      id,
      name,
      imageUrl,
      moodProfile, 
      topGenres, 
      budget = 'mid',
      gender,
      tracks, // For playlists: array of track audio features
    } = body;
    
    if (!type || !name || !moodProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name, moodProfile' },
        { status: 400 }
      );
    }
    
    // Calculate mood profile based on context
    let finalMoodProfile: MoodProfile = moodProfile;
    
    // For tracks, use the track's audio features directly
    if (type === 'track' && moodProfile) {
      finalMoodProfile = moodProfile;
    }
    
    // For playlists, average the mood of all tracks
    if (type === 'playlist' && tracks && tracks.length > 0) {
      const avgMood: MoodProfile = {
        energy: tracks.reduce((sum: number, t: any) => sum + (t.energy || 0.5), 0) / tracks.length,
        valence: tracks.reduce((sum: number, t: any) => sum + (t.valence || 0.5), 0) / tracks.length,
        danceability: tracks.reduce((sum: number, t: any) => sum + (t.danceability || 0.5), 0) / tracks.length,
        acousticness: tracks.reduce((sum: number, t: any) => sum + (t.acousticness || 0.5), 0) / tracks.length,
        tempo: tracks.reduce((sum: number, t: any) => sum + (t.tempo || 120), 0) / tracks.length,
      };
      finalMoodProfile = avgMood;
    }
    
    // 1. Map mood to style profile (with gender filter)
    const styleProfile = mapMoodToStyle(finalMoodProfile, topGenres || [], undefined, gender as Gender);
    
    // 2. Generate style tags
    const styleTags = generateStyleTags(finalMoodProfile, topGenres || [], styleProfile);
    
    // 3. Generate outfit with 4-6 items
    const outfit = generateSingleOutfit(
      styleProfile,
      finalMoodProfile,
      topGenres || [],
      budget,
      gender as Gender,
      type,
      name
    );
    
    return NextResponse.json({
      styleProfile,
      styleTags,
      outfit,
      source: {
        type,
        id,
        name,
        imageUrl,
      },
    });
  } catch (error: any) {
    console.error('[AUTO-GENERATE] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate outfit: ' + error.message },
      { status: 500 }
    );
  }
}

// =========================================
// SINGLE OUTFIT GENERATOR
// =========================================

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

interface SingleOutfit {
  name: string;
  styleName: string;
  items: OutfitItem[];
  source: {
    type: string;
    name: string;
  };
}

function generateSingleOutfit(
  styleProfile: any,
  moodProfile: MoodProfile,
  topGenres: { genre: string; count: number }[],
  budget: 'low' | 'mid' | 'high',
  gender?: Gender,
  sourceType?: string,
  sourceName?: string
): SingleOutfit {
  const { aesthetic, clothingTypes, accessories, colorPalette, keywords, fit } = styleProfile;
  
  // Get available colors
  const availableColors = [
    colorPalette.primary,
    colorPalette.secondary,
    colorPalette.accent,
    colorPalette.neutral,
  ];
  
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
  
  // Generate 4-6 items for the outfit
  const items: OutfitItem[] = [];
  
  // 1. Top piece
  if (clothingTypes.length > 0) {
    items.push(makeItem(
      getCategory(clothingTypes[0]),
      clothingTypes[0],
      availableColors
    ));
  }
  
  // 2. Bottom piece
  if (clothingTypes.length > 1) {
    items.push(makeItem(
      getCategory(clothingTypes[1]),
      clothingTypes[1],
      [availableColors[1] || availableColors[0]]
    ));
  }
  
  // 3. Shoes
  items.push(makeItem('shoes', getShoesForStyle(aesthetic), [availableColors[0]]));
  
  // 4. Accessory
  if (accessories.length > 0) {
    items.push(makeItem('accessories', pick(accessories), [availableColors[2] || availableColors[0]]));
  }
  
  // 5. Optional: Add outerwear or another item based on mood
  if (moodProfile.energy < 0.4 && clothingTypes.length > 2) {
    // Low energy = add layering piece
    items.push(makeItem(
      getCategory(clothingTypes[2]),
      clothingTypes[2],
      [availableColors[3] || availableColors[0]]
    ));
  } else if (moodProfile.energy > 0.7 && accessories.length > 1) {
    // High energy = add bold accessory
    items.push(makeItem('accessories', accessories[1], [availableColors[2] || availableColors[0]]));
  }
  
  // Create outfit name based on source
  let outfitName = aesthetic;
  if (sourceType === 'artist') {
    outfitName = `${sourceName} Style`;
  } else if (sourceType === 'track') {
    outfitName = `${sourceName} Vibes`;
  } else if (sourceType === 'playlist') {
    outfitName = `${sourceName} Look`;
  }
  
  return {
    name: outfitName,
    styleName: aesthetic,
    items,
    source: {
      type: sourceType || 'generated',
      name: sourceName || 'Generated',
    },
  };
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

function getBestStore(category: string, aesthetic: string, budget: 'low' | 'mid' | 'high'): string {
  const budgetStores = getStoresForBudget(budget);
  const styleStores = getStoresForStyle(aesthetic);
  const candidates = budgetStores.filter(s => styleStores.includes(s));
  const valid = candidates.filter(s => STORES[s]?.categories.includes(category));
  return valid[0] || budgetStores[0] || 'zara';
}
