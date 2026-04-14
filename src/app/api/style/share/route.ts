import { NextRequest, NextResponse } from 'next/server';
import { generateShareableDescription } from '@/lib/fashionAI';

// POST /api/style/share - Generate shareable social media description
export async function POST(request: NextRequest) {
  let body: any = null;
  
  try {
    body = await request.json();
    const { styleProfile, topArtists, topGenres } = body;
    
    if (!styleProfile || !topArtists || !topGenres) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const shareData = await generateShareableDescription(
      styleProfile,
      topArtists,
      topGenres
    );
    
    return NextResponse.json(shareData);
  } catch (error) {
    console.error('Error generating share:', error);
    
    // Fallback response if AI fails
    return NextResponse.json({
      title: 'O Meu Estilo Musical',
      description: `O meu estilo é ${body?.styleProfile?.aesthetic || 'único'}! A música define como me visto.`,
      hashtags: ['#SoundStyle', '#SpotifyFashion', '#MeuEstilo'],
    });
  }
}
