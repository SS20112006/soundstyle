'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import MoodDisplay, { getMoodDescription } from '@/components/MoodDisplay';
import TopArtists from '@/components/TopArtists';
import TopTracks from '@/components/TopTracks';
import Playlists from '@/components/Playlists';
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
    isAuthenticated,
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
  
  const moodDescription = moodProfile ? getMoodDescription(moodProfile) : null;
  
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
      
      if (!response.ok) {
        throw new Error('Failed to generate style');
      }
      
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              Sound<span className="text-[#1DB954]">Style</span>
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex gap-1 bg-white/5 rounded-full p-1">
                {[
                  { value: 'short_term', label: '4 semanas' },
                  { value: 'medium_term', label: '6 meses' },
                  { value: 'long_term', label: 'Todos' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value as any)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      timeRange === option.value
                        ? 'bg-[#1DB954] text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* User info */}
              <div className="flex items-center gap-2">
                {user.images[0] && (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-white/80 text-sm hidden md:block">
                  {user.display_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-[#1DB954]/20 border-t-[#1DB954] rounded-full animate-spin" />
              <p className="text-white/60 mt-4">Analisando o teu estilo musical...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => setTimeRange(timeRange)}
                className="px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                Tentar novamente
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Mood Section */}
              {moodProfile && (
                <section className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        O Teu Estilo
                      </h2>
                      <p className="text-xl text-[#1DB954] font-medium">
                        {moodDescription?.primary}
                      </p>
                      <p className="text-white/50 mt-1">
                        {moodDescription?.secondary} • {moodDescription?.fit}
                      </p>
                    </div>
                    
                    {/* Budget selector */}
                    <div className="flex gap-2">
                      {(['low', 'mid', 'high'] as const).map((b) => (
                        <button
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            budget === b
                              ? 'bg-white/20 text-white'
                              : 'bg-white/5 text-white/40 hover:text-white/60'
                          }`}
                        >
                          {b === 'low' ? '€' : b === 'mid' ? '€€' : '€€€'}
                        </button>
                      ))}
                    </div>
                    
                    {/* Generate look button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateStyle}
                      disabled={isGeneratingStyle}
                      className="px-8 py-4 bg-gradient-to-r from-[#1DB954] to-emerald-400 text-black font-bold rounded-full shadow-lg shadow-[#1DB954]/20 hover:shadow-[#1DB954]/40 transition-shadow disabled:opacity-50"
                    >
                      {isGeneratingStyle ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          A gerar...
                        </span>
                      ) : (
                        'Gerar Look ✨'
                      )}
                    </motion.button>
                  </div>
                  
                  <MoodDisplay moodProfile={moodProfile} />
                </section>
              )}
              
              {/* Style Profile (after generation) */}
              {styleProfile && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ColorPaletteDisplay palette={styleProfile.colorPalette} />
                    <StyleTags tags={styleTags} />
                  </div>
                  
                  {/* Social Share & Download */}
                  <div className="flex flex-col items-center gap-4 pt-4">
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
                </motion.section>
              )}
              
              {/* Outfit Recommendations */}
              {outfits.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Looks Recomendados
                  </h2>
                  
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
              
              {/* View Mode Toggle */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Explorar por
                  </h2>
                  <div className="flex gap-1 bg-white/5 rounded-full p-1">
                    <button
                      onClick={() => setViewMode('artists')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        viewMode === 'artists'
                          ? 'bg-[#1DB954] text-black'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      🎤 Artistas
                    </button>
                    <button
                      onClick={() => setViewMode('albums')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        viewMode === 'albums'
                          ? 'bg-[#1DB954] text-black'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      💿 Álbuns
                    </button>
                  </div>
                </div>
                
                {/* Artist View */}
                {viewMode === 'artists' && (
                  <ArtistView
                    artists={topArtists}
                    styleProfile={styleProfile}
                    onSelectArtist={setSelectedArtist}
                    selectedArtist={selectedArtist}
                  />
                )}
                
                {/* Album View */}
                {viewMode === 'albums' && (
                  <AlbumView
                    tracks={topTracks}
                    styleProfile={styleProfile}
                    onSelectAlbum={setSelectedAlbum}
                  />
                )}
              </section>
              
              {/* Virtual Closet Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    O Teu Armário Virtual
                  </h2>
                  <button
                    onClick={() => setShowCloset(!showCloset)}
                    className="px-4 py-2 bg-white/10 rounded-full text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    {showCloset ? 'Esconder' : 'Adicionar Roupa'} 📸
                  </button>
                </div>
                
                <AnimatePresence>
                  {showCloset && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-w-md"
                    >
                      <ClosetUpload />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
              
              {/* Genre Cloud */}
              {topGenres.length > 0 && (
                <section>
                  <GenreCloud genres={topGenres} />
                </section>
              )}
              
              {/* Top Tracks */}
              {topTracks.length > 0 && (
                <section>
                  <TopTracks 
                    tracks={topTracks}
                    onSelect={(track) => console.log('Selected track:', track.name)}
                  />
                </section>
              )}
              
              {/* Playlists */}
              {playlists.length > 0 && (
                <section>
                  <Playlists 
                    playlists={playlists}
                    onSelect={setSelectedPlaylist}
                  />
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white/30 text-sm">
            SoundStyle • Transforma a tua música em moda
          </p>
        </div>
      </footer>
    </div>
  );
}
