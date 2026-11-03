import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { identityVaultService } from '../services/identityVaultService';

/** State and actions owned by the identityVault feature. */
export function useIdentityVault() {
  return useFeatureRecords(identityVaultService, { fileName: 'loop-kyc-records.csv' });
}
