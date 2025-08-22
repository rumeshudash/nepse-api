import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import apiEndpoints from '../data/apiEndpoints.json';
import headers from '../data/headers.json';
import {
  NepseInvalidClientRequest,
  NepseInvalidServerResponse,
  NepseNetworkError,
} from '../errors';
import {
  Company,
  FloorSheet,
  Headers,
  LiveMarketData,
  MarketDepth,
  MarketStatus,
  MarketSummary,
  NepseIndex,
  Security,
  TopTenItem,
} from '../types';
import { DummyIDManager } from '../utils/DummyIDManager';
import { TokenManager } from '../utils/TokenManager';

/**
 * Base class for Nepse API
 */
export abstract class BaseNepse {
  protected tokenManager!: TokenManager;
  protected dummyIdManager!: DummyIDManager;
  protected tlsVerify: boolean = false;
  protected companySymbolIdKeymap: Map<string, number> | null = null;
  protected securitySymbolIdKeymap: Map<string, number> | null = null;
  protected companyList: Company[] | null = null;
  protected securityList: Security[] | null = null;
  protected sectorScrips: Record<string, unknown> | null = null;
  protected floorSheetSize: number = 500;
  protected baseUrl: string = 'https://nepalstock.com.np'; // Try alternative domain
  protected apiEndpoints!: typeof apiEndpoints;
  protected headers!: Headers;
  protected client!: AxiosInstance;

  constructor() {
    this.apiEndpoints = apiEndpoints;
    this.headers = headers as Headers;
    this.headers.Host = this.baseUrl.replace('https://', '');
    this.headers.Referer = this.baseUrl.replace('https://', '');
    this.initClient();
  }

  /**
   * Set the TLS verification
   * @param verify - Whether to verify the TLS certificate
   */
  setTLSVerification(verify: boolean): void {
    this.tlsVerify = verify;
    this.initClient();
  }

  /**
   * Initialize the client
   */
  protected initClient(): void {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 100000, // Increased to match Python timeout
      httpsAgent: this.tlsVerify
        ? undefined
        : new (require('https').Agent)({
            requestCert: false,
            rejectUnauthorized: false,
          }),
      headers: this.headers as Record<string, string>,
    });
  }

  /**
   * Get the full URL
   * @param apiUrl - The API URL
   * @returns The full URL
   */
  protected getFullUrl(apiUrl: string): string {
    return `${this.baseUrl}${apiUrl}`;
  }

  /**
   * Get the authorization headers
   * @param accessToken - The access token
   * @returns The authorization headers
   */
  protected getAuthorizationHeaders(
    accessToken: string
  ): Record<string, string> {
    return {
      Authorization: `Salter ${accessToken}`,
      'Content-Type': 'application/json',
      ...this.headers,
    };
  }

  /**
   * Handle the response
   * @param response - The response
   * @returns The response data
   */
  protected handleResponse<TResponse>(response: AxiosResponse): TResponse {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else if (response.status >= 400 && response.status < 500) {
      throw new NepseInvalidClientRequest(`Client error: ${response.status}`);
    } else if (response.status >= 500) {
      throw new NepseInvalidServerResponse(`Server error: ${response.status}`);
    } else {
      throw new NepseNetworkError(`Unexpected response: ${response.status}`);
    }
  }

  /**
   * Request a GET API
   * @param url - The URL
   * @param includeAuth - Whether to include the authorization headers
   * @returns The response data
   */
  public async requestGETAPI<TResponse>(
    url: string,
    includeAuth: boolean = true
  ): Promise<TResponse> {
    try {
      const config: AxiosRequestConfig = {};

      if (includeAuth) {
        const accessToken = await this.tokenManager.getAccessToken();
        config.headers = this.getAuthorizationHeaders(accessToken);
      } else {
        config.headers = this.headers as Record<string, string>;
      }

      const response = await this.client.get(url, config);
      return this.handleResponse<TResponse>(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new NepseNetworkError(
            `HTTP ${error.response.status}: ${error.response.statusText}`
          );
        } else if (error.request) {
          throw new NepseNetworkError(
            `Network error: No response received: ${error.message}`
          );
        } else {
          throw new NepseNetworkError(`Request error: ${error.message}`);
        }
      } else {
        if (error instanceof NepseNetworkError) {
          throw error;
        }
        throw new NepseNetworkError(`Unknown error: ${String(error)}`);
      }
    }
  }

  /**
   * Request a POST API
   * @param url - The URL
   * @param payload - The payload
   * @param includeAuth - Whether to include the authorization headers
   * @returns The response data
   */
  protected async requestPOSTAPI<TResponse>(
    url: string,
    payload: Record<string, unknown>,
    includeAuth: boolean = true
  ): Promise<TResponse> {
    try {
      const config: AxiosRequestConfig = {};

      if (includeAuth) {
        const accessToken = await this.tokenManager.getAccessToken();
        config.headers = this.getAuthorizationHeaders(accessToken);
      } else {
        config.headers = this.headers as Record<string, string>;
      }

      const response = await this.client.post(url, payload, config);
      return this.handleResponse<TResponse>(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new NepseNetworkError(
            `HTTP ${error.response.status}: ${error.response.statusText}`
          );
        } else if (error.request) {
          throw new NepseNetworkError('Network error: No response received');
        } else {
          throw new NepseNetworkError(`Request error: ${error.message}`);
        }
      } else {
        throw new NepseNetworkError(`Unknown error: ${String(error)}`);
      }
    }
  }

  /**
   * Get the company ID keymap
   * @returns The company ID keymap
   */
  protected async getCompanyIdKeymap(): Promise<Map<string, number>> {
    if (!this.companySymbolIdKeymap) {
      this.companySymbolIdKeymap = new Map(
        (await this.getCompanyList()).map((company) => [
          company.symbol,
          company.id,
        ])
      );
    }
    return this.companySymbolIdKeymap;
  }

  /**
   * Get the security ID keymap
   * @returns The security ID keymap
   */
  protected async getSecurityIdKeymap(): Promise<Map<string, number>> {
    if (!this.securitySymbolIdKeymap) {
      this.securitySymbolIdKeymap = new Map(
        (await this.getSecurityList()).map((security) => [
          security.symbol,
          security.id,
        ])
      );
    }
    return this.securitySymbolIdKeymap;
  }

  /**
   * Abstract methods to be implemented by child classes
   */
  abstract getMarketStatus(): Promise<MarketStatus>;
  abstract getCompanyList(force?: boolean): Promise<Company[]>;
  abstract getSecurityList(force?: boolean): Promise<Security[]>;
  abstract getMarketSummary(): Promise<MarketSummary>;
  abstract getNepseIndex(): Promise<NepseIndex[]>;
  abstract getTopTenGainers(): Promise<TopTenItem[]>;
  abstract getTopTenLosers(): Promise<TopTenItem[]>;
  abstract getFloorSheet(options?: {
    page?: number;
    size?: number;
  }): Promise<FloorSheet>;
  abstract getLiveMarket(): Promise<LiveMarketData[]>;
  abstract getMarketDepth(symbol: string): Promise<MarketDepth>;
}
