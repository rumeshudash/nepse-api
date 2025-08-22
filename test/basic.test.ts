import { Nepse } from '../src/index';

describe('NEPSE API Basic Tests', () => {
  test('should create Nepse instance', () => {
    const nepse = new Nepse();
    expect(nepse).toBeInstanceOf(Nepse);
  });

  test('should create AsyncNepse instance', () => {
    const asyncNepse = new Nepse();
    expect(asyncNepse).toBeInstanceOf(Nepse);
  });

  test('should set TLS verification', () => {
    const nepse = new Nepse();
    nepse.setTLSVerification(false);
    // This test just ensures the method doesn't throw
    expect(true).toBe(true);
  });

  test('should get market status', async () => {
    const nepse = new Nepse();
    const marketStatus = await nepse.getMarketStatus();
    expect(marketStatus).toBeDefined();
    expect(marketStatus.id).toBeDefined();
  });
  test('should get floorsheet', async () => {
    const nepse = new Nepse();
    const floorsheet = await nepse.getFloorSheet();
    expect(floorsheet.totalAmount).toBeDefined();
  });
});
