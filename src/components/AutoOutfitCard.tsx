'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RecommendedItem } from '@/types';
import { STORES } from '@/lib/affiliateLinks';
import PinterestCollage from './PinterestCollage';

interface AutoOutfitCardProps {
  source: {
    type: 'artist' | 'track' | 'playlist';
    name: string;
    imageUrl?: string;
    id?: string;
  };
  items: RecommendedItem[];
  styleName: string;
  index?: number;
  onSave?: () => void;
  isSaved?: boolean;
}

interface EnhancedItem extends RecommendedItem {
  realImageUrl?: string;
  productUrl?: string;
}

export default function AutoOutfitCard({
  source,
  items,
  styleName,
  index = 0,
  onSave,
  isSaved = false,
}: AutoOutfitCardProps) {
  const [enhancedItems, setEnhancedItems] = useState<EnhancedItem[]>(items);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'collage'>('card');

  // Fetch real product images
  useEffect(() => {
    const fetchProductImages = async () => {
      setIsLoadingImages(true);
      try {
        const enhanced = await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(
                `/api/products/search?q=${encodeURIComponent(item.name)}&store=${item.store}&limit=1`
              );
              if (response.ok) {
                const data = await response.json();
                if (data.products && data.products.length > 0) {
                  return {
                    ...item,
                    realImageUrl: data.products[0].imageUrl,
                    productUrl: data.products[0].productUrl,
                  };
                }
              }
            } catch (err) {
              console.error(`Failed to fetch image for ${item.name}:`, err);
            }
            return item;
          })
        );
        setEnhancedItems(enhanced);
      } catch (err) {
        console.error('Error fetching product images:', err);
      } finally {
        setIsLoadingImages(false);
      }
    };

    if (items.length > 0) {
      fetchProductImages();
    }
  }, [items]);

  const getSourceIcon = (): string => {
    switch (source.type) {
      case 'artist': return '🎤';
      case 'track': return '🎵';
      case 'playlist': return '📋';
      default: return '🎵';
    }
  };

  // Use PinterestCollage for the view
  if (viewMode === 'collage') {
    return (
      <div className="space-y-4">
        {/* Toggle button */}
        <div className="flex justify-end">
          <button
            onClick={() => setViewMode('card')}
            className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-all"
          >
            ← Back to Card View
          </button>
        </div>
        
        <PinterestCollage
          items={enhancedItems}
          title={`${source.name} Look`}
          sourceName={styleName}
          sourceImage={source.imageUrl}
          onSave={onSave}
          isSaved={isSaved}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Header with source info */}
      <div className="relative p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          {/* Source image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.06]">
            {source.imageUrl ? (
              <img src={source.imageUrl} alt={source.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {getSourceIcon()}
              </div>
            )}
          </div>
          
          {/* Source info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getSourceIcon()}</span>
              <span className="text-xs text-white/50 uppercase tracking-wider">
                {source.type === 'artist' ? 'Based on Artist' : source.type === 'track' ? 'Based on Track' : 'Playlist Style'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white truncate mt-1">
              {source.name}
            </h3>
            <p className="text-sm text-[#c4a882]">{styleName}</p>
          </div>
          
          {/* View mode toggle */}
          <button
            onClick={() => setViewMode('collage')}
            className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-all"
          >
            Collage View →
          </button>
          
          {/* Save button */}
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

      {/* Product grid with real images */}
      <div className="p-4">
        {isLoadingImages ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <div className="w-4 h-4 border-2 border-white/20 border-t-[#c4a882] rounded-full animate-spin" />
              Loading product images...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {enhancedItems.slice(0, 4).map((item, itemIndex) => {
              const storeLogo = STORES[item.store]?.logo || '';
              
              return (
                <motion.a
                  key={itemIndex}
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + itemIndex * 0.08 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    relative rounded-xl overflow-hidden group cursor-pointer
                    border border-white/[0.06] hover:border-[#c4a882]/40
                    transition-all duration-300
                    ${itemIndex === 0 ? 'col-span-2 row-span-2' : ''}
                  `}
                >
                  {/* Product image */}
                  <div className="relative aspect-square bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
                    <img
                      src={item.realImageUrl || generatePlaceholder(item.category, item.colors?.[0])}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    
                    {/* Store logo */}
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
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Shop indicator */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#c4a882]/80 backdrop-blur-sm rounded-full 
                                  text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop →
                    </div>
                    
                    {/* Item details */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-white/50 text-[10px] uppercase tracking-wider">{item.brand}</span>
                        <span className="text-white font-bold text-sm">
                          {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with total */}
      <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs uppercase tracking-wider">
            {enhancedItems.length} pieces
          </span>
          <div className="flex -space-x-2">
            {enhancedItems.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#1a1a1a] overflow-hidden"
                style={{ backgroundColor: item.colors?.[0] || '#c4a882' }}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs">Total</p>
          <p className="text-white font-bold text-lg">€{enhancedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}

function generatePlaceholder(category: string, color?: string): string {
  const categoryEmoji: Record<string, string> = {
    tops: '👕',
    bottoms: '👖',
    shoes: '👟',
    outerwear: '🧥',
    accessories: '💎',
    dresses: '👗',
  };
  
  const bgColor = color || '#c4a882';
  const emoji = categoryEmoji[category] || '👕';
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}20"/>
      <rect x="10" y="10" width="180" height="180" rx="12" fill="${bgColor}40"/>
      <text x="100" y="110" font-size="60" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>
  `)}`;
}
