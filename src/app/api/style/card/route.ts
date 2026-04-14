import { NextRequest, NextResponse } from 'next/server';
import { generateStyleCardSVG } from '@/lib/styleCardGenerator';

// POST /api/style/card - Generate style card image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styleProfile, moodProfile, topArtists, userName } = body;
    
    if (!styleProfile || !moodProfile || !topArtists) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const svg = generateStyleCardSVG(styleProfile, moodProfile, topArtists, userName);
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating style card:', error);
    return NextResponse.json(
      { error: 'Failed to generate style card' },
      { status: 500 }
    );
  }
}
