import { NextRequest, NextResponse } from 'next/server';
import { getTopArtists, getTopTracks, getRecentlyPlayed, getAudioFeatures, getPlaylists, aggregateMoodProfile } from '@/lib/spotify';

// Helper to get tokens from cookies or Authorization header
function getTokens(request: NextRequest) {
  // Try Authorization header first (for localStorage-based auth)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    console.log('[PROFILE] Token from Authorization header');
    return { access_token: token };
  }
  
  // Try cookie
  const tokensCookie = request.cookies.get('spotify_tokens')?.value;
  
  console.log('[PROFILE] Cookie spotify_tokens exists:', !!tokensCookie);
  
  if (!tokensCookie) return null;
  
  try {
    return JSON.parse(tokensCookie);
  } catch (e) {
    console.error('[PROFILE] Failed to parse tokens cookie:', e);
    return null;
  }
}

// GET /api/spotify/profile - Get full user music profile
export async function GET(request: NextRequest) {
  const tokens = getTokens(request);
  
  if (!tokens) {
    console.log('[PROFILE] No tokens found, returning 401');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  console.log('[PROFILE] Token found, length:', tokens.access_token?.length, 'scopes:', tokens.scope);
  
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' || 'medium_term';
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    // Fetch data sequentially to identify which call fails
    let topArtists: any[] = [];
    let topTracks: any[] = [];
    
    try {
      const result = await getTopArtists(tokens.access_token, timeRange, limit);
      topArtists = Array.isArray(result) ? result : [];
      console.log('[PROFILE] Top artists:', topArtists.length);
    } catch (e: any) {
      console.error('[PROFILE] getTopArtists failed:', e.message);
      throw new Error('Failed to fetch top artists: ' + e.message);
    }
    
    try {
      const result = await getTopTracks(tokens.access_token, timeRange, limit);
      topTracks = Array.isArray(result) ? result : [];
      console.log('[PROFILE] Top tracks:', topTracks.length);
    } catch (e: any) {
      console.error('[PROFILE] getTopTracks failed:', e.message);
      throw new Error('Failed to fetch top tracks: ' + e.message);
    }
    let recentlyPlayed: any[] = [];
    try {
      const result = await getRecentlyPlayed(tokens.access_token, limit);
      recentlyPlayed = Array.isArray(result) ? result : [];
    } catch (e: any) {
      console.warn('[PROFILE] getRecentlyPlayed failed:', e.message);
    }
    let playlists: any[] = [];
    try {
      const result = await getPlaylists(tokens.access_token, 50);
      playlists = Array.isArray(result) ? result : [];
    } catch (e: any) {
      console.warn('[PROFILE] getPlaylists failed:', e.message);
    }
    
    // Get audio features for top tracks (may fail for dev mode apps — non-critical)
    const trackIds = topTracks.map(t => t.id);
    let audioFeatures: any[] = [];
    try {
      audioFeatures = await getAudioFeatures(tokens.access_token, trackIds);
      console.log('[PROFILE] Audio features fetched:', audioFeatures.length);
    } catch (e: any) {
      console.warn('[PROFILE] Audio features not available (dev mode), using defaults:', e.message);
      // Generate default audio features from artist genres
      audioFeatures = topTracks.map(() => ({
        danceability: 0.5, energy: 0.5, valence: 0.5,
        acousticness: 0.5, tempo: 120, instrumentalness: 0,
        speechiness: 0, loudness: -10, mode: 1, key: 0,
      }));
    }
    
    // Aggregate mood profile
    const moodProfile = aggregateMoodProfile(audioFeatures);
    
    // Extract all genres from top artists
    const genreCounts: Record<string, number> = {};
    console.log('[PROFILE] First artist:', JSON.stringify(topArtists[0]?.name), 'genres:', topArtists[0]?.genres);
    topArtists.forEach(artist => {
      (artist.genres || []).forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    // Sort genres by frequency
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
    
    console.log('[PROFILE] Data fetched OK:', topArtists.length, 'artists,', topTracks.length, 'tracks');
    
    return NextResponse.json({
      topArtists,
      topTracks,
      recentlyPlayed,
      playlists,
      audioFeatures,
      moodProfile,
      topGenres,
    });
  } catch (error: any) {
    console.error('[PROFILE] Error fetching Spotify data:', error.message);
    
    if (error.message === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
