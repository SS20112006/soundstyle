'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Checks if user is logged in (from localStorage) and redirects to dashboard
export function useAutoLogin() {
  const router = useRouter();
  
  useEffect(() => {
    const tokens = localStorage.getItem('spotify_tokens');
    const user = localStorage.getItem('spotify_user');
    
    if (tokens && user) {
      try {
        const parsed = JSON.parse(tokens);
        // Check if token is still valid (not expired)
        if (parsed.expires_at && parsed.expires_at > Date.now()) {
          router.push('/dashboard');
        }
      } catch {}
    }
  }, [router]);
}

// Get current user from localStorage
export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('spotify_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Get current tokens from localStorage
export function getStoredTokens() {
  if (typeof window === 'undefined') return null;
  try {
    const tokens = localStorage.getItem('spotify_tokens');
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const tokens = getStoredTokens();
  if (!tokens) return false;
  return tokens.expires_at && tokens.expires_at > Date.now();
}

// Logout
export function logout() {
  localStorage.removeItem('spotify_tokens');
  localStorage.removeItem('spotify_user');
  window.location.href = '/';
}
