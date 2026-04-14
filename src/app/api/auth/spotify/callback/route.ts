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
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', error);
    return NextResponse.redirect(errorUrl);
  }
  
  // Verify state parameter (CSRF protection)
  if (!code || !state || state !== storedState) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'invalid_state');
    return NextResponse.redirect(errorUrl);
  }
  
  if (!codeVerifier) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'missing_verifier');
    return NextResponse.redirect(errorUrl);
  }
  
  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier, request as any);
    
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
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'auth_failed');
    return NextResponse.redirect(errorUrl);
  }
}
