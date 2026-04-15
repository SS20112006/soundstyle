'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface UndesiredColorsProps {
  colors: string[];
  onToggle: (color: string) => void;
  undesiredColors: string[];
  storageKey?: string;
}

export default function UndesiredColors({
  colors,
  onToggle,
  undesiredColors,
  storageKey = 'soundstyle-undesired-colors'
}: UndesiredColorsProps) {
  const [localUndesired, setLocalUndesired] = useState<Set<string>>(
    new Set(undesiredColors)
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setLocalUndesired(new Set(undesiredColors));
  }, [undesiredColors]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLocalUndesired(new Set(parsed));
            // Sync with parent
            parsed.forEach((color: string) => {
              if (!undesiredColors.includes(color)) {
                onToggle(color);
              }
            });
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, []);

  // Save to localStorage when undesired colors change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify([...localUndesired]));
    }
  }, [localUndesired, storageKey]);

  const handleToggle = (color: string) => {
    const newUndesired = new Set(localUndesired);
    if (newUndesired.has(color)) {
      newUndesired.delete(color);
    } else {
      newUndesired.add(color);
    }
    setLocalUndesired(newUndesired);
    onToggle(color);
  };

  const handleReset = () => {
    const colorsToRemove = [...localUndesired];
    colorsToRemove.forEach((color) => onToggle(color));
    setLocalUndesired(new Set());
    setShowResetConfirm(false);
  };

  const isUndesired = (color: string) => localUndesired.has(color);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Undesired Colors</h3>
          <p className="text-white/40 text-sm mt-0.5">
            Tap colors you don&apos;t want in your recommendations
          </p>
        </div>
        
        {localUndesired.size > 0 && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-sm text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-colors"
            >
              Reset
            </motion.button>
          </div>
        )}
      </div>

      {/* Reset confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
              <p className="text-white/70 text-sm">
                Clear all {localUndesired.size} undesired color{localUndesired.size !== 1 ? 's' : ''}?
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-sm text-white/50 hover:text-white/70 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Clear All
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
        {colors.map((color, index) => {
          const undesired = isUndesired(color);
          
          return (
            <motion.button
              key={color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggle(color)}
              className="relative group"
            >
              <motion.div
                className={`
                  aspect-square rounded-xl shadow-lg cursor-pointer
                  ring-1 ring-white/[0.08] transition-all duration-200
                  ${undesired ? 'ring-2 ring-red-400/50' : 'hover:ring-2 hover:ring-[#c4a882]/50'}
                `}
                style={{
                  backgroundColor: color,
                  opacity: undesired ? 0.4 : 1,
                }}
              >
                {/* Undesired indicator */}
                <AnimatePresence>
                  {undesired && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/[0.1] backdrop-blur-xl rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-mono">{color}</p>
                <p className="text-white/60 text-[10px]">
                  {undesired ? 'Click to allow' : 'Click to exclude'}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Summary */}
      {localUndesired.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 pt-2"
        >
          <div className="flex -space-x-1.5">
            {[...localUndesired].slice(0, 5).map((color) => (
              <div
                key={color}
                className="w-5 h-5 rounded-full ring-1 ring-[#0a0a0a] opacity-50"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-white/30 text-xs">
            {localUndesired.size} color{localUndesired.size !== 1 ? 's' : ''} excluded
          </p>
        </motion.div>
      )}
    </div>
  );
}
