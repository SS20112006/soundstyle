'use client';

import { motion } from 'framer-motion';
import { StyleTag } from '@/lib/styleMapper';

interface StyleTagsProps {
  tags: StyleTag[];
  maxDisplay?: number;
}

export default function StyleTags({ tags, maxDisplay = 8 }: StyleTagsProps) {
  const displayTags = tags.slice(0, maxDisplay);
  
  const categoryColors: Record<string, { bg: string; text: string }> = {
    aesthetic: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
    mood: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
    era: { bg: 'bg-amber-500/20', text: 'text-amber-300' },
    cultural: { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
        Tags de Estilo
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => {
          const colors = categoryColors[tag.category] || { bg: 'bg-white/10', text: 'text-white/70' };
          const size = tag.confidence > 0.7 ? 'text-sm' : 'text-xs';
          
          return (
            <motion.span
              key={`${tag.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                px-3 py-1.5 rounded-full font-medium ${size}
                ${colors.bg} ${colors.text}
                transition-all duration-200 cursor-default
              `}
            >
              {tag.name}
              {tag.confidence > 0.8 && ' ★'}
            </motion.span>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-white/30">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500/50" />
          Estética
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500/50" />
          Mood
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500/50" />
          Época
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Cultural
        </span>
      </div>
    </div>
  );
}
