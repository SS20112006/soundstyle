'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { StyleProfile, MoodProfile } from '@/types';
import { generateStyleCardSVG, generateShareText } from '@/lib/styleCardGenerator';

interface StyleCardDownloadProps {
  styleProfile: StyleProfile;
  moodProfile: MoodProfile;
  topArtists: string[];
  userName?: string;
}

export default function StyleCardDownload({ 
  styleProfile, 
  moodProfile, 
  topArtists,
  userName 
}: StyleCardDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async (): Promise<Blob | null> => {
    const svg = generateStyleCardSVG(styleProfile, moodProfile, topArtists, userName);
    
    return new Promise((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(null);
          return;
        }
        
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      
      img.src = url;
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('Failed to generate image');
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soundstyle-${styleProfile.aesthetic.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Erro ao gerar imagem. Tenta novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('Failed to generate image');
      
      const shareText = generateShareText(
        styleProfile.aesthetic,
        styleProfile.mood,
        topArtists
      );
      
      // Try native share API (mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'soundstyle.png', { type: 'image/png' });
        const shareData = {
          title: 'O Meu Estilo Spotify',
          text: shareText,
          files: [file],
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }
      
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Texto copiado! A imagem foi descarregada - partilha-a nas tuas redes sociais.');
      await handleDownload();
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to just downloading
      await handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          Descarregar Imagem
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DB954] to-emerald-400 text-black font-semibold rounded-full shadow-lg disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
          Partilhar
        </motion.button>
      </div>
    </>
  );
}
