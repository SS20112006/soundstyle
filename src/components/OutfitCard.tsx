'use client';

import { motion } from 'framer-motion';
import { RecommendedItem, StyleProfile } from '@/types';
import { STORES } from '@/lib/affiliateLinks';
import { useSavedLooksStore } from '@/stores/savedLooksStore';

interface OutfitCardProps {
  outfit: {
    name: string;
    occasion: string;
    items: RecommendedItem[];
  };
  styleProfile: StyleProfile;
  index: number;
  source?: {
    type: 'playlist' | 'artist' | 'track' | 'generated';
    name: string;
    imageUrl?: string;
  };
}

export default function OutfitCard({ outfit, styleProfile, index, source }: OutfitCardProps) {
  const { saveLook, looks } = useSavedLooksStore();

  // Check if this outfit is already saved
  const isSaved = looks.some(
    (look) => look.name === outfit.name && look.occasion === outfit.occasion
  );

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) return;

    saveLook({
      name: outfit.name,
      occasion: outfit.occasion,
      items: outfit.items,
      styleProfile,
      source: source || { type: 'generated', name: 'Generated Look' },
    });
  };
  const { primary, secondary, accent } = styleProfile.colorPalette;
  
  // Pinterest-style masonry layout: different heights for visual interest
  const layoutClasses = [
    'col-span-2 row-span-2', // hero item
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="w-full"
    >
      {/* Outfit Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{outfit.name}</h3>
          <p className="text-white/40 text-sm">{outfit.occasion} · {styleProfile.fit} fit</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isSaved
                ? 'bg-[#c4a882]/20 text-[#c4a882] border border-[#c4a882]/30'
                : 'bg-white/[0.06] text-white/50 border border-white/[0.08] hover:text-[#c4a882] hover:border-[#c4a882]/30'
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill={isSaved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isSaved ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {isSaved ? 'Saved ✓' : 'Save'}
          </motion.button>
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: `conic-gradient(${primary}, ${secondary}, ${accent}, ${primary})`
            }}
          />
        </div>
      </div>
      
      {/* Pinterest-style Grid */}
      <div className="grid grid-cols-3 gap-2 auto-rows-[120px]">
        {outfit.items.map((item, itemIndex) => {
          const layoutClass = layoutClasses[itemIndex % layoutClasses.length];
          const storeKey = getStoreKey(item.brand);
          const searchUrl = storeKey 
            ? `${STORES[storeKey]?.searchUrl || '#'}${encodeURIComponent(item.name)}`
            : '#';
          const storeLogo = storeKey ? STORES[storeKey]?.logo : undefined;
          
          return (
            <motion.a
              key={itemIndex}
              href={item.affiliateUrl || searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + itemIndex * 0.08 }}
              className={`
                ${layoutClass}
                relative rounded-xl overflow-hidden group cursor-pointer
                border border-white/[0.06] hover:border-white/[0.15]
                transition-all duration-300
              `}
            >
              {/* Background with color gradient */}
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(135deg, ${item.colors?.[0] || primary}33, ${item.colors?.[1] || secondary}22)` 
                }}
              />
              
              {/* Category icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                  {getCategoryEmoji(item.category)}
                </span>
              </div>
              
              {/* Hover overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                            opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Store logo (top right) */}
              {storeLogo && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm 
                              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <img 
                    src={storeLogo} 
                    alt={item.brand} 
                    className="w-4 h-4 rounded-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              
              {/* Item info (bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/50 text-[10px] uppercase tracking-wider">{item.brand}</span>
                  <span className="text-white font-bold text-sm">
                    {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* "Shop" indicator */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#c4a882]/80 backdrop-blur-sm rounded-full 
                            text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Shop →
              </div>
            </motion.a>
          );
        })}
      </div>
      
      {/* Total bar */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-white/30 text-xs uppercase tracking-wider">
          {outfit.items.length} peças
        </span>
        <span className="text-white/60 text-sm font-medium">
          Total: €{outfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    tops: '👕',
    bottoms: '👖',
    shoes: '👟',
    outerwear: '🧥',
    accessories: '💎',
    dresses: '👗',
  };
  return emojis[category] || '👕';
}

function getStoreKey(brand: string): string | null {
  const brandLower = brand.toLowerCase();
  const mapping: Record<string, string> = {
    'zara': 'zara',
    'h&m': 'hm',
    'hm': 'hm',
    'asos': 'asos',
    'nike': 'nike',
    'adidas': 'adidas',
    'uniqlo': 'uniqlo',
    'cos': 'cos',
    'mango': 'mango',
    'massimo dutti': 'massimodutti',
    'pull&bear': 'pullandbear',
    'pullandbear': 'pullandbear',
    'bershka': 'bershka',
    'stradivarius': 'stradivarius',
  };
  return mapping[brandLower] || null;
}
