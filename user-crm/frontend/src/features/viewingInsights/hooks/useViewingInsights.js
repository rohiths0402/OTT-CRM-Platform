import { useFeatureRecords } from "../../shared/hooks/useFeatureRecords";
import { viewingInsightsService } from "../services/viewingInsightsService";

/** State and actions owned by the viewingInsights feature. */
export function useViewingInsights() {
  return useFeatureRecords(viewingInsightsService, {
    fileName: "loop-viewing-insights.csv",
  });
}
