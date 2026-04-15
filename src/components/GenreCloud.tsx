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
      <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider">
        Your Genres
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {displayGenres.map((genre, index) => {
          const intensity = genre.count / maxCount;
          
          return (
            <motion.span
              key={genre.genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 cursor-default
                ${intensity > 0.7 
                  ? 'bg-[#c4a882] text-black' 
                  : intensity > 0.4
                    ? 'bg-[#c4a882]/20 text-[#c4a882]'
                    : 'bg-white/[0.06] text-white/60'
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
