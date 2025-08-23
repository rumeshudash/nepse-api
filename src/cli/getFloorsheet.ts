import cliProgress from 'cli-progress';
import { Nepse } from '../core/Nepse';
import { FloorSheetItem } from '../types';

const RETRY_DELAY = 5; // 5 seconds

export async function getFloorSheet(
  hideProgress: boolean = false
): Promise<FloorSheetItem[]> {
  const nepse = new Nepse();
  nepse.setTLSVerification(false);

  const allFloorSheetItems: FloorSheetItem[] = [];
  let currentPage = 0;
  let totalPages = 1; // Will be updated after first request
  let progressBar: cliProgress.SingleBar | null = null;

  try {
    // Get first page to determine total pages
    const firstPageResponse = await nepse.getFloorSheet({ page: 0 });
    totalPages = firstPageResponse.floorsheets.totalPages;
    allFloorSheetItems.push(...firstPageResponse.floorsheets.content);

    if (!hideProgress) {
      // Initialize progress bar
      progressBar = new cliProgress.SingleBar({
        format:
          'Downloading floorsheet |{bar}| {percentage}% | {value}/{total} pages | {items} items',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      });
      progressBar.start(totalPages, 1, { items: allFloorSheetItems.length });
    }

    // Fetch remaining pages
    for (currentPage = 1; currentPage < totalPages; currentPage++) {
      await fetchPageWithRetry(
        nepse,
        currentPage,
        allFloorSheetItems,
        progressBar,
        hideProgress
      );
    }

    if (!hideProgress && progressBar) {
      progressBar.stop();
      console.log(
        `✅ Completed! Total items fetched: ${allFloorSheetItems.length}`
      );
    }

    return allFloorSheetItems;
  } catch (error) {
    if (progressBar) {
      progressBar.stop();
    }
    throw error;
  }
}

async function fetchPageWithRetry(
  nepse: Nepse,
  currentPage: number,
  allFloorSheetItems: FloorSheetItem[],
  progressBar: cliProgress.SingleBar | null,
  hideProgress: boolean,
  retryCount: number = 0,
  maxRetries: number = 3
): Promise<void> {
  try {
    const floorSheetResponse = await nepse.getFloorSheet({
      page: currentPage,
    });
    allFloorSheetItems.push(...floorSheetResponse.floorsheets.content);

    if (!hideProgress && progressBar) {
      progressBar.update(currentPage + 1, {
        items: allFloorSheetItems.length,
      });
    }

    // Add a small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error(`\nError fetching page ${currentPage + 1}:`, error);

    if (retryCount < maxRetries) {
      console.log(
        `\nRetrying page ${currentPage + 1} in ${RETRY_DELAY} seconds... (Attempt ${retryCount + 1}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * 1000));
      return fetchPageWithRetry(
        nepse,
        currentPage,
        allFloorSheetItems,
        progressBar,
        hideProgress,
        retryCount + 1,
        maxRetries
      );
    } else {
      console.error(
        `\nFailed to fetch page ${currentPage + 1} after ${maxRetries} attempts. Skipping...`
      );
      // Continue with next page instead of throwing error
    }
  }
}
