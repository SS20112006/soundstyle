'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import MoodDisplay from '@/components/MoodDisplay';
import GenreCloud from '@/components/GenreCloud';
import ColorPaletteDisplay from '@/components/ColorPaletteDisplay';
import StyleTags from '@/components/StyleTags';
import OutfitCard from '@/components/OutfitCard';
import ClosetUpload from '@/components/ClosetUpload';
import AlbumView from '@/components/AlbumView';
import ArtistView from '@/components/ArtistView';
import SocialShare from '@/components/SocialShare';
import StyleCardDownload from '@/components/StyleCardDownload';
import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, StyleProfile, RecommendedItem } from '@/types';
import { StyleTag } from '@/lib/styleMapper';

type ViewMode = 'artists' | 'albums';

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
    setIsLoading,
    setError,
  } = useAppStore();
  
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('artists');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  
  // Style generation state
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [styleTags, setStyleTags] = useState<StyleTag[]>([]);
  const [outfits, setOutfits] = useState<{ name: string; occasion: string; items: RecommendedItem[] }[]>([]);
  const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
  const [budget, setBudget] = useState<'low' | 'mid' | 'high'>('mid');
  const [showCloset, setShowCloset] = useState(false);
  
  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/spotify/profile?time_range=${timeRange}&limit=20`);
        
        if (response.status === 401) {
          window.location.href = '/api/auth/spotify';
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setSpotifyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [timeRange]);
  
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
      {/* Navigation Bar - Apple-style sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold">SoundStyle</span>
          </a>
          
          {/* Right side controls */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Time Range - Apple segmented control style */}
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
              /* Loading State - Apple style */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.08]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1DB954] animate-spin" />
                </div>
                <p className="mt-6 text-white/50 text-lg">Analyzing your music taste...</p>
              </motion.div>
            ) : error ? (
              /* Error State */
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
              /* Content */
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Style Overview */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/40 text-sm font-medium uppercase tracking-wider mb-2">Your Style</p>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                        {styleDesc.primary}
                      </h1>
                      <p className="text-white/50">
                        Based on your {timeRange === 'short_term' ? 'last 4 weeks' : timeRange === 'medium_term' ? 'last 6 months' : 'all time'} listening
                      </p>
                    </div>
                    
                    {/* Mood Metrics */}
                    {moodProfile && <MoodDisplay moodProfile={moodProfile} />}
                  </div>
                  
                  {/* Right: Actions */}
                  <div className="space-y-6">
                    {/* Budget Selector - Apple pill style */}
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
                    
                    {/* Generate Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateStyle}
                      disabled={isGeneratingStyle}
                      className="w-full py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#1DB954]/20"
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
                      className="w-full py-4 bg-white/[0.06] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {showCloset ? 'Hide' : 'Add to'} Virtual Closet
                    </button>
                  </div>
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
                
                {/* Generated Style Profile */}
                {styleProfile && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                      <ColorPaletteDisplay palette={styleProfile.colorPalette} />
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                      <StyleTags tags={styleTags} />
                    </div>
                  </motion.section>
                )}
                
                {/* Share & Download */}
                {styleProfile && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
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
                  </motion.section>
                )}
                
                {/* Outfit Recommendations */}
                {outfits.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Recommended Looks</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {outfits.map((outfit, index) => (
                        <OutfitCard
                          key={index}
                          outfit={outfit}
                          styleProfile={styleProfile!}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                )}
                
                {/* Explore Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Explore</h2>
                    {/* View Mode Toggle - Apple segmented */}
                    <div className="flex items-center bg-white/[0.06] rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('artists')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                          viewMode === 'artists'
                            ? 'bg-white/[0.12] text-white'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                      >
                        Artists
                      </button>
                      <button
                        onClick={() => setViewMode('albums')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                          viewMode === 'albums'
                            ? 'bg-white/[0.12] text-white'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                      >
                        Albums
                      </button>
                    </div>
                  </div>
                  
                  {viewMode === 'artists' && (
                    <ArtistView
                      artists={topArtists}
                      styleProfile={styleProfile}
                      onSelectArtist={setSelectedArtist}
                      selectedArtist={selectedArtist}
                    />
                  )}
                  
                  {viewMode === 'albums' && (
                    <AlbumView
                      tracks={topTracks}
                      styleProfile={styleProfile}
                      onSelectAlbum={setSelectedAlbum}
                    />
                  )}
                </section>
                
                {/* Genres */}
                {topGenres.length > 0 && (
                  <section className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <GenreCloud genres={topGenres} />
                  </section>
                )}
                
                {/* Top Tracks */}
                {topTracks.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Top Tracks</h2>
                    <div className="space-y-2">
                      {topTracks.slice(0, 5).map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                        >
                          <span className="text-white/30 font-mono text-sm w-6 text-right">{index + 1}</span>
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.06]">
                            {track.album.images[0] && (
                              <img src={track.album.images[0].url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate group-hover:text-[#1DB954] transition-colors">{track.name}</p>
                            <p className="text-white/50 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/30 text-sm">SoundStyle • Transform your music into fashion</p>
        </div>
      </footer>
    </div>
  );
}
