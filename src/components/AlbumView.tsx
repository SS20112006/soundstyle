'use client';

import { motion } from 'framer-motion';
import { SpotifyTrack, SpotifyAlbum, StyleProfile, RecommendedItem } from '@/types';
import ProductCard from './ProductCard';

interface AlbumViewProps {
  tracks: SpotifyTrack[];
  styleProfile: StyleProfile | null;
  onSelectAlbum?: (album: SpotifyAlbum) => void;
  generatedLooks?: Map<string, RecommendedItem[]>;
}

export default function AlbumView({ tracks, styleProfile, onSelectAlbum, generatedLooks }: AlbumViewProps) {
  // Get unique albums from tracks
  const albums = tracks.reduce((acc, track) => {
    if (track.album && !acc.find(a => a.id === track.album.id)) {
      acc.push(track.album);
    }
    return acc;
  }, [] as SpotifyAlbum[]).slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Looks por Álbum</h3>
          <p className="text-white/50 text-sm mt-1">
            Inspiração visual das tuas capas favoritas
          </p>
        </div>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectAlbum?.(album)}
            className="group cursor-pointer"
          >
            {/* Album Art */}
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-xl">
              {album.images[0] ? (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div 
                  className="w-full h-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${styleProfile?.colorPalette.primary || '#333'}, ${styleProfile?.colorPalette.accent || '#666'})` 
                  }}
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm truncate">{album.name}</p>
                  <p className="text-white/70 text-xs truncate">
                    {album.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
              </div>

              {/* Play/Generate Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-2xl"
                >
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Album Info */}
            <div className="space-y-1">
              <p className="text-white font-medium text-sm truncate group-hover:text-[#1DB954] transition-colors">
                {album.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">
                  {album.release_date?.split('-')[0]}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-xs">
                  {album.total_tracks} músicas
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generated Looks for Selected Album */}
      {generatedLooks && generatedLooks.size > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-xl font-bold text-white mb-6">
            Peças inspiradas neste álbum
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from(generatedLooks.values()).flat().slice(0, 4).map((item, idx) => (
              <ProductCard key={item.id || idx} item={item} index={idx} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
