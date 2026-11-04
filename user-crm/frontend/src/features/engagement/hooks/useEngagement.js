import { useFeatureRecords } from "../../shared/hooks/useFeatureRecords";
import { engagementService } from "../services/engagementService";

/** State and actions owned by the engagement feature. */
export function useEngagement() {
  return useFeatureRecords(engagementService, {
    fileName: "loop-engagement.csv",
  });
}
