import { MarketStatus } from '../types';

export abstract class BaseDummyIDManager {
  protected data: MarketStatus | null = null;
  protected dummyId: number | null = null;
  protected dateStamp: Date | null = null;
  protected marketStatusFunction:
    | (() => Promise<MarketStatus>)
    | (() => MarketStatus)
    | null = null;

  constructor(
    marketStatusFunction?: (() => Promise<MarketStatus>) | (() => MarketStatus)
  ) {
    this.setMarketStatusFunction(marketStatusFunction || null);
  }

  setMarketStatusFunction(
    func: (() => Promise<MarketStatus>) | (() => MarketStatus) | null
  ): void {
    this.marketStatusFunction = func;
    this.data = null;
  }

  protected convertToDateTime(dateTimeStr: string): Date {
    return new Date(dateTimeStr);
  }

  toString(): string {
    return `<Dummy ID: ${this.dummyId}, Date: ${this.dateStamp}>`;
  }
}

export class DummyIDManager extends BaseDummyIDManager {
  private updateStarted = false;
  private updatePromise: Promise<void> | null = null;

  async populateData(force = false): Promise<void> {
    const today = new Date();

    if (this.data === null || force) {
      if (!this.updateStarted) {
        this.updateStarted = true;
        this.updatePromise = this.performUpdate();
        await this.updatePromise;
        this.updateStarted = false;
        this.updatePromise = null;
        return;
      }
      await this.updatePromise;
    }

    if (this.dateStamp && this.dateStamp.getDate() < today.getDate()) {
      if (this.updateStarted) {
        await this.updatePromise;
      } else {
        this.updateStarted = true;
        this.updatePromise = this.performUpdate();
        await this.updatePromise;
        this.updateStarted = false;
        this.updatePromise = null;
      }
    }
  }

  private async performUpdate(): Promise<void> {
    if (!this.marketStatusFunction) {
      throw new Error('Market status function not set');
    }

    const newData = await this.marketStatusFunction();
    const today = new Date();
    const newConvertedDate = this.convertToDateTime(newData.asOf);

    if (newConvertedDate.getDate() === today.getDate()) {
      this.data = newData;
      this.dummyId = this.data.id;
      this.dateStamp = newConvertedDate;
    } else {
      this.data = newData;
      this.dummyId = this.data.id;
      this.dateStamp = today;
    }
  }

  async getDummyID(): Promise<number> {
    await this.populateData();
    if (this.dummyId === null) {
      throw new Error('Dummy ID not available');
    }
    return this.dummyId;
  }
}
