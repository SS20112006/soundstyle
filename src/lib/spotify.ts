import { SpotifyTokens, SpotifyUser, SpotifyArtist, SpotifyTrack, AudioFeatures, SpotifyPlaylist } from '@/types';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// Scopes needed for our app
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

// Generate random string for state parameter
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// PKCE Challenge generation
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Get the redirect URI dynamically based on the request
function getRedirectUri(request?: Request): string {
  // First, try the environment variable
  const envUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  if (envUri && !envUri.includes('your_')) {
    return envUri;
  }
  
  // Fallback: construct from request headers
  if (request) {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}/api/auth/spotify/callback`;
  }
  
  // Default fallback - use 127.0.0.1 (Spotify doesn't accept localhost)
  return 'http://127.0.0.1:3000/api/auth/spotify/callback';
}

// ===== AUTH FUNCTIONS =====

export function getSpotifyAuthUrl(request?: Request): { url: string; state: string; codeVerifier: string } {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = getRedirectUri(request);
  
  if (!clientId || clientId === 'your_client_id_here') {
    throw new Error('Spotify Client ID not configured. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID in .env.local');
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
    state: state,
    show_dialog: 'true',
  });
  
  return {
    url: `${SPOTIFY_AUTH_URL}?${params.toString()}`,
    state,
    codeVerifier,
  };
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  request?: Request
): Promise<SpotifyTokens> {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = getRedirectUri(request);
  
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }
  
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    token_type: data.token_type,
    scope: data.scope,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }
  
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: Date.now() + data.expires_in * 1000,
    token_type: data.token_type,
    scope: data.scope,
  };
}

// ===== API HELPER =====

async function spotifyFetch<T>(endpoint: string, accessToken: string): Promise<T> {
  const response = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (response.status === 401) {
    throw new Error('TOKEN_EXPIRED');
  }
  
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }
  
  return response.json();
}

// ===== USER DATA FUNCTIONS =====

export async function getCurrentUser(accessToken: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>('/me', accessToken);
}

export async function getTopArtists(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

export async function getTopTracks(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

export async function getRecentlyPlayed(
  accessToken: string,
  limit: number = 20
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken
  );
  return data.items.map(item => item.track);
}

export async function getAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<AudioFeatures[]> {
  const data = await spotifyFetch<{ audio_features: AudioFeatures[] }>(
    `/audio-features?ids=${trackIds.join(',')}`,
    accessToken
  );
  return data.audio_features.filter(Boolean);
}

export async function getPlaylists(
  accessToken: string,
  limit: number = 20
): Promise<SpotifyPlaylist[]> {
  const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>(
    `/me/playlists?limit=${limit}`,
    accessToken
  );
  return data.items;
}

export async function getPlaylistTracks(
  accessToken: string,
  playlistId: string,
  limit: number = 50
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(
    `/playlists/${playlistId}/tracks?limit=${limit}`,
    accessToken
  );
  return data.items.map(item => item.track).filter(Boolean);
}

export async function getArtistTopTracks(
  accessToken: string,
  artistId: string,
  market: string = 'US'
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/artists/${artistId}/top-tracks?market=${market}`,
    accessToken
  );
  return data.tracks;
}

export async function getAlbumTracks(
  accessToken: string,
  albumId: string
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/albums/${albumId}/tracks`,
    accessToken
  );
  return data.items;
}

// ===== MOOD AGGREGATION =====

// ===== SEARCH =====

export interface SpotifySearchResult {
  tracks?: SpotifyTrack[];
  artists?: SpotifyArtist[];
}

export async function searchSpotify(
  accessToken: string,
  query: string,
  type: ('track' | 'artist')[] = ['track', 'artist'],
  limit: number = 10
): Promise<SpotifySearchResult> {
  const typeStr = type.join(',');
  const encodedQuery = encodeURIComponent(query);
  const data = await spotifyFetch<any>(
    `/search?q=${encodedQuery}&type=${typeStr}&limit=${limit}`,
    accessToken
  );

  return {
    tracks: data.tracks?.items || [],
    artists: data.artists?.items || [],
  };
}

export function aggregateMoodProfile(audioFeatures: AudioFeatures[]): {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  tempo: number;
} {
  if (audioFeatures.length === 0) {
    return { energy: 0.5, valence: 0.5, danceability: 0.5, acousticness: 0.5, tempo: 120 };
  }
  
  const sum = audioFeatures.reduce(
    (acc, f) => ({
      energy: acc.energy + f.energy,
      valence: acc.valence + f.valence,
      danceability: acc.danceability + f.danceability,
      acousticness: acc.acousticness + f.acousticness,
      tempo: acc.tempo + f.tempo,
    }),
    { energy: 0, valence: 0, danceability: 0, acousticness: 0, tempo: 0 }
  );
  
  const count = audioFeatures.length;
  return {
    energy: sum.energy / count,
    valence: sum.valence / count,
    danceability: sum.danceability / count,
    acousticness: sum.acousticness / count,
    tempo: sum.tempo / count,
  };
}
