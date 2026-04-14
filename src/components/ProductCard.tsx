'use client';

import { motion } from 'framer-motion';
import { RecommendedItem } from '@/types';

interface ProductCardProps {
  item: RecommendedItem;
  index: number;
  compact?: boolean;
}

export default function ProductCard({ item, index, compact = false }: ProductCardProps) {
  const storeLogos: Record<string, string> = {
    'Zara': 'https://logo.clearbit.com/zara.com',
    'H&M': 'https://logo.clearbit.com/hm.com',
    'ASOS': 'https://logo.clearbit.com/asos.com',
    'Nike': 'https://logo.clearbit.com/nike.com',
    'Adidas': 'https://logo.clearbit.com/adidas.com',
    'Uniqlo': 'https://logo.clearbit.com/uniqlo.com',
    'COS': 'https://logo.clearbit.com/cos.com',
    'Mango': 'https://logo.clearbit.com/mango.com',
    'Pull&Bear': 'https://logo.clearbit.com/pullandbear.com',
    'Bershka': 'https://logo.clearbit.com/bershka.com',
    'Massimo Dutti': 'https://logo.clearbit.com/massimodutti.com',
    'Stradivarius': 'https://logo.clearbit.com/stradivarius.com',
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      tops: '👕',
      bottoms: '👖',
      shoes: '👟',
      outerwear: '🧥',
      accessories: '💎',
      dresses: '👗',
    };
    return icons[category] || '👕';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`
        group relative bg-gradient-to-b from-white/[0.07] to-white/[0.03] 
        rounded-2xl overflow-hidden border border-white/10
        hover:border-white/20 transition-all duration-300
        ${compact ? 'p-4' : ''}
      `}
    >
      {/* Product Image Area */}
      <div 
        className={`
          relative overflow-hidden
          ${compact ? 'h-40' : 'h-56'}
        `}
        style={{ 
          background: `linear-gradient(135deg, ${item.colors[0] || '#333'}22, ${item.colors[1] || item.colors[0] || '#555'}22)` 
        }}
      >
        {/* Category Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
            {getCategoryIcon(item.category)}
          </span>
        </div>
        
        {/* Style Tags Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {item.style?.slice(0, 2).map((tag, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white/80 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Quick View on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white text-black text-sm font-medium rounded-full"
          >
            Ver Detalhes
          </motion.button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className={`space-y-3 ${compact ? 'p-3' : 'p-5'}`}>
        {/* Brand & Store */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {storeLogos[item.brand] && (
              <img 
                src={storeLogos[item.brand]} 
                alt={item.brand}
                className="w-5 h-5 rounded-full object-contain bg-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">
              {item.brand}
            </span>
          </div>
          <span className="text-white/30 text-[10px] uppercase">
            {item.category}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className={`text-white font-medium leading-snug ${compact ? 'text-sm' : 'text-base'}`}>
          {item.name}
        </h3>
        
        {/* Colors */}
        {item.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {item.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {item.colors.length > 4 && (
              <span className="text-white/30 text-xs">+{item.colors.length - 4}</span>
            )}
          </div>
        )}
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span className="text-2xl font-bold text-white">
              {item.currency === 'EUR' ? '€' : item.currency === 'USD' ? '$' : '£'}
              {item.price.toFixed(2)}
            </span>
          </div>
          
          <motion.a
            href={item.affiliateUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black text-sm font-semibold rounded-full transition-colors"
          >
            <span>Comprar</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
