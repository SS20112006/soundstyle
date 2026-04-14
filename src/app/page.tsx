'use client';

import { motion } from 'framer-motion';
import SpotifyLoginButton from '@/components/SpotifyLoginButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects - Apple-style subtle gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle green glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[120px]" />
        
        {/* Subtle purple accent */}
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar - Apple-style */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center">
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">SoundStyle</span>
            </div>
            
            {/* Right side */}
            <SpotifyLoginButton compact />
          </div>
        </nav>
        
        {/* Hero Section - Apple-style */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 mb-8"
            >
              <span className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse" />
              <span className="text-[#1DB954] text-sm font-medium">
                Powered by AI
              </span>
            </motion.div>
            
            {/* Main Headline - Apple typography */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="block">Your Music.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#1ed760]">
                Your Style.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              We analyze your Spotify listening habits and transform them into 
              personalized fashion recommendations.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <SpotifyLoginButton />
              <p className="text-white/40 text-sm">
                Free forever • No credit card required
              </p>
            </div>
          </motion.div>
          
          {/* Features - Apple card style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-32 w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: '🎵',
                  title: 'Music Analysis',
                  desc: 'Energy, valence, and danceability from your listening patterns',
                  gradient: 'from-[#1DB954]/20 to-transparent',
                },
                {
                  icon: '🎨',
                  title: 'Color Palette',
                  desc: 'Colors extracted from the vibe of your favorite songs',
                  gradient: 'from-purple-500/20 to-transparent',
                },
                {
                  icon: '👔',
                  title: 'Recommendations',
                  desc: 'Pieces that match your unique musical identity',
                  gradient: 'from-blue-500/20 to-transparent',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  {/* Gradient accent */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <span className="text-3xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* How it works - Apple style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-32 w-full max-w-4xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-white/50 mb-12">Three simple steps to discover your style</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect', desc: 'Link your Spotify account securely' },
                { step: '02', title: 'Analyze', desc: 'AI processes your music taste' },
                { step: '03', title: 'Discover', desc: 'Get personalized style recommendations' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.15 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-white/[0.04] mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
        
        {/* Footer - Apple minimal */}
        <footer className="py-8 border-t border-white/[0.08]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © 2024 SoundStyle. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white/30 text-sm">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/60 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
