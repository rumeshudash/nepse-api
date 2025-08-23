import { Nepse } from '../core/Nepse';

export async function showStatus() {
  const nepse = new Nepse();
  nepse.setTLSVerification(false);
  return await nepse.getMarketStatus();
}
