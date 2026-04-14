'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StyleProfile, MoodProfile } from '@/types';

interface SocialShareProps {
  styleProfile: StyleProfile;
  moodProfile: MoodProfile;
  topArtists: string[];
  topGenres: string[];
  userName?: string;
}

export default function SocialShare({ 
  styleProfile, 
  moodProfile, 
  topArtists, 
  topGenres,
  userName 
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareData, setShareData] = useState<{
    title: string;
    description: string;
    hashtags: string[];
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/style/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleProfile,
          topArtists: topArtists.slice(0, 5),
          topGenres: topGenres.slice(0, 5),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setShareData(data);
      }
    } catch (error) {
      console.error('Error generating share data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = shareData 
    ? `${shareData.title}\n\n${shareData.description}\n\n${shareData.hashtags.join(' ')}`
    : `O meu estilo é ${styleProfile.aesthetic}! 🎵👔 #SoundStyle #SpotifyFashion`;

  const socialLinks = [
    {
      name: 'Instagram',
      icon: '📸',
      color: 'from-purple-500 to-pink-500',
      action: () => {
        // Copy text for Instagram (no direct share API)
        navigator.clipboard.writeText(shareText);
        alert('Texto copiado! Abre o Instagram e cola na tua story ou post.');
      },
    },
    {
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'from-gray-800 to-black',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'from-green-500 to-green-600',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'TikTok',
      icon: '🎵',
      color: 'from-pink-500 to-red-500',
      action: () => {
        navigator.clipboard.writeText(shareText);
        alert('Texto copiado! Usa como legenda no teu próximo TikTok.');
      },
    },
  ];

  return (
    <>
      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setIsOpen(true);
          if (!shareData) handleGenerate();
        }}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partilhar o Meu Estilo
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div 
                className="p-6 relative"
                style={{ 
                  background: `linear-gradient(135deg, ${styleProfile.colorPalette.primary}, ${styleProfile.colorPalette.accent})` 
                }}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white"
                >
                  ✕
                </button>
                
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">O Meu Estilo Spotify</p>
                  <h3 className="text-2xl font-bold text-white">{styleProfile.aesthetic}</h3>
                  <p className="text-white/70 text-sm mt-1">{styleProfile.mood}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Color Palette Preview */}
                <div className="flex justify-center gap-2">
                  {[styleProfile.colorPalette.primary, styleProfile.colorPalette.secondary, styleProfile.colorPalette.accent, styleProfile.colorPalette.neutral].map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-2xl font-bold text-[#1DB954]">
                      {Math.round(moodProfile.energy * 100)}%
                    </p>
                    <p className="text-white/50 text-xs">Energia</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-2xl font-bold text-purple-400">
                      {Math.round(moodProfile.valence * 100)}%
                    </p>
                    <p className="text-white/50 text-xs">Vibe</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-2xl font-bold text-pink-400">
                      {Math.round(moodProfile.danceability * 100)}%
                    </p>
                    <p className="text-white/50 text-xs">Flow</p>
                  </div>
                </div>

                {/* Top Artists */}
                <div className="text-center">
                  <p className="text-white/40 text-xs mb-2">TOP ARTISTAS</p>
                  <p className="text-white/80 text-sm">
                    {topArtists.slice(0, 3).join(' • ')}
                  </p>
                </div>

                {/* Share Text Preview */}
                {shareData && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {shareData.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {shareData.hashtags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="text-[#1DB954] text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {isGenerating && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-[#1DB954] rounded-full animate-spin" />
                    <span className="ml-3 text-white/50 text-sm">A gerar descrição...</span>
                  </div>
                )}

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <motion.button
                      key={social.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={social.action}
                      className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${social.color} text-white text-sm font-medium rounded-xl`}
                    >
                      <span>{social.icon}</span>
                      <span>{social.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText + '\n' + shareUrl);
                    alert('Link copiado!');
                  }}
                  className="w-full py-3 border border-white/20 text-white/60 text-sm rounded-xl hover:bg-white/5 transition-colors"
                >
                  📋 Copiar Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
