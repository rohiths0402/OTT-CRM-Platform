import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { broadcastService } from '../services/broadcastService';

/** State and actions owned by the broadcast feature. */
export function useBroadcast() {
  return useFeatureRecords(broadcastService, { fileName: 'loop-broadcast.csv' });
}
