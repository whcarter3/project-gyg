import YahooFantasy from 'yahoo-fantasy';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { getYahooClientConfig } from '@/app/actions/yahoo-user';

let yahooClient: YahooFantasy | null = null;

export async function getYahooAuthUrl(): Promise<string> {
  const { data: config, error } = await getYahooClientConfig();
  if (error || !config) {
    throw new Error(
      error?.message || 'Failed to get Yahoo client configuration'
    );
  }

  const baseUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'fspt-r',
  });

  return `${baseUrl}?${params.toString()}`;
}

export async function getYahooClient(
  accessToken?: string
): Promise<YahooFantasy> {
  if (!accessToken && yahooClient) {
    return yahooClient;
  }

  let token: string;

  if (!accessToken) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.user_metadata?.yahoo_access_token) {
      throw new Error('No access token available');
    }

    token = user.user_metadata.yahoo_access_token;
  } else {
    token = accessToken;
  }

  const { data: config, error } = await getYahooClientConfig();
  if (error || !config) {
    throw new Error(
      error?.message || 'Failed to get Yahoo client configuration'
    );
  }

  yahooClient = new YahooFantasy(
    config.clientId,
    config.clientSecret,
    token
  );

  return yahooClient;
}
