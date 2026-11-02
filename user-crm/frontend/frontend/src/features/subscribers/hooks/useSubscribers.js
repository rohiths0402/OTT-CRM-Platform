import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { subscribersService } from '../services/subscribersService';

/** State and actions owned by the subscribers feature. */
export function useSubscribers() {
  return useFeatureRecords(subscribersService, { fileName: 'loop-subscribers.csv' });
}
