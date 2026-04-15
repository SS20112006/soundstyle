'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');
    const spotifyError = searchParams.get('error');
    
    if (spotifyError) {
      // User denied or Spotify error — restart auth
      window.location.href = '/api/auth/spotify';
      return;
    }
    
    if (!code || !stateParam) {
      // No code — restart auth
      window.location.href = '/api/auth/spotify';
      return;
    }
    
    // Decode state to get codeVerifier
    let codeVerifier: string;
    try {
      const decoded = JSON.parse(atob(stateParam));
      codeVerifier = decoded.v;
      if (!codeVerifier) throw new Error('Missing verifier');
    } catch {
      // Invalid state — restart auth
      window.location.href = '/api/auth/spotify';
      return;
    }
    
    // Exchange code for tokens via our API
    async function exchangeTokens() {
      try {
        const res = await fetch('/api/auth/spotify/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, codeVerifier }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          // If code expired or invalid, restart auth automatically
          if (data.error?.includes('expired') || data.error?.includes('invalid_grant')) {
            console.log('[CALLBACK] Code expired, restarting auth...');
            window.location.href = '/api/auth/spotify';
            return;
          }
          throw new Error(data.error || 'Token exchange failed');
        }
        
        // Store tokens and user in localStorage
        localStorage.setItem('spotify_tokens', JSON.stringify(data.tokens));
        localStorage.setItem('spotify_user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err: any) {
        console.error('[CALLBACK] Token exchange error:', err.message);
        // On any error, restart auth
        window.location.href = '/api/auth/spotify';
      }
    }
    
    exchangeTokens();
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
        </div>
        <p className="text-white/60 text-lg">Connecting your music...</p>
        <p className="text-white/30 text-sm mt-2">This may take a moment</p>
      </div>
    </div>
  );
}

export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
