'use client';

import { motion } from 'framer-motion';
import { MoodProfile } from '@/types';

interface MoodDisplayProps {
  moodProfile: MoodProfile;
}

export default function MoodDisplay({ moodProfile }: MoodDisplayProps) {
  const metrics = [
    {
      label: 'Energy',
      value: moodProfile.energy,
      icon: '⚡',
      color: moodProfile.energy > 0.7 ? '#FF3B30' : moodProfile.energy > 0.4 ? '#FF9500' : '#5AC8FA',
    },
    {
      label: 'Vibe',
      value: moodProfile.valence,
      icon: moodProfile.valence > 0.6 ? '☀️' : moodProfile.valence > 0.4 ? '🌤' : '🌙',
      color: moodProfile.valence > 0.6 ? '#FFCC00' : moodProfile.valence > 0.4 ? '#5856D6' : '#8E8E93',
    },
    {
      label: 'Flow',
      value: moodProfile.danceability,
      icon: '💃',
      color: moodProfile.danceability > 0.7 ? '#FF2D55' : moodProfile.danceability > 0.4 ? '#34C759' : '#8E8E93',
    },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{metric.icon}</span>
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">{metric.label}</span>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={metric.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${metric.value * 175.93} 175.93`}
                initial={{ strokeDasharray: '0 175.93' }}
                animate={{ strokeDasharray: `${metric.value * 175.93} 175.93` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            {/* Percentage in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: metric.color }}>
                {Math.round(metric.value * 100)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
