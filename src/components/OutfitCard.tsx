'use client';

import { motion } from 'framer-motion';
import { RecommendedItem, StyleProfile } from '@/types';

interface OutfitCardProps {
  outfit: {
    name: string;
    occasion: string;
    items: RecommendedItem[];
  };
  styleProfile: StyleProfile;
  index: number;
}

export default function OutfitCard({ outfit, styleProfile, index }: OutfitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
    >
      {/* Header with style colors */}
      <div 
        className="h-2"
        style={{
          background: `linear-gradient(90deg, ${styleProfile.colorPalette.primary}, ${styleProfile.colorPalette.secondary}, ${styleProfile.colorPalette.accent})`
        }}
      />
      
      <div className="p-6">
        {/* Outfit name & occasion */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{outfit.name}</h3>
            <p className="text-white/50 text-sm">{outfit.occasion}</p>
          </div>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
            {styleProfile.fit} fit
          </span>
        </div>
        
        {/* Items grid */}
        <div className="space-y-3">
          {outfit.items.map((item, itemIndex) => (
            <motion.div
              key={itemIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + itemIndex * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              {/* Item image placeholder */}
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: item.colors[0] || styleProfile.colorPalette.primary }}
              >
                <span className="text-2xl opacity-70">
                  {getCategoryIcon(item.category)}
                </span>
              </div>
              
              {/* Item details */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/40">{item.brand}</span>
                  {item.style && item.style.length > 0 && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-white/40 truncate">
                        {item.style.slice(0, 2).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">
                  {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                </p>
              </div>
              
              {/* Buy button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#1DB954] text-black text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Comprar
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        {/* Total */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/50">Total estimado</span>
          <span className="text-white font-bold text-lg">
            €{outfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </span>
        </div>
      </div>
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
