import { useFeatureRecords } from "../../shared/hooks/useFeatureRecords";
import { rolesService } from "../services/rolesService";

export function useRoles() {
  return useFeatureRecords(rolesService, { fileName: "loop-roles.csv" });
}
