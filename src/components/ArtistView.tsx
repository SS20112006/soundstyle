'use client';

import { motion } from 'framer-motion';
import { SpotifyArtist, StyleProfile, RecommendedItem } from '@/types';
import ProductCard from './ProductCard';

interface ArtistViewProps {
  artists: SpotifyArtist[];
  styleProfile: StyleProfile | null;
  onSelectArtist?: (artist: SpotifyArtist) => void;
  selectedArtist?: SpotifyArtist | null;
  artistLooks?: RecommendedItem[];
}

export default function ArtistView({ 
  artists, 
  styleProfile, 
  onSelectArtist, 
  selectedArtist,
  artistLooks 
}: ArtistViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Looks por Artista</h3>
          <p className="text-white/50 text-sm mt-1">
            Street style dos teus artistas favoritos
          </p>
        </div>
      </div>

      {/* Artist Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
        {artists.slice(0, 10).map((artist, index) => (
          <motion.button
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectArtist?.(artist)}
            className={`
              flex-shrink-0 group text-center
              ${selectedArtist?.id === artist.id ? 'ring-2 ring-[#c4a882] rounded-2xl' : ''}
            `}
          >
            {/* Artist Image */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden mb-2 shadow-lg">
              {artist.images[0] ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div 
                  className="w-full h-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${styleProfile?.colorPalette.primary || '#333'}, ${styleProfile?.colorPalette.secondary || '#555'})` 
                  }}
                />
              )}
              
              {/* Selected Indicator */}
              {selectedArtist?.id === artist.id && (
                <div className="absolute inset-0 bg-[#c4a882]/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#c4a882] flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {/* Artist Info */}
            <p className="text-white text-sm font-medium truncate max-w-28 md:max-w-32 group-hover:text-[#c4a882] transition-colors">
              {artist.name}
            </p>
            {artist.genres?.[0] && (
              <p className="text-white/40 text-xs truncate max-w-28 md:max-w-32">
                {artist.genres?.[0]}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Artist Details */}
      {selectedArtist && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
        >
          <div className="flex items-start gap-6">
            {/* Artist Large Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
              {selectedArtist.images[0] ? (
                <img
                  src={selectedArtist.images[0].url}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600" />
              )}
            </div>
            
            {/* Artist Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-2xl font-bold text-white mb-1">{selectedArtist.name}</h4>
              <p className="text-white/50 mb-3">
                {selectedArtist.followers?.total?.toLocaleString()} seguidores • 
                Popularidade: {selectedArtist.popularity}/100
              </p>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedArtist.genres?.slice(0, 5).map((genre, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-[#c4a882] to-emerald-400 text-black font-semibold rounded-full shadow-lg"
              >
                Gerar Look do {selectedArtist.name.split(' ')[0]} ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Generated Artist Looks */}
      {artistLooks && artistLooks.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-bold text-white mb-6">
            Look inspirado em {selectedArtist?.name}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artistLooks.map((item, idx) => (
              <ProductCard key={item.id || idx} item={item} index={idx} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
