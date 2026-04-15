import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// PLAYLIST CONTEXT TO STYLE MAPPING
// ==========================================

interface StyleContext {
  aesthetic: string;
  description: string;
  keyPieces: string[];
  colorPalette: string[];
  fabrics: string[];
  accessories: string[];
  mood: string;
}

const PLAYLIST_STYLE_MAP: Record<string, StyleContext> = {
  workout: {
    aesthetic: 'Athleisure',
    description: 'Performance-driven fashion that blends gym functionality with streetwear edge',
    keyPieces: ['Compression leggings', 'Oversized hoodie', 'Performance sneakers', 'Bike shorts', 'Sports bralette'],
    colorPalette: ['#FF4D4D', '#1A1A2E', '#00F5D4', '#FFFFFF', '#000000'],
    fabrics: ['Performance mesh', 'Moisture-wicking polyester', 'Spandex blend', 'Nylon'],
    accessories: ['Fitness tracker', 'Gym bag', 'Sports cap', 'Water bottle sling'],
    mood: 'Bold, energetic, determined',
  },
  focus: {
    aesthetic: 'Intellectual Minimalism',
    description: 'Clean lines and structured silhouettes for the focused mind',
    keyPieces: ['Tailored trousers', 'Fitted turtleneck', 'Structured blazer', 'Minimal sneakers', 'Oxford shirt'],
    colorPalette: ['#2C3E50', '#ECF0F1', '#BDC3C7', '#34495E', '#FFFFFF'],
    fabrics: ['Wool blend', 'Organic cotton', 'Linen', 'Cashmere'],
    accessories: ['Minimal watch', 'Leather bag', 'Reading glasses', 'Slim belt'],
    mood: 'Calm, focused, intentional',
  },
  party: {
    aesthetic: 'Y2K / Club',
    description: 'Bold, maximalist fashion for the dance floor',
    keyPieces: ['Sequin top', 'Mini skirt', 'Platform boots', 'Crop top', 'Cargo pants'],
    colorPalette: ['#FF00FF', '#00FFFF', '#FFD700', '#FF1493', '#000000'],
    fabrics: ['Sequins', 'PVC', 'Mesh', 'Satin', 'Faux leather'],
    accessories: ['Platform shoes', 'Chunky jewelry', 'Small shoulder bag', 'Glitter accessories'],
    mood: 'Bold, playful, electric',
  },
  chill: {
    aesthetic: 'Soft Scandinavian',
    description: 'Effortlessly cozy with earth tones and relaxed silhouettes',
    keyPieces: ['Oversized knit sweater', 'Wide-leg trousers', 'Canvas sneakers', 'Linen shirt', 'Knit cardigan'],
    colorPalette: ['#D4A574', '#8B7355', '#F5F5DC', '#C4A882', '#A0522D'],
    fabrics: ['Organic cotton', 'Cashmere', 'Linen', 'Wool', 'Alpaca'],
    accessories: ['Canvas tote', 'Wool beanie', 'Simple pendant', 'Cozy scarf'],
    mood: 'Warm, relaxed, grounded',
  },
  sad: {
    aesthetic: 'Dark Minimal',
    description: 'Moody layers in monochrome with a poetic edge',
    keyPieces: ['Oversized black coat', 'Slim black jeans', 'Chelsea boots', 'Black turtleneck', 'Long cardigan'],
    colorPalette: ['#1A1A1A', '#2D2D2D', '#4A4A4A', '#000000', '#1C1C1C'],
    fabrics: ['Wool', 'Cashmere', 'Leather', 'Heavy cotton'],
    accessories: ['Silver rings', 'Black leather boots', 'Dark sunglasses', 'Cross-body bag'],
    mood: 'Introspective, dark, poetic',
  },
  roadtrip: {
    aesthetic: 'Boho / Folk',
    description: 'Free-spirited, vintage-inspired pieces for the wanderer',
    keyPieces: ['Flowy maxi dress', 'Distressed denim jacket', 'Suede boots', 'Embroidered top', 'Wide-brim hat'],
    colorPalette: ['#D2691E', '#8B4513', '#F4A460', '#DEB887', '#CD853F'],
    fabrics: ['Denim', 'Suede', 'Cotton', 'Embroidered linen'],
    accessories: ['Wide-brim hat', 'Layered necklaces', 'Crossbody bag', 'Leather sandals'],
    mood: 'Free, adventurous, nostalgic',
  },
  romance: {
    aesthetic: 'Ethereal',
    description: 'Soft, romantic fabrics with delicate details',
    keyPieces: ['Silk blouse', 'Flowing midi skirt', 'Delicate flats', 'Wrap dress', 'Lace top'],
    colorPalette: ['#FFB6C1', '#E6E6FA', '#FFF0F5', '#FAEBD7', '#F5DEB3'],
    fabrics: ['Silk', 'Chiffon', 'Lace', 'Satin', 'Organza'],
    accessories: ['Pearl earrings', 'Delicate chain necklace', 'Silk scarf', 'Small clutch'],
    mood: 'Soft, romantic, dreamy',
  },
  morning: {
    aesthetic: 'Smart Casual',
    description: 'Polished versatility for the modern professional',
    keyPieces: ['Blazer', 'Chinos', 'Loafers', 'Button-down shirt', 'Merino sweater'],
    colorPalette: ['#2F4F4F', '#708090', '#F5F5F5', '#DCDCDC', '#4A4A4A'],
    fabrics: ['Cotton', 'Wool blend', 'Linen', 'Merino'],
    accessories: ['Leather watch', 'Minimal bag', 'Belt', 'Sunglasses'],
    mood: 'Polished, ready, composed',
  },
};

// ==========================================
// KEYWORD MATCHING
// ==========================================

const KEYWORD_PATTERNS: Record<string, string[]> = {
  workout: ['workout', 'gym', 'fitness', 'run', 'training', 'exercise', 'cardio', 'hiit', 'crossfit', 'power', 'pump', 'sweat', 'beast', 'strong', 'lift'],
  focus: ['focus', 'study', 'concentrate', 'work', 'deep', 'ambient', 'lo-fi', 'lofi', 'classical', 'instrumental', 'piano', 'coding', 'flow', 'brain'],
  party: ['party', 'club', 'dance', 'edm', 'techno', 'house', 'banger', 'night', 'turn up', 'lit', 'dj', 'disco', 'bass', 'drop', 'rave'],
  chill: ['chill', 'relax', 'lo-fi', 'lofi', 'mellow', 'soft', 'cozy', 'calm', 'peace', 'quiet', 'lazy', 'sunday', 'morning coffee', 'ambient'],
  sad: ['sad', 'melancholy', 'melancholic', 'heartbreak', 'cry', 'rain', 'alone', 'lonely', 'dark', 'emo', 'depressed', 'blue', 'tears', 'hurt'],
  roadtrip: ['road trip', 'drive', 'highway', 'travel', 'adventure', 'wanderlust', 'freedom', 'open road', 'journey', 'explore', 'wild', 'camp', 'nature'],
  romance: ['romance', 'love', 'date', 'romantic', 'heart', 'kiss', 'crush', 'valentine', 'together', 'dream', 'moonlight', 'candle', 'sunset'],
  morning: ['morning', 'commute', 'routine', 'daily', 'coffee', 'getting ready', 'workday', 'office', 'smart', 'polished', 'professional', 'start'],
};

function detectPlaylistContext(name: string, description?: string): StyleContext {
  const combinedText = `${name} ${description || ''}`.toLowerCase();

  // Score each context
  const scores: Record<string, number> = {};
  
  for (const [context, keywords] of Object.entries(KEYWORD_PATTERNS)) {
    scores[context] = 0;
    for (const keyword of keywords) {
      if (combinedText.includes(keyword)) {
        scores[context] += keyword.length; // Longer matches score higher
      }
    }
  }

  // Find the best match
  const bestMatch = Object.entries(scores).reduce((best, [context, score]) => 
    score > best.score ? { context, score } : best,
    { context: 'chill', score: 0 } // Default to chill
  );

  return PLAYLIST_STYLE_MAP[bestMatch.context] || PLAYLIST_STYLE_MAP.chill;
}

// ==========================================
// API HANDLER
// ==========================================

interface PlaylistTrack {
  name: string;
  artists: string[];
}

interface PlaylistAnalysisRequest {
  playlistName: string;
  playlistDescription?: string;
  tracks?: PlaylistTrack[];
}

// POST /api/style/playlist-analysis - Analyze a playlist for style context
export async function POST(request: NextRequest) {
  try {
    const body: PlaylistAnalysisRequest = await request.json();
    const { playlistName, playlistDescription, tracks } = body;

    if (!playlistName) {
      return NextResponse.json(
        { error: 'Missing required field: playlistName' },
        { status: 400 }
      );
    }

    // Detect the playlist context
    const styleContext = detectPlaylistContext(playlistName, playlistDescription);

    // Build response
    const response = {
      playlist: {
        name: playlistName,
        description: playlistDescription || '',
        trackCount: tracks?.length || 0,
      },
      styleContext,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing playlist:', error);
    return NextResponse.json(
      { error: 'Failed to analyze playlist for style context' },
      { status: 500 }
    );
  }
}
