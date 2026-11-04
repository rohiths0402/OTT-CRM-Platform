import { useFeatureRecords } from "../../shared/hooks/useFeatureRecords";
import { rewardsService } from "../services/rewardsService";

/** State and actions owned by the rewards feature. */
export function useRewards() {
  return useFeatureRecords(rewardsService, { fileName: "loop-rewards.csv" });
}
