import { NextRequest, NextResponse } from 'next/server';
import { mapMoodToStyle, generateColorPalette, generateStyleTags } from '@/lib/styleMapper';
import { generateOutfitRecommendations } from '@/lib/fashionAI';

// POST /api/style/generate - Generate outfit recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moodProfile, topGenres, topArtists, budget, occasion } = body;
    
    if (!moodProfile || !topGenres) {
      return NextResponse.json(
        { error: 'Missing required fields: moodProfile, topGenres' },
        { status: 400 }
      );
    }
    
    // Generate style profile from mood
    const styleProfile = mapMoodToStyle(moodProfile, topGenres);
    
    // Generate style tags
    const styleTags = generateStyleTags(moodProfile, topGenres, styleProfile);
    
    // Generate outfit recommendations
    const outfits = await generateOutfitRecommendations(
      styleProfile,
      moodProfile,
      topGenres,
      topArtists || [],
      budget,
      occasion
    );
    
    return NextResponse.json({
      styleProfile,
      styleTags,
      outfits,
      colorPalette: styleProfile.colorPalette,
    });
  } catch (error) {
    console.error('Error generating style:', error);
    return NextResponse.json(
      { error: 'Failed to generate style recommendations' },
      { status: 500 }
    );
  }
}
