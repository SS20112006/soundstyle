'use client';

import { motion } from 'framer-motion';
import { SpotifyPlaylist } from '@/types';

interface PlaylistsProps {
  playlists: SpotifyPlaylist[];
  onSelect?: (playlist: SpotifyPlaylist) => void;
}

export default function Playlists({ playlists, onSelect }: PlaylistsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
        Tuas Playlists
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((playlist, index) => (
          <motion.button
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect?.(playlist)}
            className="group text-left"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 shadow-lg">
              {playlist.images[0] ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                  <span className="text-5xl">🎵</span>
                </div>
              )}
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#c4a882] flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <p className="text-white font-medium truncate group-hover:text-[#c4a882] transition-colors">
              {playlist.name}
            </p>
            <p className="text-white/40 text-sm truncate">
              {playlist.tracks.total} músicas
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
