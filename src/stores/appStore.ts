import { create } from 'zustand';
import { SpotifyUser, SpotifyArtist, SpotifyTrack, AudioFeatures, SpotifyPlaylist, MoodProfile } from '@/types';

interface AppStore {
  // Auth state
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  setAuth: (user: SpotifyUser | null) => void;
  
  // Spotify data
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyTrack[];
  playlists: SpotifyPlaylist[];
  audioFeatures: Map<string, AudioFeatures>;
  moodProfile: MoodProfile | null;
  topGenres: { genre: string; count: number }[];
  
  setSpotifyData: (data: {
    topArtists: SpotifyArtist[];
    topTracks: SpotifyTrack[];
    recentlyPlayed: SpotifyTrack[];
    playlists: SpotifyPlaylist[];
    audioFeatures: AudioFeatures[];
    moodProfile: MoodProfile;
    topGenres: { genre: string; count: number }[];
  }) => void;
  
  // Time range selection
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  setTimeRange: (range: 'short_term' | 'medium_term' | 'long_term') => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  
  // Clear all data
  clearAll: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Auth state
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ 
    isAuthenticated: !!user, 
    user 
  }),
  
  // Spotify data
  topArtists: [],
  topTracks: [],
  recentlyPlayed: [],
  playlists: [],
  audioFeatures: new Map(),
  moodProfile: null,
  topGenres: [],
  
  setSpotifyData: (data) => {
    const featuresMap = new Map<string, AudioFeatures>();
    data.audioFeatures.forEach(f => {
      // Audio features don't have id directly, but we can use the track index
      featuresMap.set(String(data.audioFeatures.indexOf(f)), f);
    });
    
    set({
      topArtists: data.topArtists,
      topTracks: data.topTracks,
      recentlyPlayed: data.recentlyPlayed,
      playlists: data.playlists,
      audioFeatures: featuresMap,
      moodProfile: data.moodProfile,
      topGenres: data.topGenres,
    });
  },
  
  // Time range
  timeRange: 'medium_term',
  setTimeRange: (range) => set({ timeRange: range }),
  
  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Error
  error: null,
  setError: (error) => set({ error }),
  
  // Clear
  clearAll: () => set({
    isAuthenticated: false,
    user: null,
    topArtists: [],
    topTracks: [],
    recentlyPlayed: [],
    playlists: [],
    audioFeatures: new Map(),
    moodProfile: null,
    topGenres: [],
    error: null,
  }),
}));
