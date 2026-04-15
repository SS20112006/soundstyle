import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getCurrentUser } from '@/lib/spotify';

// POST /api/auth/spotify/token - Exchange code for tokens (called from client callback page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, codeVerifier } = body;
    
    if (!code || !codeVerifier) {
      return NextResponse.json({ error: 'Missing code or codeVerifier' }, { status: 400 });
    }
    
    console.log('[TOKEN] Exchanging code for tokens...');
    
    const tokens = await exchangeCodeForTokens(code, codeVerifier, request);
    
    console.log('[TOKEN] Token exchange OK, fetching user...');
    
    const user = await getCurrentUser(tokens.access_token);
    
    console.log('[TOKEN] User:', user.display_name);
    
    return NextResponse.json({
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
        token_type: tokens.token_type,
        scope: tokens.scope,
      },
      user: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        images: user.images,
        product: user.product,
        country: user.country,
      },
    });
  } catch (error: any) {
    console.error('[TOKEN] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
