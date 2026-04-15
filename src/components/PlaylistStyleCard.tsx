'use client';

import { motion } from 'framer-motion';
import { RecommendedItem } from '@/types';

interface Playlist {
  name: string;
  imageUrl: string;
  trackCount: number;
}

interface StyleContext {
  name: string;
  description: string;
  suggestedItems: RecommendedItem[];
}

interface PlaylistStyleCardProps {
  playlist: Playlist;
  styleContext: StyleContext;
  index?: number;
}

export default function PlaylistStyleCard({
  playlist,
  styleContext,
  index = 0
}: PlaylistStyleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Header with playlist cover */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Playlist info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-1 truncate">
              {playlist.name}
            </h3>
            <p className="text-white/50 text-sm">
              {playlist.trackCount} tracks
            </p>
          </motion.div>
        </div>

        {/* Style context badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="absolute top-4 right-4"
        >
          <span className="px-3 py-1.5 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white text-xs font-semibold rounded-full shadow-lg">
            {styleContext.name}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Style description */}
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {styleContext.description}
        </p>

        {/* Suggested items */}
        {styleContext.suggestedItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white/40 text-xs font-medium uppercase tracking-wider">
              Suggested Items
            </h4>
            
            <div className="space-y-2">
              {styleContext.suggestedItems.slice(0, 3).map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 + itemIndex * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                >
                  {/* Item color swatch */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-white/[0.08]"
                    style={{ backgroundColor: item.colors[0] || '#c4a882' }}
                  >
                    <span className="text-lg">
                      {getCategoryIcon(item.category)}
                    </span>
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-white/40 text-xs">{item.brand}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#c4a882] text-sm font-semibold">
                      {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {styleContext.suggestedItems.length > 3 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 py-2.5 text-[#c4a882] text-sm font-medium rounded-xl border border-[#c4a882]/20 hover:bg-[#c4a882]/10 transition-colors"
              >
                View {styleContext.suggestedItems.length - 3} more items
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Bottom gradient bar */}
      <div
        className="h-1"
        style={{
          background: 'linear-gradient(90deg, #c4a882, #8b6f5c, #d4a574)'
        }}
      />
    </motion.div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    tops: '👕',
    bottoms: '👖',
    shoes: '👟',
    outerwear: '🧥',
    accessories: '💎',
    dresses: '👗',
  };
  return icons[category] || '👕';
}
