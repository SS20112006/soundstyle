'use client';

import { motion } from 'framer-motion';
import { ColorPalette } from '@/types';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  showNames?: boolean;
}

export default function ColorPaletteDisplay({ palette, showNames = true }: ColorPaletteDisplayProps) {
  const colors = [
    { hex: palette.primary, label: 'Primary' },
    { hex: palette.secondary, label: 'Secondary' },
    { hex: palette.accent, label: 'Accent' },
    { hex: palette.neutral, label: 'Neutral' },
  ];

  return (
    <div className="space-y-4">
      {showNames && (
        <div>
          <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">
            Color Palette
          </h3>
          <p className="text-white font-medium">{palette.name}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        {colors.map((color, index) => (
          <motion.div
            key={color.hex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-2xl shadow-lg cursor-pointer ring-1 ring-white/[0.08]"
              style={{ backgroundColor: color.hex }}
              onClick={() => {
                navigator.clipboard.writeText(color.hex);
              }}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white/[0.1] backdrop-blur-xl rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <p className="font-medium">{color.label}</p>
              <p className="text-white/60 font-mono">{color.hex}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Copy button */}
      <button
        onClick={() => {
          const allColors = colors.map(c => c.hex).join(', ');
          navigator.clipboard.writeText(allColors);
        }}
        className="text-white/30 text-xs hover:text-white/50 transition-colors"
      >
        Copy all colors
      </button>
    </div>
  );
}
