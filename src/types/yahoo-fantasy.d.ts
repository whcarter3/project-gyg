declare module 'yahoo-fantasy' {
  export interface YahooLeague {
    league_id: string;
    name: string;
    game_key: string;
    game_id: string;
    league_key: string;
  }

  export interface YahooFantasyClient {
    user: {
      game_leagues: () => Promise<YahooLeague[]>;
    };
    league: {
      settings: (league_key: string) => Promise<YahooLeagueSettings>;
      standings: (league_key: string) => Promise<YahooStanding[]>;
    };
  }

  export default class YahooFantasy implements YahooFantasyClient {
    constructor(
      clientId: string,
      clientSecret: string,
      accessToken: string
    );

    user: {
      game_leagues: () => Promise<YahooLeague[]>;
    };
    league: {
      settings: (league_key: string) => Promise<YahooLeagueSettings>;
      standings: (league_key: string) => Promise<YahooStanding[]>;
    };
  }
}
