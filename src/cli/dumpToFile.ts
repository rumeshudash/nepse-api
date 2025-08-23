import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

export function dumpToFile(
  outputFile: string | undefined,
  content: unknown,
  convertToCsv: boolean = false
): void {
  if (outputFile) {
    if (convertToCsv) {
      const contentArray = Array.isArray(content) ? content : [content];
      // Convert to CSV format
      const csvWriter = createObjectCsvWriter({
        path: outputFile,
        header: Object.keys(contentArray[0] || {}).map((key) => ({
          id: key,
          title: key,
        })),
      });
      csvWriter.writeRecords(contentArray);
    } else {
      // Write as JSON
      fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
    }
    console.log(`Data written to ${outputFile}`);
  } else {
    if (convertToCsv) {
      const contentArray = Array.isArray(content) ? content : [content];
      // Convert to CSV and print to stdout
      const csvWriter = createObjectCsvWriter({
        path: '/dev/stdout',
        header: Object.keys(contentArray[0] || {}).map((key) => ({
          id: key,
          title: key,
        })),
      });
      csvWriter.writeRecords(contentArray);
    } else {
      // Print as JSON
      console.log(JSON.stringify(content, null, 2));
    }
  }
}
