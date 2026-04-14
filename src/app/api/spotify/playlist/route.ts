import { NextRequest, NextResponse } from 'next/server';
import { getAudioFeatures, getPlaylistTracks, aggregateMoodProfile } from '@/lib/spotify';

function getTokens(request: NextRequest) {
  const tokensCookie = request.cookies.get('spotify_tokens')?.value;
  if (!tokensCookie) return null;
  try {
    return JSON.parse(tokensCookie);
  } catch {
    return null;
  }
}

// GET /api/spotify/playlist?id=playlist_id - Get playlist mood analysis
export async function GET(request: NextRequest) {
  const tokens = getTokens(request);
  
  if (!tokens) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('id');
  
  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID required' }, { status: 400 });
  }
  
  try {
    // Get playlist tracks
    const tracks = await getPlaylistTracks(tokens.access_token, playlistId);
    
    // Get audio features
    const trackIds = tracks.map(t => t.id);
    const audioFeatures = await getAudioFeatures(tokens.access_token, trackIds);
    
    // Aggregate mood
    const moodProfile = aggregateMoodProfile(audioFeatures);
    
    // Extract genres from track artists
    const genres: string[] = [];
    tracks.forEach(track => {
      track.artists.forEach(artist => {
        // Note: artist.genres isn't available in track response
        // We'd need to fetch artist details separately for full genre data
        genres.push(artist.name);
      });
    });
    
    return NextResponse.json({
      tracks,
      audioFeatures,
      moodProfile,
      trackCount: tracks.length,
    });
  } catch (error: any) {
    console.error('Error analyzing playlist:', error);
    
    if (error.message === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Failed to analyze playlist' }, { status: 500 });
  }
}
