import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.redirect(
    new URL('/', request.url)
  );
  
  // Clear all Spotify cookies
  response.cookies.delete('spotify_tokens');
  response.cookies.delete('spotify_user');
  response.cookies.delete('spotify_auth_state');
  response.cookies.delete('spotify_code_verifier');
  
  return response;
}
