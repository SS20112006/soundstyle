import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getCurrentUser } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const spotifyError = searchParams.get('error');
  
  console.log('[CALLBACK] Received:', { hasCode: !!code, hasState: !!stateParam, error: spotifyError });
  
  const homeUrl = new URL('/', request.url).toString();
  
  if (spotifyError) {
    return NextResponse.redirect(homeUrl + '?error=' + spotifyError);
  }
  
  if (!code || !stateParam) {
    return NextResponse.redirect(homeUrl + '?error=missing_params');
  }
  
  // Decode state to get codeVerifier
  let codeVerifier: string;
  try {
    const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString());
    codeVerifier = decoded.v;
    if (!codeVerifier) throw new Error('Missing verifier');
    console.log('[CALLBACK] Decoded state OK');
  } catch (e: any) {
    console.error('[CALLBACK] State decode failed:', e.message);
    return NextResponse.redirect(homeUrl + '?error=invalid_state');
  }
  
  try {
    console.log('[CALLBACK] Exchanging code for tokens...');
    const tokens = await exchangeCodeForTokens(code, codeVerifier, request);
    console.log('[CALLBACK] Token exchange OK, fetching user...');
    const user = await getCurrentUser(tokens.access_token);
    console.log('[CALLBACK] User:', user.display_name);
    
    // Encode token data
    const payload = JSON.stringify({
      t: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
        token_type: tokens.token_type,
        scope: tokens.scope,
      },
      u: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        images: user.images,
        product: user.product,
        country: user.country,
      },
    });
    
    const tokenData = Buffer.from(payload).toString('base64url');
    console.log('[CALLBACK] Data encoded, length:', tokenData.length);
    
    // Redirect to auth-success page with data
    const successUrl = new URL('/auth-success', request.url);
    successUrl.searchParams.set('d', tokenData);
    
    console.log('[CALLBACK] Redirecting to auth-success');
    return NextResponse.redirect(successUrl.toString());
  } catch (err: any) {
    console.error('[CALLBACK] Error:', err.message);
    return NextResponse.redirect(homeUrl + '?error=auth_failed&msg=' + encodeURIComponent(err.message));
  }
}
