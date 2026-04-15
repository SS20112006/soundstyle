import { NextRequest, NextResponse } from 'next/server';

// GET /api/spotify/now-playing — Get currently playing track
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': authHeader,
      },
    });

    // 204 means nothing is playing
    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false, track: null });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error?.message || 'Failed to fetch now playing' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Get audio features for the current track
    let audioFeatures = null;
    if (data.item?.id) {
      try {
        const featuresResponse = await fetch(
          `https://api.spotify.com/v1/audio-features/${data.item.id}`,
          { headers: { 'Authorization': authHeader } }
        );
        if (featuresResponse.ok) {
          audioFeatures = await featuresResponse.json();
        }
      } catch (err) {
        console.error('Failed to fetch audio features:', err);
      }
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      track: {
        id: data.item?.id,
        name: data.item?.name,
        artists: data.item?.artists?.map((a: any) => ({
          id: a.id,
          name: a.name,
        })),
        album: {
          id: data.item?.album?.id,
          name: data.item?.album?.name,
          images: data.item?.album?.images,
        },
        duration_ms: data.item?.duration_ms,
        progress_ms: data.progress_ms,
        popularity: data.item?.popularity,
      },
      audioFeatures: audioFeatures ? {
        danceability: audioFeatures.danceability,
        energy: audioFeatures.energy,
        valence: audioFeatures.valence,
        tempo: audioFeatures.tempo,
        acousticness: audioFeatures.acousticness,
        instrumentalness: audioFeatures.instrumentalness,
        speechiness: audioFeatures.speechiness,
      } : null,
      device: {
        name: data.device?.name,
        type: data.device?.type,
        volume: data.device?.volume_percent,
      },
    });
  } catch (error: any) {
    console.error('[NOW-PLAYING] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch now playing: ' + error.message },
      { status: 500 }
    );
  }
}
