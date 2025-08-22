import dummyData from '../data/DUMMY_DATA.json';
import { IndexIDEnum } from '../enums';
import {
  Company,
  FloorSheet,
  IndexGraphData,
  LiveMarketData,
  MarketDepth,
  MarketStatus,
  MarketSummary,
  NepseIndex,
  NepseSubIndex,
  Security,
  SecurityDailyGraph,
  SecurityDetails,
  SecurityPriceVolumeHistory,
  TodaysPrice,
  TopTenItem,
  TopTenTradeScripItem,
  TopTenTransactionScripItem,
  TopTenTurnoverScripItem,
} from '../types';
import { DummyIDManager } from '../utils/DummyIDManager';
import { TokenManager } from '../utils/TokenManager';
import { BaseNepse } from './BaseNepse';

/**
 * Nepse class
 */
export class Nepse extends BaseNepse {
  constructor() {
    super();
    this.tokenManager = new TokenManager(this);
    this.dummyIdManager = new DummyIDManager(() => this.getMarketStatus());
  }

  /**
   * Get the POST payload ID for scrips
   * @returns The POST payload ID
   */
  private async getPOSTPayloadIDForScrips(): Promise<number> {
    const dummyId = await this.dummyIdManager.getDummyID();
    const today = new Date();
    const e = dummyData[dummyId] + dummyId + 2 * today.getDate();
    return e;
  }

  /**
   * Get the POST payload ID
   * @returns The POST payload ID
   */
  async getPOSTPayloadID(): Promise<number> {
    const e = await this.getPOSTPayloadIDForScrips();
    const today = new Date();

    // Wait for token manager to be ready
    await this.tokenManager.getAccessToken();

    const salts = this.tokenManager.getSalts();
    if (!salts) {
      throw new Error('Salts not available');
    }

    const saltIndex = e % 10 < 5 ? 3 : 1;
    const postPayloadId =
      e + salts[saltIndex] * today.getDate() - salts[saltIndex - 1];

    return postPayloadId;
  }

  /**
   * Get the POST payload ID for floor sheet
   * @returns The POST payload ID
   */
  async getPOSTPayloadIDForFloorSheet(): Promise<number> {
    const e = await this.getPOSTPayloadIDForScrips();
    const today = new Date();

    // Wait for token manager to be ready
    await this.tokenManager.getAccessToken();

    const salts = this.tokenManager.getSalts();
    if (!salts) {
      throw new Error('Salts not available');
    }

    const saltIndex = e % 10 < 4 ? 1 : 3;
    const postPayloadId =
      e + salts[saltIndex] * today.getDate() - salts[saltIndex - 1];

    return postPayloadId;
  }

  /**
   * Get the market status
   * @returns MarketStatus
   */
  async getMarketStatus() {
    return await this.requestGETAPI<MarketStatus>(
      this.apiEndpoints.nepse_open_url
    );
  }

  /**
   * Get the company list
   * @returns Company[]
   */
  async getCompanyList(force?: boolean) {
    if (!this.companyList || force) {
      this.companyList = await this.requestGETAPI<Company[]>(
        this.apiEndpoints.company_list_url
      );
    }
    return this.companyList || [];
  }

  /**
   * Get the security list
   * @returns Security[]
   */
  async getSecurityList(force?: boolean) {
    if (!this.securityList || force) {
      this.securityList = await this.requestGETAPI<Security[]>(
        this.apiEndpoints.security_list_url
      );
    }
    return this.securityList || [];
  }

  /**
   * Get the market summary
   * @returns MarketSummary[]
   */
  async getMarketSummary() {
    const summary = await this.requestGETAPI<
      { detail: string; value: string | number }[]
    >(this.apiEndpoints.summary_url);

    const response = summary.reduce((acc: MarketSummary, obj) => {
      acc[obj.detail] = obj.value;
      return acc;
    }, {});

    return response;
  }

  /**
   * Get the nepse index
   * @returns NepseIndex[]
   */
  async getNepseIndex() {
    return await this.requestGETAPI<NepseIndex[]>(
      this.apiEndpoints.nepse_index_url
    );
  }

  /**
   * Get the nepse sub indices
   * @returns NepseSubIndex[]
   */
  async getNepseSubIndices() {
    return await this.requestGETAPI<NepseSubIndex[]>(
      this.apiEndpoints.nepse_subindices_url
    );
  }

  /**
   * Get the top ten gainers
   * @returns TopTenItem[]
   */
  async getTopTenGainers() {
    return await this.requestGETAPI<TopTenItem[]>(
      this.apiEndpoints.top_gainers_url
    );
  }

  /**
   * Get the top ten losers
   * @returns TopTenItem[]
   */
  async getTopTenLosers() {
    return await this.requestGETAPI<TopTenItem[]>(
      this.apiEndpoints.top_losers_url
    );
  }

  /**
   * Get the top ten trade scrips
   * @returns TopTenTradeScripItem[]
   */
  async getTopTenTradeScrips() {
    return await this.requestGETAPI<TopTenTradeScripItem[]>(
      this.apiEndpoints.top_ten_trade_url
    );
  }

  /**
   * Get the top ten transaction scrips
   * @returns TopTenTransactionScripItem[]
   */
  async getTopTenTransactionScrips() {
    return await this.requestGETAPI<TopTenTransactionScripItem[]>(
      this.apiEndpoints.top_ten_transaction_url
    );
  }

  /**
   * Get the top ten turnover scrips
   * @returns TopTenTurnoverScripItem[]
   */
  async getTopTenTurnoverScrips() {
    return await this.requestGETAPI<TopTenTurnoverScripItem[]>(
      this.apiEndpoints.top_ten_turnover_url
    );
  }

  /**
   * Get the floor sheet
   * @param options - The options for the floor sheet
   * @param options.page - The page number
   * @param options.size - The size of the page
   * @param options.date - The date of the floor sheet
   * @param options.symbol - The symbol of the company
   * @param options.buyerBroker - The buyer broker
   * @param options.sellerBroker - The seller broker
   * @returns FloorSheet
   */
  async getFloorSheet(options?: {
    page?: number;
    size?: number;
    symbol?: string;
    buyerBroker?: number;
    sellerBroker?: number;
  }) {
    const payloadId = await this.getPOSTPayloadIDForFloorSheet();
    const payload = {
      id: payloadId,
    };

    const queryParams = new URLSearchParams({
      page: options?.page?.toString() || '0',
      size: options?.size?.toString() || this.floorSheetSize.toString(),
      sort: 'contractId,desc',
    });

    if (options?.symbol) {
      const securityId = (await this.getSecurityIdKeymap()).get(options.symbol);
      if (!securityId) {
        throw new Error(`Security symbol ${options.symbol} not found`);
      }
      queryParams.set('stockId', securityId.toString());
    }

    if (options?.buyerBroker) {
      queryParams.set('buyerBroker', options.buyerBroker.toString());
    }

    if (options?.sellerBroker) {
      queryParams.set('sellerBroker', options.sellerBroker.toString());
    }

    return await this.requestPOSTAPI<FloorSheet>(
      `${this.apiEndpoints.floor_sheet}?${queryParams.toString()}`,
      payload
    );
  }

  /**
   * Get the live market data
   * @returns LiveMarketData[]
   */
  async getLiveMarket() {
    return await this.requestGETAPI<LiveMarketData[]>(
      this.apiEndpoints['live-market']
    );
  }

  /**
   * Get the market depth
   * @param symbol - The symbol of the company
   * @returns MarketDepth
   */
  async getMarketDepth(symbol: string) {
    const securityId = (await this.getSecuritySymbolIdKeymap()).get(symbol);
    if (!securityId) {
      throw new Error(`Security symbol ${symbol} not found`);
    }

    return await this.requestGETAPI<MarketDepth>(
      `${this.apiEndpoints['market-depth']}/${securityId}`
    );
  }

  /**
   * Get the security details
   * @param symbol - The symbol of the security
   * @returns SecurityDetails
   */
  async getSecurityDetails(symbol: string) {
    const payloadId = await this.getPOSTPayloadIDForScrips();
    const payload = {
      id: payloadId,
    };

    const securityId = (await this.getSecuritySymbolIdKeymap()).get(symbol);
    if (!securityId) {
      throw new Error(`Security symbol ${symbol} not found`);
    }

    return await this.requestPOSTAPI<SecurityDetails>(
      `${this.apiEndpoints.security_details}${securityId}`,
      payload
    );
  }

  /**
   * Get the security daily graph
   * @param symbol - The symbol of the security
   * @returns SecurityDailyGraph[]
   */
  async getSecurityDailyGraph(symbol: string) {
    const payloadId = await this.getPOSTPayloadIDForScrips();
    const payload = {
      id: payloadId,
    };

    const securityId = (await this.getSecuritySymbolIdKeymap()).get(symbol);
    if (!securityId) {
      throw new Error(`Security symbol ${symbol} not found`);
    }

    return await this.requestPOSTAPI<SecurityDailyGraph[]>(
      `${this.apiEndpoints.security_daily_graph}${securityId}`,
      payload
    );
  }

  /**
   * Get the security price volume history
   * @param symbol - The symbol of the security
   * @returns SecurityPriceVolumeHistory
   */
  async getSecurityPriceVolumeHistory(symbol: string) {
    const securityId = (await this.getSecuritySymbolIdKeymap()).get(symbol);
    if (!securityId) {
      throw new Error(`Security symbol ${symbol} not found`);
    }

    return await this.requestGETAPI<SecurityPriceVolumeHistory>(
      `${this.apiEndpoints.security_price_volume_history}${securityId}`
    );
  }

  /**
   * Get the index daily graph
   * @param indexId - The ID of the index
   * @returns IndexGraphData[]
   */
  async getIndexDailyGraph(indexId: IndexIDEnum) {
    const payloadId = await this.getPOSTPayloadID();
    const payload = {
      id: payloadId,
    };
    return await this.requestPOSTAPI<IndexGraphData[]>(
      `${this.apiEndpoints.daily_index_graph}${indexId}`,
      payload
    );
  }

  /**
   * Get the nepse index daily graph
   * @returns IndexGraphData[]
   */
  async getNepseIndexDailyGraph() {
    const payloadId = await this.getPOSTPayloadID();
    const payload = {
      id: payloadId,
    };
    return await this.requestPOSTAPI<IndexGraphData[]>(
      this.apiEndpoints.nepse_index_daily_graph,
      payload
    );
  }

  /**
   * Get the todays price
   * @param business_date - The business date
   * @returns TodaysPriceData[]
   */
  async getTodaysPriceVolumeHistory(options?: {
    page?: number;
    size?: number;
    businessDate?: string;
  }) {
    const payloadId = await this.getPOSTPayloadIDForFloorSheet();
    const payload = {
      id: payloadId,
    };

    const queryParams = new URLSearchParams({
      page: options?.page?.toString() || '0',
      size: options?.size?.toString() || this.floorSheetSize.toString(),
    });

    if (options?.businessDate) {
      queryParams.set('businessDate', options.businessDate);
    }

    return await this.requestPOSTAPI<TodaysPrice>(
      `${this.apiEndpoints.todays_price}?${queryParams.toString()}`,
      payload
    );
  }
}
