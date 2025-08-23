# Changelog

All notable changes to the NEPSE API Node.js package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-08-23

### Fixed
- **CLI Documentation**: Updated README.md CLI command examples to match actual CLI implementation
  - Fixed incorrect command syntax from global options to proper subcommands
  - Updated `--show-status` to `status` subcommand
  - Updated `--get-floorsheet` to `floorsheet` subcommand  
  - Updated `--start-server` to `server` subcommand
  - Added missing examples for file output and CSV format options
  - Added example for hiding progress bar in floorsheet command

### Documentation
- Improved CLI usage examples for better user experience
- Added comprehensive examples for all available CLI options
- Ensured documentation accuracy with actual implementation

## [1.0.2] - 2025-08-22

### Fixed
- **TypeScript Declaration Files**: Fixed missing TypeScript declaration files (`.d.ts`) in npm package
  - Added proper `"types": "dist/index.d.ts"` field in package.json
  - Ensured all TypeScript declaration files are generated and included in npm package
  - Resolved TypeScript compilation errors when importing the package
- **ESLint Configuration**: Updated ESLint configuration to use flat config format (ESLint v9)
  - Converted from CommonJS to flat config format
  - Added proper TypeScript support with `@typescript-eslint` plugin
  - Fixed "File ignored because no matching configuration was supplied" warnings
  - Added missing globals for `URLSearchParams` and `WebAssembly`
  - Disabled problematic rules for better compatibility

### Added
- **NPM Ignore Configuration**: Added comprehensive `.npmignore` file
  - Excludes development files and source code from npm package
  - Ensures only compiled JavaScript and declaration files are published
  - Improves package size and security

### Technical Improvements
- Enhanced build process to ensure declaration files are properly generated
- Improved TypeScript configuration for better type safety
- Better development tooling with updated ESLint rules
- Cleaner npm package structure with proper file exclusions

## [1.0.0] - 2025-08-22

### Added
- Initial release of NEPSE API Node.js package
- Core functionality for interacting with Nepal Stock Exchange (NEPSE) APIs
- TypeScript support with comprehensive type definitions
- CLI interface for easy command-line usage
- Token management system for API authentication
- Error handling and validation
- Unit tests for core functionality

### Features
- Company details and information retrieval
- Stock price and volume data
- Floor sheet data access
- Index graph data
- Supply and demand information
- Today's price data
- Historical price and volume data

### Technical Details
- Built with TypeScript for type safety
- Uses Axios for HTTP requests
- Includes comprehensive error handling
- Supports both synchronous and asynchronous operations
- Includes CLI executable for command-line usage
- Full test coverage with Jest
- ESLint and Prettier configuration for code quality
