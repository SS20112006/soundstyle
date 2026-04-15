'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { STORES } from '@/lib/affiliateLinks';

interface NowPlayingTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  progress_ms: number;
  popularity: number;
}

interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
}

interface NowPlayingData {
  isPlaying: boolean;
  track: NowPlayingTrack | null;
  audioFeatures: AudioFeatures | null;
  device: {
    name: string;
    type: string;
    volume: number;
  } | null;
}

interface GeneratedOutfit {
  style: string;
  items: {
    name: string;
    category: string;
    brand: string;
    price: number;
    color: string;
    store: string;
  }[];
}

interface NowPlayingProps {
  onOutfitGenerated?: (outfit: GeneratedOutfit) => void;
}

export default function NowPlaying({ onOutfitGenerated }: NowPlayingProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fetch now playing data
  const fetchNowPlaying = async () => {
    try {
      const tokensStr = localStorage.getItem('spotify_tokens');
      if (!tokensStr) return;

      const tokens = JSON.parse(tokensStr);
      const response = await fetch('/api/spotify/now-playing', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNowPlaying(data);
        
        // Generate outfit if track is playing and we have audio features
        if (data.isPlaying && data.track && data.audioFeatures) {
          generateOutfitFromTrack(data.track, data.audioFeatures);
        }
      } else if (response.status === 401) {
        // Token expired, could refresh here
        setError('Session expired. Please reconnect.');
      }
    } catch (err) {
      console.error('Failed to fetch now playing:', err);
      setError('Failed to fetch now playing');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate outfit based on track audio features
  const generateOutfitFromTrack = (track: NowPlayingTrack, features: AudioFeatures) => {
    const style = getStyleFromFeatures(features);
    const colors = getColorsFromFeatures(features);
    const items = generateOutfitItems(style, colors);
    
    const outfit: GeneratedOutfit = {
      style,
      items,
    };
    
    setGeneratedOutfit(outfit);
    onOutfitGenerated?.(outfit);
  };

  // Map audio features to style
  const getStyleFromFeatures = (features: AudioFeatures): string => {
    const { energy, valence, danceability, acousticness } = features;
    
    if (energy > 0.7 && valence < 0.4) return 'Cyber-Gothic';
    if (energy > 0.7 && valence > 0.6) return 'Street Pop';
    if (energy < 0.4 && valence < 0.4) return 'Dark Minimal';
    if (energy < 0.4 && valence > 0.6) return 'Soft Scandinavian';
    if (danceability > 0.7) return 'Y2K Club';
    if (acousticness > 0.6) return 'Boho Folk';
    if (valence > 0.5) return 'Smart Casual';
    return 'Versatile';
  };

  // Get colors from audio features
  const getColorsFromFeatures = (features: AudioFeatures): string[] => {
    const { energy, valence, danceability } = features;
    
    // High energy + low valence = dark/neon
    if (energy > 0.7 && valence < 0.4) {
      return ['#0a0a0a', '#e94560', '#00ff41', '#1a1a2e'];
    }
    // High energy + high valence = vibrant
    if (energy > 0.7 && valence > 0.6) {
      return ['#ff4500', '#1e90ff', '#ffd700', '#ffffff'];
    }
    // Low energy + low valence = muted
    if (energy < 0.4 && valence < 0.4) {
      return ['#1a1a1a', '#2d2d2d', '#8b0000', '#4a4a4a'];
    }
    // Low energy + high valence = soft
    if (energy < 0.4 && valence > 0.6) {
      return ['#f5f5dc', '#d2b48c', '#8fbc8f', '#ffffff'];
    }
    // High danceability = colorful
    if (danceability > 0.7) {
      return ['#ff69b4', '#00ced1', '#ffd700', '#f0f0f0'];
    }
    // Default
    return ['#c4a882', '#8b6f5c', '#d4a574', '#ffffff'];
  };

  // Generate outfit items based on style
  const generateOutfitItems = (style: string, colors: string[]): GeneratedOutfit['items'] => {
    const styleItems: Record<string, { name: string; category: string }[]> = {
      'Cyber-Gothic': [
        { name: 'Bomber Jacket', category: 'outerwear' },
        { name: 'Cargo Pants', category: 'bottoms' },
        { name: 'Tech Sneakers', category: 'shoes' },
        { name: 'Chain Necklace', category: 'accessories' },
      ],
      'Street Pop': [
        { name: 'Oversized Hoodie', category: 'outerwear' },
        { name: 'Wide Leg Pants', category: 'bottoms' },
        { name: 'Chunky Sneakers', category: 'shoes' },
        { name: 'Cap', category: 'accessories' },
      ],
      'Dark Minimal': [
        { name: 'Trench Coat', category: 'outerwear' },
        { name: 'Slim Trousers', category: 'bottoms' },
        { name: 'Chelsea Boots', category: 'shoes' },
        { name: 'Minimal Watch', category: 'accessories' },
      ],
      'Soft Scandinavian': [
        { name: 'Cashmere Sweater', category: 'tops' },
        { name: 'Relaxed Trousers', category: 'bottoms' },
        { name: 'White Sneakers', category: 'shoes' },
        { name: 'Leather Tote', category: 'accessories' },
      ],
      'Y2K Club': [
        { name: 'Baby Tee', category: 'tops' },
        { name: 'Low-Rise Jeans', category: 'bottoms' },
        { name: 'Platform Shoes', category: 'shoes' },
        { name: 'Butterfly Clips', category: 'accessories' },
      ],
      'Boho Folk': [
        { name: 'Embroidered Blouse', category: 'tops' },
        { name: 'Bell-Bottom Jeans', category: 'bottoms' },
        { name: 'Suede Boots', category: 'shoes' },
        { name: 'Layered Necklaces', category: 'accessories' },
      ],
      'Smart Casual': [
        { name: 'Oxford Shirt', category: 'tops' },
        { name: 'Chinos', category: 'bottoms' },
        { name: 'Derby Shoes', category: 'shoes' },
        { name: 'Leather Watch', category: 'accessories' },
      ],
      'Versatile': [
        { name: 'Graphic Tee', category: 'tops' },
        { name: 'Jeans', category: 'bottoms' },
        { name: 'Sneakers', category: 'shoes' },
        { name: 'Crossbody Bag', category: 'accessories' },
      ],
    };

    const items = styleItems[style] || styleItems['Versatile'];
    const stores = ['zara', 'hm', 'asos', 'nike'];
    
    return items.map((item, index) => {
      const store = stores[index % stores.length];
      const storeConfig = STORES[store];
      
      return {
        ...item,
        brand: storeConfig?.name || 'Various',
        price: Math.round((20 + Math.random() * 80) * 100) / 100,
        color: colors[index % colors.length],
        store,
      };
    });
  };

  // Update progress bar
  useEffect(() => {
    if (nowPlaying?.isPlaying && nowPlaying.track) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1000;
          if (newProgress >= (nowPlaying.track?.duration_ms || 0)) {
            return 0;
          }
          return newProgress;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [nowPlaying?.isPlaying, nowPlaying?.track?.duration_ms]);

  // Fetch on mount and set interval for updates
  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Update progress when track changes
  useEffect(() => {
    if (nowPlaying?.track?.progress_ms) {
      setProgress(nowPlaying.track.progress_ms);
    }
  }, [nowPlaying?.track?.progress_ms]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMoodEmoji = (features: AudioFeatures | null): string => {
    if (!features) return '🎵';
    if (features.energy > 0.7 && features.valence > 0.6) return '🔥';
    if (features.energy > 0.7 && features.valence < 0.4) return '💀';
    if (features.energy < 0.4 && features.valence > 0.6) return '☀️';
    if (features.energy < 0.4 && features.valence < 0.4) return '🌧️';
    if (features.danceability > 0.7) return '💃';
    return '🎵';
  };

  if (isLoading) {
    return (
      <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#c4a882] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06]">
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!nowPlaying?.isPlaying || !nowPlaying.track) {
    return (
      <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06]">
        <div className="text-center py-4">
          <span className="text-4xl mb-3 block">🎧</span>
          <p className="text-white/50 text-sm">Nothing playing right now</p>
          <p className="text-white/30 text-xs mt-1">Play something on Spotify to see your style</p>
        </div>
      </div>
    );
  }

  const { track, audioFeatures, device } = nowPlaying;
  const albumImage = track.album.images?.[0]?.url;
  const progressPercent = track.duration_ms > 0 ? (progress / track.duration_ms) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.08]"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-white/50 uppercase tracking-wider">Now Playing</span>
        </div>
        {device && (
          <span className="text-xs text-white/30">on {device.name}</span>
        )}
      </div>

      {/* Track Info */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Album Art */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative group">
            {albumImage ? (
              <img src={albumImage} alt={track.album.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/[0.06] flex items-center justify-center text-3xl">
                🎵
              </div>
            )}
            {/* Playing animation */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{
                      height: [8, 16, 8],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Track Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{track.name}</h3>
            <p className="text-sm text-white/50 truncate">
              {track.artists.map(a => a.name).join(', ')}
            </p>
            <p className="text-xs text-white/30 mt-1 truncate">{track.album.name}</p>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#c4a882] to-[#8b6f5c]"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-white/30">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(track.duration_ms)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Features Meters */}
        {audioFeatures && (
          <div className="mt-5 grid grid-cols-4 gap-3">
            {[
              { label: 'Energy', value: audioFeatures.energy, icon: '⚡' },
              { label: 'Dance', value: audioFeatures.danceability, icon: '💃' },
              { label: 'Mood', value: audioFeatures.valence, icon: getMoodEmoji(audioFeatures) },
              { label: 'Acoustic', value: audioFeatures.acousticness, icon: '🎸' },
            ].map((feature) => (
              <div key={feature.label} className="text-center">
                <div className="text-lg mb-1">{feature.icon}</div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c4a882] transition-all duration-500"
                    style={{ width: `${feature.value * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-white/40 mt-1">{feature.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generated Outfit Preview */}
      <AnimatePresence>
        {generatedOutfit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.06]"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/50 uppercase tracking-wider">
                  Outfit for this track
                </span>
                <span className="px-2 py-0.5 bg-[#c4a882]/20 text-[#c4a882] text-xs rounded-full">
                  {generatedOutfit.style}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {generatedOutfit.items.map((item, index) => (
                  <motion.a
                    key={index}
                    href={`${STORES[item.store]?.searchUrl || '#'}${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border border-white/[0.06] hover:border-[#c4a882]/40 transition-all"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">
                      {item.category === 'tops' || item.category === 'outerwear' ? '👕' :
                       item.category === 'bottoms' ? '👖' :
                       item.category === 'shoes' ? '👟' : '💎'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-[8px] font-medium truncate">{item.name}</p>
                      <p className="text-white/50 text-[6px]">€{item.price.toFixed(2)}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/30">
                  {generatedOutfit.items.length} pieces
                </span>
                <span className="text-white/60">
                  Total: €{generatedOutfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
