'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SpotifyLoginButton from '@/components/SpotifyLoginButton';

function ErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const details = searchParams.get('details');
  
  if (!error) return null;
  
  const messages: Record<string, string> = {
    'auth_failed': 'Authentication failed. Please try again.',
    'invalid_state': 'Security check failed. Please try again.',
    'missing_verifier': 'Session expired. Please try again.',
    'access_denied': 'You denied access to Spotify.',
  };
  
  const message = messages[error] || `Error: ${error}`;
  
  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-red-500/10 border-b border-red-500/20 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-red-400 text-sm">
          {message}
          {details && <span className="text-red-400/60 ml-2">({details})</span>}
        </p>
        <a href="/" className="text-red-400/60 text-xs hover:text-red-400">Dismiss</a>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Error Banner */}
      <Suspense fallback={null}>
        <ErrorBanner />
      </Suspense>
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        {/* Warm gradient orbs — fashion forward */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[#c4a882]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8b6f5c]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/6 w-[300px] h-[300px] bg-[#d4a574]/4 rounded-full blur-[100px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo — custom SoundStyle wordmark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a882] to-[#8b6f5c] flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">SoundStyle</span>
            </div>
            
            {/* Right side */}
            <SpotifyLoginButton compact />
          </div>
        </nav>
        
        {/* Hero Section */}
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c4a882]/10 border border-[#c4a882]/20 mb-8"
            >
              <span className="w-1.5 h-1.5 bg-[#c4a882] rounded-full animate-pulse" />
              <span className="text-[#c4a882] text-sm font-medium">
                AI-Powered Style
              </span>
            </motion.div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="block text-white">Wear Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c4a882] via-[#d4a574] to-[#8b6f5c]">
                Sound.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover your personal style through the music you love.
              AI-curated outfits that match your rhythm.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <SpotifyLoginButton />
              <p className="text-white/30 text-sm">
                Free forever · No credit card required
              </p>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-32 w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  ),
                  title: 'Sound Analysis',
                  desc: 'Energy, rhythm, and mood decoded from your listening patterns',
                  gradient: 'from-[#c4a882]/15 to-transparent',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13.5" cy="6.5" r="2.5" />
                      <circle cx="17.5" cy="10.5" r="2.5" />
                      <circle cx="8.5" cy="7.5" r="2.5" />
                      <circle cx="6.5" cy="12.5" r="2.5" />
                      <path d="M12 22c-4.97 0-9-2.69-9-6v-2c0-3.31 4.03-6 9-6s9 2.69 9 6v2c0 3.31-4.03 6-9 6z" />
                    </svg>
                  ),
                  title: 'Color Palette',
                  desc: 'Colors extracted from the vibe and emotion of your favorite songs',
                  gradient: 'from-[#d4a574]/15 to-transparent',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46L16 2l-4 4-4-4L3.62 3.46 2 9.17l5.33 2.14L12 22l4.67-10.69L22 9.17z" />
                    </svg>
                  ),
                  title: 'Style Match',
                  desc: 'Curated pieces that express your unique musical identity',
                  gradient: 'from-[#8b6f5c]/15 to-transparent',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                >
                  {/* Gradient accent */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 text-[#c4a882]">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-32 w-full max-w-4xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-white/40 mb-12">Three steps to discover your style DNA</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect', desc: 'Link your music streaming account' },
                { step: '02', title: 'Analyze', desc: 'AI decodes your musical identity' },
                { step: '03', title: 'Discover', desc: 'Get personalized style recommendations' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.15 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-white/[0.03] mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-sm">
              © 2024 SoundStyle. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white/25 text-sm">
              <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/50 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
