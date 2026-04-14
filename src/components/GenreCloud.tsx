'use client';

import { motion } from 'framer-motion';

interface GenreCloudProps {
  genres: { genre: string; count: number }[];
  maxDisplay?: number;
}

export default function GenreCloud({ genres, maxDisplay = 8 }: GenreCloudProps) {
  const displayGenres = genres.slice(0, maxDisplay);
  const maxCount = Math.max(...displayGenres.map(g => g.count));
  
  return (
    <div className="space-y-4">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
        Géneros Favoritos
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {displayGenres.map((genre, index) => {
          const intensity = genre.count / maxCount;
          const size = 0.75 + intensity * 0.5; // 0.75rem to 1.25rem
          
          return (
            <motion.span
              key={genre.genre}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{ fontSize: `${size}rem` }}
              className={`
                px-4 py-2 rounded-full font-medium
                transition-all duration-200 cursor-default
                ${intensity > 0.7 
                  ? 'bg-[#1DB954] text-black' 
                  : intensity > 0.4
                    ? 'bg-[#1DB954]/30 text-[#1DB954]'
                    : 'bg-white/10 text-white/60'
                }
              `}
            >
              {genre.genre}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
