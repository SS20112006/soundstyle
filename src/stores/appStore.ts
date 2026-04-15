import { create } from 'zustand';
import { SpotifyUser, SpotifyArtist, SpotifyTrack, AudioFeatures, SpotifyPlaylist, MoodProfile } from '@/types';

export type Gender = 'male' | 'female' | 'other';
export type SizeSystem = 'EU' | 'US' | 'UK';

export interface UserMeasurements {
  gender: Gender;
  tops: {
    size: string; // XS, S, M, L, XL, XXL
    chest?: number; // cm
    waist?: number; // cm
  };
  bottoms: {
    size: string; // 28, 30, 32, 34, 36, 38, 40
    waist?: number; // cm
    hips?: number; // cm
    inseam?: number; // cm
  };
  shoes: {
    sizeEU: number;
    sizeUS: number;
    sizeUK: number;
  };
  sizeSystem: SizeSystem;
}

interface AppStore {
  // Auth state
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  setAuth: (user: SpotifyUser | null) => void;
  
  // User measurements
  measurements: UserMeasurements | null;
  setMeasurements: (measurements: UserMeasurements | null) => void;
  isProfileComplete: boolean;
  
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

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth state
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ 
    isAuthenticated: !!user, 
    user 
  }),
  
  // User measurements
  measurements: null,
  setMeasurements: (measurements) => {
    set({ measurements });
    // Save to localStorage
    if (measurements) {
      localStorage.setItem('soundstyle_measurements', JSON.stringify(measurements));
    } else {
      localStorage.removeItem('soundstyle_measurements');
    }
  },
  get isProfileComplete() {
    const measurements = get().measurements;
    return measurements !== null && measurements.gender !== undefined;
  },
  
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
    measurements: null,
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
