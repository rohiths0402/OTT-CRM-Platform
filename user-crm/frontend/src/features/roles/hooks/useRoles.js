import { useFeatureRecords } from '../../shared/hooks/useFeatureRecords';
import { rolesService } from '../services/rolesService';

/** State and actions owned by the roles feature. */
export function useRoles() {
  return useFeatureRecords(rolesService, { fileName: 'loop-roles.csv' });
}
