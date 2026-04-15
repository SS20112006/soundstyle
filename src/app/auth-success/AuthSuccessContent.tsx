'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/appStore';

export default function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get('d');
    
    if (!data) {
      setError('No auth data received');
      setTimeout(() => router.replace('/'), 2000);
      return;
    }

    try {
      const decoded = JSON.parse(atob(data));
      const { t: tokens, u: user } = decoded;

      // Store tokens
      localStorage.setItem('spotify_tokens', JSON.stringify(tokens));
      localStorage.setItem('spotify_user', JSON.stringify(user));

      // Update app store
      setAuth(user);

      console.log('[AUTH-SUCCESS] Logged in as:', user.display_name);

      // Redirect to dashboard
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('[AUTH-SUCCESS] Decode error:', err.message);
      setError('Failed to process login data');
      setTimeout(() => router.replace('/'), 2000);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <p className="text-white/40 text-sm mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#c4a882] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Logging you in...</p>
      </div>
    </div>
  );
}
