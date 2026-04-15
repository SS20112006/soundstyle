import { NextRequest, NextResponse } from 'next/server';
import { searchSpotify } from '@/lib/spotify';

// Helper to get tokens from cookies or Authorization header
function getTokens(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return { access_token: token };
  }

  const tokensCookie = request.cookies.get('spotify_tokens')?.value;
  if (!tokensCookie) return null;

  try {
    return JSON.parse(tokensCookie);
  } catch {
    return null;
  }
}

// Style derivation from music data
function deriveStyleHint(item: any, type: 'track' | 'artist'): string {
  if (type === 'artist') {
    const genres = item.genres || [];
    if (genres.some((g: string) => g.includes('hip hop') || g.includes('rap')))
      return 'Street Style';
    if (genres.some((g: string) => g.includes('rock') || g.includes('metal')))
      return 'Rebel Edge';
    if (genres.some((g: string) => g.includes('pop')))
      return 'Modern Pop';
    if (genres.some((g: string) => g.includes('r&b') || g.includes('soul')))
      return 'Smooth Sophisticated';
    if (genres.some((g: string) => g.includes('electronic') || g.includes('edm')))
      return 'Cyber Futuristic';
    if (genres.some((g: string) => g.includes('jazz') || g.includes('blues')))
      return 'Classic Elegance';
    if (genres.some((g: string) => g.includes('indie')))
      return 'Indie Artisan';
    if (genres.some((g: string) => g.includes('classical')))
      return 'Timeless Luxe';
    if (genres.some((g: string) => g.includes('country')))
      return 'Western Casual';
    return 'Versatile';
  }

  // Track-based hint using popularity
  const popularity = item.popularity || 50;
  if (popularity > 80) return 'Trend Forward';
  if (popularity > 60) return 'Mainstream Cool';
  if (popularity > 40) return 'Underground Edge';
  return 'Hidden Gem';
}

// GET /api/spotify/search?q=search&type=track,artist
export async function GET(request: NextRequest) {
  const tokens = getTokens(request);

  if (!tokens) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const typeParam = searchParams.get('type') || 'track,artist';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  const types = typeParam.split(',').filter(
    (t): t is 'track' | 'artist' => t === 'track' || t === 'artist'
  );

  if (types.length === 0) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  try {
    const results = await searchSpotify(tokens.access_token, query.trim(), types, limit);

    // Enrich results with style hints
    const enrichedTracks = (results.tracks || []).map((track: any) => ({
      ...track,
      styleHint: deriveStyleHint(track, 'track'),
    }));

    const enrichedArtists = (results.artists || []).map((artist: any) => ({
      ...artist,
      styleHint: deriveStyleHint(artist, 'artist'),
    }));

    return NextResponse.json({
      tracks: enrichedTracks,
      artists: enrichedArtists,
      query: query.trim(),
    });
  } catch (error: any) {
    console.error('[SEARCH] Error:', error.message);

    if (error.message === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
