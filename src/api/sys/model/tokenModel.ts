export interface tokenInfoModel {
  access_token: string | undefined;
  expires_in: number;
  refresh_token: string | undefined;
  scope: string[];
  token_type: string;
}
