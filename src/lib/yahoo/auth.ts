import { createSupabaseServerClient } from '@/lib/supabase/server-client';

export function getYahooAuthUrl() {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Yahoo OAuth configuration is missing');
  }

  const baseUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'fspt-r',
  });

  return `${baseUrl}?${params.toString()}`;
}

export async function handleYahooCallback(code: string) {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Yahoo OAuth configuration is missing');
  }

  const tokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  const basicAuth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  const responseData = await response.text();
  let tokens;

  try {
    tokens = JSON.parse(responseData);
  } catch (error) {
    console.error(
      'Failed to parse Yahoo token response:',
      responseData,
      error
    );
    throw new Error('Invalid response from Yahoo');
  }

  if (!response.ok) {
    console.error('Yahoo token error:', tokens);
    throw new Error(
      tokens.error_description || 'Failed to exchange code for tokens'
    );
  }

  if (
    !tokens.access_token ||
    !tokens.refresh_token ||
    !tokens.expires_in
  ) {
    console.error('Invalid token response:', tokens);
    throw new Error('Invalid token response from Yahoo');
  }

  // Store tokens in user metadata
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      yahoo_access_token: tokens.access_token,
      yahoo_refresh_token: tokens.refresh_token,
      yahoo_token_expires_at: new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString(),
      yahoo_connected_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error('Failed to store Yahoo tokens:', error);
    throw error;
  }

  return tokens;
}

export async function refreshYahooToken(refreshToken: string) {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Yahoo OAuth configuration is missing');
  }

  const tokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  const basicAuth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const tokens = await response.json();

  // Update tokens in user metadata
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      yahoo_access_token: tokens.access_token,
      yahoo_refresh_token: tokens.refresh_token,
      yahoo_token_expires_at: new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString(),
      yahoo_connected_at: new Date().toISOString(),
    },
  });

  if (error) throw error;
  return tokens;
}

export async function getYahooConnectionStatus() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isConnected: false,
      status: 'not_authenticated',
      message: 'User not authenticated',
      lastConnected: null,
      expiresAt: null,
    };
  }

  const accessToken = user.user_metadata.yahoo_access_token;
  const refreshToken = user.user_metadata.yahoo_refresh_token;
  const tokenExpiresAt = user.user_metadata.yahoo_token_expires_at
    ? new Date(user.user_metadata.yahoo_token_expires_at)
    : null;
  const lastConnected = user.user_metadata.yahoo_connected_at
    ? new Date(user.user_metadata.yahoo_connected_at)
    : null;

  if (!accessToken || !refreshToken) {
    return {
      isConnected: false,
      status: 'disconnected',
      message: 'Not connected to Yahoo',
      lastConnected: null,
      expiresAt: null,
    };
  }

  if (!tokenExpiresAt) {
    return {
      isConnected: false,
      status: 'invalid',
      message: 'Invalid token expiration',
      lastConnected,
      expiresAt: null,
    };
  }

  const isExpired = tokenExpiresAt.getTime() - Date.now() < 0;
  if (isExpired) {
    // Try to refresh the token
    try {
      await refreshYahooToken(refreshToken);
      return {
        isConnected: true,
        status: 'connected',
        message: 'Connected to Yahoo',
        lastConnected,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      };
    } catch {
      return {
        isConnected: false,
        status: 'expired',
        message: 'Yahoo connection has expired',
        lastConnected,
        expiresAt: tokenExpiresAt,
      };
    }
  }

  return {
    isConnected: true,
    status: 'connected',
    message: 'Connected to Yahoo',
    lastConnected,
    expiresAt: tokenExpiresAt,
  };
}

export async function disconnectYahoo() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.updateUser({
    data: {
      yahoo_access_token: null,
      yahoo_refresh_token: null,
      yahoo_token_expires_at: null,
      yahoo_connected_at: null,
    },
  });

  return true;
}
