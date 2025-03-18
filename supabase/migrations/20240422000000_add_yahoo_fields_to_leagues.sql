-- Add Yahoo-specific fields to leagues table
alter table public.leagues
add column if not exists platform text default 'yahoo',
add column if not exists yahoo_game_key text,
add column if not exists yahoo_game_id text,
add column if not exists yahoo_league_id text,
add column if not exists yahoo_league_key text,
add column if not exists yahoo_league_name text,
add column if not exists yahoo_league_url text,
add column if not exists yahoo_season text,
add column if not exists yahoo_settings jsonb,
add column if not exists yahoo_standings jsonb,
add column if not exists yahoo_last_synced timestamp with time zone;

-- Create index on yahoo_league_id for faster lookups
create index if not exists leagues_yahoo_league_id_idx on public.leagues(yahoo_league_id);

-- Add constraint to ensure yahoo_league_id is unique per user
alter table public.leagues
add constraint unique_yahoo_league_per_user
unique (user_id, yahoo_league_id);