'use client';

import { motion } from 'framer-motion';
import { StyleProfile, ColorPalette, RecommendedItem } from '@/types';
import { useState } from 'react';

interface Outfit {
  name: string;
  occasion: string;
  items: RecommendedItem[];
}

interface LookbookViewProps {
  userName: string;
  styleProfile: StyleProfile;
  outfits: Outfit[];
  onShare?: () => void;
  onDownload?: () => void;
}

export default function LookbookView({
  userName,
  styleProfile,
  outfits,
  onShare,
  onDownload
}: LookbookViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      onShare?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      onDownload?.();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/40 text-sm mb-1">{currentDate}</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {userName}&apos;s Lookbook
            </h1>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isGenerating}
              className="p-3 bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isGenerating}
              className="p-3 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Style Profile Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 p-6 bg-white/[0.03] rounded-3xl border border-white/[0.06]"
      >
        <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
          Style Profile
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aesthetic */}
          <div>
            <p className="text-white/40 text-sm mb-1">Aesthetic</p>
            <p className="text-xl font-bold text-[#c4a882]">{styleProfile.aesthetic}</p>
          </div>
          
          {/* Mood */}
          <div>
            <p className="text-white/40 text-sm mb-1">Mood</p>
            <p className="text-xl font-bold text-white">{styleProfile.mood}</p>
          </div>
          
          {/* Fit */}
          <div>
            <p className="text-white/40 text-sm mb-1">Preferred Fit</p>
            <p className="text-xl font-bold text-white capitalize">{styleProfile.fit}</p>
          </div>
        </div>

        {/* Keywords */}
        {styleProfile.keywords.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
              Style Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {styleProfile.keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="px-3 py-1.5 bg-white/[0.06] text-white/70 text-sm rounded-full"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Color Palette */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
          Color Palette — {styleProfile.colorPalette.name}
        </h2>
        
        <div className="flex gap-3">
          {[
            { hex: styleProfile.colorPalette.primary, label: 'Primary' },
            { hex: styleProfile.colorPalette.secondary, label: 'Secondary' },
            { hex: styleProfile.colorPalette.accent, label: 'Accent' },
            { hex: styleProfile.colorPalette.neutral, label: 'Neutral' },
          ].map((color, index) => (
            <motion.div
              key={color.hex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group relative flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-2xl shadow-lg cursor-pointer ring-1 ring-white/[0.08]"
                style={{ backgroundColor: color.hex }}
              />
              <div className="mt-2 text-center">
                <p className="text-white/50 text-xs">{color.label}</p>
                <p className="text-white/30 text-xs font-mono">{color.hex}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Outfits Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
          Recommended Outfits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {outfits.map((outfit, outfitIndex) => (
            <motion.div
              key={outfit.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + outfitIndex * 0.1 }}
              className="bg-white/[0.03] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.06]"
            >
              {/* Outfit header */}
              <div
                className="h-1.5"
                style={{
                  background: `linear-gradient(90deg, ${styleProfile.colorPalette.primary}, ${styleProfile.colorPalette.secondary}, ${styleProfile.colorPalette.accent})`
                }}
              />
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{outfit.name}</h3>
                    <p className="text-white/40 text-sm">{outfit.occasion}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/[0.06] rounded-full text-xs text-white/60 capitalize">
                    {styleProfile.fit}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {outfit.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + outfitIndex * 0.1 + itemIndex * 0.03 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                    >
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.colors[0] || styleProfile.colorPalette.primary }}
                      >
                        <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-white/30 text-xs">{item.brand}</p>
                      </div>
                      
                      <p className="text-[#c4a882] text-sm font-semibold flex-shrink-0">
                        {item.currency === 'EUR' ? '€' : '$'}{item.price.toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/40 text-sm">Estimated Total</span>
                  <span className="text-white font-bold">
                    €{outfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer branding */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 pt-8 border-t border-white/[0.06] text-center"
      >
        <p className="text-white/20 text-sm">
          Generated by <span className="text-[#c4a882] font-medium">SoundStyle</span>
        </p>
        <p className="text-white/10 text-xs mt-1">{currentDate}</p>
      </motion.footer>
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
