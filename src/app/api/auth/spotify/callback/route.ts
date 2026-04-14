import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getCurrentUser } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Get stored state and verifier from cookies
  const storedState = request.cookies.get('spotify_auth_state')?.value;
  const codeVerifier = request.cookies.get('spotify_code_verifier')?.value;
  
  // Handle user denying access
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }
  
  // Verify state parameter (CSRF protection)
  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(
      new URL('/?error=invalid_state', request.url)
    );
  }
  
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL('/?error=missing_verifier', request.url)
    );
  }
  
  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier);
    
    // Get user profile
    const user = await getCurrentUser(tokens.access_token);
    
    // Create response with redirect to app
    const response = NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
    
    // Clear auth cookies
    response.cookies.delete('spotify_auth_state');
    response.cookies.delete('spotify_code_verifier');
    
    // Store tokens securely
    response.cookies.set('spotify_tokens', JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      token_type: tokens.token_type,
      scope: tokens.scope,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    // Store user info (non-sensitive, for client)
    response.cookies.set('spotify_user', JSON.stringify({
      id: user.id,
      display_name: user.display_name,
      email: user.email,
      images: user.images,
      product: user.product,
      country: user.country,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_failed', request.url)
    );
  }
}
