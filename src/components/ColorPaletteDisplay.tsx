'use client';

import { motion } from 'framer-motion';
import { ColorPalette } from '@/types';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  showNames?: boolean;
}

export default function ColorPaletteDisplay({ palette, showNames = true }: ColorPaletteDisplayProps) {
  const colors = [
    { hex: palette.primary, label: 'Principal' },
    { hex: palette.secondary, label: 'Secundária' },
    { hex: palette.accent, label: 'Destaque' },
    { hex: palette.neutral, label: 'Neutro' },
  ];

  return (
    <div className="space-y-3">
      {showNames && (
        <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
          Paleta: {palette.name}
        </h3>
      )}
      
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <motion.div
            key={color.hex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: color.hex }}
              onClick={() => {
                navigator.clipboard.writeText(color.hex);
              }}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <p className="font-medium">{color.label}</p>
              <p className="text-white/60 font-mono">{color.hex}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Copy all button */}
      <button
        onClick={() => {
          const allColors = colors.map(c => c.hex).join(', ');
          navigator.clipboard.writeText(allColors);
        }}
        className="text-white/40 text-xs hover:text-white/60 transition-colors"
      >
        Copiar todas as cores
      </button>
    </div>
  );
}
