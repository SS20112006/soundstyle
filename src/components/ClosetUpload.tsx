'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClothingAnalysis } from '@/lib/visionAI';

interface ClosetUploadProps {
  onItemAnalyzed?: (analysis: ClothingAnalysis, imageUrl: string) => void;
}

export default function ClosetUpload({ onItemAnalyzed }: ClosetUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ClothingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    
    setError(null);
    setAnalysis(null);
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Usa JPEG, PNG, WebP ou GIF.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem demasiado grande. Máximo 10MB.');
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    
    // Analyze
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/style/closet/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao analisar imagem');
      }
      
      const data = await response.json();
      setAnalysis(data.analysis);
      
      if (onItemAnalyzed) {
        onItemAnalyzed(data.analysis, preview || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-[#1DB954] bg-[#1DB954]/10' 
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        
        {preview ? (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#1DB954]/20 border-t-[#1DB954] rounded-full animate-spin" />
                  <span className="text-white/60">A analisar com IA...</span>
                </div>
              ) : analysis ? (
                <div>
                  <p className="text-white font-medium">{analysis.name}</p>
                  <p className="text-white/50 text-sm capitalize">{analysis.category}</p>
                </div>
              ) : (
                <p className="text-white/40">Erro na análise</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-3">📸</div>
            <p className="text-white/60 mb-1">Arrasta uma foto da tua roupa</p>
            <p className="text-white/30 text-sm">ou clica para selecionar</p>
          </div>
        )}
      </div>
      
      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm px-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      {/* Analysis result */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#1DB954]">✓</span>
              <span className="text-white/80 text-sm">Análise completa</span>
            </div>
            
            {/* Style tags */}
            <div className="flex flex-wrap gap-2">
              {analysis.style.map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
              {analysis.tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xs">Cores:</span>
              <div className="flex gap-1">
                {analysis.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Reset button */}
            <button
              onClick={() => {
                setPreview(null);
                setAnalysis(null);
                setError(null);
              }}
              className="text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              Adicionar outro item
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
