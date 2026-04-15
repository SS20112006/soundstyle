import { NextRequest, NextResponse } from 'next/server';
import { mapMoodToStyle, generateColorPalette } from '@/lib/styleMapper';
import { generateMoodboardPrompt } from '@/lib/fashionAI';

// Album-to-style mappings for famous albums
const ALBUM_STYLE_MAP: Record<string, { title: string; description: string; suggestedStyles: string[]; visualElements: string[] }> = {
  'after hours': {
    title: 'Night Luxe',
    description: 'A retro-futuristic dreamscape where neon-lit cityscapes meet 80s glamour. Think sleek leather, metallic accents, and deep reds against midnight backdrops.',
    suggestedStyles: [
      'Retro-futuristic metallic bomber',
      'High-waisted leather pants',
      'Pointed boots with chrome details',
      'Wrap sunglasses for mysterious allure',
    ],
    visualElements: [
      'Neon city lights',
      'Synthwave sunsets',
      'Chromed surfaces',
      'Red and blue contrast',
    ],
  },
  'lover': {
    title: 'Romantic Pastels',
    description: 'An ethereal world of soft pinks, lavenders, and gentle sparkles. Dreamy layers and delicate fabrics create a whimsical, love-filled aesthetic.',
    suggestedStyles: [
      'Flowy pastel midi skirt',
      'Sheer blouse with ruffle details',
      'Pearl accessories',
      'Soft knit cardigan',
    ],
    visualElements: [
      'Cotton candy clouds',
      'Rose gold accents',
      'Butterfly motifs',
      'Heart-shaped accessories',
    ],
  },
  'astroworld': {
    title: 'Psychedelic Streetwear',
    description: 'Bold, chaotic, and larger-than-life. Vibrant tie-dye patterns meet oversized silhouettes, creating a carnival-inspired streetwear aesthetic.',
    suggestedStyles: [
      'Oversized graphic hoodie',
      'Tie-dye cargo pants',
      'Chunky platform sneakers',
      'Statement chain necklace',
    ],
    visualElements: [
      'Amusement park imagery',
      'Psychedelic color swirls',
      'Flame and smoke effects',
      'Neon carnival lights',
    ],
  },
  'blonde': {
    title: 'Minimal Nostalgia',
    description: 'Clean lines and muted tones evoke a sense of reflective melancholy. Simplicity meets emotion in understated, timeless pieces.',
    suggestedStyles: [
      'White oversized tee',
      'Relaxed-fit light wash jeans',
      'Simple canvas sneakers',
      'Minimal gold jewelry',
    ],
    visualElements: [
      'Soft natural light',
      'Muted earth tones',
      'Polaroid aesthetics',
      'Ocean and nature imagery',
    ],
  },
  'random access memories': {
    title: 'Disco Revival',
    description: 'Studio 54 meets modern sophistication. Shimmering fabrics, flared silhouettes, and metallic accents channel the golden era of disco.',
    suggestedStyles: [
      'Sequin-embellished top',
      'High-waisted flared pants',
      'Platform heels',
      'Gold chain belt',
    ],
    visualElements: [
      'Disco ball reflections',
      'Studio 54 vibes',
      'Gold and silver shimmer',
      'Funky geometric patterns',
    ],
  },
};

// POST /api/style/moodboard - Generate album moodboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { albumName, artistName, imageUrl, moodProfile, topGenres } = body;
    
    // Validate required fields
    if (!albumName) {
      return NextResponse.json(
        { error: 'Missing required field: albumName' },
        { status: 400 }
      );
    }
    
    // Check for predefined album mappings
    const albumLower = albumName.toLowerCase();
    let moodBoard;
    
    if (ALBUM_STYLE_MAP[albumLower]) {
      // Use predefined moodboard for known albums
      const preset = ALBUM_STYLE_MAP[albumLower];
      
      // Generate color palette from mood profile if available, or use preset
      const colorPalette = moodProfile 
        ? generateColorPalette(moodProfile)
        : {
            primary: '#c4a882',
            secondary: '#8b6f5c',
            accent: '#d4a574',
            neutral: '#1a1a1a',
            name: 'Album Default',
          };
      
      moodBoard = {
        title: preset.title,
        description: preset.description,
        colorPalette,
        suggestedStyles: preset.suggestedStyles,
        visualElements: preset.visualElements,
        albumInfo: {
          name: albumName,
          artist: artistName || 'Unknown Artist',
          imageUrl: imageUrl || null,
        },
      };
    } else if (moodProfile && topGenres) {
      // Generate dynamic moodboard using styleMapper
      const styleProfile = mapMoodToStyle(moodProfile, topGenres);
      
      // Generate AI moodboard prompt
      let prompt;
      try {
        prompt = await generateMoodboardPrompt(styleProfile, moodProfile);
      } catch {
        prompt = `A moodboard featuring ${styleProfile.aesthetic} aesthetic with ${styleProfile.colorPalette.name} colors`;
      }
      
      moodBoard = {
        title: `${styleProfile.aesthetic} Vibes`,
        description: prompt || styleProfile.mood,
        colorPalette: styleProfile.colorPalette,
        suggestedStyles: [
          ...styleProfile.clothingTypes.slice(0, 4),
        ].map(item => item.charAt(0).toUpperCase() + item.slice(1)),
        visualElements: styleProfile.keywords.slice(0, 4).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        albumInfo: {
          name: albumName,
          artist: artistName || 'Unknown Artist',
          imageUrl: imageUrl || null,
        },
      };
    } else {
      // Fallback: generic moodboard based on album name
      moodBoard = {
        title: `${albumName} Aesthetic`,
        description: `A style inspired by the vibes of ${albumName}${artistName ? ` by ${artistName}` : ''}.`,
        colorPalette: {
          primary: '#c4a882',
          secondary: '#8b6f5c',
          accent: '#d4a574',
          neutral: '#1a1a1a',
          name: 'Classic Gold',
        },
        suggestedStyles: [
          'Statement piece inspired by album art',
          'Comfortable layers for listening sessions',
          'Accessories that match the album mood',
          'Everyday pieces with artistic flair',
        ],
        visualElements: [
          'Album cover colors',
          'Artist aesthetic',
          'Genre-specific vibes',
          'Personal expression',
        ],
        albumInfo: {
          name: albumName,
          artist: artistName || 'Unknown Artist',
          imageUrl: imageUrl || null,
        },
      };
    }
    
    return NextResponse.json(
      { moodBoard },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error generating moodboard:', error);
    return NextResponse.json(
      { error: 'Failed to generate moodboard' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
