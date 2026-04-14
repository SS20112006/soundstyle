'use client';

import { motion } from 'framer-motion';
import { MoodProfile } from '@/types';

interface MoodDisplayProps {
  moodProfile: MoodProfile;
}

export default function MoodDisplay({ moodProfile }: MoodDisplayProps) {
  const metrics = [
    {
      label: 'Energia',
      value: moodProfile.energy,
      description: 'Agressividade do estilo',
      icon: '⚡',
      color: moodProfile.energy > 0.7 ? 'from-red-500 to-orange-500' : 
             moodProfile.energy > 0.4 ? 'from-yellow-500 to-amber-500' : 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Positividade',
      value: moodProfile.valence,
      description: 'Paleta de cores',
      icon: moodProfile.valence > 0.6 ? '☀️' : moodProfile.valence > 0.4 ? '🌤️' : '🌙',
      color: moodProfile.valence > 0.6 ? 'from-yellow-400 to-pink-400' : 
             moodProfile.valence > 0.4 ? 'from-purple-400 to-blue-400' : 'from-slate-600 to-slate-800',
    },
    {
      label: 'Dançabilidade',
      value: moodProfile.danceability,
      description: 'Conforto & fit',
      icon: '💃',
      color: moodProfile.danceability > 0.7 ? 'from-pink-500 to-purple-500' : 
             moodProfile.danceability > 0.4 ? 'from-teal-500 to-emerald-500' : 'from-slate-500 to-gray-600',
    },
    {
      label: 'Acústico',
      value: moodProfile.acousticness,
      description: 'Texturas naturais',
      icon: '🎸',
      color: moodProfile.acousticness > 0.6 ? 'from-amber-600 to-orange-700' : 
             moodProfile.acousticness > 0.3 ? 'from-emerald-600 to-teal-700' : 'from-violet-600 to-indigo-700',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{metric.icon}</span>
            <span className="text-white/80 font-medium text-sm">{metric.label}</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metric.value * 100}%` }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-xs">{metric.description}</span>
            <span className="text-white font-bold text-sm">
              {Math.round(metric.value * 100)}%
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Mood description based on profile
export function getMoodDescription(mood: MoodProfile): {
  primary: string;
  secondary: string;
  fit: string;
} {
  const { energy, valence, danceability, acousticness } = mood;
  
  // Primary style based on energy + valence
  let primary = 'Versátil';
  if (energy > 0.7 && valence < 0.4) primary = 'Cyber-Gothic / Techwear';
  else if (energy > 0.7 && valence > 0.6) primary = 'Street Pop / Neon';
  else if (energy < 0.4 && valence < 0.4) primary = 'Dark Minimal / Noir';
  else if (energy < 0.4 && valence > 0.6) primary = 'Soft Scandinavian';
  else if (energy > 0.5 && danceability > 0.7) primary = 'Y2K / Club Kid';
  else if (acousticness > 0.6) primary = 'Boho / Folk';
  else if (valence > 0.5) primary = 'Clean / Smart Casual';
  
  // Secondary descriptor
  let secondary = 'Moderno';
  if (acousticness > 0.5) secondary = 'Orgânico';
  else if (energy > 0.6) secondary = 'Elétrico';
  else if (valence < 0.3) secondary = 'Melancólico';
  
  // Fit recommendation
  let fit = 'Regular fit';
  if (danceability > 0.7) fit = 'Oversized / Relaxed';
  else if (danceability < 0.3) fit = 'Slim / Tailored';
  else if (energy > 0.7) fit = 'Structured / Technical';
  
  return { primary, secondary, fit };
}
