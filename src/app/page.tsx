'use client';

import { motion } from 'framer-motion';
import SpotifyLoginButton from '@/components/SpotifyLoginButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#1DB954]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <h1 className="text-2xl font-bold">
            Sound<span className="text-[#1DB954]">Style</span>
          </h1>
        </header>
        
        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 mb-8"
            >
              <span className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse" />
              <span className="text-[#1DB954] text-sm font-medium">
                A tua música. O teu estilo.
              </span>
            </motion.div>
            
            {/* Main headline */}
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              O Som da Tua{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-emerald-400">
                Roupas
              </span>
            </h2>
            
            <p className="text-xl text-white/60 max-w-xl mx-auto mb-12">
              Transforma os teus hábitos musicais em recomendações de moda únicas. 
              A nossa IA analisa o teu Spotify e descobre o estilo que combina contigo.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <SpotifyLoginButton />
              <p className="text-white/30 text-sm">
                Grátis para sempre • Sem cartão de crédito
              </p>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
          >
            {[
              {
                icon: '🎵',
                title: 'Análise Musical',
                desc: 'Energia, valência e dançabilidade do teu gosto musical'
              },
              {
                icon: '🎨',
                title: 'Paleta de Cores',
                desc: 'Cores extraídas da vibe das tuas músicas favoritas'
              },
              {
                icon: '👔',
                title: 'Recomendações',
                desc: 'Peças que combinam com o teu perfil musical único'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/20 text-sm">
            © 2024 SoundStyle • Transforma a tua música em moda
          </p>
        </footer>
      </div>
    </div>
  );
}
