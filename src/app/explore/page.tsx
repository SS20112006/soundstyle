'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useSavedLooksStore } from '@/stores/savedLooksStore';

type SearchType = 'tracks' | 'artists' | 'playlists';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
  subtitle?: string;
  uri?: string;
}

export default function ExplorePage() {
  const { user } = useAppStore();
  const { looks: savedLooks, loadFromStorage } = useSavedLooksStore();

  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('tracks');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const tokensStr = localStorage.getItem('spotify_tokens');
      const headers: Record<string, string> = {};

      if (tokensStr) {
        const tokens = JSON.parse(tokensStr);
        headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }

      const response = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=20`,
        { headers }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      const items: SearchResult[] = [];

      if (data.tracks?.items) {
        data.tracks.items.forEach((track: any) => {
          items.push({
            id: track.id,
            name: track.name,
            type: 'track',
            imageUrl: track.album?.images?.[0]?.url,
            subtitle: track.artists?.map((a: any) => a.name).join(', '),
            uri: track.uri,
          });
        });
      }

      if (data.artists?.items) {
        data.artists.items.forEach((artist: any) => {
          items.push({
            id: artist.id,
            name: artist.name,
            type: 'artist',
            imageUrl: artist.images?.[0]?.url,
            subtitle: artist.genres?.slice(0, 2).join(', ') || 'Artist',
            uri: artist.uri,
          });
        });
      }

      if (data.playlists?.items) {
        data.playlists.items.forEach((playlist: any) => {
          items.push({
            id: playlist.id,
            name: playlist.name,
            type: 'playlist',
            imageUrl: playlist.images?.[0]?.url,
            subtitle: `${playlist.tracks?.total || 0} tracks`,
            uri: playlist.uri,
          });
        });
      }

      setResults(items);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              Dashboard
            </a>
            <a href="/explore" className="text-sm text-[#c4a882] font-medium">
              Explore
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
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-4xl font-bold tracking-tight">Explore Music</h1>
            <p className="text-white/50">Search for tracks, artists, and playlists to discover style inspiration</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Type Selector */}
            <div className="flex items-center justify-center gap-2">
              {(['tracks', 'artists', 'playlists'] as SearchType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    searchType === type
                      ? 'bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white'
                      : 'bg-white/[0.06] text-white/50 hover:text-white/80'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Search for ${searchType}...`}
                className="w-full px-6 py-4 pl-14 bg-white/[0.06] rounded-2xl border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#c4a882]/50 transition-colors text-lg"
                autoFocus
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] hover:from-[#d4b892] hover:to-[#9b7f6c] rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-12"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
                </div>
              </motion.div>
            ) : hasSearched && results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white/40 text-lg">No results found</p>
                <p className="text-white/25 text-sm mt-1">Try a different search term</p>
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-white/40 text-sm">{results.length} results found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((result, index) => (
                    <motion.a
                      key={result.id}
                      href={result.uri ? `https://open.spotify.com/${result.type}/${result.id}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#c4a882]/30 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.06] flex-shrink-0">
                        {result.imageUrl ? (
                          <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30">
                            {result.type === 'track' ? '🎵' : result.type === 'artist' ? '👤' : '📋'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-[#c4a882] transition-colors">
                          {result.name}
                        </p>
                        <p className="text-white/40 text-sm truncate">{result.subtitle}</p>
                      </div>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-[#c4a882] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ) : null}
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
