import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { walletService } from '../services/walletService';

/** State and actions owned by the wallet feature. */
export function useWallet() {
  return useFeatureRecords(walletService, { fileName: 'loop-wallet.csv' });
}
