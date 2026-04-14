// Core Spotify Types
export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; height: number; width: number }[];
  product: string;
  country: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  popularity: number;
  followers: { total: number };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  images: { url: string; height: number; width: number }[];
  release_date: string;
  total_tracks: number;
}

export interface AudioFeatures {
  danceability: number;    // 0.0 - 1.0
  energy: number;          // 0.0 - 1.0
  valence: number;         // 0.0 - 1.0 (positivity)
  tempo: number;           // BPM
  acousticness: number;    // 0.0 - 1.0
  instrumentalness: number;
  speechiness: number;
  loudness: number;        // dB
  mode: number;            // 0 = minor, 1 = major
  key: number;             // 0-11
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  owner: { display_name: string };
}

// Style/Mood Types
export interface MoodProfile {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  tempo: number;
}

export interface StyleProfile {
  aesthetic: string;           // e.g., "Cyber-Gothic", "Minimal Nordic"
  keywords: string[];          // e.g., ["oversized", "layered", "dark"]
  colorPalette: ColorPalette;
  clothingTypes: string[];     // e.g., ["bomber jacket", "cargo pants"]
  accessories: string[];       // e.g., ["chain necklace", "beanie"]
  fit: 'oversized' | 'regular' | 'slim' | 'relaxed';
  mood: string;                // "aggressive", "melancholic", "uplifting"
  genre?: string;              // Primary music genre
}

export interface ColorPalette {
  primary: string;      // Hex color
  secondary: string;
  accent: string;
  neutral: string;
  name: string;         // e.g., "Midnight Noir", "Sunset Haze"
}

// Closet Types
export interface ClosetItem {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl: string;
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear' | 'dresses';
  tags: string[];           // AI-generated style tags
  colors: string[];         // Dominant colors
  style: string[];          // e.g., ["grunge", "90s", "casual"]
  brand?: string;
  createdAt: Date;
}

// Recommendation Types
export interface OutfitRecommendation {
  id: string;
  userId: string;
  generatedFrom: {
    type: 'artist' | 'album' | 'playlist' | 'track';
    id: string;
    name: string;
    imageUrl?: string;
  };
  styleProfile: StyleProfile;
  items: RecommendedItem[];
  closetMatches: ClosetItem[];  // Items from user's closet that match
  moodboardUrl?: string;
  createdAt: Date;
}

export interface RecommendedItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  store: string;
  style: string[];
  colors: string[];
}

// App State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  tokens: SpotifyTokens | null;
  loading: boolean;
  error: string | null;
}

export interface SpotifyData {
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyTrack[];
  audioFeatures: Map<string, AudioFeatures>;
  playlists: SpotifyPlaylist[];
}
