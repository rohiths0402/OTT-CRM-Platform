import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { auditLogsService } from '../services/auditLogsService';

/** State and actions owned by the auditLogs feature. */
export function useAuditLogs() {
  return useFeatureRecords(auditLogsService, { fileName: 'loop-audit-logs.csv' });
}
