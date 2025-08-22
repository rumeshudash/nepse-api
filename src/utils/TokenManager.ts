import { BaseNepse } from '../core/BaseNepse';
import { TokenResponse } from '../types';
import { TokenParser } from './TokenParser';

export abstract class BaseTokenManager {
  protected nepse: BaseNepse;
  protected readonly MAX_UPDATE_PERIOD = 45; // seconds
  protected accessToken: string | null = null;
  protected refreshToken: string | null = null;
  protected tokenTimeStamp: number | null = null;
  protected salts: number[] | null = null;
  protected tokenParser: TokenParser;

  protected readonly tokenUrl = '/api/authenticate/prove';
  protected readonly refreshUrl = '/api/authenticate/refresh-token';

  constructor(nepse: BaseNepse) {
    this.nepse = nepse;
    this.tokenParser = new TokenParser();
  }

  isTokenValid(): boolean {
    if (!this.tokenTimeStamp) return false;
    return (
      Math.floor(Date.now() / 1000) - this.tokenTimeStamp <
      this.MAX_UPDATE_PERIOD
    );
  }

  protected async getValidTokenFromJSON(
    tokenResponse: TokenResponse
  ): Promise<[string, string, number, number[]]> {
    const salts = [
      parseInt(tokenResponse.salt1.toString()),
      parseInt(tokenResponse.salt2.toString()),
      parseInt(tokenResponse.salt3.toString()),
      parseInt(tokenResponse.salt4.toString()),
      parseInt(tokenResponse.salt5.toString()),
    ];

    const [parsedAccessToken, parsedRefreshToken] =
      await this.tokenParser.parseTokenResponse(tokenResponse);

    return [
      parsedAccessToken,
      parsedRefreshToken,
      Math.floor(tokenResponse.serverTime / 1000),
      salts,
    ];
  }

  toString(): string {
    if (this.accessToken && this.tokenTimeStamp) {
      return `Access Token: ${this.accessToken}\nRefresh Token: ${this.refreshToken}\nSalts: ${this.salts}\nTimeStamp: ${new Date(this.tokenTimeStamp * 1000).toISOString()}`;
    }
    return 'Token Manager Not Initialized';
  }
}

export class TokenManager extends BaseTokenManager {
  private updateStarted = false;
  private updatePromise: Promise<void> | null = null;

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid() && this.accessToken) {
      return this.accessToken;
    } else {
      await this.update();
      if (!this.accessToken) {
        throw new Error('Failed to obtain access token');
      }
      return this.accessToken;
    }
  }

  async getRefreshToken(): Promise<string> {
    if (this.isTokenValid() && this.refreshToken) {
      return this.refreshToken;
    } else {
      await this.update();
      if (!this.refreshToken) {
        throw new Error('Failed to obtain refresh token');
      }
      return this.refreshToken;
    }
  }

  getSalts(): number[] | null {
    return this.salts;
  }

  async update(): Promise<void> {
    await this.setToken();
  }

  private async setToken(): Promise<void> {
    if (!this.updateStarted) {
      this.updateStarted = true;
      this.updatePromise = this.performTokenUpdate();
      await this.updatePromise;
      this.updateStarted = false;
      this.updatePromise = null;
    } else {
      await this.updatePromise;
    }
  }

  private async performTokenUpdate(): Promise<void> {
    const response = await this.nepse.requestGETAPI<TokenResponse>(
      this.tokenUrl,
      false
    );
    const jsonResponse = response;
    [this.accessToken, this.refreshToken, this.tokenTimeStamp, this.salts] =
      await this.getValidTokenFromJSON(jsonResponse);
  }
}
