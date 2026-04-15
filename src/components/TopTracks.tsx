'use client';

import { motion } from 'framer-motion';
import { SpotifyTrack } from '@/types';

interface TopTracksProps {
  tracks: SpotifyTrack[];
  onSelect?: (track: SpotifyTrack) => void;
}

export default function TopTracks({ tracks, onSelect }: TopTracksProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
        Top Músicas
      </h3>
      
      <div className="space-y-2">
        {tracks.slice(0, 10).map((track, index) => (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect?.(track)}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {/* Rank */}
            <span className="text-white/30 font-mono text-sm w-6 text-right">
              {index + 1}
            </span>
            
            {/* Album art */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {track.album.images[0] ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600" />
              )}
            </div>
            
            {/* Track info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-medium truncate group-hover:text-[#c4a882] transition-colors">
                {track.name}
              </p>
              <p className="text-white/50 text-sm truncate">
                {track.artists.map(a => a.name).join(', ')}
              </p>
            </div>
            
            {/* Album name */}
            <p className="text-white/30 text-sm truncate max-w-[150px] hidden md:block">
              {track.album.name}
            </p>
            
            {/* Duration */}
            <span className="text-white/30 text-sm font-mono">
              {formatDuration(track.duration_ms)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
