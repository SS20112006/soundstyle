import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const { url, state, codeVerifier } = getSpotifyAuthUrl(request as any);
    
    const response = NextResponse.redirect(url);
    
    // Store state and codeVerifier in cookies for verification
    response.cookies.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });
    
    response.cookies.set('spotify_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    console.error('Auth error:', error);
    
    // Return a helpful error page
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', error.message || 'auth_failed');
    
    return NextResponse.redirect(errorUrl);
  }
}
