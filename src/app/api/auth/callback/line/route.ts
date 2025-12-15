import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, protocol, host } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const storedState = request.cookies.get('line-oauth-state')?.value;

  const errorRedirectUrl = new URL('/', request.url);

  if (!state || !storedState || state !== storedState) {
    errorRedirectUrl.searchParams.set('error', 'login_failed');
    return NextResponse.redirect(errorRedirectUrl);
  }

  const response = NextResponse.redirect(new URL('/welcome', request.url));
  response.cookies.set({
    name: 'line-oauth-state',
    value: '',
    path: '/',
    maxAge: -1,
  });

  if (!code) {
    errorRedirectUrl.searchParams.set('error', 'login_failed');
    const errorResponse = NextResponse.redirect(errorRedirectUrl);
    errorResponse.cookies.set({ name: 'line-oauth-state', value: '', path: '/', maxAge: -1 });
    return errorResponse;
  }
  
  try {
    const redirect_uri = new URL('/api/auth/callback/line', `${protocol}//${host}`).toString();
    
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
      client_id: process.env.LINE_LOGIN_CHANNEL_ID || '2008685502',
      client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET || 'ea9752cc09af18ab80328a5ecd7df5f9',
    });

    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Line token error:', tokens);
      throw new Error(tokens.error_description || 'Failed to fetch token');
    }

    const idToken = tokens.id_token;
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    const userId = payload.sub;

    if (!userId) {
        throw new Error('User ID (sub) not found in id_token');
    }
    
    response.cookies.set('line-session', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    const finalErrorUrl = new URL('/', request.url);
    finalErrorUrl.searchParams.set('error', 'login_failed');
    const errorResponse = NextResponse.redirect(finalErrorUrl);
    errorResponse.cookies.set({ name: 'line-oauth-state', value: '', path: '/', maxAge: -1 });
    return errorResponse;
  }
}
