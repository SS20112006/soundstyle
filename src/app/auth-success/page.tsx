'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const data = searchParams.get('d') || searchParams.get('data');
    
    if (!data) {
      router.push('/?error=no_data');
      return;
    }
    
    try {
      const parsed = JSON.parse(atob(data));
      
      // Support both old format (tokens/user) and new format (t/u)
      const tokens = parsed.tokens || parsed.t;
      const user = parsed.user || parsed.u;
      
      if (!tokens || !user) {
        throw new Error('Invalid data format');
      }
      
      // Store in localStorage
      localStorage.setItem('spotify_tokens', JSON.stringify(tokens));
      localStorage.setItem('spotify_user', JSON.stringify(user));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('[AUTH-SUCCESS] Failed to parse data:', err);
      router.push('/?error=auth_failed');
    }
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
        </div>
        <p className="text-white/60 text-lg">Setting up your style profile...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4a882] animate-spin" />
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
