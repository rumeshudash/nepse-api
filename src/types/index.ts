/**
 * Market status from the API
 */
export interface MarketStatus {
  isOpen: string;
  asOf: string;
  id: number;
}

/**
 * Token response from the API
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  serverTime: number;
  salt1: number;
  salt2: number;
  salt3: number;
  salt4: number;
  salt5: number;
}

/**
 * Company from the API
 */
export interface Company {
  id: number;
  symbol: string;
  companyName: string;
  securityName: string;
  status: string;
  companyEmail: string;
  website: string;
  sectorName: string;
  regulatoryBody: string;
  instrumentType: string;
}

/**
 * Security from the API
 */
export interface Security {
  id: number;
  symbol: string;
  name: string;
  securityName: string;
  activeStatus: string;
}

/**
 * Market summary from the API
 */
export type MarketSummary = Record<string, string | number>;

/**
 * Nepse index from the API
 */
export interface NepseIndex {
  id: number;
  auditId: number | null;
  exchangeIndexId: number | null;
  generatedTime: string;
  index: string;
  close: number;
  high: number;
  low: number;
  previousClose: number;
  change: number;
  perChange: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currentValue: number;
}
/**
 * Nepse sub index from the API
 */
export interface NepseSubIndex {
  id: number;
  index: string;
  change: number;
  perChange: number;
  currentValue: number;
}

/**
 * Top ten item from the API (gainer, loser)
 */
export interface TopTenItem {
  symbol: string;
  ltp: number;
  cp: number;
  pointChange: number;
  percentChange: number;
  securityName: string;
  securityId: number;
}

/**
 * Top ten trade scrip item from the API
 */
export interface TopTenTradeScripItem {
  symbol: string;
  shareTraded: number;
  closingPrice: number;
  securityName: string;
  securityId: number;
}

/**
 * Top ten turnover scrip item from the API
 */
export interface TopTenTurnoverScripItem {
  symbol: string;
  turnover: number;
  closingPrice: number;
  securityName: string;
  securityId: number;
}

/**
 * Top ten transaction scrip item from the API
 */
export interface TopTenTransactionScripItem {
  symbol: string;
  totalTrades: number;
  lastTradedPrice: number;
  securityName: string;
  securityId: number;
}

/**
 * Pageable from the API
 */
export interface Pageable {
  last: boolean;
  totalPages: number;
  totalElements: number;
}

/**
 * Floor sheet from the API
 */
export interface FloorSheet {
  totalAmount: number;
  totalQty: number;
  totalTrades: number;
  floorsheets: Pageable & {
    content: FloorSheetItem[];
  };
}

/**
 * Floor sheet item from the API
 */
export interface FloorSheetItem {
  businessDate: string;
  buyerBrokerName: string;
  buyerMemberId: string;
  contractAmount: number;
  contractId: number;
  contractQuantity: number;
  contractRate: number;
  securityName: string;
  sellerBrokerName: string;
  sellerMemberId: string;
  stockId: number;
  stockSymbol: string;
  tradeBookId: number;
  tradeTime: string;
}

/**
 * Market depth from the API
 */
export interface MarketDepth {
  totalBuyQty: number;
  totalSellQty: number;
  marketDepth: {
    buyMarketDepthList: Array<{
      stockId: number;
      orderBookOrderPrice: number;
      quantity: number;
      orderCount: number;
      isBuy: number;
      buy: boolean;
      sell: boolean;
    }>;
    sellMarketDepthList: Array<{
      stockId: number;
      orderBookOrderPrice: number;
      quantity: number;
      orderCount: number;
      isBuy: number;
      buy: boolean;
      sell: boolean;
    }>;
  };
}

/**
 * Live market data from the API
 */
export interface LiveMarketData {
  securityId: string | number;
  securityName: string;
  symbol: string;
  indexId: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  totalTradeQuantity: number;
  totalTradeValue: number;
  lastTradedPrice: number;
  percentageChange: number;
  lastUpdatedDateTime: string;
  lastTradedVolume: number;
  previousClose: number;
  averageTradedPrice: number;
}

/**
 * Headers from the API
 */
export interface Headers {
  Host: string;
  'User-Agent': string;
  Accept: string;
  'Accept-Language': string;
  'Accept-Encoding': string;
  Connection: string;
  Referer: string;
  Pragma: string;
  'Cache-Control': string;
  TE: string;
  [key: string]: string; // Index signature for additional headers
}

/**
 * Company details from the API
 */
export interface CompanyDetails {
  securityDailyTradeDto: {
    securityId: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    totalTradeQuantity: number;
    totalTrades: number;
    lastTradedPrice: number;
    previousClose: number;
    businessDate: string;
    closePrice: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    lastUpdatedDateTime: string;
  };
  security: {
    id: number;
    symbol: string;
    isin: string;
    permittedToTrade: string;
    listingDate: string;
    creditRating: string | null;
    tickSize: number;
    instrumentType: {
      id: number;
      code: string;
      description: string;
      activeStatus: string;
    };
    capitalGainBaseDate: string;
    faceValue: number;
    highRangeDPR: number;
    issuerName: string | null;
    meInstanceNumber: number;
    parentId: number | null;
    recordType: number;
    schemeDescription: string | null;
    schemeName: string | null;
    secured: string | null;
    series: string | null;
    shareGroupId: {
      id: number;
      name: string;
      description: string;
      capitalRangeMin: number;
      modifiedBy: string | null;
      modifiedDate: string | null;
      activeStatus: string;
      isDefault: string;
    };
    activeStatus: string;
    divisor: number;
    cdsStockRefId: number;
    securityName: string;
    tradingStartDate: string;
    networthBasePrice: number;
    securityTradeCycle: number;
    isPromoter: string;
    companyId: {
      id: number;
      companyShortName: string;
      companyName: string;
      email: string;
      companyWebsite: string;
      companyContactPerson: string;
      sectorMaster: {
        id: number;
        sectorDescription: string;
        activeStatus: string;
        regulatoryBody: string;
      };
      companyRegistrationNumber: string;
      activeStatus: string;
    };
  };
  stockListedShares: number;
  paidUpCapital: number;
  issuedCapital: number;
  marketCapitalization: number;
  publicShares: number;
  publicPercentage: number;
  promoterShares: number;
  promoterPercentage: number;
  updatedDate: string;
  securityId: number;
}

/**
 * Company daily graph from the API
 */
export interface CompanyDailyGraph {
  time: number;
  contractRate: number;
  contractQuantity: number;
}

/**
 * Company price volume history from the API
 */
export interface CompanyPriceVolumeHistory extends Pageable {
  content: CompanyPriceVolumeHistoryItem[];
}

/**
 * Company price volume history item from the API
 */
export interface CompanyPriceVolumeHistoryItem {
  id: number;
  businessDate: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  totalTradedQuantity: number;
  totalTradedValue: number;
  previousDayClosePrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  lastUpdatedTime: string;
  totalTrades: number;
  lastTradedPrice: number;
  averageTradedPrice: number;
}

/**
 * Index graph data from the API ([date, value])
 */
export type IndexGraphData = [number, number];

/**
 * Todays price from the API
 */
export interface TodaysPrice extends Pageable {
  content: TodaysPriceItem[];
}
/**
 * Todays price item from the API
 */
export interface TodaysPriceItem {
  businessDate: string;
  securityId: number;
  symbol: string;
  securityName: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  totalTradedQuantity: number;
  totalTradedValue: number;
  previousDayClosePrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  lastUpdatedTime: string;
  lastUpdatedPrice: number;
  totalTrades: number;
  averageTradedPrice: number;
  marketCapitalization: number;
}
