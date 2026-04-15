import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// LOOKBOOK DATA STRUCTURES
// ==========================================

interface LookbookItem {
  name: string;
  category: string;
  imageUrl?: string;
  brand?: string;
  price?: number;
  affiliateUrl?: string;
}

interface LookbookOutfit {
  name: string;
  occasion: string;
  items: LookbookItem[];
  style: string[];
}

interface LookbookData {
  id: string;
  title: string;
  aesthetic: string;
  description: string;
  outfits: LookbookOutfit[];
  colorPalette: string[];
  createdAt: string;
  shareUrl: string;
}

// ==========================================
// API HANDLER
// ==========================================

// GET /api/style/lookbook - Generate lookbook page data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const aesthetic = searchParams.get('aesthetic') || 'Soft Scandinavian';

    // Generate a mock lookbook (in production, fetch from database)
    const lookbook: LookbookData = {
      id: profileId || `lookbook-${Date.now()}`,
      title: `${aesthetic} Lookbook`,
      aesthetic,
      description: `A curated collection inspired by ${aesthetic} aesthetic, blending music mood with fashion.`,
      outfits: generateMockOutfits(aesthetic),
      colorPalette: getPaletteForAesthetic(aesthetic),
      createdAt: new Date().toISOString(),
      shareUrl: `${request.nextUrl.origin}/lookbook/${profileId || 'preview'}`,
    };

    return NextResponse.json(lookbook);
  } catch (error) {
    console.error('Error generating lookbook:', error);
    return NextResponse.json(
      { error: 'Failed to generate lookbook' },
      { status: 500 }
    );
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateMockOutfits(aesthetic: string): LookbookOutfit[] {
  const outfitTemplates: Record<string, LookbookOutfit[]> = {
    'Soft Scandinavian': [
      {
        name: 'Cozy Weekend',
        occasion: 'Casual',
        items: [
          { name: 'Oversized Knit Sweater', category: 'tops', brand: 'COS' },
          { name: 'Wide-Leg Linen Trousers', category: 'bottoms', brand: 'Uniqlo' },
          { name: 'Canvas Sneakers', category: 'shoes', brand: 'Veja' },
        ],
        style: ['cozy', 'relaxed', 'minimal'],
      },
      {
        name: 'Coffee Run',
        occasion: 'Daily',
        items: [
          { name: 'Merino Wool Cardigan', category: 'outerwear', brand: 'COS' },
          { name: 'Organic Cotton Tee', category: 'tops', brand: 'Uniqlo' },
          { name: 'Straight Leg Jeans', category: 'bottoms', brand: 'Weekday' },
        ],
        style: ['casual', 'effortless', 'warm'],
      },
    ],
    'Y2K / Club': [
      {
        name: 'Night Out',
        occasion: 'Party',
        items: [
          { name: 'Sequin Crop Top', category: 'tops', brand: 'ASOS' },
          { name: 'Cargo Mini Skirt', category: 'bottoms', brand: 'Bershka' },
          { name: 'Platform Boots', category: 'shoes', brand: 'Demonia' },
        ],
        style: ['bold', 'playful', 'maximalist'],
      },
    ],
    'Dark Minimal': [
      {
        name: 'Moody Layers',
        occasion: 'Evening',
        items: [
          { name: 'Oversized Black Coat', category: 'outerwear', brand: 'COS' },
          { name: 'Slim Black Turtleneck', category: 'tops', brand: 'Uniqlo' },
          { name: 'Chelsea Boots', category: 'shoes', brand: 'Dr. Martens' },
        ],
        style: ['dark', 'layered', 'structured'],
      },
    ],
  };

  return outfitTemplates[aesthetic] || outfitTemplates['Soft Scandinavian'];
}

function getPaletteForAesthetic(aesthetic: string): string[] {
  const palettes: Record<string, string[]> = {
    'Athleisure': ['#FF4D4D', '#1A1A2E', '#00F5D4', '#FFFFFF', '#000000'],
    'Intellectual Minimalism': ['#2C3E50', '#ECF0F1', '#BDC3C7', '#34495E', '#FFFFFF'],
    'Y2K / Club': ['#FF00FF', '#00FFFF', '#FFD700', '#FF1493', '#000000'],
    'Soft Scandinavian': ['#D4A574', '#8B7355', '#F5F5DC', '#C4A882', '#A0522D'],
    'Dark Minimal': ['#1A1A1A', '#2D2D2D', '#4A4A4A', '#000000', '#1C1C1C'],
    'Boho / Folk': ['#D2691E', '#8B4513', '#F4A460', '#DEB887', '#CD853F'],
    'Ethereal': ['#FFB6C1', '#E6E6FA', '#FFF0F5', '#FAEBD7', '#F5DEB3'],
    'Smart Casual': ['#2F4F4F', '#708090', '#F5F5F5', '#DCDCDC', '#4A4A4A'],
  };
  return palettes[aesthetic] || palettes['Soft Scandinavian'];
}
