'use client';

import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getStoredUser, isAuthenticated } from '@/lib/auth';
import { useAppStore } from '@/stores/appStore';

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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { measurements, setMeasurements } = useAppStore();
  
  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        
        // Load measurements from localStorage
        const storedMeasurements = localStorage.getItem('soundstyle_measurements');
        if (storedMeasurements) {
          try {
            const measurementsData = JSON.parse(storedMeasurements);
            setMeasurements(measurementsData);
          } catch {}
        }
        
        // Check if profile is complete
        const hasMeasurements = storedMeasurements !== null;
        
        // Auto-redirect to dashboard or setup
        const timer = setTimeout(() => {
          if (hasMeasurements) {
            router.push('/dashboard');
          } else {
            router.push('/setup');
          }
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [router, setMeasurements]);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Error Banner */}
      <Suspense fallback={null}>
        <ErrorBanner />
      </Suspense>
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[#c4a882]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8b6f5c]/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
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
            
            {/* Show user or connect button */}
            {user ? (
              <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium rounded-full border border-white/[0.1] transition-colors">
                {user.images?.[0] ? (
                  <img src={user.images[0].url} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#c4a882] flex items-center justify-center text-xs">
                    {user.display_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span>{user.display_name}</span>
              </a>
            ) : (
              <a href="/api/auth/spotify" className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium rounded-full border border-white/[0.1] transition-colors">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span>Connect</span>
              </a>
            )}
          </div>
        </nav>
        
        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c4a882]/10 border border-[#c4a882]/20 mb-8"
            >
              <span className="w-1.5 h-1.5 bg-[#c4a882] rounded-full animate-pulse" />
              <span className="text-[#c4a882] text-sm font-medium">AI-Powered Style</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="block text-white">Wear Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c4a882] via-[#d4a574] to-[#8b6f5c]">Sound.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover your personal style through the music you love. AI-curated outfits that match your rhythm.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              {user ? (
                <a href="/dashboard" className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] hover:from-[#d4b892] hover:to-[#9b7f6c] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#c4a882]/15">
                  <span>Go to Dashboard</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ) : (
                <a href="/api/auth/spotify" className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] hover:from-[#d4b892] hover:to-[#9b7f6c] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#c4a882]/15">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span>Connect with Spotify</span>
                </a>
              )}
              <p className="text-white/30 text-sm">Free forever · No credit card required</p>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-32 w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: '🎵', title: 'Sound Analysis', desc: 'Energy, rhythm, and mood decoded from your listening patterns' },
                { icon: '👗', title: 'Real Outfits', desc: 'Curated pieces from real stores — Zara, H&M, ASOS, Nike and more' },
              ].map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
                  <span className="text-3xl mb-4 block">{f.icon}</span>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/40 text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
        
        <footer className="py-8 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-white/25 text-sm">© 2024 SoundStyle. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
