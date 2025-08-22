# @rumess/nepse-api

Unofficial Node.js library to interface with nepalstock.com. This is a TypeScript/Node.js port of the Python NEPSE API library.

## Features

- **TypeScript Support**: Full type definitions for better development experience
- **Command Line Interface**: Built-in CLI tool for quick data access
- **Web Server**: Express.js server for API endpoints
- **Comprehensive Data Access**: Market data, company information, indices, and more
- **Error Handling**: Custom error classes for better debugging
- **SSL Certificate Handling**: Automatic SSL verification bypass for NEPSE's certificate issues
- **Token Management**: Automatic token handling and refresh
- **Dummy ID Management**: Handles NEPSE's dummy ID requirements

## Installation

### Using npm

```bash
npm install @rumess/nepse-api
```

### From Source

```bash
git clone <repository-url>
cd nepse-api
npm install
npm run build
```

## Quick Start

### Basic Usage

```typescript
import { Nepse } from '@rumess/nepse-api';

// Create instance
const nepse = new Nepse();
nepse.setTLSVerification(false); // Handle SSL certificate issues

// Get market data
const marketStatus = await nepse.getMarketStatus();
console.log(marketStatus);

const companyList = await nepse.getCompanyList();
console.log(companyList);
```

### Command Line Interface

```bash
# Show version
nepse-cli --version

# Get market status
nepse-cli --show-status

# Get floorsheet and save to file
nepse-cli --get-floorsheet --output-file floor.json

# Get floorsheet in CSV format
nepse-cli --get-floorsheet --to-csv --output-file floor.csv

# Start web server
nepse-cli --start-server
```

## API Reference

### Core Class

#### `Nepse`
Main class for all NEPSE API operations.

```typescript
const nepse = new Nepse();
nepse.setTLSVerification(false);

// Market data
const status = await nepse.getMarketStatus();
const summary = await nepse.getMarketSummary();
const indices = await nepse.getNepseIndex();
const subIndices = await nepse.getNepseSubIndices();

// Company data
const companies = await nepse.getCompanyList();
const securities = await nepse.getSecurityList();

// Trading data
const floorsheet = await nepse.getFloorSheet();
const liveMarket = await nepse.getLiveMarket();
const topGainers = await nepse.getTopTenGainers();
const topLosers = await nepse.getTopTenLosers();
const topTradeScrips = await nepse.getTopTenTradeScrips();
const topTransactionScrips = await nepse.getTopTenTransactionScrips();
const topTurnoverScrips = await nepse.getTopTenTurnoverScrips();

// Market depth
const marketDepth = await nepse.getMarketDepth('NICL');

// Company details
const companyDetails = await nepse.getCompanyDetails('NICL');
const companyGraph = await nepse.getCompanyDailyGraph('NICL');
const priceVolumeHistory = await nepse.getCompanyPriceVolumeHistory('NICL');

// Today's price data
const todaysPrice = await nepse.getTodaysPriceVolumeHistory();
```

### Available Methods

#### Market Data
- `getMarketStatus()` - Get current market status
- `getMarketSummary()` - Get market summary
- `getNepseIndex()` - Get NEPSE indices
- `getNepseSubIndices()` - Get sub-indices
- `getLiveMarket()` - Get live market data

#### Company Information
- `getCompanyList(force?)` - Get list of all companies (cached by default)
- `getSecurityList(force?)` - Get list of all securities (cached by default)
- `getCompanyDetails(symbol)` - Get specific company details
- `getCompanyDailyGraph(symbol)` - Get company's daily graph data
- `getCompanyPriceVolumeHistory(symbol)` - Get company's price volume history

#### Trading Data
- `getFloorSheet(options?)` - Get floorsheet with optional filtering
  - `page` - Page number (default: 0)
  - `size` - Page size (default: 500)
  - `symbol` - Filter by company symbol
  - `buyerBroker` - Filter by buyer broker ID
  - `sellerBroker` - Filter by seller broker ID
- `getTopTenGainers()` - Get top 10 gainers
- `getTopTenLosers()` - Get top 10 losers
- `getTopTenTradeScrips()` - Get top 10 by trade volume
- `getTopTenTransactionScrips()` - Get top 10 by transaction count
- `getTopTenTurnoverScrips()` - Get top 10 by turnover
- `getTodaysPriceVolumeHistory(options?)` - Get today's price data
  - `page` - Page number (default: 0)
  - `size` - Page size (default: 500)
  - `businessDate` - Specific business date

#### Market Depth
- `getMarketDepth(symbol)` - Get market depth for a symbol

#### Index Graph Data
- `getIndexDailyGraph(indexId)` - Get daily graph for specific index
- `getNepseIndexDailyGraph()` - NEPSE index daily graph

### Index IDs

Use the `IndexIDEnum` for index graph data:

```typescript
import { IndexIDEnum } from '@rumess/nepse-api';

// Available indices
IndexIDEnum.NEPSE                    // '58'
IndexIDEnum.SENSITIVE               // '57'
IndexIDEnum.FLOAT                   // '62'
IndexIDEnum.SENSITIVE_FLOAT         // '63'
IndexIDEnum.BANKING                 // '51'
IndexIDEnum.DEVELOPMENT_BANK        // '55'
IndexIDEnum.FINANCE                 // '60'
IndexIDEnum.HOTEL_TOURISM           // '52'
IndexIDEnum.HYDRO                   // '54'
IndexIDEnum.INVESTMENT              // '67'
IndexIDEnum.LIFE_INSURANCE          // '65'
IndexIDEnum.MANUFACTURING           // '56'
IndexIDEnum.MICROFINANCE            // '64'
IndexIDEnum.MUTUAL_FUND             // '66'
IndexIDEnum.NON_LIFE_INSURANCE      // '59'
IndexIDEnum.OTHERS                  // '53'
IndexIDEnum.TRADING                 // '61'

// Example usage
const nepseGraph = await nepse.getIndexDailyGraph(IndexIDEnum.NEPSE);
```

### Web Server

Start the web server to access NEPSE data via HTTP endpoints:

```bash
nepse-cli --start-server
```

Available endpoints:
- `GET /` - Server information and available routes
- `GET /summary` - Market summary
- `GET /nepseIndex` - NEPSE indices
- `GET /nepseSubIndices` - Sub-indices
- `GET /topGainers` - Top gainers
- `GET /topLosers` - Top losers
- `GET /topTenTradeScrips` - Top 10 by trade volume
- `GET /topTenTransactionScrips` - Top 10 by transaction count
- `GET /topTenTurnoverScrips` - Top 10 by turnover
- `GET /companyList` - Company list
- `GET /securityList` - Security list
- `GET /liveMarket` - Live market data
- `GET /marketDepth?symbol=SYMBOL` - Market depth for symbol
- `GET /floorsheet` - Today's floorsheet
- `GET /isNepseOpen` - Market status
- `GET /companyDetails?symbol=SYMBOL` - Company details
- `GET /companyPriceVolumeHistory?symbol=SYMBOL` - Company price volume history
- `GET /dailyIndexGraph?indexId=ID` - Index daily graph
- `GET /dailyNepseIndexGraph` - NEPSE index daily graph
- `GET /dailyScripPriceGraph?symbol=SYMBOL` - Company daily graph

## Error Handling

The library provides custom error classes:

```typescript
import { 
  NepseError,
  NepseNetworkError,
  NepseInvalidClientRequest,
  NepseInvalidServerResponse,
  NepseTokenExpired
} from '@rumess/nepse-api';

try {
  const data = await nepse.getMarketStatus();
} catch (error) {
  if (error instanceof NepseNetworkError) {
    console.log('Network error occurred');
  } else if (error instanceof NepseTokenExpired) {
    console.log('Token expired, retrying...');
  }
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { 
  MarketStatus, 
  Company, 
  Security, 
  MarketSummary,
  NepseIndex,
  NepseSubIndex,
  TopTenItem,
  TopTenTradeScripItem,
  TopTenTransactionScripItem,
  TopTenTurnoverScripItem,
  FloorSheet,
  MarketDepth,
  LiveMarketData,
  CompanyDetails,
  CompanyDailyGraph,
  CompanyPriceVolumeHistory,
  TodaysPrice,
  IndexGraphData
} from '@rumess/nepse-api';

const companies: Company[] = await nepse.getCompanyList();
const status: MarketStatus = await nepse.getMarketStatus();
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Development Mode

```bash
npm run dev
```

## SSL Certificate Issues

NEPSE's website has SSL certificate issues. The library automatically handles this by providing a `setTLSVerification(false)` method:

```typescript
const nepse = new Nepse();
nepse.setTLSVerification(false); // Required for NEPSE's SSL issues
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Disclaimer

This is an unofficial library and is not affiliated with NEPSE or nepalstock.com. Use at your own risk.

## Changelog

### v1.0.0
- Initial release
- TypeScript support
- Command line interface
- Web server functionality
- Comprehensive error handling
- SSL certificate handling
- Token management
- Dummy ID management
- Full NEPSE API coverage
