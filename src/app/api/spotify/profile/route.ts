import { NextRequest, NextResponse } from 'next/server';
import { getTopArtists, getTopTracks, getRecentlyPlayed, getAudioFeatures, getPlaylists, aggregateMoodProfile } from '@/lib/spotify';

// Helper to get tokens from cookies
function getTokens(request: NextRequest) {
  const tokensCookie = request.cookies.get('spotify_tokens')?.value;
  if (!tokensCookie) return null;
  
  try {
    return JSON.parse(tokensCookie);
  } catch {
    return null;
  }
}

// GET /api/spotify/profile - Get full user music profile
export async function GET(request: NextRequest) {
  const tokens = getTokens(request);
  
  if (!tokens) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' || 'medium_term';
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    // Fetch all data in parallel
    const [topArtists, topTracks, recentlyPlayed, playlists] = await Promise.all([
      getTopArtists(tokens.access_token, timeRange, limit),
      getTopTracks(tokens.access_token, timeRange, limit),
      getRecentlyPlayed(tokens.access_token, limit),
      getPlaylists(tokens.access_token, 50),
    ]);
    
    // Get audio features for top tracks
    const trackIds = topTracks.map(t => t.id);
    const audioFeatures = await getAudioFeatures(tokens.access_token, trackIds);
    
    // Aggregate mood profile
    const moodProfile = aggregateMoodProfile(audioFeatures);
    
    // Extract all genres from top artists
    const genreCounts: Record<string, number> = {};
    topArtists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    // Sort genres by frequency
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
    
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
    console.error('Error fetching Spotify data:', error);
    
    if (error.message === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
