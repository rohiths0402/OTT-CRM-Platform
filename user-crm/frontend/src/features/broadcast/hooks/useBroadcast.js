import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { broadcastService } from '../services/broadcastService';

export function useBroadcast() {
    return useFeatureRecords(broadcastService, {
        fileName: 'loop-broadcast.csv'
    });
}