'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useSavedLooksStore } from '@/stores/savedLooksStore';
import MoodDisplay from '@/components/MoodDisplay';
import GenreCloud from '@/components/GenreCloud';
import StyleTags from '@/components/StyleTags';
import OutfitCard from '@/components/OutfitCard';
import ClosetUpload from '@/components/ClosetUpload';
import AlbumView from '@/components/AlbumView';
import ArtistView from '@/components/ArtistView';
import SocialShare from '@/components/SocialShare';
import StyleCardDownload from '@/components/StyleCardDownload';
import PlaylistStyleCard from '@/components/PlaylistStyleCard';
import LookbookView from '@/components/LookbookView';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import AutoOutfitCard from '@/components/AutoOutfitCard';
import NowPlaying from '@/components/NowPlaying';
import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, StyleProfile, RecommendedItem } from '@/types';
import { StyleTag } from '@/lib/styleMapper';

type ViewMode = 'artists' | 'albums';
type MobileTab = 'sound' | 'style';

interface PlaylistStyleContext {
  name: string;
  description: string;
  suggestedItems: RecommendedItem[];
}

export default function DashboardPage() {
  const {
    user,
    topArtists,
    topTracks,
    playlists,
    moodProfile,
    topGenres,
    timeRange,
    isLoading,
    error,
    setTimeRange,
    setSpotifyData,
    setAuth,
    setIsLoading,
    setError,
    setMeasurements,
    measurements,
  } = useAppStore();
  
  const { looks: savedLooks, loadFromStorage: loadSavedLooks } = useSavedLooksStore();
  
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('artists');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('sound');
  
  // Load user from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem('spotify_user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setAuth(userData);
      } catch {}
    }
    
    // Load measurements from localStorage
    const measurementsStr = localStorage.getItem('soundstyle_measurements');
    if (measurementsStr) {
      try {
        const measurementsData = JSON.parse(measurementsStr);
        setMeasurements(measurementsData);
      } catch {}
    }
  }, []);
  
  // Style generation state
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [styleTags, setStyleTags] = useState<StyleTag[]>([]);
  const [outfits, setOutfits] = useState<{ name: string; occasion: string; items: RecommendedItem[] }[]>([]);
  const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
  const [budget, setBudget] = useState<'low' | 'mid' | 'high'>('mid');
  const [showCloset, setShowCloset] = useState(false);
  
  // New state for playlists style contexts
  const [playlistContexts, setPlaylistContexts] = useState<Map<string, PlaylistStyleContext>>(new Map());
  const [isLoadingPlaylistContexts, setIsLoadingPlaylistContexts] = useState(false);
  
  // Undesired colors state
  const [undesiredColors, setUndesiredColors] = useState<string[]>([]);
  
  // Lookbook state
  const [showLookbook, setShowLookbook] = useState(false);
  
  // Profile setup modal
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  
  // Auto-generated outfits for each element
  const [autoOutfits, setAutoOutfits] = useState<Map<string, any>>(new Map());
  const [isGeneratingAutoOutfits, setIsGeneratingAutoOutfits] = useState(false);
  
  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get token from localStorage
        const tokensStr = typeof window !== 'undefined' ? localStorage.getItem('spotify_tokens') : null;
        const headers: Record<string, string> = {};
        
        if (tokensStr) {
          try {
            const tokens = JSON.parse(tokensStr);
            headers['Authorization'] = `Bearer ${tokens.access_token}`;
          } catch {}
        } else {
          // No token, redirect to auth
          window.location.href = '/api/auth/spotify';
          return;
        }
        
        const response = await fetch(`/api/spotify/profile?time_range=${timeRange}&limit=20`, { headers });
        
        if (response.status === 401) {
          // Clear invalid tokens and redirect
          localStorage.removeItem('spotify_tokens');
          localStorage.removeItem('spotify_user');
          window.location.href = '/api/auth/spotify';
          return;
        }
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `API error (${response.status})`);
        }
        
        const data = await response.json();
        setSpotifyData(data);
        
        console.log('[DASHBOARD] Profile data:', { 
          hasMood: !!data.moodProfile, 
          genres: data.topGenres?.length, 
          artists: data.topArtists?.length 
        });
        
        // Auto-generate looks immediately after data loads
        // Use genres if available, otherwise use artist names as style context
        const genres = data.topGenres || [];
        const hasGenres = genres.length > 0;
        
        console.log('[DASHBOARD] Generating looks...', { hasMood: !!data.moodProfile, genres: genres.length });
        
        try {
          const genRes = await fetch('/api/style/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moodProfile: data.moodProfile || { energy: 0.5, valence: 0.5, danceability: 0.5, acousticness: 0.5, tempo: 120 },
              topGenres: hasGenres ? genres : [{ genre: 'pop', count: 5 }, { genre: 'rock', count: 3 }],
              topArtists: (data.topArtists || []).map((a: any) => a.name),
              budget: 'mid',
              undesiredColors: [],
              gender: measurements?.gender,
            }),
          });
          if (genRes.ok) {
            const genData = await genRes.json();
            setStyleProfile(genData.styleProfile);
            setStyleTags(genData.styleTags || []);
            setOutfits(genData.outfits || []);
            console.log('[DASHBOARD] Generated', genData.outfits?.length, 'outfits');
          }
        } catch (e) {
          console.error('[DASHBOARD] Style generation failed:', e);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    setHasAutoGenerated(false); // Reset so looks regenerate with new data
    
    // Show profile setup if no measurements set
    const hasMeasurements = localStorage.getItem('soundstyle_measurements');
    if (!hasMeasurements) {
      // Delay slightly so the dashboard loads first
      setTimeout(() => setShowProfileSetup(true), 1500);
    }
  }, [timeRange]);
  
  // Load saved looks from localStorage
  useEffect(() => {
    loadSavedLooks();
  }, []);
  
  // Auto-generate outfits for playlists, artists, and tracks
  useEffect(() => {
    if (moodProfile && topArtists.length > 0 && autoOutfits.size === 0 && !isGeneratingAutoOutfits) {
      generateAutoOutfits();
    }
  }, [moodProfile, topArtists.length, autoOutfits.size]);

  // Clear and regenerate auto outfits when gender changes
  useEffect(() => {
    if (moodProfile && topArtists.length > 0) {
      setAutoOutfits(new Map());
      setHasAutoGenerated(false);
    }
  }, [measurements?.gender]);
  
  // Auto-generate looks after data is loaded
  const [hasAutoGenerated, setHasAutoGenerated] = useState(false);
  
  useEffect(() => {
    if (moodProfile && topGenres.length > 0 && topArtists.length > 0 && !hasAutoGenerated && !isGeneratingStyle) {
      setHasAutoGenerated(true);
      console.log('[DASHBOARD] Auto-generating looks...');
      handleGenerateStyle();
    }
  }, [moodProfile, topGenres.length, topArtists.length, hasAutoGenerated]);
  
  const autoGenerateLooks = async () => {
    if (!moodProfile || topGenres.length === 0) return;
    
    setIsGeneratingStyle(true);
    
    try {
      // Generate looks with different contexts
      const requests: Promise<Response>[] = [];
      
      // 1. Look based on top genre/style
      requests.push(
        fetch('/api/style/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodProfile,
            topGenres: topGenres.slice(0, 3),
            topArtists: topArtists.slice(0, 5).map(a => a.name),
            budget: 'mid',
            undesiredColors: [],
            occasion: `${topGenres[0]?.genre || 'Casual'} Style`,
            gender: measurements?.gender,
          }),
        })
      );
      
      // 2. Look based on top playlist (if available)
      if (playlists.length > 0) {
        const topPlaylist = playlists[0];
        requests.push(
          fetch('/api/style/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moodProfile,
              topGenres: topGenres.slice(0, 3),
              topArtists: topArtists.slice(0, 5).map(a => a.name),
              budget: 'mid',
              undesiredColors: [],
              occasion: `${topPlaylist.name} Vibes`,
              gender: measurements?.gender,
            }),
          })
        );
      }
      
      // 3. Look based on mood profile
      const moodLabel = moodProfile.valence > 0.6 ? 'Happy' : moodProfile.valence < 0.4 ? 'Melancholic' : 'Balanced';
      const energyLabel = moodProfile.energy > 0.6 ? 'High Energy' : moodProfile.energy < 0.4 ? 'Chill' : '';
      requests.push(
        fetch('/api/style/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodProfile,
            topGenres: topGenres.slice(0, 3),
            topArtists: topArtists.slice(0, 5).map(a => a.name),
            budget: 'mid',
            undesiredColors: [],
            occasion: `${moodLabel} ${energyLabel} Mood`,
            gender: measurements?.gender,
          }),
        })
      );
      
      const responses = await Promise.all(requests);
      const allOutfits: { name: string; occasion: string; items: any[] }[] = [];
      let lastStyleProfile: any = null;
      let lastStyleTags: any[] = [];
      
      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          if (data.outfits) {
            allOutfits.push(...data.outfits);
          }
          if (data.styleProfile) {
            lastStyleProfile = data.styleProfile;
          }
          if (data.styleTags) {
            lastStyleTags = data.styleTags;
          }
        }
      }
      
      if (allOutfits.length > 0) {
        setStyleProfile(lastStyleProfile);
        setStyleTags(lastStyleTags);
        setOutfits(allOutfits.slice(0, 6)); // Max 6 outfits
      }
    } catch (err) {
      console.error('Error auto-generating looks:', err);
    } finally {
      setIsGeneratingStyle(false);
    }
  };
  
  // Load playlist style contexts after style is generated
  useEffect(() => {
    if (styleProfile && playlists.length > 0 && playlistContexts.size === 0) {
      loadPlaylistContexts();
    }
  }, [styleProfile, playlists]);
  
  const loadPlaylistContexts = async () => {
    if (playlists.length === 0) return;
    
    setIsLoadingPlaylistContexts(true);
    const contexts = new Map<string, PlaylistStyleContext>();
    
    try {
      await Promise.all(
        playlists.slice(0, 6).map(async (playlist) => {
          try {
            const res = await fetch('/api/style/playlist-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                playlistName: playlist.name,
                playlistDescription: playlist.description,
              }),
            });
            
            if (res.ok) {
              const data = await res.json();
              contexts.set(playlist.id, {
                name: data.styleContext.aesthetic,
                description: data.styleContext.description,
                suggestedItems: [],
              });
            }
          } catch (err) {
            console.error(`Failed to analyze playlist ${playlist.name}:`, err);
          }
        })
      );
      
      setPlaylistContexts(new Map(contexts));
    } catch (err) {
      console.error('Error loading playlist contexts:', err);
    } finally {
      setIsLoadingPlaylistContexts(false);
    }
  };
  
  // Handle undesired color toggle
  const handleToggleUndesiredColor = (color: string) => {
    setUndesiredColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };
  
  // Delete user data
  const handleDeleteData = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('spotify_tokens');
      localStorage.removeItem('spotify_user');
      localStorage.removeItem('soundstyle-undesired-colors');
      
      // Call delete API (best effort)
      try {
        await fetch('/api/style/colors?userId=me', { method: 'DELETE' });
      } catch {}
      
      // Clear app state
      useAppStore.getState().clearAll();
      
      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };
  
  // Generate auto outfits for playlists, artists, and tracks
  const generateAutoOutfits = async () => {
    if (!moodProfile || topArtists.length === 0) return;
    
    setIsGeneratingAutoOutfits(true);
    const newAutoOutfits = new Map<string, any>();
    
    try {
      // Generate outfits for top 3 artists
      const artistPromises = topArtists.slice(0, 3).map(async (artist) => {
        try {
          const response = await fetch('/api/style/auto-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'artist',
              id: artist.id,
              name: artist.name,
              imageUrl: artist.images?.[0]?.url,
              moodProfile,
              topGenres: topGenres.slice(0, 3),
              budget,
              gender: measurements?.gender,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            newAutoOutfits.set(`artist-${artist.id}`, data);
          }
        } catch (err) {
          console.error(`Failed to generate outfit for artist ${artist.name}:`, err);
        }
      });
      
      // Generate outfits for top 3 tracks
      const trackPromises = topTracks.slice(0, 3).map(async (track) => {
        try {
          const response = await fetch('/api/style/auto-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'track',
              id: track.id,
              name: track.name,
              imageUrl: track.album.images?.[0]?.url,
              moodProfile: moodProfile, // Use overall mood for tracks
              topGenres: topGenres.slice(0, 3),
              budget,
              gender: measurements?.gender,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            newAutoOutfits.set(`track-${track.id}`, data);
          }
        } catch (err) {
          console.error(`Failed to generate outfit for track ${track.name}:`, err);
        }
      });
      
      // Generate outfits for top 3 playlists
      const playlistPromises = playlists.slice(0, 3).map(async (playlist) => {
        try {
          const response = await fetch('/api/style/auto-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'playlist',
              id: playlist.id,
              name: playlist.name,
              imageUrl: playlist.images?.[0]?.url,
              moodProfile,
              topGenres: topGenres.slice(0, 3),
              budget,
              gender: measurements?.gender,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            newAutoOutfits.set(`playlist-${playlist.id}`, data);
          }
        } catch (err) {
          console.error(`Failed to generate outfit for playlist ${playlist.name}:`, err);
        }
      });
      
      await Promise.all([...artistPromises, ...trackPromises, ...playlistPromises]);
      setAutoOutfits(newAutoOutfits);
      
    } catch (err) {
      console.error('Error generating auto outfits:', err);
    } finally {
      setIsGeneratingAutoOutfits(false);
    }
  };
  
  // Generate style
  const handleGenerateStyle = async () => {
    if (!moodProfile || topGenres.length === 0) return;
    
    setIsGeneratingStyle(true);
    
    try {
      const response = await fetch('/api/style/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodProfile,
          topGenres,
          topArtists: topArtists.map(a => a.name),
          budget,
          undesiredColors,
          gender: measurements?.gender,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate style');
      
      const data = await response.json();
      setStyleProfile(data.styleProfile);
      setStyleTags(data.styleTags);
      setOutfits(data.outfits);
    } catch (err) {
      console.error('Error generating style:', err);
    } finally {
      setIsGeneratingStyle(false);
    }
  };
  
  // Get style description
  const getStyleDescription = () => {
    if (!moodProfile) return { primary: 'Analyzing...', secondary: '', fit: '' };
    
    const { energy, valence, danceability } = moodProfile;
    
    let primary = 'Versatile';
    if (energy > 0.7 && valence < 0.4) primary = 'Cyber-Gothic';
    else if (energy > 0.7 && valence > 0.6) primary = 'Street Pop';
    else if (energy < 0.4 && valence < 0.4) primary = 'Dark Minimal';
    else if (energy < 0.4 && valence > 0.6) primary = 'Soft Scandinavian';
    else if (danceability > 0.7) primary = 'Y2K Club';
    else if (valence > 0.5) primary = 'Smart Casual';
    
    let fit = 'Regular';
    if (danceability > 0.7) fit = 'Oversized';
    else if (danceability < 0.3) fit = 'Slim';
    
    return { primary, secondary: '', fit };
  };
  
  const styleDesc = getStyleDescription();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a882] to-[#8b6f5c] flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">SoundStyle</span>
          </a>
          
          {/* Time Range Selector + Navigation */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-white/[0.06] rounded-lg p-1">
                {[
                  { value: 'short_term', label: '4 Weeks' },
                  { value: 'medium_term', label: '6 Months' },
                  { value: 'long_term', label: 'All Time' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value as any)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeRange === option.value
                        ? 'bg-white/[0.12] text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                <a
                  href="/explore"
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                  title="Explore"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </a>
                <a
                  href="/profile"
                  className="relative p-2 rounded-lg text-white/40 hover:text-[#c4a882] hover:bg-[#c4a882]/10 transition-all"
                  title="Saved Looks"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {savedLooks.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#c4a882] text-[10px] text-black font-bold flex items-center justify-center">
                      {savedLooks.length > 99 ? '99+' : savedLooks.length}
                    </span>
                  )}
                </a>
              </div>
              
              {/* User Avatar */}
              <div className="flex items-center gap-3">
                {user.images?.[0] && (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full ring-2 ring-white/10"
                  />
                )}
                <span className="hidden md:block text-sm text-white/70">
                  {user.display_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
                </div>
                <p className="mt-6 text-white/50 text-lg">Analyzing your music taste...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => setTimeRange(timeRange)}
                  className="px-6 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] rounded-full text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left: User Identity & Style */}
                  <div className="space-y-4">
                    <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Welcome back</p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                      {user?.display_name || 'Music Lover'}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎨</span>
                      <span className="text-xl text-[#c4a882] font-semibold">{styleDesc.primary}</span>
                    </div>
                    <p className="text-white/50 text-sm">
                      Based on your {timeRange === 'short_term' ? 'last 4 weeks' : timeRange === 'medium_term' ? 'last 6 months' : 'all time'} listening
                    </p>
                  </div>
                  
                  {/* Right: Mood Metrics */}
                  <div className="flex justify-center lg:justify-end">
                    {moodProfile && <MoodDisplay moodProfile={moodProfile} />}
                  </div>
                </section>

                {/* Auto-Generating indicator */}
                {isGeneratingStyle && !styleProfile && (
                  <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center gap-4">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Generating your style looks...</p>
                      <p className="text-white/40 text-sm">Based on your music taste</p>
                    </div>
                  </section>
                )}

                {/* Mobile Tab Toggle */}
                <div className="lg:hidden flex items-center bg-white/[0.06] rounded-xl p-1">
                  <button
                    onClick={() => setMobileTab('sound')}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mobileTab === 'sound'
                        ? 'bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Your Sound
                  </button>
                  <button
                    onClick={() => setMobileTab('style')}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mobileTab === 'style'
                        ? 'bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Your Style
                  </button>
                </div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT COLUMN: Your Sound */}
                  <div className={`space-y-8 ${mobileTab !== 'sound' ? 'hidden lg:block' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a882]/20 to-[#8b6f5c]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#c4a882]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Your Sound</h2>
                    </div>

                    {/* Now Playing - Live Spotify Connection */}
                    <NowPlaying />

                    {/* Top Artists (compact, max 6) */}
                    {topArtists.length > 0 && (
                      <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-4">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Top Artists</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                          {topArtists.slice(0, 6).map((artist, index) => (
                            <motion.div
                              key={artist.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.08 }}
                              className="flex flex-col items-center gap-2 group cursor-pointer"
                            >
                              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/[0.08] group-hover:ring-[#c4a882]/40 transition-all">
                                {artist.images?.[0] ? (
                                  <img src={artist.images[0].url} alt={artist.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-white/[0.06] flex items-center justify-center text-white/30">♪</div>
                                )}
                              </div>
                              <span className="text-xs text-white/60 text-center truncate w-full group-hover:text-[#c4a882] transition-colors">{artist.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Genre Cloud */}
                    {topGenres.length > 0 && (
                      <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Genres</h3>
                        <GenreCloud genres={topGenres} />
                      </section>
                    )}

                    {/* Top Tracks (compact, max 5) */}
                    {topTracks.length > 0 && (
                      <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-3">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Top Tracks</h3>
                        <div className="space-y-1">
                          {topTracks.slice(0, 5).map((track, index) => (
                            <motion.div
                              key={track.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                            >
                              <span className="text-white/30 font-mono text-xs w-5 text-right">{index + 1}</span>
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.06]">
                                {track.album.images[0] && (
                                  <img src={track.album.images[0].url} alt="" className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate group-hover:text-[#c4a882] transition-colors">{track.name}</p>
                                <p className="text-white/40 text-xs truncate">{track.artists.map(a => a.name).join(', ')}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Playlists */}
                    {playlists.length > 0 && (
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Playlists</h3>
                          {isLoadingPlaylistContexts && (
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <div className="w-3 h-3 border-2 border-white/20 border-t-[#c4a882] rounded-full animate-spin" />
                              Analyzing...
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {playlists.slice(0, 4).map((playlist, index) => {
                            const context = playlistContexts.get(playlist.id);
                            const defaultContext: PlaylistStyleContext = {
                              name: 'Analyzing...',
                              description: 'Style context is being generated based on this playlist.',
                              suggestedItems: [],
                            };
                            
                            return (
                              <PlaylistStyleCard
                                key={playlist.id}
                                playlist={{
                                  name: playlist.name,
                                  imageUrl: playlist.images?.[0]?.url || '',
                                  trackCount: playlist.tracks?.total || 0,
                                }}
                                styleContext={context || defaultContext}
                                index={index}
                              />
                            );
                          })}
                        </div>
                      </section>
                    )}
                    
                    {/* Auto-Generated Outfits for Your Sound */}
                    {(autoOutfits.size > 0 || isGeneratingAutoOutfits) && (
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
                            Your Sound → Style
                          </h3>
                          {isGeneratingAutoOutfits && (
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <div className="w-3 h-3 border-2 border-white/20 border-t-[#c4a882] rounded-full animate-spin" />
                              Generating...
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {/* Artist outfits */}
                          {topArtists.slice(0, 3).map((artist) => {
                            const outfitData = autoOutfits.get(`artist-${artist.id}`);
                            if (!outfitData) return null;
                            
                            return (
                              <AutoOutfitCard
                                key={`artist-${artist.id}`}
                                source={{
                                  type: 'artist',
                                  name: artist.name,
                                  imageUrl: artist.images?.[0]?.url,
                                  id: artist.id,
                                }}
                                items={outfitData.outfit?.items || []}
                                styleName={outfitData.styleProfile?.aesthetic || 'Analyzing...'}
                                onSave={() => {
                                  // Save look functionality
                                  const { saveLook } = useSavedLooksStore.getState();
                                  saveLook({
                                    name: outfitData.outfit?.name || `${artist.name} Style`,
                                    occasion: 'Artist Inspired',
                                    items: outfitData.outfit?.items || [],
                                    styleProfile: outfitData.styleProfile,
                                    source: { type: 'artist', name: artist.name, imageUrl: artist.images?.[0]?.url },
                                  });
                                }}
                                isSaved={savedLooks.some(l => l.name === outfitData.outfit?.name)}
                              />
                            );
                          })}
                          
                          {/* Track outfits */}
                          {topTracks.slice(0, 3).map((track) => {
                            const outfitData = autoOutfits.get(`track-${track.id}`);
                            if (!outfitData) return null;
                            
                            return (
                              <AutoOutfitCard
                                key={`track-${track.id}`}
                                source={{
                                  type: 'track',
                                  name: track.name,
                                  imageUrl: track.album.images?.[0]?.url,
                                  id: track.id,
                                }}
                                items={outfitData.outfit?.items || []}
                                styleName={outfitData.styleProfile?.aesthetic || 'Analyzing...'}
                                onSave={() => {
                                  const { saveLook } = useSavedLooksStore.getState();
                                  saveLook({
                                    name: outfitData.outfit?.name || `${track.name} Vibes`,
                                    occasion: 'Track Inspired',
                                    items: outfitData.outfit?.items || [],
                                    styleProfile: outfitData.styleProfile,
                                    source: { type: 'track', name: track.name, imageUrl: track.album.images?.[0]?.url },
                                  });
                                }}
                                isSaved={savedLooks.some(l => l.name === outfitData.outfit?.name)}
                              />
                            );
                          })}
                          
                          {/* Playlist outfits */}
                          {playlists.slice(0, 3).map((playlist) => {
                            const outfitData = autoOutfits.get(`playlist-${playlist.id}`);
                            if (!outfitData) return null;
                            
                            return (
                              <AutoOutfitCard
                                key={`playlist-${playlist.id}`}
                                source={{
                                  type: 'playlist',
                                  name: playlist.name,
                                  imageUrl: playlist.images?.[0]?.url,
                                  id: playlist.id,
                                }}
                                items={outfitData.outfit?.items || []}
                                styleName={outfitData.styleProfile?.aesthetic || 'Analyzing...'}
                                onSave={() => {
                                  const { saveLook } = useSavedLooksStore.getState();
                                  saveLook({
                                    name: outfitData.outfit?.name || `${playlist.name} Look`,
                                    occasion: 'Playlist Inspired',
                                    items: outfitData.outfit?.items || [],
                                    styleProfile: outfitData.styleProfile,
                                    source: { type: 'playlist', name: playlist.name, imageUrl: playlist.images?.[0]?.url },
                                  });
                                }}
                                isSaved={savedLooks.some(l => l.name === outfitData.outfit?.name)}
                              />
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Your Style */}
                  <div className={`space-y-8 ${mobileTab !== 'style' ? 'hidden lg:block' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574]/20 to-[#c4a882]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#d4a574]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Your Style</h2>
                    </div>

                    {/* Budget Selector + Generate Button */}
                    <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-5">
                      <div>
                        <p className="text-white/40 text-sm font-medium uppercase tracking-wider mb-3">Budget</p>
                        <div className="flex gap-2">
                          {([
                            { value: 'low', label: '€', desc: 'Budget' },
                            { value: 'mid', label: '€€', desc: 'Mid-range' },
                            { value: 'high', label: '€€€', desc: 'Premium' },
                          ] as const).map((b) => (
                            <button
                              key={b.value}
                              onClick={() => setBudget(b.value)}
                              className={`flex-1 py-3 rounded-xl text-center transition-all duration-200 ${
                                budget === b.value
                                  ? 'bg-white/[0.12] text-white border border-white/[0.15]'
                                  : 'bg-white/[0.04] text-white/50 border border-transparent hover:bg-white/[0.06]'
                              }`}
                            >
                              <span className="block text-lg font-semibold">{b.label}</span>
                              <span className="block text-xs opacity-60">{b.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerateStyle}
                        disabled={isGeneratingStyle}
                        className="w-full py-4 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] hover:from-[#d4b892] hover:to-[#9b7f6c] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#c4a882]/15"
                      >
                        {isGeneratingStyle ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Generating...
                          </span>
                        ) : (
                          'Generate Look ✨'
                        )}
                      </motion.button>

                      {/* Virtual Closet Toggle */}
                      <button
                        onClick={() => setShowCloset(!showCloset)}
                        className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {showCloset ? 'Hide' : 'Add to'} Virtual Closet
                      </button>
                    </section>

                    {/* Closet Upload - Collapsible */}
                    <AnimatePresence>
                      {showCloset && (
                        <motion.section
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                            <ClosetUpload />
                          </div>
                        </motion.section>
                      )}
                    </AnimatePresence>

                    {/* Style Tags */}
                    {styleProfile && (
                      <>
                        <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                          <StyleTags tags={styleTags} />
                        </section>
                        
                    {/* Profile Settings Button */}
                    <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Your Profile</p>
                          <p className="text-white text-sm">
                            {measurements ? (
                              <>
                                {measurements.gender === 'male' ? '👔 Men' : measurements.gender === 'female' ? '👗 Women' : '✨ Unisex'}
                                {' · '}Top {measurements.tops.size}{' · '}Bottom {measurements.bottoms.size}{' · '}EU {measurements.shoes.sizeEU}
                              </>
                            ) : (
                              <span className="text-white/30">Set your sizes for better recommendations</span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowProfileSetup(true)}
                          className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </section>
                      </>
                    )}

                    {/* Outfit Cards - Pinterest Grid */}
                    {outfits.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Recommended Looks</h3>
                        <div className="space-y-6">
                          {outfits.map((outfit, index) => (
                            <OutfitCard
                              key={index}
                              outfit={outfit}
                              styleProfile={styleProfile!}
                              index={index}
                              source={{
                                type: 'generated',
                                name: outfit.occasion || 'Generated Look',
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* View Lookbook Button */}
                    {styleProfile && outfits.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowLookbook(true)}
                        className="w-full py-4 bg-white/[0.06] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        View Lookbook
                      </motion.button>
                    )}

                    {/* Share & Download */}
                    {styleProfile && (
                      <div className="flex flex-col items-center gap-4">
                        <SocialShare
                          styleProfile={styleProfile}
                          moodProfile={moodProfile!}
                          topArtists={topArtists.map(a => a.name)}
                          topGenres={topGenres.map(g => g.genre)}
                          userName={user?.display_name}
                        />
                        <StyleCardDownload
                          styleProfile={styleProfile}
                          moodProfile={moodProfile!}
                          topArtists={topArtists.map(a => a.name)}
                          userName={user?.display_name}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
      />
      
      {/* Lookbook Modal */}
      <AnimatePresence>
        {showLookbook && styleProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 overflow-auto"
          >
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setShowLookbook(false)}
                className="fixed top-6 right-6 z-50 p-3 bg-white/[0.1] hover:bg-white/[0.2] rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <LookbookView
                userName={user?.display_name || 'User'}
                styleProfile={styleProfile}
                outfits={outfits}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">SoundStyle • Transform your music into fashion</p>
            
            {/* Delete my data button */}
            <button
              onClick={handleDeleteData}
              className="text-white/30 hover:text-red-400 text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete my data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
