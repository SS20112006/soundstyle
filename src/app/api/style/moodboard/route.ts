import { NextRequest, NextResponse } from 'next/server';
import { mapMoodToStyle } from '@/lib/styleMapper';
import { generateMoodboardPrompt } from '@/lib/fashionAI';

// POST /api/style/moodboard - Generate moodboard prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moodProfile, topGenres } = body;
    
    if (!moodProfile || !topGenres) {
      return NextResponse.json(
        { error: 'Missing required fields: moodProfile, topGenres' },
        { status: 400 }
      );
    }
    
    // Generate style profile
    const styleProfile = mapMoodToStyle(moodProfile, topGenres);
    
    // Generate moodboard prompt
    const prompt = await generateMoodboardPrompt(styleProfile, moodProfile);
    
    return NextResponse.json({
      prompt,
      styleProfile: {
        aesthetic: styleProfile.aesthetic,
        colorPalette: styleProfile.colorPalette,
        mood: styleProfile.mood,
      },
    });
  } catch (error) {
    console.error('Error generating moodboard:', error);
    return NextResponse.json(
      { error: 'Failed to generate moodboard' },
      { status: 500 }
    );
  }
}
