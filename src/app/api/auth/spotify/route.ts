import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const { url, state, codeVerifier } = getSpotifyAuthUrl(request);
    
    // Encode state + codeVerifier in the state parameter
    // Spotify passes the state through unchanged — no cookies needed
    const combinedState = btoa(JSON.stringify({ s: state, v: codeVerifier }));
    
    // Replace the state in the URL
    const authUrl = new URL(url);
    authUrl.searchParams.set('state', combinedState);
    
    console.log('[AUTH] Redirecting to Spotify, state length:', combinedState.length);
    
    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error('[AUTH] Error:', error.message);
    
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', error.message || 'auth_failed');
    
    return NextResponse.redirect(errorUrl);
  }
}
