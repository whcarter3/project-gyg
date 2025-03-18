'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import type { DatabaseResponse } from '@/types/database';

export type YahooConnectionStatus = {
  isConnected: boolean;
  status:
    | 'connected'
    | 'disconnected'
    | 'expired'
    | 'invalid'
    | 'not_authenticated';
  message: string;
  lastConnected: Date | null;
  expiresAt: Date | null;
};

export async function getYahooClientConfig(): Promise<
  DatabaseResponse<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }>
> {
  try {
    const clientId = process.env.YAHOO_CLIENT_ID;
    const clientSecret = process.env.YAHOO_CLIENT_SECRET;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return {
        data: null,
        error: {
          code: 'CONFIGURATION_ERROR',
          message: 'Yahoo OAuth configuration is missing',
          details: null,
          hint: 'Check your environment variables',
        },
      };
    }

    return {
      data: { clientId, clientSecret, redirectUri },
      error: null,
    };
  } catch (error) {
    console.error('Error getting Yahoo client config:', error);
    return {
      data: null,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : null,
        hint: null,
      },
    };
  }
}

export async function getYahooAuthUrl(): Promise<string> {
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

export async function disconnectYahoo(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      yahoo_access_token: null,
      yahoo_refresh_token: null,
      yahoo_token_expires_at: null,
      yahoo_connected_at: null,
    },
  });

  if (error) throw error;
  return true;
}

export async function getYahooConnectionStatus(): Promise<YahooConnectionStatus> {
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
    return {
      isConnected: false,
      status: 'expired',
      message: 'Yahoo connection has expired',
      lastConnected,
      expiresAt: tokenExpiresAt,
    };
  }

  return {
    isConnected: true,
    status: 'connected',
    message: 'Connected to Yahoo',
    lastConnected,
    expiresAt: tokenExpiresAt,
  };
}
