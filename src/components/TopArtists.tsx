'use client';

import { motion } from 'framer-motion';
import { SpotifyArtist } from '@/types';

interface TopArtistsProps {
  artists: SpotifyArtist[];
  onSelect?: (artist: SpotifyArtist) => void;
}

export default function TopArtists({ artists, onSelect }: TopArtistsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
        Top Artistas
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {artists.map((artist, index) => (
          <motion.button
            key={artist.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect?.(artist)}
            className="flex-shrink-0 group"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#1DB954] transition-all duration-300">
              {artist.images[0] ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-3xl">🎵</span>
                </div>
              )}
            </div>
            
            <p className="text-white text-sm font-medium mt-2 text-center truncate max-w-24 md:max-w-32">
              {artist.name}
            </p>
            
            {artist.genres[0] && (
              <p className="text-white/40 text-xs text-center truncate max-w-24 md:max-w-32">
                {artist.genres[0]}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
