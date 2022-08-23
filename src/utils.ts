export const API_URL = 'https://lookup-service-prod.mlb.com'

export type PlayerType = {
  'position': string;
  'birth_country': string;
  'name_display_first_last': string;
  'college': string;
  'name_display_roster': string;
  'bats': string;
  'team_full': string;
  'team_abbrev': string;
  'birth_date': string;
  'throws': string;
  'name_display_last_first': string;
  'player_id': string;
  'team_id': string;
}

export type ResultType = {
  created: Date;
  totalSize: number;
  row: PlayerType;
}