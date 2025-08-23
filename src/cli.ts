#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import { dumpToFile } from './cli/dumpToFile';
import { getFloorSheet } from './cli/getFloorsheet';
import { showStatus } from './cli/showStatus';
import { startServer } from './cli/startServer';

const program = new Command();

program
  .name('nepse-cli')
  .description('Command line interface to nepalstock.com')
  .version(packageJson.version);

// Remove the global options and create separate commands
program
  .command('server')
  .description('Starts local server at 0.0.0.0:8000')
  .action(async () => {
    await startServer();
  });

program
  .command('status')
  .description('Dumps Nepse status to the standard output')
  .option(
    '-o, --output-file <file>',
    'sets the output file for dumping the content'
  )
  .option('-csv, --to-csv', 'sets the output format from default[JSON] to CSV')
  .action(async (options) => {
    const outputContent = await showStatus();
    if (outputContent) {
      dumpToFile(options.outputFile, outputContent, options.toCsv);
    }
  });

program
  .command('floorsheet')
  .description("Dumps Nepse's floorsheet to the standard output")
  .option(
    '-o, --output-file <file>',
    'sets the output file for dumping the content'
  )
  .option('-csv, --to-csv', 'sets the output format from default[JSON] to CSV')
  .option(
    '-hide, --hide-progressbar',
    'sets the visibility of progress base to False'
  )
  .action(async (options) => {
    const outputContent = await getFloorSheet(options.hideProgressbar);
    if (outputContent) {
      dumpToFile(options.outputFile, outputContent, options.toCsv);
    }
  });

program.showHelpAfterError();

program.parse();
