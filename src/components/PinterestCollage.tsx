'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RecommendedItem } from '@/types';
import { STORES } from '@/lib/affiliateLinks';

interface PinterestCollageProps {
  items: RecommendedItem[];
  title: string;
  sourceName?: string;
  sourceImage?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function PinterestCollage({
  items,
  title,
  sourceName,
  sourceImage,
  onSave,
  isSaved = false,
}: PinterestCollageProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      tops: '👕',
      bottoms: '👖',
      shoes: '👟',
      outerwear: '🧥',
      accessories: '💎',
      dresses: '👗',
    };
    return emojis[category] || '👕';
  };

  const getStoreLogo = (storeKey: string): string => {
    return STORES[storeKey]?.logo || '';
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  // Create masonry layout positions
  const getMasonryStyles = (index: number) => {
    const layouts = [
      { gridColumn: 'span 2', gridRow: 'span 2' }, // Hero
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 1' },
    ];
    return layouts[index % layouts.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Header */}
      <div className="relative p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sourceImage && (
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img src={sourceImage} alt={sourceName || ''} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {sourceName && (
                <p className="text-sm text-white/50">{sourceName}</p>
              )}
            </div>
          </div>
          
          {onSave && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
              className={`p-2 rounded-full transition-all ${
                isSaved
                  ? 'bg-[#c4a882]/20 text-[#c4a882]'
                  : 'bg-white/[0.06] text-white/50 hover:text-[#c4a882]'
              }`}
            >
              <svg
                className="w-5 h-5"
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
            </motion.button>
          )}
        </div>
      </div>

      {/* Pinterest-style Collage Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 auto-rows-[100px]">
          {items.slice(0, expanded ? items.length : 6).map((item, index) => {
            const storeLogo = getStoreLogo(item.store);
            const isSelected = selectedItem === index;
            
            return (
              <motion.a
                key={index}
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={getMasonryStyles(index)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(isSelected ? null : index);
                }}
                className={`
                  relative rounded-xl overflow-hidden group cursor-pointer
                  border-2 transition-all duration-300
                  ${isSelected 
                    ? 'border-[#c4a882] ring-2 ring-[#c4a882]/30' 
                    : 'border-white/[0.06] hover:border-white/[0.15]'
                  }
                `}
              >
                {/* Product visual */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${item.colors?.[0] || '#c4a882'}33, ${item.colors?.[1] || '#8b6f5c'}22)`,
                  }}
                />
                
                {/* Category icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                    {getCategoryEmoji(item.category)}
                  </span>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Store logo */}
                {storeLogo && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm 
                                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <img 
                      src={storeLogo} 
                      alt={item.brand} 
                      className="w-3 h-3 rounded-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}
                
                {/* Shop indicator */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#c4a882]/80 backdrop-blur-sm rounded-full 
                              text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop →
                </div>
                
                {/* Item info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-white/50 text-[10px] uppercase tracking-wider">{item.brand}</span>
                    <span className="text-white font-bold text-xs">
                      {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#c4a882] flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.a>
            );
          })}
        </div>
        
        {/* Show more/less button */}
        {items.length > 6 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 py-2.5 text-[#c4a882] text-sm font-medium rounded-xl border border-[#c4a882]/20 hover:bg-[#c4a882]/10 transition-colors"
          >
            {expanded ? 'Show less' : `View ${items.length - 6} more items`}
          </motion.button>
        )}
      </div>

      {/* Selected item detail panel */}
      <AnimatePresence>
        {selectedItem !== null && items[selectedItem] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.06] overflow-hidden"
          >
            <div className="p-4 bg-white/[0.02]">
              <div className="flex items-start gap-4">
                {/* Product preview */}
                <div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${items[selectedItem].colors?.[0] || '#c4a882'}33, ${items[selectedItem].colors?.[1] || '#8b6f5c'}22)`,
                  }}
                >
                  {getCategoryEmoji(items[selectedItem].category)}
                </div>
                
                {/* Product details */}
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{items[selectedItem].name}</h4>
                  <p className="text-white/50 text-sm">{items[selectedItem].brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#c4a882] font-bold text-lg">
                      {items[selectedItem].currency === 'EUR' ? '€' : '$'}{items[selectedItem].price.toFixed(2)}
                    </span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/50 text-xs uppercase">{items[selectedItem].category}</span>
                  </div>
                  
                  {/* Style tags */}
                  {items[selectedItem].style && items[selectedItem].style.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {items[selectedItem].style.slice(0, 3).map((tag, i) => (
                        <span 
                          key={i}
                          className="px-2 py-0.5 bg-white/[0.06] rounded-full text-[10px] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Shop button */}
                <a
                  href={items[selectedItem].affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with total */}
      <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs uppercase tracking-wider">
            {items.length} pieces
          </span>
          <div className="flex -space-x-2">
            {items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#1a1a1a]"
                style={{ backgroundColor: item.colors?.[0] || '#c4a882' }}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs">Total</p>
          <p className="text-white font-bold text-lg">€{total.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}
